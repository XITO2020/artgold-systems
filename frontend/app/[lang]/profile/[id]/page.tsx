"use client";

import { useState, useEffect } from 'react';
import { Card } from "ù/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";
import { LikeButton } from "ç/like-button";
import { Award, Video, FileText, Palette } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  artworks: any[];
  dubbedContent: any[];
  blogPosts: any[];
  totalTabz: number;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Fetch user profile data
    // This is a placeholder - implement actual data fetching
    setProfile({
      id: params.id,
      name: "Creative Artist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      artworks: [],
      dubbedContent: [],
      blogPosts: [],
      totalTabz: 125.5
    });
  }, [params.id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">
            Total Value: {profile.totalTabz} TABZ
          </p>
        </div>
      </div>

      <Tabs defaultValue="artworks" className="space-y-8">
        <TabsList>
          <TabsTrigger value="artworks">
            <Palette className="h-4 w-4 mr-2" />
            Artworks
          </TabsTrigger>
          <TabsTrigger value="dubbed">
            <Video className="h-4 w-4 mr-2" />
            Dubbed Content
          </TabsTrigger>
          <TabsTrigger value="blog">
            <FileText className="h-4 w-4 mr-2" />
            Blog Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artworks" className="grid md:grid-cols-3 gap-6">
          {profile.artworks.map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden">
              {/* Artwork display */}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="dubbed" className="grid md:grid-cols-3 gap-6">
          {profile.dubbedContent.map((content) => (
            <Card key={content.id} className="overflow-hidden">
              {/* Dubbed content display */}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="blog" className="grid md:grid-cols-2 gap-6">
          {profile.blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {/* Blog post display */}
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}