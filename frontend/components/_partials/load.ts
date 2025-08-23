// components/_partials/load.ts
import { ThemeName } from '@t/theme/types';

export const THEME_FOLDERS: ThemeName[] = [
  'dark',
  'emerald',
  'silver-berry',
  'metal-lazuli',
  'diamond-pastel',
  'africa-gems',
  'golden-tacos',
  'agua-saphir',
  'chili-ruby',
];

// Interface pour les props des composants thématiques
export interface ThemeComponentProps {
  theme?: string;
  dict: any;
  lang: string;
  [key: string]: any; // Pour les props supplémentaires spécifiques à chaque composant
}

/**
 * Normalise le nom du thème et gère les cas spéciaux
 * - 'system' : utilise les préférences système (sombre/clair)
 * - 'light' : mappé sur 'diamond-pastel' (thème clair par défaut)
 * - Autres noms : vérifie s'ils font partie des thèmes valides, sinon retourne 'dark'
 */
export function normalizeTheme(t?: string): ThemeName {
  const name = (t || '').toLowerCase();
  
  // Gestion du thème système
  if (name === 'system') {
    // Vérifie si on est côté client (navigateur)
    if (typeof window !== 'undefined' && window.matchMedia) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDarkMode ? 'dark' : 'diamond-pastel';
    }
    // Par défaut, retourne un thème clair si on ne peut pas détecter les préférences
    return 'diamond-pastel';
  }
  
  // Mappage explicite de 'light' vers 'diamond-pastel'
  if (name === 'light') {
    return 'diamond-pastel';
  }
  
  // Vérifie si le thème fait partie de la liste des thèmes valides
  if (THEME_FOLDERS.includes(name as ThemeName)) {
    return name as ThemeName;
  }
  
  // Par défaut, retourne le thème sombre
  return 'dark';
}

// Fonction pour importer dynamiquement un composant thématique
export async function importPartial(theme: string, partial:
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
  
  try {
    // Utiliser l'import dynamique avec des chemins complets
    const themePath = `@comp/_partials/${t}/${partial}`;
    console.log(`Tentative de chargement du composant: ${themePath}`);
    
    // Essayer de charger le composant du thème spécifié
    return import(/* webpackMode: "eager" */ themePath).catch((error) => {
      console.warn(`Composant ${partial} non trouvé dans le thème ${t}, utilisation du thème par défaut`, error);
      
      // Charger le composant du thème dark par défaut
      const defaultThemePath = `@comp/_partials/dark/${partial}`;
      console.log(`Tentative de chargement du composant par défaut: ${defaultThemePath}`);
      
      return import(/* webpackMode: "eager" */ defaultThemePath).catch((defaultError) => {
        console.error(`Impossible de charger le composant par défaut: ${defaultThemePath}`, defaultError);
        throw new Error(`Impossible de charger le composant ${partial} (thème: ${t} ou dark)`);
      });
    });
  } catch (error) {
    console.error(`Erreur lors du chargement du composant ${partial} pour le thème ${t}:`, error);
    throw error; // Propager l'erreur pour qu'elle soit gérée plus haut
  }
}
