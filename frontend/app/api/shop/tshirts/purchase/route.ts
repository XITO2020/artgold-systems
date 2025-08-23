import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@lib/db';
import { distributeValue } from '@lib/value-distribution';

const TABZ_REWARD_RATE = 0.05; // 5% of purchase price in TABZ

export async function POST(req: Request) {
  try {
    // Vérification du token JWT
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string' || !decoded.id) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }
    const userId = decoded.id;
    
    const { tshirtId, size, color, quantity } = await req.json();

    const tshirt = await prisma.tShirt.findUnique({
      where: { id: tshirtId }
    });

    if (!tshirt) {
      return NextResponse.json(
        { error: 'T-shirt not found' },
        { status: 404 }
      );
    }

    const totalAmount = Number(tshirt.price) * Number(quantity);
    const tabzReward = Number(totalAmount) * TABZ_REWARD_RATE;

    // Create purchase record
    const purchase = await prisma.tShirtPurchase.create({
      data: {
        tshirtId,
        userId,
        size,
        color,
        quantity,
        amount: totalAmount,
        status: 'PENDING'
      }
    });

    // Distribute value - Note: This needs to be updated to use a valid artwork ID
    // For now, we'll skip this as it's not clear what should be distributed
    console.log('Value distribution for t-shirt purchase is not yet implemented');

    // Award TABZ tokens to the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: tabzReward
        }
      }
    });

    // If purchase supports a project, distribute value
    if (tshirt.projectId) {
      // Convert tabzReward to number if it's not already
      const rewardAmount = Number(tabzReward);
      if (!isNaN(rewardAmount)) {
        await distributeValue(
          tshirt.projectId,
          rewardAmount,
          'SALE'
        );
      }
    }

    return NextResponse.json({
      purchase,
      tabzReward: tabzReward
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}