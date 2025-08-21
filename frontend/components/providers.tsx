// frontend/components/providers.tsx
"use client";

import { ThemeProvider } from "./theme/ThemeProvider";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

const WalletContextProvider = dynamic(
  () => import("./wallet-provider").then(mod => mod.WalletContextProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
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
    </SessionProvider>
  );
}
