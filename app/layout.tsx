import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/navigation';
import { Providers } from './providers';
import InstallPWA from '@/components/install-pwa';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArtGold Systems | L&apos;argent doit redevenir l&apos;art des gens',
  description: 'Convert your handmade art into digital currency',
  manifest: '/manifest.json',
  themeColor: '#EAB308',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ArtGold Systems',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TabAsCoin" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main>{children}</main>
          <Toaster />
          <InstallPWA />
        </Providers>
      </body>
    </html>
  );
}