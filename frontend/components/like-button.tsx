"use client";

import { useState } from 'react';
import { Button } from "@ui/button";
import { Heart } from "lucide-react";
import { useToast } from "#/use-toast";

interface LikeButtonProps {
  contentId: string;
  initialLikes: number;
  onLikeSuccess?: () => void;
}

export function LikeButton({ contentId, initialLikes, onLikeSuccess }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    setIsLiking(true);
    try {
      const response = await fetch('/api/content/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId })
      });

      if (!response.ok) throw new Error('Failed to like content');

      setLikes(prev => prev + 1);
      onLikeSuccess?.();

      // Show TABZ earned if likes are divisible by 100
      if (likes % 100 === 99) {
        toast({
          title: "🎉 Earned 1 TABZ!",
          description: "This content has reached another 100 likes milestone",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like content",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLike}
      disabled={isLiking}
      className="flex items-center gap-2"
    >
      <Heart className={`h-4 w-4 ${likes > 0 ? 'fill-current' : ''}`} />
      <span>{likes}</span>
    </Button>
  );
}