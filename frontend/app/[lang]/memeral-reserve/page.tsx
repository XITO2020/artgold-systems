"use client";

import { useState, useEffect } from 'react';
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Badge } from "@ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@hooks/use-toast";
import {  ImageIcon, Heart, Coins } from "lucide-react";

interface MemeralItem {
  id: string;
  memeHash: string;
  title: string;
  url: string;
  tabzValue: number;
  addedBy: string;
  createdAt: Date;
}

type UserLike = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;   // ← on l’ajoute ici
};

export default function MemeralReservePage() {
  const [memes, setMemes] = useState<MemeralItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = Boolean(user?.isAdmin);

  // Admin upload state
  const [newMeme, setNewMeme] = useState({
    title: '',
    price: 1000,
    file: null as File | null
  });

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await fetch('/api/bank/memeral');
      const data = await response.json();
      setMemes(data);
    } catch (error) {
      console.error('Error fetching memes:', error);
      toast({
        title: "Error",
        description: "Failed to load memeral reserve",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeme.file || !newMeme.title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', newMeme.file);
    formData.append('title', newMeme.title);
    formData.append('price', newMeme.price.toString());

    try {
      const response = await fetch('/api/bank/memeral/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      toast({
        title: "Success",
        description: "Meme added to memeral reserve"
      });

      // Reset form and refresh memes
      setNewMeme({ title: '', price: 1000, file: null });
      fetchMemes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload meme",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePurchase = async (memeId: string) => {
    try {
      const response = await fetch('/api/bank/memeral/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memeId })
      });

      if (!response.ok) throw new Error('Purchase failed');

      toast({
        title: "Success",
        description: "Meme purchased successfully"
      });

      fetchMemes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purchase meme",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Memeral Reserve</h1>

      {isAdmin && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Meme</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Meme Title"
                value={newMeme.title}
                onChange={(e) => setNewMeme(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Price in TABZ"
                value={newMeme.price}
                onChange={(e) => setNewMeme(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                min={1}
                required
              />
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewMeme(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                required
              />
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Add to Reserve'}
            </Button>
          </form>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <Card key={meme.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={meme.url}
                alt={meme.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-black/50">
                  <Heart className="h-4 w-4 mr-1" />
                  {meme.tabzValue} TABZ
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{meme.title}</h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{meme.tabzValue} TABZ</span>
                </div>
                <Button
                  onClick={() => handlePurchase(meme.id)}
                  disabled={!user}
                >
                  Purchase
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}