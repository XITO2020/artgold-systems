
"use client";

import { useState } from 'react';
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Label } from "ù/label";
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useToast } from '#/hooks/use-toast';
import { TOKEN_CONFIG } from '~/token-config';

interface TokenPurchaseProps {
  tokenType: 'TABZ' | 'AGT';
  onSuccess: () => void;
}

export function TokenPurchase({ tokenType, onSuccess }: TokenPurchaseProps) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const token = TOKEN_CONFIG[tokenType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          tokenType,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        toast({
          title: "Payment Failed",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: `You've purchased ${amount} ${token.symbol}`,
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Amount (EUR)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            placeholder="Enter amount in EUR"
            required
          />
          {amount && (
            <p className="text-sm text-muted-foreground">
              You will receive: {parseFloat(amount)} {token.symbol}
            </p>
          )}
        </div>

        <PaymentElement />

        <Button
          type="submit"
          disabled={!stripe || isProcessing || !amount}
          className="w-full"
        >
          {isProcessing ? "Processing..." : `Buy ${token.symbol}`}
        </Button>
      </form>
    </Card>
  );
};