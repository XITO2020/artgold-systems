"use client";

import { useState } from "react";
import { Card } from "ù/card";
import { Input } from "ù/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";
import { Search, ExternalLink } from "lucide-react";

interface StreamingLink {
  title: string;
  url: string;
  platform: string;
  language: string;
  quality: string;
  type: "websites-A" | "websites-S" | "websites-M" | "anime" | "series" | "movies";
}

const streamingLinks: StreamingLink[] = [
  // Anime
  {
    title: "Crunchyroll",
    url: "https://www.crunchyroll.com",
    platform: "Official",
    language: "Multi",
    quality: "HD",
    type: "websites-A"
  },
  {
    title: "Funimation",
    url: "https://www.funimation.com",
    platform: "Official",
    language: "Multi",
    quality: "HD",
    type: "anime"
  },
  // Series
  {
    title: "Netflix",
    url: "https://www.netflix.com",
    platform: "Official",
    language: "Multi",
    quality: "4K",
    type: "series"
  },
  {
    title: "Amazon Prime Video",
    url: "https://www.primevideo.com",
    platform: "Official",
    language: "Multi",
    quality: "4K",
    type: "series"
  },
  {
    title: "Disney+",
    url: "https://www.disneyplus.com",
    platform: "Official",
    language: "Multi",
    quality: "4K",
    type: "series"
  },
  // Movies
  {
    title: "HBO Max",
    url: "https://www.hbomax.com",
    platform: "Official",
    language: "Multi",
    quality: "4K",
    type: "movies"
  },
  {
    title: "Hulu",
    url: "https://www.hulu.com",
    platform: "Official",
    language: "Multi",
    quality: "HD",
    type: "movies"
  }
];

export default function StreamingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLinks = (type:  "websites-A" | "websites-S" | "websites-M" | "anime" | "series" | "movies") => {
    return streamingLinks.filter(link => 
      link.type === type && 
      link.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Streaming Directory</h1>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search streaming services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="anime" className="space-y-6">
        <TabsList>
          <TabsTrigger value="anime">Anime</TabsTrigger>
          <TabsTrigger value="series">Series</TabsTrigger>
          <TabsTrigger value="movies">Movies</TabsTrigger>
        </TabsList>

        {["anime", "series", "movies"].map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks(type as "anime" | "series" | "movies").map((link, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{link.title}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Platform: {link.platform}</p>
                        <p>Language: {link.language}</p>
                        <p>Quality: {link.quality}</p>
                      </div>
                    </div>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Note: All links provided are to official streaming platforms. Please support the content creators by using legal streaming services.
        </p>
      </div>
    </div>
  );
}