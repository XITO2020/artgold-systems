"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Heart, Share, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '#//use-toast';

interface EnhancedImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  title: string;
  description: string;
  likes: number;
  comments?: Array<{
    id: string;
    content: string;
    user: {
      name: string;
      image: string;
    };
    createdAt: Date;
  }>;
  itemId: string;
}

export function EnhancedImageModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  title,
  description,
  likes,
  comments = [],
  itemId
}: EnhancedImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like items",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/portfolio/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });

      if (!response.ok) throw new Error('Failed to like item');

      setLiked(true);
      toast({
        title: "Success",
        description: "Item liked successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like item",
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

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/portfolio/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, content: newComment })
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="relative">
            <img
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentIndex((prev) => 
                  prev === 0 ? images.length - 1 : prev - 1
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentIndex((prev) => 
                  (prev + 1) % images.length
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <p className="text-muted-foreground mb-4">{description}</p>

              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  disabled={liked}
                >
                  <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  {likes}
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
                disabled={isSubmitting || !newComment.trim()}
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