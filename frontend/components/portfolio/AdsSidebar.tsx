"use client";

import { Menu } from 'lucide-react';
import { Button } from '@ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@ui/sheet';

const links = [
  { id: 'friend1', label: 'Artist Friend 1', url: '#' },
  { id: 'friend2', label: 'Artist Friend 2', url: '#' },
  { id: 'ad1', label: 'Featured Project 1', url: '#' },
  { id: 'ad2', label: 'Featured Project 2', url: '#' }
];

export function AdsSidebar() {
  const LinksList = () => (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            className="block p-2 hover:bg-white/10 rounded transition-colors"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[14%] p-4 rounded-lg" style={{ background: "var(--sidebars", color:"var(--sidetext)"}}>
        <LinksList />
      </aside>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" style={{ background: "var(--sidebars", color:"var(--sidetext)"}}>
            <LinksList />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}