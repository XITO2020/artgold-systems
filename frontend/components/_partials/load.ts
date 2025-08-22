// components/_partials/load.ts
export const THEME_FOLDERS = [
  'dark',
  'emerald',
  'silver-berry',
  'metal-lazuli',
  'diamond-pastel',
  'africa-gems',
  'golden-tacos',
  'agua-saphir',
  'chili-ruby',
] as const;

// Interface pour les props des composants thématiques
export interface ThemeComponentProps {
  theme?: string;
  dict: any;
  lang: string;
  [key: string]: any; // Pour les props supplémentaires spécifiques à chaque composant
}

export type ThemeFolder = typeof THEME_FOLDERS[number];

export function normalizeTheme(t?: string): ThemeFolder {
  const name = (t || '').toLowerCase();
  if (name === 'system') {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'diamond-pastel';
  }
  if (name === 'light') return 'diamond-pastel';
  return THEME_FOLDERS.includes(name as ThemeFolder) ? (name as ThemeFolder) : 'dark';
}

// Fonction pour importer dynamiquement un composant thématique
export function importPartial(theme: string, partial:
  'value-distribution' |
  'validation-process' |
  'mobile-slider' |
  'SliderComponent' |
  'LoadingScreen' |
  'Hero' |
  'Features'
) {
  const t = normalizeTheme(theme);
  const basePath = `@comp/_partials/${t}`;
  
  // Log pour le débogage
  console.log(`Chargement du composant: ${basePath}/${partial}`);
  
  switch (partial) {
    case 'value-distribution': return import(`@comp/_partials/${t}/value-distribution`);
    case 'validation-process': return import(`@comp/_partials/${t}/validation-process`);
    case 'mobile-slider':      return import(`@comp/_partials/${t}/mobile-slider`);
    case 'SliderComponent':    return import(`@comp/_partials/${t}/SliderComponent`);
    case 'LoadingScreen':      return import(`@comp/_partials/${t}/LoadingScreen`);
    case 'Hero':               return import(`@comp/_partials/${t}/Hero`);
    case 'Features':           return import(`@comp/_partials/${t}/Features`);
    default: {
      console.error(`Composant inconnu: ${partial}`);
      throw new Error(`Composant ${partial} non trouvé pour le thème ${t}`);
    }
  }
}
