"use client";

import { Dialog, DialogContent } from "ù/dialog";
import { Button } from "ù/button";
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: {
    id: string;
    name: string;
    artworks: Array<{
      id: string;
      imageUrl: string;
      title: string;
    }>;
    category: string;
    followers: number;
  };
}

export function ArtistModal({ isOpen, onClose, artist }: ArtistModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{artist.name}</h2>
            <p className="text-sm text-muted-foreground">{artist.followers} followers</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Follow Artist
            </Button>
            <Link href={`/gallery/${artist.category}`}>
              <Button>View All in {artist.category}</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {artist.artworks.map((artwork) => (
            <div key={artwork.id} className="group relative">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full aspect-square object-cover rounded-lg transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-center font-medium">{artwork.title}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}