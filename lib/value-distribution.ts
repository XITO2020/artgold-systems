
import { prisma } from './db';
import { sendValueChangeNotifications } from './mail/notifications';

export const VALUE_SHARES = {
  CREATOR: 0.10, // 10%
  OWNER: 0.80,   // 80%
  BUYERS: 0.10   // 10%
} as const;

export async function distributeValue(
  artworkId: string,
  valueIncrease: number,
  reason: 'SALE' | 'LIKES' | 'ADMIN'
) {
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
    include: {
      artist: true,
      purchases: {
        include: { buyer: true }
      }
    }
  });

  if (!artwork) throw new Error('Artwork not found');

  const previousValue = artwork.currentValue;
  const newValue = previousValue + valueIncrease;

  // Calculate shares
  const creatorShare = valueIncrease * VALUE_SHARES.CREATOR;
  const ownerShare = valueIncrease * VALUE_SHARES.OWNER;
  const buyersShare = valueIncrease * VALUE_SHARES.BUYERS;

  await prisma.$transaction(async (tx) => {
    // Update artwork value
    await tx.artwork.update({
      where: { id: artworkId },
      data: { currentValue: newValue }
    });

    // Update creator balance
    await tx.user.update({
      where: { id: artwork.artist.id },
      data: { balance: { increment: creatorShare } }
    });

    // Update owner balance
    await tx.user.update({
      where: { id: artwork.artistId },
      data: { balance: { increment: ownerShare } }
    });

    // Distribute buyers share
    if (artwork.purchases.length > 0) {
      const sharePerBuyer = buyersShare / artwork.purchases.length;
      
      await Promise.all(
        artwork.purchases.map(purchase => 
          tx.user.update({
            where: { id: purchase.buyerId },
            data: { balance: { increment: sharePerBuyer } }
          })
        )
      );
    }

    // Record distribution
    await tx.valueDistribution.create({
      data: {
        artworkId,
        previousValue,
        newValue,
        creatorShare,
        ownerShare,
        buyersShare,
        reason
      }
    });
  });

  // Send notifications
  await sendValueChangeNotifications({
    artworkId,
    newValue,
    previousValue,
    reason
  });

  return {
    previousValue,
    newValue,
    creatorShare,
    ownerShare,
    buyersShare
  };
}

export async function canDeleteArtwork(artworkId: string, userId: string): Promise<boolean> {
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
    include: {
      purchases: true
    }
  });

  if (!artwork) return false;

  // Only creator can delete
  if (artwork.artistId !== userId) return false;

  // Can't delete if there are any purchases
  if (artwork.purchases.length > 0) return false;

  return true;
}
