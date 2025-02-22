
import { prisma } from './db';
import { sendSaleNotification } from './mail/notifications';

const FIRST_SALE_BONUS = 40; // 40 TABZ bonus for first sale

export async function processSale(
  artworkId: string,
  buyerId: string,
  amount: number
) {
  const artwork = await prisma.artwork.findUnique({
    where: { id: artworkId },
    include: {
      artist: true,
      purchases: true
    }
  });

  if (!artwork) throw new Error('Artwork not found');

  const isFirstSale = artwork.purchases.length === 0;

  await prisma.$transaction(async (tx) => {
    // Record the purchase
    await tx.artworkPurchase.create({
      data: {
        artworkId,
        buyerId,
        amount,
        sharePercent: 10 // Buyers get 10% share
      }
    });

    // Update artwork value
    await tx.artwork.update({
      where: { id: artworkId },
      data: {
        currentValue: amount,
        canDelete: false // Once sold, artwork cannot be deleted
      }
    });

    // Distribute value
    const creatorShare = amount * 0.1; // 10% to creator
    const ownerShare = amount * 0.8;   // 80% to owner
    const buyersShare = amount * 0.1;  // 10% split among buyers

    // Update balances
    await tx.user.update({
      where: { id: artwork.artistId },
      data: {
        balance: {
          increment: creatorShare + (isFirstSale ? FIRST_SALE_BONUS : 0)
        }
      }
    });

    await tx.user.update({
      where: { id: artwork.artistId },
      data: { balance: { increment: ownerShare } }
    });

    // Distribute buyers share among previous buyers
    if (artwork.purchases.length > 0) {
      const sharePerBuyer = buyersShare / artwork.purchases.length;
      for (const purchase of artwork.purchases) {
        await tx.user.update({
          where: { id: purchase.buyerId },
          data: { balance: { increment: sharePerBuyer } }
        });
      }
    }
  });

  // Send notifications
  await sendSaleNotification({
    artwork,
    amount,
    isFirstSale,
    buyerId
  });

  return { success: true, isFirstSale };
}
