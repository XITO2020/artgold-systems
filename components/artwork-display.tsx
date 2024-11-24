"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArtworkMetadata } from '@/types/artwork';

interface ArtworkDisplayProps {
  artwork: ArtworkMetadata;
  showUncannyStamp?: boolean;
}

export function ArtworkDisplay({ artwork, showUncannyStamp = true }: ArtworkDisplayProps) {
  const [imageUrl, setImageUrl] = useState<string>(artwork.imageUrl);

  useEffect(() => {
    if (showUncannyStamp && artwork.authentication.verified) {
      // Add uncanny stamp to the image
      fetch('/api/artwork/stamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: artwork.imageUrl })
      })
        .then(res => res.json())
        .then(data => setImageUrl(data.stampedImageUrl))
        .catch(console.error);
    }
  }, [artwork, showUncannyStamp]);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={artwork.title}
          fill
          className="object-cover"
        />
        {artwork.authentication.verified && (
          <div className="absolute top-2 right-2">
            <Badge variant="success" className="bg-green-500">
              Verified Original
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{artwork.title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{artwork.artist}</span>
          <span className="font-medium">{artwork.currentValue} TABZ</span>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Location: {artwork.location.address}</p>
          <p>Created: {new Date(artwork.creationDate).toLocaleDateString()}</p>
        </div>
      </div>
    </Card>
  );
}