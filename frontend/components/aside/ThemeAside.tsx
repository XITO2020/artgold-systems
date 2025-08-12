"use client";

import { useTheme } from 'ç/theme/ThemeContext';
import {  CircleArrowRight,  CircleArrowLeft,  Telescope, Tent,  ShoppingBag,  BookOpen,  User,  Mail,  Gift } from 'lucide-react';
import Link from 'next/link';
import '@/wonderstyles/aside.css';

interface ThemeAsideProps {
  isOpen: boolean;
  onToggle: () => void;
  lang: string;
}

export function ThemeAside({ isOpen, onToggle, lang }: ThemeAsideProps) {
  const { theme } = useTheme();

  return (
    <>
      {!isOpen && (
        <button
          onClick={onToggle}
          className={`menu-button theme-${theme}`}
          aria-label="Open menu"
        >
          <CircleArrowRight className="menu-icon" />
        </button>
      )}

      <aside className={`theme-aside theme-${theme} ${isOpen ? 'open' : ''}`}>
        <nav className="aside-nav">
          <ul className="aside-nav-list">
            {[
              { href: `/${lang}/`, icon: Tent, text: 'Home' },
              { href: `/${lang}/sitemap`, icon: Telescope, text: 'Site Map' },
              { href: `/${lang}/shop`, icon: ShoppingBag, text: 'Shop' },
              { href: `/${lang}/blog`, icon: BookOpen, text: 'Blog' },
              { href: `/${lang}/contact`, icon: User, text: 'Contact & CV' },
              { href: `/${lang}/newsletter`, icon: Mail, text: 'Newsletter' },
              { href: `/${lang}/ebooks`, icon: Gift, text: 'Win eBooks' },
            ].map((item, index) => (
              <li key={index} className="aside-nav-link">
                <Link href={item.href} className="aside-nav-parts">
                  <item.icon className="aside-icon" />
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
            <button
                onClick={onToggle}
                className={`close-button theme-${theme}`}
                aria-label="Close menu"
            >
                <CircleArrowLeft className="close-icon animate-bounce hover:animate-ping hover:mix-blend-none" />
            </button>
          </ul>
        </nav>
      </aside>
    </>
  );
}