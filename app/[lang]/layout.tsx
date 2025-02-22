"use client";

import { Providers } from '@/providers';
import Navigation from 'ç/navigation';
import { Toaster } from 'ù/toaster';
import InstallPWA from 'ç/install-pwa';
import AnimeHeroStyle from 'ç/sections/AnimHeroStyle';
import { ThemeProvider } from 'ç/theme/ThemeContext';
import Footer from '#/components/Footer';


export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {


  return (
    <Providers>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col relative">
          <Navigation />
          <main className="chargeur flex-1">{children}</main>
          <Toaster />
          <InstallPWA />
          {/* AnimeHeroStyle would be positioned absolutely HERE */}
          <AnimeHeroStyle />
          <Footer />
        </div>
      </ThemeProvider>
    </Providers>
  );
}
