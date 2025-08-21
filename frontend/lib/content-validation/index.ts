import { apiClient } from '@lib/db/prisma';
import { detectExplicitContent } from './explicit-content';
import { detectHateSpeech } from './hate-speech';
import { validateCategory } from './category-validation';
import type { ArtCategory } from '@t/artwork';

export interface ValidationResult {
  isValid: boolean;
  status: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW';
  confidence: number;
  details: {
    aiScore: number;
    explicitScore: number;
    hateScore: number;
    categoryScore: number;
    reasons: string[];
    warnings: string[];
  };
}

export async function validateContent(
  imageBuffer: Buffer,
  category: ArtCategory,
  metadata: { description?: string; reviewerId: string }
): Promise<ValidationResult> {
  // Run all validations in parallel
  const [explicitResult, categoryResult] = await Promise.all([
    detectExplicitContent(imageBuffer),
    validateCategory(imageBuffer, category, [])
  ]);

  // Run hate speech detection if description is provided
  const hateResult = metadata.description ? 
    await detectHateSpeech(metadata.description) : 
    { score: 0, categories: {} };

  // Aggregate results
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Check for explicit content
  if (explicitResult.adult > 0.4 || explicitResult.racy > 0.3) {
    reasons.push('EXPLICIT_CONTENT');
  }

  // Check for hate speech
  if (hateResult.score > 0.3) {
    reasons.push('HATE_SPEECH');
  }

  // Check category relevance
  if (categoryResult.score < 0.5) {
    reasons.push('CATEGORY_MISMATCH');
  }

  // Calculate overall confidence
  const confidence = 1 - (
    Math.max(explicitResult.adult, explicitResult.racy) * 0.4 +
    hateResult.score * 0.3 +
    (1 - categoryResult.score) * 0.3
  );

  // Determine status
  const status = reasons.length > 0 ? 'REJECTED' :
                 confidence > 0.8 ? 'APPROVED' :
                 'PENDING_REVIEW';

  // Create validation record via backend
  await apiClient.post('/content-validations', {
    contentId: metadata.reviewerId,
    reviewerId: metadata.reviewerId,
    status,
    confidence,
    details: {
      aiScore: categoryResult.score,
      explicitScore: Math.max(explicitResult.adult, explicitResult.racy),
      hateScore: hateResult.score,
      categoryScore: categoryResult.score,
      reasons,
      warnings
    }
  });

  return {
    isValid: reasons.length === 0,
    status,
    confidence,
    details: {
      aiScore: categoryResult.score,
      explicitScore: Math.max(explicitResult.adult, explicitResult.racy),
      hateScore: hateResult.score,
      categoryScore: categoryResult.score,
      reasons,
      warnings
    }
  };
}