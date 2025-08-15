"use client";

import { useEffect, useState } from "react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Upload, Edit } from "lucide-react";
import Image from "next/image";
import { ArtworkMetadata } from "T/artwork";

export function CreatedArtworks() {
  const [artworks, setArtworks] = useState<ArtworkMetadata[]>([]);

  useEffect(() => {
    // Fetch user's created artworks
    fetchCreatedArtworks();
  }, []);

  const fetchCreatedArtworks = async () => {
    try {
      const response = await fetch('/api/artworks/created');
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Artwork
        </Button>
      </div>

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
              <p className="text-sm text-muted-foreground">Created on {new Date(artwork.creationDate).toLocaleDateString()}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-medium">{artwork.currentValue} TABZ</span>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}