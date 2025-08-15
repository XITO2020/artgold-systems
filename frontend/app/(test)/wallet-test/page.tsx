"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletTestPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Test Wallet</h1>
      <WalletMultiButton />
    </div>
  );
}
