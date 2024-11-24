"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Wallet, ArrowRightLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { TOKEN_CONFIG, CONVERSION_RATES } from '@/lib/token-config';
import { TokenPurchase } from '@/components/payment/token-purchase';
import { TokenExchange } from '@/components/payment/token-exchange';

export default function ShopPage() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const [selectedToken, setSelectedToken] = useState<'TABZ' | 'AGT'>('TABZ');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');

  const handleSuccess = () => {
    // Refresh user's balance and show success message
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Token Shop</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Current Rates</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={TOKEN_CONFIG.TABZ.logo}
                    alt="TABZ"
                    className="w-8 h-8"
                  />
                  <span>1 TABZ</span>
                </div>
                <span>= {TOKEN_CONFIG.TABZ.goldGramsPerToken}g Gold</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={TOKEN_CONFIG.AGT.logo}
                    alt="AGT"
                    className="w-8 h-8"
                  />
                  <span>1 AGT</span>
                </div>
                <span>= {TOKEN_CONFIG.AGT.silverGramsPerToken}g Silver</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Connect Wallet</h2>
            <div className="space-y-4">
              <WalletMultiButton className="w-full" />
              {!session && (
                <p className="text-sm text-muted-foreground">
                  Sign in to access additional features
                </p>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="buy" className="space-y-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="buy">Buy Tokens</TabsTrigger>
              <TabsTrigger value="exchange">Exchange</TabsTrigger>
            </TabsList>

            <TabsContent value="buy">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Button
                      variant={selectedToken === 'TABZ' ? 'default' : 'outline'}
                      onClick={() => setSelectedToken('TABZ')}
                      className="flex-1"
                    >
                      <Coins className="mr-2 h-4 w-4" />
                      TABZ
                    </Button>
                    <Button
                      variant={selectedToken === 'AGT' ? 'default' : 'outline'}
                      onClick={() => setSelectedToken('AGT')}
                      className="flex-1"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      AGT
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('card')}
                      className="w-full"
                    >
                      Pay with Card
                    </Button>
                    <Button
                      variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('crypto')}
                      className="w-full"
                    >
                      Pay with Crypto
                    </Button>
                  </div>

                  {paymentMethod === 'card' && (
                    <TokenPurchase
                      tokenType={selectedToken}
                      onSuccess={handleSuccess}
                    />
                  )}
                  {paymentMethod === 'crypto' && (
                    <TokenExchange
                      tokenType={selectedToken}
                      onSuccess={handleSuccess}
                    />
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="exchange">
              <Card className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Exchange Tokens</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Amount"
                      />
                      <select className="mt-2 w-full">
                        <option value="TABZ">TABZ</option>
                        <option value="AGT">AGT</option>
                      </select>
                    </div>
                    <ArrowRightLeft className="h-6 w-6" />
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="You receive"
                        readOnly
                      />
                      <select className="mt-2 w-full">
                        <option value="ETH">ETH</option>
                        <option value="SOL">SOL</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full">
                    Exchange Tokens
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}