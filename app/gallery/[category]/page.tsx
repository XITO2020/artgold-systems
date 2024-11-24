"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { GALLERY_CATEGORIES } from '@/types/gallery-backup';
import { Card } from '@/components/ui/card';
import Button  from '@/components/ui/button';
import { TabButton } from '@/components/tab-button';
import { ColorFilter } from '@/components/color-filter';
import Image from 'next/image';

export default function GalleryPage() {
  const params = useParams();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  const category = Object.values(GALLERY_CATEGORIES).flat().find(
    cat => cat.slug === params.category
  );

  if (!category) {
    return <div>Gallery not found</div>;
  }

  const handleColorSelect = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  return (
    <div className={`min-h-screen ${category.theme.background}`}>
      <div className="container mx-auto py-8">
        <h1 className={`text-4xl font-bold mb-8 ${category.theme.text}`}>
          {category.name}
        </h1>
        <p className={`text-lg mb-8 ${category.theme.text} opacity-80`}>
          {category.description}
        </p>

        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${category.theme.text}`}>
            Filter by Color
          </h2>
          <ColorFilter
            onColorSelect={handleColorSelect}
            selectedColors={selectedColors}
          />
        </div>

        <div className={`grid gap-6 ${
          category.layout === 'grid' ? 'grid-cols-3' :
          category.layout === 'masonry' ? 'columns-3' :
          category.layout === 'horizontal' ? 'flex overflow-x-auto' :
          'flex flex-col'
        }`}>
          {/* Example artwork cards */}
          {[1, 2, 3, 4, 5].map((i) => (
            <Card 
              key={i}
              className={`overflow-hidden ${category.theme.accent} hover:shadow-xl transition-shadow`}
            >
              <div className="aspect-square relative">
                <Image
                  src={`https://images.unsplash.com/photo-${1544333320 + i}-9c5cca5d6123?auto=format&fit=crop&w=800&q=80`}
                  alt={`Artwork ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className={`font-semibold text-xl mb-2 ${category.theme.text}`}>
                  Artwork Title #{i}
                </h3>
                <div className="flex justify-between items-center">
                  <span className={`${category.theme.text} opacity-75`}>
                    Artist Name
                  </span>
                  <TabButton amount={100 * i} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}