"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coins, Search } from 'lucide-react';
import { LanguageSelector } from './language-selector';
import { ThemeToggle } from './theme-toggle';
import { useParams } from 'next/navigation';

export default function Navigation() {
  const params = useParams();
  const lang = params.lang || 'fr';

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <Coins className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ArtGold Systems</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4 mx-6 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
          <Link href={`/${lang}/explore`}>
            <Button variant="ghost">Treasury</Button>
          </Link>
          <Link href={`/${lang}/upload`}>
            <Button variant="ghost">Convert</Button>
          </Link>
          <Link href={`/${lang}/dashboard`}>
            <Button variant="ghost">Dashboard</Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}