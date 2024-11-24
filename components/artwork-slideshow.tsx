"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { MapPin, Sparkles, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  price: number;
  location: string;
  image: string;
  rating?: number;
  createdAt?: string;
}

interface ArtworkSlideshowProps {
  items: Artwork[];
  variant: "top-sales" | "new-arrivals";
}

export function ArtworkSlideshow({ items, variant }: ArtworkSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const currentItems = items.slice(
    currentIndex * itemsPerSlide,
    (currentIndex + 1) * itemsPerSlide
  );

  return (
    <div className="relative group">
      <div className="grid md:grid-cols-3 gap-8">
        {currentItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`${
                    variant === "top-sales"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  } text-white px-2 py-1 rounded-full text-sm font-medium`}
                >
                  {variant === "top-sales" ? "Top Seller" : "New"}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">{item.artist}</span>
                {variant === "top-sales" ? (
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    {item.rating}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(item.createdAt!).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  {item.location}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.price} TABZ</span>
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="default"
          size="sm"
          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-primary"
                : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
            }`}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}