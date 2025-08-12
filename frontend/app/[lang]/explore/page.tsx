"use client";

import { useState } from 'react';
import { ArtworkSlideshow } from "ç/artwork-slideshow";
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";
import { TrendingUp, Clock, Award, ChevronDown } from "lucide-react";
import { CategoriesGridModal } from "ç/modals/treasury/CategoriesGridModal";
import DictionaryLoader from 'ç/DictionaryLoader';
import Image from 'next/image';

const topSales = [
  {
    id: 1,
    title: "Golden Harmony",
    artist: "Maria Chen",
    price: 15000,
    location: "Paris, France",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4"
  },
  {
    id: 2,
    title: "Abstract Dreams",
    artist: "John Smith",
    price: 12500,
    location: "New York, USA",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
  },
  {
    id: 3,
    title: "Urban Symphony",
    artist: "Lisa Wong",
    price: 18000,
    location: "Tokyo, Japan",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1"
  }
];

const newArrivals = [
  {
    id: 1,
    title: "Urban Perspective",
    artist: "Alex Rivera",
    price: 5000,
    location: "Barcelona, Spain",
    createdAt: "2024-03-15",
    image: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1"
  },
  {
    id: 2,
    title: "Nature's Whisper",
    artist: "Emma Wilson",
    price: 3500,
    location: "Tokyo, Japan",
    createdAt: "2024-03-14",
    image: "https://images.unsplash.com/photo-1579783902439-0f151d0beb27"
  }
];

