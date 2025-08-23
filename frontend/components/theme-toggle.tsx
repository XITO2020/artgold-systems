"use client";

import React, { useEffect, useState } from 'react';
import { Moon, Sun, Bean, Gem, Hexagon, Coins, CupSoda, Laptop, Monitor } from "lucide-react";
import { useTheme } from "./theme/ThemeContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { ThemeName } from '@t/theme/types';

// Type pour les options de thème
type ThemeOption = {
  id: ThemeName | 'system';
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'system' | 'light' | 'dark' | 'custom';
};

// Options de thème disponibles
const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'system',
    name: 'Système',
    icon: Monitor,
    category: 'system'
  },
  {
    id: 'diamond-pastel',
    name: 'Diamond Pastel (clair)',
    icon: Gem,
    category: 'light'
  },
  {
    id: 'dark',
    name: 'Neon Dark',
    icon: Moon,
    category: 'dark'
  },
  {
    id: 'silver-berry',
    name: 'Silver Berry',
    icon: CupSoda,
    category: 'custom'
  },
  {
    id: 'golden-tacos',
    name: 'Taco Gold',
    icon: Coins,
    category: 'custom'
  },
  {
    id: 'agua-saphir',
    name: 'Agua Saphir',
    icon: Sun,
    category: 'custom'
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    icon: Hexagon,
    category: 'custom'
  },
  {
    id: 'africa-gems',
    name: 'Africa Gems',
    icon: Gem,
    category: 'custom'
  },
  {
    id: 'chili-ruby',
    name: 'Chili Ruby',
    icon: Bean,
    category: 'custom'
  },
  {
    id: 'metal-lazuli',
    name: 'Metal Lazuli',
    icon: Gem,
    category: 'custom'
  },
];

// Grouper les thèmes par catégorie
const THEMES_BY_CATEGORY = THEME_OPTIONS.reduce((acc, theme) => {
  if (!acc[theme.category]) {
    acc[theme.category] = [];
  }
  acc[theme.category].push(theme);
  return acc;
}, {} as Record<string, ThemeOption[]>);

// Catégories dans l'ordre d'affichage souhaité
const CATEGORY_ORDER: Array<ThemeOption['category']> = ['system', 'light', 'dark', 'custom'];

interface ThemeToggleProps {
  toggleTheme?: (newTheme: ThemeName | 'system') => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ toggleTheme }) => {
  const { theme: currentTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Éviter l'hydratation côté serveur
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gérer le changement de thème
  const handleThemeChange = (themeId: ThemeName | 'system') => {
    if (toggleTheme) {
      toggleTheme(themeId);
    } else {
      // Si c'est le thème système, on utilise la détection automatique
      if (themeId === 'system') {
        const isDarkMode = typeof window !== 'undefined' && 
          window.matchMedia && 
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(isDarkMode ? 'dark' : 'diamond-pastel');
      } else {
        setTheme(themeId);
      }
    }
  };

  // Récupérer l'icône du thème actif
  const currentThemeIcon = THEME_OPTIONS.find(t => t.id === currentTheme)?.icon || Sun;
  const currentThemeName = THEME_OPTIONS.find(t => t.id === currentTheme)?.name || 'Thème';

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Chargement du thème...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Sélectionner un thème">
          {React.createElement(currentThemeIcon, { className: "h-[1.2rem] w-[1.2rem]" })}
          <span className="sr-only">Sélectionner un thème (actuel: {currentThemeName})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-[100] max-h-[80vh] overflow-y-auto">
        {CATEGORY_ORDER.map(category => {
          const themes = THEMES_BY_CATEGORY[category];
          if (!themes || themes.length === 0) return null;

          return (
            <div key={category}>
              {category === 'custom' && <DropdownMenuSeparator />}
              {category !== 'custom' && (
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                  {category === 'system' ? 'Système' : category === 'light' ? 'Thèmes clairs' : 'Thèmes sombres'}
                </DropdownMenuLabel>
              )}
              {themes.map((theme) => {
                const Icon = theme.icon;
                return (
                  <DropdownMenuItem
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`flex items-center ${currentTheme === theme.id ? 'bg-accent' : ''}`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{theme.name}</span>
                  </DropdownMenuItem>
                );
              })}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
