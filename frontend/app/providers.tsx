"use client";

import { ThemeProvider } from "@comp/theme/ThemeProvider";
import dynamic from "next/dynamic";

const WalletContextProvider = dynamic(
  () => import("@comp/wallet-provider").then(mod => mod.WalletContextProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
