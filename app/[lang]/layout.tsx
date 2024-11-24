import React from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/navigation';
import { Providers } from '../providers';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TabAsCoin | Art to Digital Gold',
  description: 'Convert your handmade art into digital currency',
  icons: {
    icon: '/favicon.ico',
  },
};

export async function generateStaticParams() {
  return [
    { lang: 'fr' }, // Default first
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'tr' },
    { lang: 'ja' },
    { lang: 'ar' },
    { lang: 'am' },
    { lang: 'wo' },
    { lang: 'sw' },
    { lang: 'it' },
    { lang: 'pt' },
    { lang: 'ru' },
    { lang: 'cs' },
    { lang: 'el' },
    { lang: 'ms' },
    { lang: 'id' },
    { lang: 'th' },
    { lang: 'ro' },
    { lang: 'ko' },
    { lang: 'hi' },
    { lang: 'kk' },
    { lang: 'ps' },
    { lang: 'ur' },
    { lang: 'bn' },
    { lang: 'bo' },
    { lang: 'de' },
    { lang: 'fi' },
    { lang: 'is' },
    { lang: 'hu' },
    { lang: 'sk' },
    { lang: 'nl' },
    { lang: 'pl' },
    { lang: 'se' },
    { lang: 'ga' },
    { lang: 'ha' },
    { lang: 'xh' },
    { lang: 'yo' },
    { lang: 'zh' },
    { lang: 'zu' }
  ];
}

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}