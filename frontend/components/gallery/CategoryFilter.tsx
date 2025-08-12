"use client";

import { Button } from "ù/button";
import { ScrollArea } from "ù/scroll-area";
import { GALLERY_CATEGORIES } from 'T/gallery';

interface CategoryFilterProps {
  categories: typeof GALLERY_CATEGORIES;
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {Object.entries(categories).map(([mainCategory, subCategories]) => (
          <div key={mainCategory} className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              {mainCategory.replace('_', ' ')}
            </h3>
            <div className="space-y-1">
              {Object.entries(subCategories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start text-sm"
                  onClick={() => onCategorySelect?.(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}