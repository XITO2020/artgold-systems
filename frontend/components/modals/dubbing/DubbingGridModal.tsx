"use client";

import { useState } from 'react';
import { Dialog, DialogContent } from "ù/dialog";
import { Button } from "ù/button";
import { Tabs, TabsList, TabsTrigger } from "ù/tabs";
import { Heart } from 'lucide-react';

interface DubbingGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Array<{
    id: string;
    title: string;
    thumbnail: string;
    likes: number;
    type: 'dubbed' | 'subtitled';
    duration: string;
  }>;
}

export function DubbingGridModal({ isOpen, onClose, content }: DubbingGridModalProps) {
  const [selectedType, setSelectedType] = useState<'dubbed' | 'subtitled'>('dubbed');

  const sortedContent = content
    .filter(item => item.type === selectedType)
    .sort((a, b) => b.likes - a.likes);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as 'dubbed' | 'subtitled')}>
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="dubbed" className="flex-1">Dubbed Content</TabsTrigger>
            <TabsTrigger value="subtitled" className="flex-1">Subtitled Content</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-4 gap-4">
          {sortedContent.map((item) => (
            <div key={item.id} className="group relative">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <span className="bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                    {item.duration}
                  </span>
                  <span className="bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {item.likes}
                  </span>
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium truncate">{item.title}</h3>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}