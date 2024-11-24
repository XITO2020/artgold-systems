"use client";
import React from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import dynamic from 'next/dynamic';

const WalletContextProvider = dynamic(
  () => import('@/components/wallet-provider').then(mod => mod.WalletContextProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <WalletContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "gold-darkblue", "emerald"]}
        >
          {children}
        </ThemeProvider>
      </WalletContextProvider>
    </SessionContextProvider>
  );
}