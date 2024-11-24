import React from 'react';
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import Image from "next/image";

const posts = [
  {
    id: 1,
    title: "The Future of Art Investment",
    excerpt: "How digital assets are revolutionizing the art market and creating new opportunities for artists and collectors.",
    date: "2024-03-15",
    author: "Maria Garcia",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Understanding Art Value Distribution",
    excerpt: "A deep dive into how InserCoin ensures fair value distribution among creators, owners, and community buyers.",
    date: "2024-03-14",
    author: "John Smith",
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80"
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <CalendarDays className="h-4 w-4" />
                {post.date}
              </div>
              <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">By {post.author}</span>
                <Button variant="secondary">Read More</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}