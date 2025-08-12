import { useState } from "react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { PlusCircle, Edit, Trash, Video, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const SAMPLE_ARTICLES = [
  {
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
  }
];

export default function ArticlesPage() {
  const [articles] = useState(SAMPLE_ARTICLES);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles Management</h1>
        <Link href="/admin/articles/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="text-muted-foreground">{article.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Published {format(article.publishedAt, 'MMM d, yyyy')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    {article.chapters.length} videos
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {article.readingTime} min read
                  </span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {article.chapters.map((chapter) => (
                    <div 
                      key={chapter.id}
                      className="relative w-24 h-16 rounded-md overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={chapter.thumbnail}
                        alt={chapter.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">
                          {Math.floor(chapter.duration / 60)}:{(chapter.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href={`/admin/articles/${article.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="destructive" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}