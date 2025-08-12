import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@lib/db';
import { BONUS_SLOTS_CONFIG } from '@lib/constants';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, toUserId, price } = await req.json();

  try {
    switch (action) {
      case 'claim':
        const isEligible = await checkBonusSlotEligibility(session.user.id);
        if (!isEligible) {
          return NextResponse.json(
            { error: 'Not eligible for bonus slots' },
            { status: 400 }
          );
        }

        await prisma.user.update({
          where: { id: session.user.id },
          data: { bonusSlots: BONUS_SLOTS_CONFIG.BONUS_SLOTS }
        });

        return NextResponse.json({ 
          slots: BONUS_SLOTS_CONFIG.BONUS_SLOTS 
        });

      case 'transfer':
        // Create transfer record and update user slots in a transaction
        await prisma.$transaction(async (tx) => {
          // Create transfer record
          await tx.bonusSlotTransfer.create({
            data: {
              fromUserId: session.user.id,
              toUserId,
              amount: 1,
              price,
              status: 'COMPLETED'
            }
          });

          // Deduct slot from sender
          await tx.user.update({
            where: { id: session.user.id },
            data: { bonusSlots: { decrement: 1 } }
          });

          // Add slot to receiver
          await tx.user.update({
            where: { id: toUserId },
            data: { bonusSlots: { increment: 1 } }
          });
        });

        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Bonus slot error:', error);
    return NextResponse.json(
      { error: 'Failed to process bonus slot action' },
      { status: 500 }
    );
  }
}

async function checkBonusSlotEligibility(userId: string): Promise<boolean> {
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