"use client";

import { useState } from 'react';
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Search, ShoppingBag, Heart } from "lucide-react";
import Link from 'next/link';
import { useToast } from "#/hooks/use-toast";

interface TShirt {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  projectId?: string;
}

interface TShirtGridProps {
  limit?: number;
  showSearch?: boolean;
  showProjectInfo?: boolean;
}

export function TShirtGrid({ limit = 12, showSearch = true, showProjectInfo = true }: TShirtGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [tshirts, setTshirts] = useState<TShirt[]>([]);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/shop/tshirts/search?q=${query}`);
      const data = await response.json();
      setTshirts(data);
    } catch (error) {
      console.error('Error searching t-shirts:', error);
    }
  };

  return (
    <div className="space-y-6">
      {showSearch && (
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search t-shirts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="pl-10"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tshirts.slice(0, limit).map((tshirt) => (
          <Card key={tshirt.id} className="overflow-hidden group">
            <div className="aspect-square relative">
              <img
                src={tshirt.imageUrl}
                alt={tshirt.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link href={`/shop/tshirts/${tshirt.id}`}>
                  <Button variant="secondary" size="lg">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{tshirt.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {tshirt.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-medium">${tshirt.price}</span>
                {showProjectInfo && tshirt.projectId && (
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Support Project
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}