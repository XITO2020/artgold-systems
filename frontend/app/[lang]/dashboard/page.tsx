"use client";

import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { ArtworkCollection } from "@comp/dashboard/ArtworkCollection";
import { DubbedVideos } from "@comp/dashboard/DubbedVideos";
import { CreatedArtworks } from "@comp/dashboard/CreatedArtworks";
import { CryptoWallet } from "@comp/dashboard/CryptoWallet";
import { Coins, ArrowUpRight, Wallet } from "lucide-react";
import { AuthForm } from "@comp/auth/AuthForm";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-16 px-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Welcome, {session.user?.name || 'Artist'}</h1>
      
      <Tabs defaultValue="collection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collection">
            <Wallet className="mr-2 h-4 w-4" />
            Collection
          </TabsTrigger>
          <TabsTrigger value="created">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Created
          </TabsTrigger>
          <TabsTrigger value="dubbed">
            <Coins className="mr-2 h-4 w-4" />
            Dubbed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-4">
          <ArtworkCollection />
          <CryptoWallet />
        </TabsContent>

        <TabsContent value="created" className="space-y-4">
          <CreatedArtworks />
        </TabsContent>

        <TabsContent value="dubbed" className="space-y-4">
          <DubbedVideos />
        </TabsContent>
      </Tabs>
    </div>
  );
}