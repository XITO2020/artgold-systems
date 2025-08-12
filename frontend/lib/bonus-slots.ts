import { prisma } from './db';

export const BONUS_SLOTS_CONFIG = {
  THRESHOLD_ARTWORKS: 12,
  THRESHOLD_TABZ: 4000,
  THRESHOLD_AGT: 27000,
  BONUS_SLOTS: 7
};

export async function checkBonusSlotEligibility(userId: string): Promise<boolean> {
  if (!prisma) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      artworks: {
        where: { status: 'SOLD' }
      },
      tokens: true
    }
  });

  if (!user) return false;

  const soldArtworks = user.artworks.length;
  const tabzBalance = user.tokens.find(t => t.type === 'TABZ')?.amount || 0;
  const agtBalance = user.tokens.find(t => t.type === 'AGT')?.amount || 0;

  return (
    soldArtworks >= BONUS_SLOTS_CONFIG.THRESHOLD_ARTWORKS &&
    (Number(tabzBalance) >= BONUS_SLOTS_CONFIG.THRESHOLD_TABZ ||
     Number(agtBalance) >= BONUS_SLOTS_CONFIG.THRESHOLD_AGT) &&
    user.bonusSlots === 0
  );
}

export async function awardBonusSlots(userId: string) {
  const isEligible = await checkBonusSlotEligibility(userId);
  if (!isEligible) {
    throw new Error('User not eligible for bonus slots');
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      bonusSlots: BONUS_SLOTS_CONFIG.BONUS_SLOTS
    }
  });

  return BONUS_SLOTS_CONFIG.BONUS_SLOTS;
}

export async function transferBonusSlot(
  fromUserId: string,
  toUserId: string,
  price: number
) {
  const fromUser = await prisma.user.findUnique({
    where: { id: fromUserId }
  });

  if (!fromUser || fromUser.bonusSlots <= 0) {
    throw new Error('No bonus slots available to transfer');
  }

  await prisma.$transaction([
    // Deduct slot from sender
    prisma.user.update({
      where: { id: fromUserId },
      data: { bonusSlots: { decrement: 1 } }
    }),

    // Add slot to receiver
    prisma.user.update({
      where: { id: toUserId },
      data: { bonusSlots: { increment: 1 } }
    }),

    // Record transfer
    prisma.bonusSlotTransfer.create({
      data: {
        fromUserId,
        toUserId,
        amount: 1,
        price,
        status: 'COMPLETED'
      }
    })
  ]);
}