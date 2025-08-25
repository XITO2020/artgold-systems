// frontend/components/providers.tsx
"use client";

import { ThemeProvider } from "./theme/ThemeProvider";
import { SolanaProvider } from "@/contexts/SolanaProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SolanaProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        themes={["light", "dark", "golden-tacos", "emerald", "chili-ruby", "agua-saphir"]}
      >
        {children}
      </ThemeProvider>
    </SolanaProvider>
  );
}
