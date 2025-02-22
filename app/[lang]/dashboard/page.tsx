"use client";

import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";
import { DashboardAuth } from "ç/dashboard/DashboardAuth";
import { ArtworkCollection } from "ç/dashboard/ArtworkCollection";
import { DubbedVideos } from "ç/dashboard/DubbedVideos";
import { CreatedArtworks } from "ç/dashboard/CreatedArtworks";
import { CryptoWallet } from "ç/dashboard/CryptoWallet";
import { Card } from "ù/card";
import { Button } from "ù/button";
import { 
  Coins, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return <DashboardAuth />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold">1,234.56 TABZ</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h Change</p>
              <p className="text-2xl font-bold text-green-600">+5.23%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available to Convert</p>
              <p className="text-2xl font-bold">234.56 TABZ</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="collection" className="space-y-8">
        <TabsList>
          <TabsTrigger value="collection">Art Collection</TabsTrigger>
          <TabsTrigger value="dubbed">Dubbed Videos</TabsTrigger>
          <TabsTrigger value="created">Created Art</TabsTrigger>
          <TabsTrigger value="wallet">Crypto Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="collection">
          <ArtworkCollection />
        </TabsContent>

        <TabsContent value="dubbed">
          <DubbedVideos />
        </TabsContent>

        <TabsContent value="created">
          <CreatedArtworks />
        </TabsContent>

        <TabsContent value="wallet">
          <CryptoWallet />
        </TabsContent>
      </Tabs>
    </div>
  );
}