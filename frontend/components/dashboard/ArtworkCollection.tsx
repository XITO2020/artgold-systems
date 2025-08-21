"use client";

import { useEffect, useState } from "react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import Image from "next/image";
import type { ArtworkMetadata } from "@t/artwork";

export function ArtworkCollection() {
  const [artworks, setArtworks] = useState<ArtworkMetadata[]>([]);

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      const response = await fetch('/api/artworks/collection');
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error('Error fetching collection:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <Card key={artwork.id} className="overflow-hidden">
          <div className="aspect-square relative">
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
              <span className="text-sm font-medium">{artwork.currentValue} TABZ</span>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}