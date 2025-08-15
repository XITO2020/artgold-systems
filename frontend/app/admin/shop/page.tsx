"use client";

import { useState } from "react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Plus, Search, Edit, Trash, Tag, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@hooks/use-toast';
import { getIPFSUrl } from '@/../services/pinataServices';

interface TShirt {
  id: string;
  title: string;
  description: string;
  price: number;
  imageId: string;
  image: {
    cid: string;
    url: string | null;
  };
  category: string;
  inStock: boolean;
  sales: number;
}

export default function AdminShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [tshirts, setTshirts] = useState<TShirt[]>([
    // Sample data - replace with actual API call
    {
      id: "1",
      title: "Art Support Tee",
      description: "Support local artists with this unique design",
      price: 29.99,
      imageId: "Qm...", // Example CID
      image: {
        cid: "Qm...",
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27"
      },
      category: "art",
      inStock: true,
      sales: 45
    }
  ]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/shop/tshirts/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete t-shirt');
      }

      setTshirts(tshirts.filter(t => t.id !== id));
      toast({
        title: "Success",
        description: "T-shirt deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete t-shirt",
        variant: "destructive"
      });
    }
  };

  const filteredTshirts = tshirts.filter(tshirt =>
    tshirt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tshirt.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">T-Shirts Management</h1>
        <Link href="/admin/shop/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New T-Shirt
          </Button>
        </Link>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search t-shirts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Tag className="h-4 w-4 mr-2" />
            Filter by Category
          </Button>
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Stock Status
          </Button>
        </div>

        <div className="grid gap-6">
          {filteredTshirts.map((tshirt) => (
            <Card key={tshirt.id} className="p-4">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 relative rounded-lg overflow-hidden">
                  <Image
                    src={tshirt.image.url || getIPFSUrl(tshirt.image.cid)}
                    alt={tshirt.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{tshirt.title}</h3>
                  <p className="text-muted-foreground mb-2">{tshirt.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">${tshirt.price}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tshirt.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tshirt.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <span className="text-muted-foreground">{tshirt.sales} sales</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>IPFS CID: {tshirt.imageId}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/shop/${tshirt.id}/edit`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDelete(tshirt.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}