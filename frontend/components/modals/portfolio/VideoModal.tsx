"use client";

import React from 'react';
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Heart, Share, MessageSquare, Play, Pause } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '#/use-toast';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    likes: number;
    duration: number;
  };
  comments?: Array<{
    id: string;
    content: string;
    user: {
      name: string;
      image: string;
    };
    createdAt: Date;
  }>;
}

export function VideoModal({
  isOpen,
  onClose,
  video,
  comments = []
}: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { data: session } = useSession();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like videos",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/portfolio/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: video.id })
      });

      if (!response.ok) throw new Error('Failed to like video');

      setLiked(true);
      toast({
        title: "Success",
        description: "Video liked successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like video",
        variant: "destructive"
      });
    }
  };

  const handleComment = async () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/portfolio/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: video.id, content: newComment })
      });

      if (!response.ok) throw new Error('Failed to post comment');

      setNewComment('');
      toast({
        title: "Success",
        description: "Comment posted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8">
          <div className="relative">
            <video
              ref={videoRef}
              src={video.url}
              poster={video.thumbnail}
              className="w-full rounded-lg"
              onTimeUpdate={handleTimeUpdate}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="secondary"
                size="icon"
                className="w-16 h-16 rounded-full"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 p-2 rounded-lg">
                <div className="h-1 bg-white/30 rounded-full">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${(currentTime / video.duration) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <p className="text-muted-foreground mb-4">{video.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  disabled={liked}
                >
                  <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  {video.likes}
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Comments</h4>
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                    <img
                      src={comment.user.image}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{comment.user.name}</p>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button 
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}