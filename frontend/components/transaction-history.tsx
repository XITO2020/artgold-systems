"use client";

import { useState, useEffect } from 'react';
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Badge } from "@ui/badge";
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: Date;
  metadata: any;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions/history');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'FAILED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <Button variant="ghost" size="sm" onClick={fetchTransactions}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 bg-muted/5 rounded-lg">
            <div className="flex items-center gap-4">
              {tx.type === 'PURCHASE' ? (
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">{tx.type}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{tx.amount} TABZ</p>
              <Badge className={getStatusColor(tx.status)}>
                {tx.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
