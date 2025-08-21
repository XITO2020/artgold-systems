"use client";

import { useState, useEffect } from 'react';
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Heart, Share } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@hooks/use-toast';

interface GalleryGridProps {
  view: 'grid' | 'masonry' | 'list';
  filters: {
    colors: string[];
    priceRange: { min: number; max: number };
    search: string;
  };
}

export function GalleryGrid({ view, filters }: GalleryGridProps) {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArtworks();
  }, [filters]);

  const fetchArtworks = async () => {
    try {
      // In a real app, this would be an API call with filters
      const response = await fetch('/api/artworks?' + new URLSearchParams({
        colors: filters.colors.join(','),
        minPrice: filters.priceRange.min.toString(),
        maxPrice: filters.priceRange.max.toString(),
        search: filters.search
      }));
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (artworkId: string) => {
    try {
      await fetch('/api/artworks/like', {
        method: 'POST',
        body: JSON.stringify({ artworkId })
      });
      toast({
        title: "Success",
        description: "Artwork liked successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like artwork",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const gridClass = view === 'grid' ? 'grid-cols-3' :
                   view === 'masonry' ? 'columns-3' :
                   'flex flex-col';

  return (
    <div className={`gap-6 ${view === 'grid' ? 'grid' : ''} ${gridClass}`}>
      {artworks.map((artwork) => (
        <Card key={artwork.id} className={`overflow-hidden ${view === 'list' ? 'flex mb-4' : ''}`}>
          <div className={`relative ${view === 'list' ? 'w-48' : 'aspect-square'}`}>
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{artwork.title}</h3>
            <p className="text-sm text-muted-foreground">{artwork.artist}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="font-medium">{artwork.price} TABZ</span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleLike(artwork.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}