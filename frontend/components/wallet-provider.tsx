"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl, type Cluster } from "@solana/web3.js";

// CSS du modal
import "@solana/wallet-adapter-react-ui/styles.css";

type Props = { children: React.ReactNode };

export function WalletContextProvider({ children }: Props) {
  // "devnet" par défaut si pas de variable
  const network: Cluster =
    (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as Cluster) || "devnet";

  // Utilise un endpoint custom si fourni, sinon celui du cluster
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl(network),
    [network]
  );

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
