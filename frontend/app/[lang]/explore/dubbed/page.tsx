"use client";

import { useState } from 'react';
import { Card } from "ù/card";
import { Button } from "ù/button";
import { LikeButton } from "ç/like-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";
import { Play, Award } from "lucide-react";

interface DubbedContent {
  id: string;
  title: string;
  thumbnail: string;
  likes: number;
  isArtwork: boolean;
  value?: number;
  artist: {
    name: string;
    avatar: string;
  };
}

export default function DubbedExplorePage() {
  const [content] = useState<DubbedContent[]>([
    {
      id: "1",
      title: "Japanese Classic Redubbed",
      thumbnail: "https://images.unsplash.com/photo-1578950435899-d1c1bf932ab2",
      likes: 850,
      isArtwork: true,
      value: 8.5,
      artist: {
        name: "Voice Master",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
      }
    },
    // Add more sample content
  ]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Dubbed Content</h1>

      <Tabs defaultValue="featured" className="space-y-8">
        <TabsList>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="grid md:grid-cols-3 gap-6">
          {content.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative bg-black">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute inset-0 m-auto opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Play className="h-8 w-8" />
                </Button>
                {item.isArtwork && (
                  <div className="absolute top-2 right-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.artist.avatar}
                      alt={item.artist.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.artist.name}
                    </span>
                  </div>
                  <LikeButton
                    contentId={item.id}
                    initialLikes={item.likes}
                  />
                </div>
                {item.isArtwork && item.value && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Value: {item.value} TABZ
                  </div>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}