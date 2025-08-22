import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@lib/db';
import { distributeValue } from '@lib/value-distribution';

const TABZ_REWARD_RATE = 0.05; // 5% of purchase price in TABZ

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
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
        userId: session?.user?.id,
        size,
        color,
        quantity,
        amount: totalAmount,
        status: 'PENDING'
      }
    });

    // If user is logged in, award TABZ tokens
    if (session?.user) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          balance: {
            increment: tabzReward
          }
        }
      });

      // If purchase supports a project, distribute value
      if (tshirt.projectId) {
        await distributeValue(tshirt.projectId, tabzReward, 'SALE');
      }
    }

    return NextResponse.json({
      purchase,
      tabzReward: session?.user ? tabzReward : 0
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}