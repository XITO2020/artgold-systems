"use client";

import { useState, useEffect } from 'react';
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from '@t/blog';

interface ThemeGridProps {
  theme: string;
  lang: string;
  dict: any;
}

export function ThemeGrid({ theme, lang, dict }: ThemeGridProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`/api/blog/theme/${theme}?limit=20`);
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [theme]);

  if (loading) {
    return <div className="grid grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="aspect-video bg-muted" />
          <div className="p-6 space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </Card>
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden group">
          <div className="aspect-video relative">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString(lang)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readTime} min read
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-3 line-clamp-2">{article.title}</h2>
            <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  src={article.author.image}
                  alt={article.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium">{article.author.name}</span>
              </div>
              <Link href={`/${lang}/blog/${article.slug}`}>
                <Button variant="secondary">{dict.readMore}</Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}