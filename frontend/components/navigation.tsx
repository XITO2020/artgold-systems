"use client";

import Link from "next/link";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Sheet, SheetContent, SheetTrigger } from "ù/sheet";
import { Coins, Search, Palette, Mic, Menu } from "lucide-react";
import { LanguageSelector } from "./language-selector";
import { ThemeToggle } from "./theme-toggle";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useTheme } from 'ç/theme/ThemeContext';
import { useMediaQuery } from "#/use-media-query";

export default function Navigation() {
  const params = useParams();
  const lang = params.lang || "fr";
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const showMobileMenu = isMobile || isTablet;

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
  }, [setTheme]);

  const logoSrc = (() => {
    switch (theme) {
      case 'dark': return "/icons/tbcity-vice.png";
      case 'light': return "/icons/tbcity.png";
      case 'silver-berry': return "/icons/tbcity-summer.png";
      case 'golden-tacos': return "/icons/tbcity-golden.png";
      case 'emerald': return "/icons/dirtgreen.png";
      case 'agua-saphir': return "/icons/tb-seamoss.png";
      case 'chili-ruby': return "/icons/tbcity-allchili.png";
      case 'diamond-pastel': return "/icons/tbcity-diamond-reflexion.png";
      default: return "/icons/tbcity-golden.png";
    }
  })();

  const themeVars = {
    'silver-berry': {
      '--accent': 'hsl(10, 100%, 94%)',
      '--accentOne': 'hsl(10, 100%, 94%)',
      '--accentTwo': 'hsl(10, 100%, 94%)',
      '--accentThree': 'hsl(10, 100%, 94%)',
      '--accentFour': 'hsl(10, 100%, 94%)',
      '--accent-foreground': '#a70071',
      '--accent-hover': 'hsl(10, 100%, 77%)',
      '--accentText-hover': 'hsl(10, 10%, 10%)',
      '--accentOne-hover': 'lightpink',
      '--accentTwo-hover': 'peachpuff',
      '--accentThree-hover': 'lemonchiffon',
      '--accentFour-hover': '#C95387',
    },
    'emerald': {
      '--accent': 'transparent',
      '--accentOne': 'transparent',
      '--accentTwo': 'transparent',
      '--accentThree': 'transparent',
      '--accentFour': 'transparent',
      '--accent-foreground': 'hsl(138, 100%, 70%)',
      '--accent-hover': 'hsl(168, 60%, 2%)',
      '--accentText-hover': 'hsl(168, 100%, 80%)',
      '--accentOne-hover': 'hsl(168, 60%, 2%)',
      '--accentTwo-hover': 'hsl(168, 60%, 2%)',
      '--accentThree-hover': 'hsl(168, 60%, 2%)',
      '--accentFour-hover': 'hsl(168, 60%, 2%)',
    },
    'chili-ruby': {
      '--accent': 'transparent',
      '--accentOne': 'transparent',
      '--accentTwo': 'transparent',
      '--accentThree': 'transparent',
      '--accentFour': 'transparent',
      '--accent-foreground': '#92044E',
      '--accent-hover': '#D41C5A',
      '--accentText-hover': 'hsl(0, 0%, 100%)',
      '--accentOne-hover': '#FAE85C',
      '--accentTwo-hover': 'orange',
      '--accentThree-hover': '#45A474',
      '--accentFour-hover': '#10AB5D',
    },
    'agua-saphir': {
      '--accent': '#78c0e0',
      '--accentOne': '#449dd1',
      '--accentTwo': '#27B2DF',
      '--accentThree': '#10A8EE',
      '--accentFour': '#2248AE',
      '--accent-foreground': 'hsl(0, 0%, 100%)',
      '--accent-hover': '#150578',
      '--accentText-hover': 'hsl(200, 100%, 40%)',
      '--accentOne-hover': '#150578',
      '--accentTwo-hover': '#0e0e52',
      '--accentThree-hover': '#0e0e52',
      '--accentFour-hover': '#88d0fc',
    },
    'golden-tacos': {
      '--accent': 'transparent',
      '--accentOne': 'transparent',
      '--accentTwo': 'transparent',
      '--accentThree': 'transparent',
      '--accentFour': 'transparent',
      '--accent-foreground': '#D2B48C',
      '--accent-hover': '#D2B48C',
      '--accentText-hover': 'black',
      '--accentOne-hover': '#FCD700',
      '--accentTwo-hover': '#FF6347',
      '--accentThree-hover': '#27AB23',
      '--accentFour-hover': '#A5260A',
    },
    'dark': {
      '--accent': 'transparent',
      '--accentOne': 'transparent',
      '--accentTwo': 'transparent',
      '--accentThree': 'transparent',
      '--accentFour': 'transparent',
      '--accent-foreground': 'hsl(188, 45%, 77%)',
      '--accent-hover': '#ffff77',
      '--accentText-hover': 'black',
      '--accentOne-hover': 'hotpink',
      '--accentTwo-hover': 'aqua',
      '--accentThree-hover': 'lime',
      '--accentFour-hover': 'mediumvioletred',
    },
    'diamond-pastel': {
      '--accent': 'lavender',
      '--accentOne': '#FFEAF6',
      '--accentTwo': '#FFF2EA',
      '--accentThree': 'lemonchiffon',
      '--accentFour': '#E1FFF5',
      '--accent-foreground': 'hsl(308, 55%, 40%)',
      '--accent-hover': '#E6DAFF',
      '--accentText-hover': '#4C4C4C',
      '--accentOne-hover': 'lightpink',
      '--accentTwo-hover': 'peachpuff',
      '--accentThree-hover': '#FFFEB9',
      '--accentFour-hover': 'palegreen',
    },
    'light': {
      '--accent': 'lightCoral',
      '--accentOne': 'Coral',
      '--accentTwo': 'salmon',
      '--accentThree': 'tomato',
      '--accentFour': 'crimson',
      '--accent-foreground': 'hsl(308, 55%, 94%)',
      '--accent-hover': 'maroon',
      '--accentText-hover': 'black',
      '--accentOne-hover': 'limegreen',
      '--accentTwo-hover': 'yellowgreen',
      '--accentThree-hover': 'red',
      '--accentFour-hover': 'springgreen',
    }
  };

  // Applique les variables du thème actuel
  useEffect(() => {
    const currentTheme = themeVars[theme] || themeVars['light'];
    Object.keys(currentTheme).forEach((key) => {
      document.documentElement.style.setProperty(key, currentTheme[key as keyof typeof currentTheme]);
    });
  }, [theme]);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const NavigationLinks = () => (
    <div className={`flex ${showMobileMenu ? 'flex-col' : 'items-center'} space-y-4 md:space-y-0 md:space-x-4`}>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-8 text-secondary-foreground" />
      </div>
      <Link href={`/${lang}/explore`}>
        <Button variant="accent" className="transition-button">
          Treasury
        </Button>
      </Link>
      <Link href={`/${lang}/upload`}>
        <Button variant="accentOne" className="transition-button">
          Convert
        </Button>
      </Link>
      <Link href={`/${lang}/portfolio`}>
        <Button variant="accentTwo" className="transition-button">
          <Palette className="h-4 w-4 mr-2" />
          Portfolio
        </Button>
      </Link>
      <Link href={`/${lang}/dubbing`}>
        <Button variant="accentThree" className="transition-button">
          <Mic className="h-4 w-4 mr-2" />
          Dubbing
        </Button>
      </Link>
      <Link href={`/${lang}/dashboard`}>
        <Button variant="accentFour" className="transition-button">
          Dashboard
        </Button>
      </Link>
    </div>
  );

  return (
    <nav className="border-b bg-transparent" style={{ borderBottom: `2px solid var(--border-color)`, zIndex: 50 }}>
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <img src={logoSrc} width={showMobileMenu ? "120" : "180"} height="auto" alt="TabascoCity" />
          </Link>
        </div>

        {showMobileMenu ? (
          <div className="flex items-center ml-auto space-x-4">
            <LanguageSelector />
            <ThemeToggle toggleTheme={toggleTheme} />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <NavigationLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-4 mx-6 flex-1">
              <NavigationLinks />
            </div>
            <div className="flex items-center space-x-4 text-primary">
              <LanguageSelector />
              <ThemeToggle toggleTheme={toggleTheme} />
              <div>
                <Link href="/shop">
                  <Coins className="h-6 w-6 text-primary" />
                </Link>
                <span className="tooltip">Shop !</span>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
