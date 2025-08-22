"use client";

import { useState } from "react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Video, FileText, ArrowLeft } from "lucide-react";
import { Switch } from "@ui/switch";
import Link from "next/link";
import type { Article } from "@t/article";

export default function BlogArticlePage({ params }: { params: { id: string } }) {
  const [viewMode, setViewMode] = useState<"video" | "text">("video");
  const [currentChapter, setCurrentChapter] = useState(0);

  // In a real app, fetch the article data based on the ID
  const article: Article = {
    id: "1",
    title: "The Future of Digital Art",
    description: "How digital assets are revolutionizing the art market",
    chapters: [
      {
        id: "ch1",
        title: "The Rise of Digital Art",
        videoUrl: "https://example.com/video1.mp4",
        thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
        duration: 45,
        textContent: "Digital art has seen unprecedented growth..."
      },
      {
        id: "ch2",
        title: "NFTs and Ownership",
        videoUrl: "https://example.com/video2.mp4",
        thumbnail: "https://images.unsplash.com/photo-1549887534-1541e9326642",
        duration: 55,
        textContent: "The concept of digital ownership has evolved..."
      },
      {
        id: "ch3",
        title: "Artist Empowerment",
        videoUrl: "https://example.com/video3.mp4",
        thumbnail: "https://images.unsplash.com/photo-1578926288207-a90a5366759d",
        duration: 50,
        textContent: "Artists are finding new ways to monetize..."
      },
      {
        id: "ch4",
        title: "Future Predictions",
        videoUrl: "https://example.com/video4.mp4",
        thumbnail: "https://images.unsplash.com/photo-1580136579312-94651dfd596d",
        duration: 40,
        textContent: "The future of digital art holds..."
      }
    ],
    author: {
      id: "auth1",
      name: "Maria Garcia",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    publishedAt: new Date("2024-03-15"),
    status: "published",
    readingTime: 8
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="p-0 h-auto text-muted-foreground hover:text-foreground"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </div>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{article.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{article.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Video className={`h-5 w-5 ${viewMode === "video" ? "text-primary" : "text-muted-foreground"}`} />
            <Switch
              checked={viewMode === "text"}
              onCheckedChange={(checked: boolean) => setViewMode(checked ? "text" : "video")}
            />
            <FileText className={`h-5 w-5 ${viewMode === "text" ? "text-primary" : "text-muted-foreground"}`} />
          </div>
        </div>
      </div>

      {viewMode === "video" ? (
        <div className="space-y-6">
          <Card className="p-6">
            <video
              src={article.chapters[currentChapter].videoUrl}
              controls
              className="w-full aspect-video rounded-lg mb-4"
            />
            <h2 className="text-2xl font-semibold mb-4">
              {article.chapters[currentChapter].title}
            </h2>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            {article.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden ${
                  index === currentChapter ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setCurrentChapter(index)}
              >
                <img
                  src={chapter.thumbnail}
                  alt={chapter.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm">
                    {Math.floor(chapter.duration / 60)}:{(chapter.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="prose prose-lg max-w-none">
          {article.chapters.map((chapter) => (
            <div key={chapter.id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{chapter.title}</h2>
              <p>{chapter.textContent}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}