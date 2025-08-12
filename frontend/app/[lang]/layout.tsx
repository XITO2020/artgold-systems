"use client";

import { useState, useEffect } from 'react';
import { Providers } from '../providers';
import Navigation from 'ç/navigation';
import { Toaster } from 'ù/toaster';
import InstallPWA from 'ç/install-pwa';
import AnimeHeroStyle from 'ç/sections/AnimHeroStyle';
import { ThemeProvider } from 'ç/theme/ThemeContext';
import { ThemeAside } from 'ç/aside/ThemeAside';
import Footer from 'ç/Footer';

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