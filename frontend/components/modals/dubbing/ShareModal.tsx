"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Facebook, Twitter, Instagram, Download, Image } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'dubbed' | 'subtitled';
}

export function ShareModal({ isOpen, onClose, contentType }: ShareModalProps) {
  const handleUploadCover = () => {
    // Implement cover upload logic
  };

  const handleDownload = () => {
    // Implement download logic
  };

  const shareOnSocial = (platform: 'facebook' | 'twitter' | 'instagram') => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      twitter: `https://twitter.com/intent/tweet?url=${window.location.href}`,
      instagram: `https://instagram.com`
    };
    window.open(shareUrls[platform], '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your {contentType === 'dubbed' ? 'Dubbing' : 'Subtitles'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Button variant="ghost" onClick={handleUploadCover}>
                <Image className="h-4 w-4 mr-2" />
                Upload Cover
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Enter a title for your video" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleDownload} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => shareOnSocial('facebook')} variant="outline">
              <Facebook className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => shareOnSocial('twitter')}>
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => shareOnSocial('instagram')}>
              <Instagram className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}