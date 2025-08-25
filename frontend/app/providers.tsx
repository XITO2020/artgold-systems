"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
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
        {children}
      </SolanaProvider>
    </ThemeProvider>
  );
}
