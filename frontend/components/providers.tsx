"use client";

import { ThemeProvider } from "./theme/ThemeProvider";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SessionProvider } from "next-auth/react";
import dynamic from 'next/dynamic';

const WalletContextProvider = dynamic(
  () => import('./wallet-provider').then(mod => mod.WalletContextProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();

  return (
    <SessionProvider>
      <SessionContextProvider supabaseClient={supabase}>
        <WalletContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={["light", "dark", "golden-tacos", "emerald", "chili-ruby", "agua-saphir"]}
          >
            {children}
          </ThemeProvider>
        </WalletContextProvider>
      </SessionContextProvider>
    </SessionProvider>
  );
}