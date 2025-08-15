import { useState } from 'react';
import { Button } from "@ui/button";
import { FaDiscord } from "react-icons/fa";
import { Share, Heart, Facebook, Twitter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";

interface ComicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comicData: {
    title: string;
    pages: string[];
    description: string;
    likes: number;
  };
}

export function ComicsModal({ isOpen, onClose, comicData }: ComicsModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [liked, setLiked] = useState(false);

  const shareOnSocial = (platform: 'facebook' | 'twitter' | 'discord') => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      twitter: `https://twitter.com/intent/tweet?url=${window.location.href}&text=${comicData.title}`,
      discord: `https://discord.com/channels/@me`
    };
    window.open(shareUrls[platform], '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{comicData.title}</DialogTitle>
        </DialogHeader>

        <div className="relative h-[40vh]">
          <img
            src={comicData.pages[currentPage]}
            alt={`Page ${currentPage + 1}`}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="ml-2">{comicData.likes}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareOnSocial('facebook')}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareOnSocial('twitter')}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareOnSocial('discord')}
            >
              <FaDiscord className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{comicData.description}</p>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === comicData.pages.length - 1}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
