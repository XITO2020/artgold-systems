"use client";

import { useState } from 'react';
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";
import { Coins, Wallet, ArrowRightLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { TOKEN_CONFIG, CONVERSION_RATES } from '~/token-config';
import { TokenPurchase } from 'ç/payment/token-purchase';
import { TokenExchange } from 'ç/payment/token-exchange';
import { useToast } from '#/hooks/use-toast';
import { TShirtGrid } from 'ç/shop/TShirtGrid';

export default function ShopPage() {
  const { data: session } = useSession();
  const wallet = useWallet();
  const [selectedToken, setSelectedToken] = useState<'TABZ' | 'AGT'>('TABZ');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const { toast } = useToast();

  const handleSuccess = () => {
    // Refresh user's balance and show success message
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="tokens" className="space-y-8">
        <TabsList>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="tshirts">T-Shirts</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens">
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
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tshirts">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Support Through Style</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Purchase unique t-shirts to support our projects and earn TABZ tokens. 
                Each purchase contributes to the creative community.
              </p>
            </div>
            <TShirtGrid showProjectInfo={true} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}