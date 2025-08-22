"use client";

import React from 'react';
import { Moon, Sun, Bean, Gem, Hexagon, Coins, CupSoda, Laptop } from "lucide-react";
import { useTheme } from "./theme/ThemeContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ThemeToggleProps {
  toggleTheme : (newTheme : string) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({toggleTheme}) => {
  const { setTheme } = useTheme();

  // Fonction pour changer de thème
  const handleThemeChange = (newTheme: 'dark' | 'light' | 'silver-berry' | 'golden-tacos' | 'emerald' | 'agua-saphir' | 'chili-ruby' | 'metal-lazuli' | 'africa-gems' | 'diamond-pastel') => {
    setTheme(newTheme);
    // No longer reloading the page to improve user experience
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Neon Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("silver-berry")}>
          <CupSoda className="mr-2 h-4 w-4" />
          Silver Berry
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("golden-tacos")}>
          <Coins className="mr-2 h-4 w-4" />
          Taco Gold
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("agua-saphir")}>
          <Sun className="mr-2 h-4 w-4" />
          Agua Saphir
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("chili-ruby")}>
          <Bean className="mr-2 h-4 w-4" />
          Chili Ruby
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("emerald")}>
          <Hexagon className="mr-2 h-4 w-4" />
          Emerald Matrix
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("diamond-pastel")}>
          <Gem className="mr-2 h-4 w-4" />
          Diamond Pastel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("metal-lazuli")}>
          <Gem className="mr-2 h-4 w-4" />
          Metal Lazuli
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("africa-gems")}>
          <Gem className="mr-2 h-4 w-4" />
          Africa Gems
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
        <img src="/icons/chili-icon.svg" alt="Chili Icon" className="mr-2 h-4 w-4" />
        Classico Tabasco
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
