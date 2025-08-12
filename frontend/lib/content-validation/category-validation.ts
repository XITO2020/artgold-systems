import { ArtCategory } from 'T/artwork';
import { CATEGORY_CONFIG } from '../config/categories';

// Types for Google Vision API responses
interface LabelAnnotation {
  description: string;
  score: number;
}

interface GoogleVisionResponse {
  labelAnnotations: LabelAnnotation[];
}

interface CustomPrediction {
  category: string;
  confidence: number;
}

interface CategoryValidationResult {
  score: number;
  predictions: CustomPrediction[];
  details: {
    googleLabels: LabelAnnotation[];
    customPredictions: CustomPrediction[];
    matchedLabels: LabelAnnotation[];
    subcategories: string[];
  };
}

// Type guard to check if a category exists in config
function isCategoryInConfig(category: ArtCategory): category is keyof typeof CATEGORY_CONFIG.points {
  return category in CATEGORY_CONFIG.points;
}

// Type guard for category labels
function hasCategoryLabels(category: ArtCategory): category is keyof typeof CATEGORY_CONFIG.validation.categoryLabels {
  return category in CATEGORY_CONFIG.validation.categoryLabels;
}

async function mockVisionAPI(imageBuffer: Buffer): Promise<GoogleVisionResponse> {
  return {
    labelAnnotations: [
      { description: 'art', score: 0.9 },
      { description: 'painting', score: 0.8 }
    ]
  };
}

async function mockCustomClassifier(imageBuffer: Buffer): Promise<CustomPrediction[]> {
  return [
    { category: 'painting', confidence: 0.85 },
    { category: 'drawing', confidence: 0.75 }
  ];
}

export async function validateCategory(
  imageBuffer: Buffer,
  category: ArtCategory,
  subcategories: string[]
): Promise<CategoryValidationResult> {
  const [googleLabels, customPredictions] = await Promise.all([
    mockVisionAPI(imageBuffer),
    mockCustomClassifier(imageBuffer)
  ]);

  // Validate category exists in config using type guard
  if (!isCategoryInConfig(category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  const categoryPoints = CATEGORY_CONFIG.points[category];

  // Type-safe subcategory validation
  const allowedSubcategories = CATEGORY_CONFIG.validation.allowedSubcategories[category as keyof typeof CATEGORY_CONFIG.validation.allowedSubcategories];
  if (!allowedSubcategories) {
    throw new Error(`No subcategories defined for category: ${category}`);
  }

  const validSubcategories = subcategories.every(sub => 
    allowedSubcategories.includes(sub)
  );

  if (!validSubcategories) {
    throw new Error('Invalid subcategories for selected category');
  }

  // Type-safe category labels access
  const categoryLabels = hasCategoryLabels(category) 
    ? CATEGORY_CONFIG.validation.categoryLabels[category]
    : [];

  // Calculate relevance score with proper typing
  const relevantLabels = [
    ...categoryLabels,
    ...subcategories.flatMap(sub => {
      const subLabels = CATEGORY_CONFIG.validation.subcategoryLabels[sub as keyof typeof CATEGORY_CONFIG.validation.subcategoryLabels];
      return subLabels || [];
    })
  ];

  const matchedLabels = googleLabels.labelAnnotations.filter(
    (label: LabelAnnotation) => relevantLabels.some(
      (relevant: string) => label.description.toLowerCase().includes(relevant.toLowerCase())
    )
  );

  const labelScore = matchedLabels.reduce(
    (sum: number, label: LabelAnnotation) => sum + label.score,
    0
  ) / Math.max(1, matchedLabels.length);

  const customScore = customPredictions.find(
    (p: CustomPrediction) => p.category === category
  )?.confidence || 0;

  const finalScore = (labelScore * 0.6) + (customScore * 0.4);

  return {
    score: finalScore,
    predictions: customPredictions,
    details: {
      googleLabels: googleLabels.labelAnnotations,
      customPredictions,
      matchedLabels,
      subcategories
    }
  };
}