"use client";

import dynamic from "next/dynamic";
import { importPartial } from "@comp/_partials/load";

import { ThemeName } from '@t/theme/types';

// Interface commune pour les props des composants thématiques
interface ThemeComponentProps {
  theme?: ThemeName | 'system' | 'light';
  dict: any;
  lang: string;
  [key: string]: any; // Pour les props supplémentaires spécifiques à chaque composant
}

// Fonction utilitaire pour créer un composant thématique
export function createThemedComponent<T extends ThemeComponentProps>(
  componentName: Parameters<typeof importPartial>[1]
) {
  return function ThemedComponent({ theme, ...props }: T) {
    const Comp = dynamic(
      async () => (await importPartial(theme || '', componentName)).default,
      { ssr: false }
    );
    return <Comp {...props} />;
  };
}

// Export des composants thématiques

export const ThemedValueDistribution = createThemedComponent<ThemeComponentProps>('value-distribution');
export const ThemedValidationProcess = createThemedComponent<ThemeComponentProps>('validation-process');
export const ThemedMobileSlider = createThemedComponent<ThemeComponentProps>('mobile-slider');
export const ThemedSliderComponent = createThemedComponent<ThemeComponentProps>('SliderComponent');
export const ThemedLoadingScreen = createThemedComponent<ThemeComponentProps>('LoadingScreen');
export const ThemedHero = createThemedComponent<ThemeComponentProps>('Hero');
export const ThemedFeatures = createThemedComponent<ThemeComponentProps>('Features');

// Export des types pour une meilleure expérience TypeScript
export type { ThemeComponentProps as ThemedComponentProps };
export type { ThemeName } from '@t/theme/types';
