import React from 'react';
import { ArtworkSlideshow } from "@/components/artwork-slideshow";

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
  },
  {
    id: 4,
    title: "Desert Mirage",
    artist: "Ahmed Hassan",
    price: 13500,
    location: "Dubai, UAE",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1579783902439-0f151d0beb27"
  },
  {
    id: 5,
    title: "Nordic Light",
    artist: "Erik Larsson",
    price: 16000,
    location: "Stockholm, Sweden",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4"
  },
  {
    id: 6,
    title: "Eternal Spring",
    artist: "Sofia Garcia",
    price: 14500,
    location: "Barcelona, Spain",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
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
  },
  {
    id: 3,
    title: "Digital Dreams",
    artist: "Marcus Chen",
    price: 4200,
    location: "Singapore",
    createdAt: "2024-03-13",
    image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4"
  },
  {
    id: 4,
    title: "Neon Nights",
    artist: "Yuki Tanaka",
    price: 6000,
    location: "Seoul, Korea",
    createdAt: "2024-03-12",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
  },
  {
    id: 5,
    title: "Ocean Memories",
    artist: "Sarah Brown",
    price: 4800,
    location: "Sydney, Australia",
    createdAt: "2024-03-11",
    image: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1"
  },
  {
    id: 6,
    title: "Mountain Echo",
    artist: "Hans Mueller",
    price: 5500,
    location: "Zurich, Switzerland",
    createdAt: "2024-03-10",
    image: "https://images.unsplash.com/photo-1579783902439-0f151d0beb27"
  }
];

export default function ExplorePage() {
  return (
    <div className="container mx-auto py-8">
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Top Sales</h2>
        <ArtworkSlideshow items={topSales} variant="top-sales" />
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
        <ArtworkSlideshow items={newArrivals} variant="new-arrivals" />
      </section>
    </div>
  );
}