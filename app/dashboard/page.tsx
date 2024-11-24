"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/ui/button";
import { 
  Coins, 
  Palette, 
  Share2, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CryptoBalance } from "@/components/crypto-balance";
import { AssetMetrics } from "@/components/asset-metrics";
import { ConversionPanel } from "@/components/conversion-panel";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [maxTabzValue, setMaxTabzValue] = useState<number>(0);

  useEffect(() => {
    // Fetch current gold price and calculate max TABZ value
    const fetchGoldPrice = async () => {
      const response = await fetch('/api/gold-price');
      const data = await response.json();
      setGoldPrice(data.price);
      setMaxTabzValue(data.price * 1); // 1 kg of gold
    };

    fetchGoldPrice();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          <div className="space-y-4">
            <WalletMultiButton className="w-full" />
            <Button className="w-full" variant="outline">
              Connect Monero Wallet
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Limits</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Gold Price (1kg)</span>
              <span className="font-medium">${goldPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Max TABZ Value</span>
              <span className="font-medium">{maxTabzValue.toLocaleString()} TABZ</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <CryptoBalance />
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

      <Tabs defaultValue="assets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="convert">Convert</TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          <div className="grid md:grid-cols-2 gap-8">
            <AssetMetrics />
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Value History</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { date: '2024-01', value: 100 },
                  { date: '2024-02', value: 150 },
                  { date: '2024-03', value: 180 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="convert">
          <ConversionPanel maxTabzValue={maxTabzValue} />
        </TabsContent>
      </Tabs>
    </div>
  );
}