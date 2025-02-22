import { ArtworkMetadata } from 'T/artwork';

interface PricingFactors {
  uniqueness: number;      // 0-1 score
  complexity: number;      // 0-1 score
  size: number;           // normalized size score
  technique: number;      // 0-1 score based on technique difficulty
  artistLevel: number;    // artist's current level
}

interface AIAnalysis {
  isUnique: boolean;
  uniquenessScore: number;
  complexity?: number;
}

export function calculateInitialPrice(
  metadata: ArtworkMetadata,
  aiAnalysis: AIAnalysis
): number {
  const factors: PricingFactors = {
    uniqueness: aiAnalysis.uniquenessScore,
    complexity: aiAnalysis.complexity || 0.5,
    size: calculateSizeScore(metadata.dimensions),
    technique: calculateTechniqueScore(metadata.technique),
    artistLevel: metadata.valueDistribution.creator.share || 1
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

function calculateTechniqueScore(technique: string): number {
  const techniqueDifficulty: { [key: string]: number } = {
    'oil': 0.9,
    'watercolor': 0.8,
    'acrylic': 0.7,
    'pencil': 0.5,
    'digital': 0.4,
    // Add more techniques as needed
  };

  return techniqueDifficulty[technique.toLowerCase()] || 0.5;
}