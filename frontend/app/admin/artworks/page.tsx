"use client";

import { useState, useEffect } from 'react';
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Plus, Edit, Trash, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@hooks/use-toast';
import { getIPFSUrl } from '@/../services/pinataServices';
import type { PortfolioItem } from '@t/portfolio';

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<PortfolioItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await fetch('/api/portfolio/all');
      const data = await response.json();
      // Map IPFS CIDs to gateway URLs
      const artworksWithUrls = data.map((artwork: PortfolioItem) => ({
        ...artwork,
        url: artwork.url.startsWith('Qm') ? getIPFSUrl(artwork.url) : artwork.url,
        thumbnail: artwork.thumbnail?.startsWith('Qm') ? 
          getIPFSUrl(artwork.thumbnail) : 
          artwork.thumbnail
      }));
      setArtworks(artworksWithUrls);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch artworks",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete artwork');
      }

      setArtworks(artworks.filter(a => a.id !== id));
      toast({
        title: "Success",
        description: "Artwork deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete artwork",
        variant: "destructive"
      });
    }
  };

  const filteredArtworks = artworks.filter(artwork =>
    artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artwork.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Artworks Management</h1>
        <Link href="/admin/artworks/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Artwork
          </Button>
        </Link>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredArtworks.map((artwork) => (
            <Card key={artwork.id} className="p-4">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 relative rounded-lg overflow-hidden">
                  <Image
                    src={artwork.thumbnail || artwork.url}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                  <p className="text-muted-foreground mb-2">{artwork.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">{artwork.category}</span>
                    <span className="text-muted-foreground">{artwork.likes} likes</span>
                    <span className="text-muted-foreground">{artwork.views} views</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>IPFS CID: {artwork.url.split('/').pop()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/artworks/${artwork.id}/edit`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDelete(artwork.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}