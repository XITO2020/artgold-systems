"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoneroPaymentProps {
  amount: number;
  onSuccess: () => void;
}

export function MoneroPayment({ amount, onSuccess }: MoneroPaymentProps) {
  const [paymentDetails, setPaymentDetails] = useState<{
    address: string;
    paymentId: string;
    integratedAddress: string;
    transactionId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      const response = await fetch('/api/payment/monero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) throw new Error('Failed to initialize payment');

      const details = await response.json();
      setPaymentDetails(details);
      startPaymentCheck(details.paymentId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize Monero payment",
        variant: "destructive",
      });
    }
  };

  const startPaymentCheck = (paymentId: string) => {
    const checkPayment = async () => {
      try {
        setChecking(true);
        const response = await fetch(`/api/payment/monero?paymentId=${paymentId}`);
        const status = await response.json();

        if (status.confirmed) {
          toast({
            title: "Payment Confirmed",
            description: "Your Monero payment has been confirmed",
          });
          onSuccess();
          return true;
        }

        return false;
      } catch (error) {
        console.error('Payment check error:', error);
        return false;
      } finally {
        setChecking(false);
      }
    };

    const interval = setInterval(async () => {
      const confirmed = await checkPayment();
      if (confirmed) clearInterval(interval);
    }, 30000);

    return () => clearInterval(interval);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!paymentDetails) {
    return (
      <Card className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Initializing payment...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Pay with Monero</h3>
          <p className="text-sm text-muted-foreground">
            Send exactly {amount} XMR to the following address
          </p>
        </div>

        <div className="flex justify-center">
          <QRCodeSVG
            value={paymentDetails.integratedAddress}
            size={200}
            level="M"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={paymentDetails.integratedAddress}
              readOnly
              className="flex-1 px-3 py-2 rounded-md border bg-muted"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(paymentDetails.integratedAddress)}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Payment ID: {paymentDetails.paymentId}
          </p>
        </div>

        {checking && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking payment status...
          </div>
        )}
      </div>
    </Card>
  );
}