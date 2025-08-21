"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Providers } from '../providers';
import Navigation from '@comp/navigation';
import { Toaster } from '@ui/toaster';
import InstallPWA from '@comp/install-pwa';
import { ThemeProvider } from '@comp/theme/ThemeContext';
import { ThemeAside } from '@comp/aside/ThemeAside';
import Footer from '@comp/Footer';

// ⬇️ charge exclusivement côté client
const AnimHeroStyle = dynamic(
  () => import('@comp/sections/AnimHeroStyle'),
  { ssr: false, loading: () => null }
);

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);   // ⬅️ garde client

  useEffect(() => {
    setMounted(true); // on ne rend la 3D qu'après hydration
  }, []);

  // ... ton gestionnaire de swipe inchangé ...

  return (
    <Providers>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col relative">
          <Navigation />
          <ThemeAside isOpen={isOpen} onToggle={() => setIsOpen(v => !v)} lang={lang} />
          <main className="chargeur flex-1">{children}</main>
          <Toaster />
          <InstallPWA />
          {mounted && <AnimHeroStyle />}  {/* ⬅️ ne monte la 3D qu’après hydration */}
          <Footer />
        </div>
      </ThemeProvider>
    </Providers>
  );
}
