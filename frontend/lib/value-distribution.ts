import { apiClient } from './db/prisma';
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
  // Fetch artwork from backend API
  const artwork = await apiClient.get(`/artworks/${artworkId}`);

  if (!artwork) throw new Error('Artwork not found');

  const previousValue = Number(artwork.currentValue);
  const newValue = previousValue + valueIncrease;

  // Calculate shares
  const creatorShare = valueIncrease * VALUE_SHARES.CREATOR;
  const ownerShare = valueIncrease * VALUE_SHARES.OWNER;
  const buyersShare = valueIncrease * VALUE_SHARES.BUYERS;

  // Perform distribution via backend API (single transactional endpoint)
  await apiClient.post(`/artworks/${artworkId}/distribute`, {
    valueIncrease,
    reason,
    previousValue,
    newValue,
    creatorShare,
    ownerShare,
    buyersShare
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

  // Can't delete if artwork has value
  if (Number(artwork.currentValue) > 0) return false;

  return true;
}