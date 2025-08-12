"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "ù/dialog";
import { Button } from "ù/button";
import { 
  Share2, 
  MessageCircle,
  Send,
  Video
} from 'lucide-react';
import { FaDiscord, FaTiktok, FaInstagram } from "react-icons/fa";
import { useToast } from "#//use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoBlob: Blob | null;
  mode: "dubbed" | "subtitled";
}

export function ShareModal({ isOpen, onClose, videoBlob, mode }: ShareModalProps) {
  const [sharing, setSharing] = useState(false);
  const { toast } = useToast();

  const handleShare = async (platform: string) => {
    if (!videoBlob) {
      toast({
        title: "Error",
        description: "No video available to share",
        variant: "destructive"
      });
      return;
    }

    setSharing(true);
    try {
      const file = new File([videoBlob], `${mode}-content.mp4`, { type: 'video/mp4' });
      
      switch (platform) {
        case 'tiktok':
          window.open('https://www.tiktok.com/upload', '_blank');
          break;
          
        case 'telegram':
          window.open('https://web.telegram.org', '_blank');
          break;
          
        case 'gab':
          window.open('https://gab.com/compose', '_blank');
          break;
          
        case 'discord':
          window.open('https://discord.com/channels/@me', '_blank');
          break;
          
        case 'dtube':
          window.open('https://d.tube/upload', '_blank');
          break;
      }

      toast({
        title: "Ready to Share",
        description: `Please upload the downloaded video to ${platform}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare video for sharing",
        variant: "destructive"
      });
    } finally {
      setSharing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Content</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleShare('tiktok')}
            disabled={sharing}
          >
            <Video className="h-5 w-5" />
            TikTok
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleShare('telegram')}
            disabled={sharing}
          >
            <Send className="h-5 w-5" />
            Telegram
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleShare('gab')}
            disabled={sharing}
          >
            <MessageCircle className="h-5 w-5" />
            Gab
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleShare('discord')}
            disabled={sharing}
          >
            <FaDiscord className="h-5 w-5" />
            Discord
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 col-span-2"
            onClick={() => handleShare('dtube')}
            disabled={sharing}
          >
            <Share2 className="h-5 w-5" />
            DTube
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Your video will be downloaded first, then you can upload it to your chosen platform
        </p>
      </DialogContent>
    </Dialog>
  );
}