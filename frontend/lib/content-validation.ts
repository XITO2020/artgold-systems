import { prisma } from './db';
import { distributeValue } from './value-distribution';

export async function reviewContent(
  contentId: string,
  reviewerId: string,
  isArtwork: boolean,
  baseValue?: number,
  notes?: string
) {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: { artist: true }
  });

  if (!content) throw new Error('Content not found');

  await prisma.$transaction(async (tx) => {
    // Update content status
    await tx.content.update({
      where: { id: contentId },
      data: {
        status: 'APPROVED',
        isArtwork,
        baseValue,
        currentValue: baseValue || 0
      }
    });

    // Create validation record
    await tx.contentValidation.create({
      data: {
        contentId,
        reviewerId,
        isArtwork,
        baseValue,
        notes
      }
    });

    // If marked as artwork, distribute initial value
    if (isArtwork && baseValue) {
      await distributeValue(contentId, baseValue);
    }
  });

  return { success: true };
}

export async function likeContent(contentId: string, userId: string) {
  const content = await prisma.content.findUnique({
    where: { id: contentId }
  });

  if (!content) throw new Error('Content not found');
  if (!content.isArtwork) throw new Error('Content is not marked as artwork');

  // Increment likes and value
  const valueIncrease = content.baseValue ? content.baseValue * 0.01 : 0;
  
  await prisma.content.update({
    where: { id: contentId },
    data: {
      likes: { increment: 1 },
      currentValue: { increment: valueIncrease }
    }
  });

  if (valueIncrease > 0) {
    await distributeValue(contentId, valueIncrease);
  }

  return { success: true };
}