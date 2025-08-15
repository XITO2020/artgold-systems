"use client";

import { useState } from 'react';
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";
import { Calendar } from "@ui/calendar";
import { Badge } from "@ui/badge";
import { Folder, Tag, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

interface BlogSidebarProps {
  themes: Array<{ id: string; name: string; count: number }>;
  categories: Array<{ id: string; name: string; count: number }>;
  lang: string;
  dict: any;
}

export function BlogSidebar({ themes, categories, lang, dict }: BlogSidebarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="w-80 space-y-6">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="h-5 w-5" />
          <h3 className="font-semibold">{dict.themes.title}</h3>
        </div>
        <ScrollArea className="h-[200px] pr-4">
          {themes.map((theme) => (
            <Link 
              key={theme.id} 
              href={`/${lang}/blog/theme/${theme.id}`}
              className="flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span>{theme.name}</span>
              <Badge variant="secondary">{theme.count}</Badge>
            </Link>
          ))}
        </ScrollArea>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5" />
          <h3 className="font-semibold">{dict.categories.title}</h3>
        </div>
        <ScrollArea className="h-[200px] pr-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${lang}/blog/category/${category.id}`}
              className="flex items-center justify-between py-2 hover:text-primary transition-colors"
            >
              <span>{category.name}</span>
              <Badge variant="secondary">{category.count}</Badge>
            </Link>
          ))}
        </ScrollArea>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5" />
          <h3 className="font-semibold">{dict.archive.title}</h3>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        {date && (
          <div className="mt-4">
            <Link href={`/${lang}/blog/archive/${date.toISOString().split('T')[0]}`}>
              <Button variant="secondary" className="w-full">
                {dict.archive.view}
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}