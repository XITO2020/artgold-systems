"use client";

import { useEffect, useState } from "react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Coins, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface WalletBalance {
  tabz: number;
  agt: number;
  solana: number;
}

export function CryptoWallet() {
  const [balance, setBalance] = useState<WalletBalance>({
    tabz: 0,
    agt: 0,
    solana: 0
  });

  useEffect(() => {
    // Fetch wallet balances
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const response = await fetch('/api/balances');
      const data = await response.json();
      setBalance(data);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-yellow-100">
            <Coins className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">TABZ Balance</p>
            <p className="text-2xl font-bold">{balance.tabz.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100">
            <Coins className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">AGT Balance</p>
            <p className="text-2xl font-bold">{balance.agt.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-100">
            <Coins className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Solana Balance</p>
            <p className="text-2xl font-bold">{balance.solana.toFixed(4)} SOL</p>
          </div>
        </div>
      </Card>
    </div>
  );
}