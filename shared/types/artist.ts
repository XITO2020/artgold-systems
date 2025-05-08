// Import ArtCategory from artwork.ts instead of declaring it locally
import { ArtCategory } from './artwork';

export interface ArtistLevel {
  level: number;
  totalPoints: number;
  artworks: {
    category: ArtCategory;
    count: number;
  }[];
}

export const POINTS_SYSTEM: Record<ArtCategory, {
  first: number;
  subsequent: number;
}> = {
  // Cultural Heritage
  african: { first: 25, subsequent: 10 },
  pacifikian: { first: 25, subsequent: 10 },
  oriental: { first: 25, subsequent: 10 },
  indian: { first: 25, subsequent: 10 },
  amerindian: { first: 25, subsequent: 10 },
  slavic: { first: 25, subsequent: 10 },

  // Styles
  calligraphy: { first: 20, subsequent: 8 },
  inked: { first: 18, subsequent: 7 },
  sketches: { first: 15, subsequent: 6 },
  manga: { first: 18, subsequent: 7 },
  comics: { first: 18, subsequent: 7 },
  abstract: { first: 15, subsequent: 6 },
  realisticXIX: { first: 22, subsequent: 9 },
  realisticXX: { first: 20, subsequent: 8 },
  realisticXXI: { first: 18, subsequent: 7 },

  // Mediums
  paper: { first: 12, subsequent: 5 },
  textil: { first: 15, subsequent: 6 },
  onwood: { first: 15, subsequent: 6 },
  oil: { first: 18, subsequent: 7 },
  acrylic: { first: 15, subsequent: 6 },
  pencil: { first: 12, subsequent: 5 },
  watercolor: { first: 15, subsequent: 6 },
  sculpture: { first: 20, subsequent: 8 },
  photography: { first: 15, subsequent: 6 },

  // Subjects & Themes
  portrait: { first: 15, subsequent: 6 },
  landscape: { first: 15, subsequent: 6 },
  objects: { first: 12, subsequent: 5 },
  creatures: { first: 15, subsequent: 6 },
  architecture: { first: 18, subsequent: 7 },
  technology: { first: 15, subsequent: 6 },
  map: { first: 18, subsequent: 7 },

  // Creative Domains
  characterdesign: { first: 20, subsequent: 8 },
  meca: { first: 20, subsequent: 8 },
  fantaisy: { first: 18, subsequent: 7 },
  medieval: { first: 18, subsequent: 7 },
  schoolsketch: { first: 12, subsequent: 5 },
  poster: { first: 15, subsequent: 6 },
  'emblem, coat of arms': { first: 20, subsequent: 8 },

  // Allowed Digital
  'Memes': { first: 10, subsequent: 4 },
  'Animated Gif': { first: 15, subsequent: 6 },
  'Motion Design': { first: 20, subsequent: 8 },
  'Illustrator Ai': { first: 18, subsequent: 7 },
  'Pixel Art': { first: 15, subsequent: 6 },
  'Photoshop PSD': { first: 15, subsequent: 6 },

  // Concepts & Innovations
  invention: { first: 25, subsequent: 10 },
  ecologicalplan: { first: 25, subsequent: 10 },
  'vehicles concept': { first: 22, subsequent: 9 },
  'visual effect': { first: 20, subsequent: 8 },
  'labyrinth & game': { first: 20, subsequent: 8 },

  // Other
  other: { first: 10, subsequent: 4 }
};

export const LEVEL_THRESHOLDS = {
  STARTER_MIN: 3,
  STARTER_MAX: 20,
  AIRDROP_ELIGIBLE: 80
} as const;

export interface ArtistRewards {
  airdrops: {
    eligible: boolean;
    nextThreshold: number;
    currentProgress: number;
  };
  badges: string[];
  privileges: string[];
}