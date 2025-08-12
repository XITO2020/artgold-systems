"use client";

import { useState, useEffect } from 'react';
import { Providers } from '../providers';
import Navigation from '@comp/navigation';
import { Toaster } from '@ui/toaster';
import InstallPWA from '@comp/install-pwa';
import AnimeHeroStyle from '@comp/sections/AnimHeroStyle';
import { ThemeProvider } from '@comp/theme/ThemeContext';
import { ThemeAside } from '@comp/aside/ThemeAside';
import Footer from '@comp/Footer';

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAside = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleSwipe = (e: TouchEvent) => {
      if (e.touches && e.touches.length === 1) {
        const touch = e.touches[0];
        const startX = touch.clientX;
        const handleTouchMove = (moveEvent: TouchEvent) => {
          const moveTouch = moveEvent.touches[0];
          const deltaX = moveTouch.clientX - startX;
          if (deltaX > 50) {
            setIsOpen(true);
          } else if (deltaX < -50) {
            setIsOpen(false);
          }
          document.removeEventListener('touchmove', handleTouchMove);
        };
        document.addEventListener('touchmove', handleTouchMove);
      }
    };

    document.addEventListener('touchstart', handleSwipe);
    return () => {
      document.removeEventListener('touchstart', handleSwipe);
    };
  }, []);

  return (
    <Providers>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col relative">
          <Navigation />
          <ThemeAside isOpen={isOpen} onToggle={toggleAside} lang={lang} />
          <main className="chargeur flex-1">{children}</main>
          <Toaster />
          <InstallPWA />
          <AnimeHeroStyle />
          <Footer />
        </div>
      </ThemeProvider>
    </Providers>
  );
}