import { ACCEPTED_FILE_TYPES, ArtCategory } from '@/types/artwork';
import sharp from 'sharp';
import { detectAIArtwork } from './ai-detection';
import { prisma } from './db';

export async function validateArtworkFile(file: File) {
  // Convert File to Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Basic file validation
  if (!ACCEPTED_FILE_TYPES.images.includes(file.type)) {
    throw new Error('Unsupported file type');
  }

  if (file.size > ACCEPTED_FILE_TYPES.maxSize) {
    throw new Error('File too large');
  }

  // Image processing with Sharp
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image dimensions');
  }

  // Dimension validation
  if (metadata.width < ACCEPTED_FILE_TYPES.minDimensions.width ||
      metadata.height < ACCEPTED_FILE_TYPES.minDimensions.height) {
    throw new Error('Image dimensions too small');
  }

  if (metadata.width > ACCEPTED_FILE_TYPES.maxDimensions.width ||
      metadata.height > ACCEPTED_FILE_TYPES.maxDimensions.height) {
    throw new Error('Image dimensions too large');
  }

  // AI Detection
  const aiDetection = await detectAIArtwork(buffer);
  
  if (aiDetection.isAIGenerated) {
    // Log the rejection for analysis
    await prisma.aiDetectionLog.create({
      data: {
        confidence: aiDetection.confidence,
        patterns: aiDetection.details.patterns,
        warnings: aiDetection.details.warnings,
        scores: {
          deepAI: aiDetection.details.deepAIScore,
          hume: aiDetection.details.humeScore,
          google: aiDetection.details.googleScore
        }
      }
    });

    throw new Error('AI-generated images are not allowed');
  }

  // Extract EXIF data
  const exif = metadata.exif ? {
    camera: metadata.exif.toString('utf-8'),
    lens: extractExifValue(metadata.exif, 'LensModel'),
    settings: {
      iso: extractExifValue(metadata.exif, 'ISOSpeedRatings'),
      aperture: extractExifValue(metadata.exif, 'FNumber'),
      shutterSpeed: extractExifValue(metadata.exif, 'ExposureTime')
    },
    software: extractExifValue(metadata.exif, 'Software')
  } : undefined;

  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    exif,
    aiAnalysis: {
      confidence: 1 - aiDetection.confidence, // Convert to human-art confidence
      verificationDetails: aiDetection.details
    }
  };
}

function extractExifValue(exif: Buffer, tag: string): string | undefined {
  try {
    // Implementation of EXIF tag extraction
    return undefined;
  } catch (error) {
    console.error(`Error extracting EXIF tag ${tag}:`, error);
    return undefined;
  }
}