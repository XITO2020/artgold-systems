"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import dynamic from "next/dynamic";
import React from "react";
import { SolanaProvider } from "@/contexts/SolanaProvider";

// Configuration des thèmes disponibles
const THEMES: string[] = [
  "system",
  "light", 
  "dark", 
  "emerald",
  "silver-berry",
  "metal-lazuli",
  "diamond-pastel",
  "africa-gems",
  "golden-tacos",
  "agua-saphir",
  "chili-ruby"
];

// Composant WalletContextProvider avec typage explicite
const WalletContextProvider = dynamic<{ children: React.ReactNode }>(
  async () => {
    const mod = await import("@comp/wallet-provider");
    return { default: mod.WalletContextProvider };
  },
  { 
    ssr: false,
    loading: () => <div>Loading wallet provider...</div>
  }
);

// Composant ThemeProvider avec configuration des thèmes
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange
      storageKey="theme"
      themes={THEMES}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

// Fournisseur principal de l'application
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SolanaProvider>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </SolanaProvider>
    </ThemeProvider>
  );
}
