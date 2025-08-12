import { prisma } from '~/db';
import { detectAIArtwork } from '~/ai-detection';

export async function validateArtwork(
  artworkId: string,
  imageBuffer: Buffer
): Promise<{
  isValid: boolean;
  status: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW';
  details: any;
}> {
  // Run AI detection
  const aiAnalysis = await detectAIArtwork(imageBuffer);

  // Create validation record
  const validation = await prisma.artworkValidation.create({
    data: {
      artworkId,
      aiScore: aiAnalysis.confidence,
      patterns: aiAnalysis.details.patterns,
      status: aiAnalysis.isAIGenerated ? 'REJECTED' : 'PENDING_REVIEW'
    }
  });

  // If AI detects generated content, reject immediately
  if (aiAnalysis.isAIGenerated) {
    await prisma.artwork.update({
      where: { id: artworkId },
      data: { status: 'REJECTED' }
    });

    // Log fraud attempt
    await prisma.fraudAttempt.create({
      data: {
        userId: (await prisma.artwork.findUnique({ 
          where: { id: artworkId },
          select: { artistId: true }
        }))!.artistId,
        type: 'AI_GENERATED',
        confidence: aiAnalysis.confidence,
        details: aiAnalysis.details
      }
    });

    return {
      isValid: false,
      status: 'REJECTED',
      details: aiAnalysis
    };
  }

  return {
    isValid: true,
    status: 'PENDING_REVIEW',
    details: aiAnalysis
  };
}

export async function reviewArtwork(
  artworkId: string,
  reviewerId: string,
  approved: boolean,
  notes?: string
) {
  const status = approved ? 'APPROVED' : 'REJECTED';

  await prisma.$transaction([
    // Update artwork status
    prisma.artwork.update({
      where: { id: artworkId },
      data: { status }
    }),

    // Update validation record
    prisma.artworkValidation.updateMany({
      where: { artworkId },
      data: {
        status,
        reviewerId,
        reviewNotes: notes
      }
    })
  ]);

  return { status };
}