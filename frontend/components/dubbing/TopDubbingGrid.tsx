"use client";

import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import LazyLoad from 'react-lazy-load';
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Heart, Play, Pause } from "lucide-react";

// Sample data generator - replace with API call
const generateTopVideos = () => 
  Array.from({ length: 1000 }, (_, i) => ({
    id: `video-${i + 1}`,
    title: `Top Dubbed Video #${i + 1}`,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with real URLs
    thumbnail: `https://picsum.photos/seed/${i}/300/200`,
    likes: Math.floor(Math.random() * 10000),
    views: Math.floor(Math.random() * 1000000)
  }));

export function TopDubbingGrid() {
  const [videos] = useState(generateTopVideos);
  const [playing, setPlaying] = useState<string | null>(null);

  const togglePlay = (videoId: string) => {
    setPlaying(playing === videoId ? null : videoId);
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {videos.map((video) => (
        <LazyLoad key={video.id} height={200} offset={300}>
          <Card className="overflow-hidden group">
            <div className="relative aspect-video">
              {playing === video.id ? (
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="100%"
                  playing={true}
                  controls={true}
                  onEnded={() => setPlaying(null)}
                />
              ) : (
                <>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => togglePlay(video.id)}
                  >
                    <Play className="h-8 w-8 text-white" />
                  </Button>
                </>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm truncate">{video.title}</h3>
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>{video.views.toLocaleString()} views</span>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {video.likes.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        </LazyLoad>
      ))}
    </div>
  );
}