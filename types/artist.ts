// Importation de ArtCategory depuis artwork.ts pour éviter la duplication
import { ArtCategory } from './artwork';

export interface ArtistLevel {
  level: number;
  totalPoints: number;
  artworks: {
    category: ArtCategory;
    count: number;
  }[];
}

export const POINTS_SYSTEM = {
  painting: {
    first: 20,
    subsequent: 7
  },
  ecologicalplan: { // Mis à jour pour correspondre à artwork.ts
    first: 40,
    subsequent: 15
  },
  inventions: { // Mis à jour pour correspondre à artwork.ts
    first: 40,
    subsequent: 15
  },
  manga: {
    first: 15,
    subsequent: 7
  },
  comics: {
    first: 12,
    subsequent: 5
  },
  portrait: {
    first: 18,
    subsequent: 6
  },
  worldart: {
    all: 21
  },
  sketch: {
    first: 40,
    subsequent: 1
  },
  schoolsketch: { // Mis à jour pour correspondre à artwork.ts
    first: 12,
    subsequent: 1,
  },
  other: {
    first: 10,
    subsequent: 4
  }
} as const;

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
