"use client";

import { useState } from "react";
import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";
import { Check } from "lucide-react";
import { useTheme } from "next-themes";
import { COLOR_FILTERS } from "@t/gallery";

interface ColorFilterProps {
  onColorSelect: (color: string) => void;
  selectedColors: string[];
}

export function ColorFilter({ onColorSelect, selectedColors }: ColorFilterProps) {
  const { theme } = useTheme();  // Utilisation du hook useTheme pour récupérer le thème actuel

  // Fonction pour déterminer la classe de couleur basée sur le thème actif
  const getColorClass = (colorValue: string) => {
    switch (theme) {
      case "dark":
        return `bg-[${colorValue}] text-white`; // Sombre
      case "golden-tacosblue":
        return `bg-[#0e1d32] text-yellow-400`; // Exemple de thème Gold & Dark Blue
      case "emerald":
        return `bg-[#2d5b4f] text-white`; // Exemple de thème Emerald Matrix
      default:
        return `bg-[${colorValue}] text-black`; // Par défaut, clair
    }
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 p-2 flex-wrap">
        {Object.entries(COLOR_FILTERS).map(([key, color]) => (
          <Button
            key={key}
            variant="outline"
            className={`w-8 h-8 rounded-full p-0 relative ${getColorClass(color.value)} ${
              selectedColors.includes(color.value) ? "border-2 border-solid border-black" : ""
            }`} // Classe conditionnelle selon le thème
            onClick={() => onColorSelect(color.value)}
          >
            {selectedColors.includes(color.value) && (
              <Check className={`h-4 w-4 absolute ${
                color.value === "#FFFFFF" ? "text-black" : "text-white"
              }`} />
            )}
            <span className="sr-only">{color.name}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
