import { ArtCategory } from 'T/artwork';
import { prisma } from './db';

// Points awarded for each category
export const POINTS_SYSTEM = {
  // Cultural Heritage (High Points - Rare & Complex)
  african: { first: 25, subsequent: 10 },
  pacifikian: { first: 25, subsequent: 10 },
  oriental: { first: 25, subsequent: 10 },
  indian: { first: 25, subsequent: 10 },
  amerindian: { first: 25, subsequent: 10 },
  slavic: { first: 25, subsequent: 10 },

  // Styles (Medium-High Points - Skill Based)
  calligraphy: { first: 20, subsequent: 8 },
  inked: { first: 18, subsequent: 7 },
  sketches: { first: 15, subsequent: 6 },
  manga: { first: 18, subsequent: 7 },
  comics: { first: 18, subsequent: 7 },
  abstract: { first: 15, subsequent: 6 },
  realisticXIX: { first: 22, subsequent: 9 },
  realisticXX: { first: 20, subsequent: 8 },
  realisticXXI: { first: 18, subsequent: 7 },

  // Mediums (Medium Points - Material Based)
  paper: { first: 12, subsequent: 5 },
  textil: { first: 15, subsequent: 6 },
  onwood: { first: 15, subsequent: 6 },
  oil: { first: 18, subsequent: 7 },
  acrylic: { first: 15, subsequent: 6 },
  pencil: { first: 12, subsequent: 5 },
  watercolor: { first: 15, subsequent: 6 },
  sculpture: { first: 20, subsequent: 8 },
  photography: { first: 15, subsequent: 6 },

  // Subjects & Themes (Medium Points - Content Based)
  portrait: { first: 15, subsequent: 6 },
  landscape: { first: 15, subsequent: 6 },
  objects: { first: 12, subsequent: 5 },
  creatures: { first: 15, subsequent: 6 },
  architecture: { first: 18, subsequent: 7 },
  technology: { first: 15, subsequent: 6 },
  map: { first: 18, subsequent: 7 },

  // Creative Domains (High Points - Original Content)
  characterdesign: { first: 20, subsequent: 8 },
  meca: { first: 20, subsequent: 8 },
  fantaisy: { first: 18, subsequent: 7 },
  medieval: { first: 18, subsequent: 7 },
  schoolsketch: { first: 12, subsequent: 5 },
  poster: { first: 15, subsequent: 6 },
  'emblem, coat of arms': { first: 20, subsequent: 8 },

  // Concepts & Innovations (Highest Points - Unique Value)
  invention: { first: 25, subsequent: 10 },
  ecologicalplan: { first: 25, subsequent: 10 },
  'vehicles concept': { first: 22, subsequent: 9 },
  'visual effect': { first: 20, subsequent: 8 },
  'labyrinth & game': { first: 20, subsequent: 8 },

  // Allowed Digital
  'Memes': { first: 10, subsequent: 4 },
  'Animated Gif': { first: 15, subsequent: 6 },
  'Motion Design': { first: 20, subsequent: 8 },
  'Illustrator Ai': { first: 18, subsequent: 7 },
  'Pixel Art': { first: 15, subsequent: 6 },
  'Photoshop PSD': { first: 15, subsequent: 6 },

  // Other
  other: { first: 10, subsequent: 4 }
} as const;

// Level thresholds
export const LEVEL_THRESHOLDS = {
  STARTER: 0,      // 0-49 points
  AMATEUR: 50,     // 50-149 points
  SKILLED: 150,    // 150-299 points
  EXPERT: 300,     // 300-499 points
  MASTER: 500,     // 500-999 points
  GRANDMASTER: 1000 // 1000+ points
} as const;

// Bonus slots management
export const BONUS_SLOTS_CRITERIA = {
  ARTWORK_COUNT: 12,
  TABZ_VALUE: 4000,
  AGT_VALUE: 27000,
  BONUS_SLOTS: 7
} as const;

export async function checkBonusSlotEligibility(userId: string): Promise<boolean> {
  if (!prisma) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      artworks: {
        where: { status: 'SOLD' }
      },
      tokens: true
    }
  });

  if (!user) return false;

  const soldArtworks = user.artworks.length;
  const tabzBalance = user.tokens.find(t => t.type === 'TABZ')?.amount || 0;
  const agtBalance = user.tokens.find(t => t.type === 'AGT')?.amount || 0;

  return (
    soldArtworks >= BONUS_SLOTS_CRITERIA.ARTWORK_COUNT &&
    (tabzBalance >= BONUS_SLOTS_CRITERIA.TABZ_VALUE ||
     agtBalance >= BONUS_SLOTS_CRITERIA.AGT_VALUE) &&
    user.bonusSlots === 0
  );
}

export function calculatePoints(category: ArtCategory, isFirst: boolean): number {
  const categoryKey = category as keyof typeof POINTS_SYSTEM;
  if (!(categoryKey in POINTS_SYSTEM)) {
    throw new Error(`Invalid category: ${category}`);
  }
  const categoryPoints = POINTS_SYSTEM[categoryKey];
  return isFirst ? categoryPoints.first : categoryPoints.subsequent;
}

export function calculateLevel(totalPoints: number): number {
  if (totalPoints >= LEVEL_THRESHOLDS.GRANDMASTER) return 6;
  if (totalPoints >= LEVEL_THRESHOLDS.MASTER) return 5;
  if (totalPoints >= LEVEL_THRESHOLDS.EXPERT) return 4;
  if (totalPoints >= LEVEL_THRESHOLDS.SKILLED) return 3;
  if (totalPoints >= LEVEL_THRESHOLDS.AMATEUR) return 2;
  return 1;
}

export function isAirdropEligible(level: number): boolean {
  return level >= 2; // Eligible from Amateur level onwards
}

export function calculateAirdropAmount(level: number): number {
  if (!isAirdropEligible(level)) return 0;
  return level * 20; // 20 TABZ per level
}

export function calculateNextAirdropThreshold(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  const thresholds = Object.values(LEVEL_THRESHOLDS);
  return thresholds.find(t => t > currentLevel) || thresholds[thresholds.length - 1];
}