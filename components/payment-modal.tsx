"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadStripe } from '@stripe/stripe-js';
import { TabButton } from './tab-button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export function PaymentModal({ 
  isOpen, 
  onClose,
  artworkPrice,
  onSuccess
}: { 
  isOpen: boolean;
  onClose: () => void;
  artworkPrice: number;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Get user's wallet address (implement wallet connection)
      const walletAddress = "USER_WALLET_ADDRESS";

      // Create payment intent
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: artworkPrice,
          wallet_address: walletAddress
        }),
      });

      const { clientSecret, tab_amount } = await response.json();

      // Complete payment with Stripe
      const stripe = await stripePromise;
      const result = await stripe!.confirmCardPayment(clientSecret);

      if (result.error) {
        throw new Error(result.error.message);
      }

      onSuccess();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Artwork</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Price:</span>
            <TabButton amount={artworkPrice} />
          </div>
          <div className="space-y-2">
            <Input type="text" placeholder="Card Number" />
            <div className="grid grid-cols-3 gap-2">
              <Input type="text" placeholder="MM/YY" />
              <Input type="text" placeholder="CVC" />
            </div>
          </div>
          <Button 
            onClick={handlePayment} 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}