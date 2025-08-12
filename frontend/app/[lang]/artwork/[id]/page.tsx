"use client";

import { useState } from 'react';
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { useSession } from "next-auth/react";
import { useToast } from "@hooks/use-toast";
import { Building2, Users, ArrowRightLeft } from "lucide-react";

export default function ArtworkPage({ params } : { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [saleType, setSaleType] = useState<'bank' | 'user'>('bank');
  const [price, setPrice] = useState('');
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleSell = async () => {
    if (!price) return;

    setLoading(true);
    try {
      const endpoint = saleType === 'bank' 
        ? '/api/bank/purchase' 
        : '/api/artwork/list';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId: params.id,
          price: parseFloat(price)
        })
      });

      if (!response.ok) throw new Error('Sale failed');

      toast({
        title: "Success",
        description: saleType === 'bank' 
          ? "Artwork sold to bank" 
          : "Artwork listed for sale"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process sale",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Sell Artwork</h2>
        
        <Tabs value={saleType} onValueChange={(v) => setSaleType(v as 'bank' | 'user')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Sell to Bank
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Sell to Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="font-medium">Bank Purchase Terms:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Maximum purchase amount: 1000 TABZ/AGT</li>
                <li>Instant settlement</li>
                <li>No listing fees</li>
                <li>Subject to bank reserve availability</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sale Price</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  max="1000"
                />
                <Button 
                  onClick={handleSell}
                  disabled={loading || !price || parseFloat(price) > 1000}
                >
                  {loading ? 'Processing...' : 'Sell to Bank'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="user" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="font-medium">User Marketplace Terms:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>No maximum price limit</li>
                <li>Listing remains active until sold</li>
                <li>2% listing fee</li>
                <li>Value distribution on sale</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Listing Price</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                />
                <Button 
                  onClick={handleSell}
                  disabled={loading || !price}
                >
                  {loading ? 'Processing...' : 'List for Sale'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}