"use client";

import { Menu } from 'lucide-react';
import { Button } from '@ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@ui/sheet';

const categories = [
  { id: 'comics', label: 'Comics' },
  { id: 'illustrations', label: 'Illustrations' },
  { id: 'ebooks', label: 'E-Books' },
  { id: 'graphics', label: 'Graphic Works' },
  { id: 'videos', label: 'Videos' },
  { id: '3d', label: '3D Works' },
  { id: 'music', label: 'Music' },
  { id: 'scenarii', label: 'Scenarii' },
  { id: 'websites', label: 'Websites' }
];

export function CategorySidebar() {
  const CategoryList = () => (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li key={category.id}>
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
          >
            {category.label}
          </Button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside  style={{ background: "var(--sidebars", color:"var(--sidetext)"}} className="hidden md:block w-[14%] p-4 rounded-lg">
        <CategoryList />
      </aside>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" style={{ background: "var(--sidebars", color:"var(--sidetext)"}} >
            <div>
              <CategoryList />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}