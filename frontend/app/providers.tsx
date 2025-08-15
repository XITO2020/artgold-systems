"use client";

import { ThemeProvider } from "@comp/theme-provider";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

// Wallet provider côté client uniquement
const WalletContextProvider = dynamic(
  () => import("@comp/wallet-provider").then((mod) => mod.WalletContextProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WalletContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          themes={["light","dark","silver-berry","golden-tacos","emerald","chili-ruby","agua-saphir"]}
        >
          {children}
        </ThemeProvider>
      </WalletContextProvider>
    </SessionProvider>
  );
}
