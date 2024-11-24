"use client";
import React from 'react';
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export function CryptoBalance() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState({
    tabz: 0,
    solana: 0,
    monero: 0
  });

  useEffect(() => {
    if (publicKey) {
      // Fetch balances
      const fetchBalances = async () => {
        try {
          const response = await fetch('/api/balances', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: publicKey.toString() })
          });
          const data = await response.json();
          setBalance(data);
        } catch (error) {
          console.error('Error fetching balances:', error);
        }
      };

      fetchBalances();
    }
  }, [publicKey]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-yellow-100">
          <Coins className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <p className="text-2xl font-bold">{balance.tabz.toFixed(2)} TABZ</p>
          <div className="text-sm text-muted-foreground mt-1">
            <p>{balance.solana.toFixed(4)} SOL</p>
            <p>{balance.monero.toFixed(4)} XMR</p>
          </div>
        </div>
      </div>
    </Card>
  );
}