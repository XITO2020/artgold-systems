"use client";

import { useEffect, useState } from "react";
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Play, Mic } from "lucide-react";

interface DubbedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  createdAt: Date;
}

export function DubbedVideos() {
  const [videos, setVideos] = useState<DubbedVideo[]>([]);

  useEffect(() => {
    // Fetch user's dubbed videos
    fetchDubbedVideos();
  }, []);

  const fetchDubbedVideos = async () => {
    try {
      const response = await fetch('/api/videos/dubbed');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button>
          <Mic className="mr-2 h-4 w-4" />
          New Dubbing Project
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video relative bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute inset-0 m-auto opacity-0 hover:opacity-100 transition-opacity"
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{video.title}</h3>
              <p className="text-sm text-muted-foreground">
                Created on {new Date(video.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </span>
                <Button variant="outline" size="sm">Edit Dubbing</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}