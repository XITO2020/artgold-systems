// Importation de ArtCategory depuis artwork.ts
import { ArtCategory } from '@/types/artwork';
import { POINTS_SYSTEM, LEVEL_THRESHOLDS } from '@/types/artist';

export function calculateInitialLevel(category: ArtCategory): number {
  switch (category) {
    case 'ecologicalplan':
      return 27;
    case 'architecture':
      return 40;
    case 'sculpture':
      return 30;
    case 'invention':
      return 35;
    case 'characterdesign':
      return 20;
    case 'comics':
      return 15;
    case 'schoolsketch':
      return 12;
    case 'landscape':
      return 25;
    case 'manga':
      return 18;
    case 'photography':
      return 22;
    case 'portrait':
      return 20;
    case 'realisticXIX':
      return 28;
    case 'realisticXX':
      return 30;
    case 'realisticXXI':
      return 32;
    case 'african':
      return 18;
    case 'pacifikian':
      return 18;
    case 'oriental':
      return 20;
    case 'indian':
      return 22;
    case 'amerindian':
      return 20;
    case 'chinese':
      return 24;
    case 'slavic':
      return 26;
    case 'abstract':
      return 28;
    case 'paper':
      return 12;
    case 'calligraphy':
      return 15;
    case 'inked':
      return 18;
    case 'sketches':
      return 15;
    case 'objects':
      return 18;
    case 'creatures':
      return 20;
    case 'onwood':
      return 25;
    case 'tricot':
      return 10;
    case 'cake':
      return 12;
    case 'oil': 
     return 16;
    case 'acrylic': 
    return 14;
    case 'pencil': 
    return 13;
    case 'watercolor': 
    return 12;
    case 'other': 
    return 1; 

    default:
      return LEVEL_THRESHOLDS.STARTER_MIN;
  }
}

export function calculatePoints(category: ArtCategory, isFirst: boolean): number {
  if (category === 'worldart') {
    return POINTS_SYSTEM.worldart.all;
  }

  const categoryPoints = POINTS_SYSTEM[category];
  if ('all' in categoryPoints) {
    return categoryPoints.all;
  }

  return isFirst ? categoryPoints.first : categoryPoints.subsequent;
}

export function calculateLevel(totalPoints: number): number {
  return Math.floor(Math.sqrt(totalPoints) * 2);
}

export function isAirdropEligible(level: number): boolean {
  return level >= LEVEL_THRESHOLDS.AIRDROP_ELIGIBLE;
}

export function calculateNextAirdropThreshold(currentLevel: number): number {
  const baseThreshold = LEVEL_THRESHOLDS.AIRDROP_ELIGIBLE;
  if (currentLevel < baseThreshold) {
    return baseThreshold;
  }
  return Math.ceil(currentLevel / 10) * 10;
}

export function calculateAirdropAmount(level: number): number {
  if (!isAirdropEligible(level)) return 0;
  const baseAmount = 100;
  const levelBonus = Math.floor((level - LEVEL_THRESHOLDS.AIRDROP_ELIGIBLE) / 10) * 50;
  return baseAmount + levelBonus;
}
