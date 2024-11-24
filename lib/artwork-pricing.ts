// Importation de ArtworkMetadata depuis artwork.ts
import { ArtworkMetadata } from '@/types/artwork';
import { ArtistLevel } from '@/types/artist';
import { ArtCategory } from '@/types/artwork'

interface PricingFactors {
  uniqueness: number;      // 0-1 score
  complexity: number;      // 0-1 score
  size: number;           // normalized size score
  technique: number;      // 0-1 score based on technique difficulty
  artistLevel: number;    // artist's current level
}

export function calculateInitialPrice(
  metadata: ArtworkMetadata,
  aiAnalysis: {
    isUnique: boolean;
    uniquenessScore: number;
    complexity?: number;
    artistlevel : ArtistLevel;
  }
): number {
  const factors: PricingFactors = {
    uniqueness: aiAnalysis.uniquenessScore,
    complexity: aiAnalysis.complexity || 0.5,
    size: calculateSizeScore(metadata.dimensions),
    technique: calculateTechniqueScore(metadata.technique),
    artistLevel: aiAnalysis.artistlevel.level || 1
  };

  // Base price in TABZ
  let basePrice = 100;

  // Apply multipliers
  const uniquenessMultiplier = aiAnalysis.isUnique ? 1.5 : 0.7;
  const complexityMultiplier = 1 + (factors.complexity * 0.5);
  const sizeMultiplier = 1 + (factors.size * 0.3);
  const techniqueMultiplier = 1 + (factors.technique * 0.4);
  const artistMultiplier = 1 + (Math.log10(factors.artistLevel) * 0.2);

  // Calculate final price
  const finalPrice = basePrice *
    uniquenessMultiplier *
    complexityMultiplier *
    sizeMultiplier *
    techniqueMultiplier *
    artistMultiplier;

  return Math.round(finalPrice * 100) / 100; // Round to 2 decimal places
}

function calculateSizeScore(dimensions: { width: number; height: number; unit: string }): number {
  const area = dimensions.width * dimensions.height;
  const maxArea = 8000 * 8000; // Maximum allowed dimensions
  return Math.min(area / maxArea, 1);
}

function calculateTechniqueScore(technique: ArtCategory): number {
  // Mapping des techniques avec leur difficulté associée
  const techniqueDifficulty: { [key in ArtCategory]: number } = {
    'ecologicalplan': 0.8,
    'architecture': 0.7,
    'sculpture': 0.7,
    'invention': 0.7,
    'characterdesign': 0.6,
    'comics': 0.3,
    'schoolsketch': 0.1,
    'manga': 0.4,
    'photography': 0.2,
    'portrait': 0.5,
    'realisticXIX': 0.9,
    'realisticXX': 0.8,
    'realisticXXI': 0.9,
    'african': 0.5,
    'pacifikian': 0.4,
    'oriental': 0.6,
    'indian': 0.5,
    'amerindian': 0.6,
    'slavic': 0.6,
    'abstract': 0.2,
    'paper': 0.4,
    'calligraphy': 0.9,
    'inked': 0.6,
    'sketches': 0.2,
    'objects': 0.4,
    'creatures': 0.4,
    'tricot': 0.7,
    'onwood': 0.7,
    'cake': 0.7,
    'oil': 0.6,
    'acrylic': 0.6,
    'pencil': 0.3,
    'watercolor': 0.3,
    'medieval':0.8,
    'textil':0.3,
    'fantaisy':0.2,
    'other': 0.1
  };

  return techniqueDifficulty[technique] || 0.1; 

}
