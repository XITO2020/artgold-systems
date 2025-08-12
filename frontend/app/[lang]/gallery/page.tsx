"use client";

import { useState } from 'react';
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";
import { ColorFilter } from 'ç/color-filter';
import { CategoryFilter } from 'ç/gallery/CategoryFilter';
import { GalleryGrid } from 'ç/gallery/GalleryGrid';
import { PriceRangeFilter } from 'ç/gallery/PriceRangeFilter';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { GALLERY_CATEGORIES } from 'T/gallery';

export default function GalleryPage() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Art Gallery</h1>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className="flex gap-8">
        {showFilters && (
          <div className="w-64 space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Categories</h3>
              <CategoryFilter categories={GALLERY_CATEGORIES} />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Colors</h3>
              <ColorFilter
                selectedColors={selectedColors}
                onColorSelect={(color) => {
                  setSelectedColors(prev => 
                    prev.includes(color) 
                      ? prev.filter(c => c !== color)
                      : [...prev, color]
                  );
                }}
              />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <PriceRangeFilter
                range={priceRange}
                onChange={setPriceRange}
              />
            </Card>
          </div>
        )}

        <div className="flex-1">
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          <Tabs defaultValue="grid" className="space-y-6">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="masonry">Masonry View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <GalleryGrid
                view="grid"
                filters={{
                  colors: selectedColors,
                  priceRange,
                  search: searchQuery
                }}
              />
            </TabsContent>

            <TabsContent value="masonry">
              <GalleryGrid
                view="masonry"
                filters={{
                  colors: selectedColors,
                  priceRange,
                  search: searchQuery
                }}
              />
            </TabsContent>

            <TabsContent value="list">
              <GalleryGrid
                view="list"
                filters={{
                  colors: selectedColors,
                  priceRange,
                  search: searchQuery
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}