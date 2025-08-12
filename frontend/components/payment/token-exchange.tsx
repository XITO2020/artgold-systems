"use client";

import { useState } from 'react';
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Label } from "ù/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ù/select";
import { useToast } from '#//use-toast';
import { TOKEN_CONFIG, CONVERSION_RATES } from '@LIB/token-config';
import { ethers } from 'ethers';

interface TokenExchangeProps {
  tokenType: 'TABZ' | 'AGT';
  onSuccess: () => void;
}

export function TokenExchange({ tokenType, onSuccess }: TokenExchangeProps) {
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState<'ETH' | 'SOL'>('ETH');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const calculateExchangeAmount = () => {
    const value = parseFloat(amount) || 0;
    const rate = targetCurrency === 'ETH' ? 
      (tokenType === 'TABZ' ? CONVERSION_RATES.TABZ_TO_ETH : CONVERSION_RATES.AGT_TO_ETH) :
      (tokenType === 'TABZ' ? CONVERSION_RATES.TABZ_TO_SOL : CONVERSION_RATES.AGT_TO_SOL);
    return value * rate;
  };

  const handleExchange = async () => {
    if (!window.ethereum) {
      toast({
        title: "Error",
        description: "Please install MetaMask to exchange tokens",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Connect to MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create exchange transaction
      const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          fromToken: tokenType,
          toToken: targetCurrency,
          walletAddress: await signer.getAddress()
        }),
      });

      if (!response.ok) throw new Error('Exchange failed');

      const { txHash } = await response.json();

      toast({
        title: "Exchange Successful",
        description: `Successfully exchanged ${amount} ${tokenType} to ${targetCurrency}`,
      });
      onSuccess();
    } catch (error) {
      console.error('Exchange error:', error);
      toast({
        title: "Exchange Failed",
        description: "Failed to complete the exchange",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Amount ({tokenType})</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter amount in ${tokenType}`}
          />
        </div>

        <div className="space-y-2">
          <Label>Exchange to</Label>
          <Select value={targetCurrency} onValueChange={(value: 'ETH' | 'SOL') => setTargetCurrency(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
              <SelectItem value="SOL">Solana (SOL)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {amount && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span>1 {tokenType} = {
                targetCurrency === 'ETH' ?
                  (tokenType === 'TABZ' ? CONVERSION_RATES.TABZ_TO_ETH : CONVERSION_RATES.AGT_TO_ETH) :
                  (tokenType === 'TABZ' ? CONVERSION_RATES.TABZ_TO_SOL : CONVERSION_RATES.AGT_TO_SOL)
              } {targetCurrency}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>You'll receive</span>
              <span>{calculateExchangeAmount().toFixed(6)} {targetCurrency}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleExchange}
          disabled={isProcessing || !amount || parseFloat(amount) <= 0}
          className="w-full"
        >
          {isProcessing ? "Processing..." : "Exchange"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Note: Tokens are locked for 1 year before they can be exchanged
        </p>
      </div>
    </Card>
  );
}