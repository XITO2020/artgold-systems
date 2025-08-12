"use client";

import { Dialog, DialogContent } from "ù/dialog";
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  title: string;
  imageUrl: string;
  name: string;
  slug: string;
}

interface CategoryColumn {
  title: string;
  categories: Category[];
}

interface CategoriesGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: CategoryColumn[];
}

export function CategoriesGridModal({ isOpen, onClose, columns }: CategoriesGridModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[840px] h-[361px] overflow-y-auto scroll-smooth no-scrollbar">
        <div className="grid grid-cols-5 gap-8">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-6">
              <h3 className="text-md text-accentOne font-semibold text-center border-b pb-2 sticky top-0 z-10">
                {column.title}
              </h3>
              <div className="space-y-4">
                {column.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/gallery/${category.slug}`}
                    className="block group text-center"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm text-center text-red-400 font-medium group-hover:text-primary transition-colors">
                      {category.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional "Others" row */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold text-center mb-6">Others</h3>
          <div className="grid grid-cols-5 gap-8">
            {/* You can map through other categories here */}
            <Link href="/gallery/others" className="block group">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                <Image
                  src="/categories/others.webp"
                  alt="Other Categories"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <p className="text-sm text-center font-medium group-hover:text-primary transition-colors">
                Other Categories
              </p>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
