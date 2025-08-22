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
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        themes={[
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
        ]}
      >
        {children}
      </ThemeProvider>
    </WalletContextProvider>
  );
}
