"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Providers } from '../providers';
import Navigation from '@comp/navigation';
import { Toaster } from '@ui/toaster';
import InstallPWA from '@comp/install-pwa';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Providers>
      <div className="min-h-screen flex flex-col relative">
        <Navigation />
        <ThemeAside isOpen={isOpen} onToggle={() => setIsOpen(v => !v)} lang={lang} />
        <main className="chargeur flex-1">{children}</main>
        <Toaster />
        <InstallPWA />
        {mounted && <AnimHeroStyle />}
        <Footer />
      </div>
    </Providers>
  );
}
