"use client";

import { useState, useEffect } from 'react';
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";
import Image from 'next/image';
import { EnhancedImageModal } from '@comp/modals/portfolio/EnhancedImageModal';
import { getIPFSUrl } from '$/services/pinataServices';

interface Artwork {
  id: string;
  title: string;
  description: string;
  image: {
    cid: string;
    url: string | null;
  };
  likes: number;
  comments: Array<{
    id: string;
    content: string;
    user: {
      name: string;
      image: string;
    };
    createdAt: Date;
  }>;
}

interface ArtworkGridProps {
  category: 'illustrations' | 'comics' | 'videos' | 'graphics';
  titles: string[];
}

export function ArtworkGrid({ category, titles }: ArtworkGridProps) {
  const [selectedTitle, setSelectedTitle] = useState<string>(titles[0] || '');
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/portfolio/${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data = await response.json();
        
        // Map IPFS CIDs to gateway URLs and ensure non-null URLs
        const artworksWithUrls = data.items.map((artwork: Artwork) => ({
          ...artwork,
          image: {
            ...artwork.image,
            url: artwork.image.url || getIPFSUrl(artwork.image.cid)
          }
        }));
        
        setArtworks(artworksWithUrls);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setError('Failed to load artworks');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [category]);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="aspect-square animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (titles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No artworks available</p>
      </div>
    );
  }

  // Filter artworks based on selected title
  const filteredArtworks = artworks.filter(artwork => 
    artwork.title && selectedTitle && 
    artwork.title.toLowerCase() === selectedTitle.toLowerCase()
  );

  // Get non-null image URLs for the modal
  const imageUrls = filteredArtworks
    .map(a => a.image.url)
    .filter((url): url is string => url !== null);

  return (
    <div className="space-y-6">
      <Tabs defaultValue={titles[0]} onValueChange={setSelectedTitle}>
        <TabsList className="w-full justify-start">
          {titles.map((title) => (
            <TabsTrigger key={title} value={title}>
              {title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTitle} className="grid grid-cols-3 gap-4">
          {filteredArtworks.length > 0 ? (
            filteredArtworks.map((artwork) => (
              <Card 
                key={artwork.id} 
                className="overflow-hidden cursor-pointer group"
                onClick={() => {
                  setCurrentPage(0);
                  setIsModalOpen(true);
                }}
              >
                <div className="aspect-square relative">
                  {artwork.image.url && (
                    <Image
                      src={artwork.image.url}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm font-medium">
                      Click to view
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">No artworks found for {selectedTitle}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {filteredArtworks.length > 0 && (
        <EnhancedImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={imageUrls}
          initialIndex={currentPage}
          title={selectedTitle}
          description={filteredArtworks[currentPage]?.description || ''}
          likes={filteredArtworks[currentPage]?.likes || 0}
          itemId={filteredArtworks[currentPage]?.id || ''}
          comments={filteredArtworks[currentPage]?.comments}
        />
      )}
    </div>
  );
}