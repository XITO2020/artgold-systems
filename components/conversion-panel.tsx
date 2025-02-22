"use client";

import { useState } from "react";
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Label } from "ù/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ù/select";
import { CONVERSION_FEES } from "~/constants";

interface ConversionPanelProps {
  maxTabzValue: number;
}

export function ConversionPanel({ maxTabzValue }: ConversionPanelProps) {
  const [amount, setAmount] = useState("");
  const [convertTo, setConvertTo] = useState("eur");
  const [loading, setLoading] = useState(false);

  const calculateFees = () => {
    const value = parseFloat(amount) || 0;
    const fee = value * (convertTo === "eur" ? CONVERSION_FEES.TABZ_TO_FIAT : CONVERSION_FEES.TABZ_TO_CRYPTO);
    const networkFee = value * CONVERSION_FEES.NETWORK_FEE;
    return {
      conversionFee: fee,
      networkFee,
      total: value - fee - networkFee
    };
  };

  const handleConversion = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: convertTo,
        }),
      });
      
      if (!response.ok) throw new Error("Conversion failed");
      
      // Handle successful conversion
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fees = calculateFees();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Convert TABZ</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Amount (TABZ)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={maxTabzValue}
            placeholder="Enter amount to convert"
          />
        </div>

        <div className="space-y-2">
          <Label>Convert to</Label>
          <Select value={convertTo} onValueChange={setConvertTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="sol">Solana (SOL)</SelectItem>
              <SelectItem value="xmr">Monero (XMR)</SelectItem>
              <SelectItem value="eth">Ethereum (ETH)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Conversion Fee ({(CONVERSION_FEES.TABZ_TO_FIAT * 100).toFixed(1)}%)</span>
            <span>{fees.conversionFee.toFixed(4)} TABZ</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network Fee ({(CONVERSION_FEES.NETWORK_FEE * 100).toFixed(1)}%)</span>
            <span>{fees.networkFee.toFixed(4)} TABZ</span>
          </div>
          <div className="flex justify-between font-medium pt-2">
            <span>You'll receive</span>
            <span>{fees.total.toFixed(4)} {convertTo.toUpperCase()}</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleConversion}
          disabled={loading || !amount || parseFloat(amount) > maxTabzValue}
        >
          {loading ? "Converting..." : "Convert"}
        </Button>
      </div>
    </Card>
  );
}