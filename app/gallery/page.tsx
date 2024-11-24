import React from 'react';
import { GALLERY_CATEGORIES } from '@/types/gallery-backup';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function GalleryHomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Art Galleries</h1>
      <p className="text-xl text-muted-foreground mb-12">
        Explore our curated collections of handmade masterpieces
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(GALLERY_CATEGORIES).map(([key, category]) => {
          if (typeof category === 'object' && !Array.isArray(category) && 'id' in category) {
            return (
              <Link key={category.id} href={`/gallery/${category.slug}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video relative">
                    <Image
                      src={category.featuredImage}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="text-white text-xl font-bold">{category.name}</h2>
                      <p className="text-white/80 text-sm">{category.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}</content>