const columns = [
  {
    title: "Heritage",
    categories: [
      { id: "1", title: "Pacifikian", imageUrl: "/categories/pac.png", name: "Pacific", slug: "pacific-art" },
      { id: "2", title: "Oriental", imageUrl: "/categories/oriental.png", name: "Oriental", slug: "oriental-art" },
      { id: "3", title: "African", imageUrl: "/categories/african.png", name: "African", slug: "african-art" },
      { id: "4", title: "Indian", imageUrl: "/categories/indian.png", name: "Indian", slug: "indian-art" },
      { id: "5", title: "Amerindian", imageUrl: "/categories/amerindian.png", name: "Amerindian", slug: "amerindian-art" },
      { id: "6", title: "Slavic", imageUrl: "/categories/slavic.png", name: "Slavic", slug: "slavic-art" },
      { id: "7", title: "Chinese", imageUrl: "/categories/china.png", name: "Chinese", slug: "chinese-art" },
      { id: "8", title: "Japanese", imageUrl: "/categories/jap.png", name: "Japanese", slug: "japanese-art" },
      { id: "9", title: "Medieval", imageUrl: "/categories/medieval.png", name: "Medieval", slug: "medieval-art" },
      { id: "10", title: "Realistic XIX", imageUrl: "/categories/XIX.png", name: "Real XIX", slug: "realistic-art" }
    ]
  },
  {
    title: "Concept",
    categories: [
      { id: "1", title: "Architecture", imageUrl: "/categories/eco.png", name: "Architecture", slug: "architecture" },
      { id: "2", title: "Object", imageUrl: "/categories/object.png", name: "Object", slug: "object" },
      { id: "3", title: "Visual Effect", imageUrl: "/categories/effect.png", name: "Visual FX", slug: "visual-effect" },
      { id: "4", title: "Technology", imageUrl: "/categories/tech.png", name: "Technology", slug: "technology" },
      { id: "5", title: "Vehicles Concept", imageUrl: "/categories/vehicles.png", name: "Vehicles", slug: "vehicles-concept" },
      { id: "6", title: "Creatures", imageUrl: "/categories/creatures.png", name: "Creatures", slug: "creatures" },
      { id: "7", title: "Character Design", imageUrl: "/categories/design.png", name: "Characters", slug: "character-design" },
      { id: "8", title: "Invention", imageUrl: "/categories/invention.png", name: "Inventions", slug: "invention" },
      { id: "9", title: "Ecological Plan", imageUrl: "/categories/eco.png", name: "Ecological", slug: "ecological-plan" },
      { id: "10", title: "Other", imageUrl: "/categories/other.png", name: "Other", slug: "other" }
    ]
  },
  {
    title: "Style",
    categories: [
      { id: "1", title: "Calligraphy", imageUrl: "/categories/calli.png", name: "Calligraphy", slug: "calligraphy" },
      { id: "2", title: "School Sketch", imageUrl: "/categories/school.png", name: "SchoolSketch", slug: "school-sketch" },
      { id: "3", title: "Portrait", imageUrl: "/categories/portrait.png", name: "Portrait", slug: "portrait" },
      { id: "4", title: "Landscape", imageUrl: "/categories/landscape.png", name: "Landscape", slug: "landscape" },
      { id: "5", title: "Sketch", imageUrl: "/categories/sketch.png", name: "Sketch", slug: "sketch" },
      { id: "6", title: "Photography", imageUrl: "/categories/photo.png", name: "Photography", slug: "photography" },
      { id: "7", title: "Map", imageUrl: "/categories/map.png", name: "Map", slug: "map" },
      { id: "8", title: "Comics", imageUrl: "/categories/comics.png", name: "Comics", slug: "comics" },
      { id: "9", title: "Manga", imageUrl: "/categories/manga.png", name: "Manga", slug: "manga" },
      { id: "10", title: "Abstract", imageUrl: "/categories/abstract.png", name: "Abstract", slug: "abstract" }
    ]
  },
  {
    title: "Pop",
    categories: [
      { id: "1", title: "Realistic XX", imageUrl: "/categories/XX.png", name: "Real XX", slug: "realistic-xx" },
      { id: "2", title: "Realistic XXI", imageUrl: "/categories/XXI.png", name: "Real XXI", slug: "realistic" },
      { id: "3", title: "Animated Gif", imageUrl: "/categories/giphy.gif", name: "Anim Gif", slug: "animated-gif" },
      { id: "4", title: "Pixel Art", imageUrl: "/categories/pixel.png", name: "Pixel Art", slug: "pixel-art" },
      { id: "5", title: "Memes", imageUrl: "/categories/memes.png", name: "Memes", slug: "memes" },
      { id: "6", title: "Poster", imageUrl: "/categories/poster.png", name: "Poster", slug: "poster" },
      { id: "7", title: "Meca", imageUrl: "/categories/meca.png", name: "Meca", slug: "meca" },
      { id: "8", title: "Fantasy", imageUrl: "/categories/fantaisy.png", name: "Fantasy", slug: "fantasy" },
      { id: "9", title: "Labyrinth Game", imageUrl: "/categories/laby.png", name: "LabyGame", slug: "labyrinth-game" },
      { id: "10", title: "Emblem Coat of Arms", imageUrl: "/categories/emblem.png", name: "Emblem Coat of Arms", slug: "emblem-coat-of-arms" }
    ]
  },
  {
    title: "Material",
    categories: [
      { id: "1", title: "Inked", imageUrl: "/categories/inked.png", name: "Inked", slug: "inked" },
      { id: "2", title: "Paper", imageUrl: "/categories/paper.png", name: "Paper", slug: "paper" },
      { id: "3", title: "Textile", imageUrl: "/categories/textile.png", name: "Textile", slug: "textile" },
      { id: "4", title: "On Wood", imageUrl: "/categories/onwood.png", name: "On Wood", slug: "on-wood" },
      { id: "5", title: "Oil", imageUrl: "/categories/oil.png", name: "Oil", slug: "oil" },
      { id: "6", title: "Acrylic", imageUrl: "/categories/acrylic.png", name: "Acrylic", slug: "acrylic" },
      { id: "7", title: "Pencil", imageUrl: "/categories/pencil.png", name: "Pencil", slug: "pencil" },
      { id: "8", title: "Watercolor", imageUrl: "/categories/watercolor.png", name: "Watercolor", slug: "watercolor" },
      { id: "9", title: "Sculpture", imageUrl: "/categories/sculpture.png", name: "Sculpture", slug: "sculpture" },
      { id: "10", title: "Cooking", imageUrl: "/categories/cake.png", name: "Cooking", slug: "cooking" }
    ]
  }
];

export default function ExplorePage({ params }: { params: { lang: string } }) {
  const [showCategories, setShowCategories] = useState(false);
  const { lang } = params;

  return (
    <DictionaryLoader lang={lang} page="explore">
      {(dict) => (
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{dict.explore.treasury.title}</h1>
            <Button
              variant="outline"
              onClick={() => setShowCategories(true)}
              className="flex items-center gap-2"
            >
              Browse Categories
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="trending" className="space-y-8">
            <TabsList>
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="new">
                <Clock className="h-4 w-4 mr-2" />
                New Arrivals
              </TabsTrigger>
              <TabsTrigger value="featured">
                <Award className="h-4 w-4 mr-2" />
                Featured
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending">
              <div className="grid md:grid-cols-3 gap-6">
                {topSales.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.artist}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium">{item.price} TABZ</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new">
              <ArtworkSlideshow items={newArrivals} variant="new-arrivals" />
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid md:grid-cols-2 gap-6">
                {topSales.slice(0, 2).map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.artist}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium">{item.price} TABZ</span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <CategoriesGridModal
            isOpen={showCategories}
            onClose={() => setShowCategories(false)}
            columns={columns}
          />
        </div>
      )}
    </DictionaryLoader>
  );
}
