import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@lib/db';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { memeId } = await req.json();

    const meme = await prisma.memeralReserve.findUnique({
      where: { id: memeId }
    });

    if (!meme) {
      return NextResponse.json(
        { error: 'Meme not found' },
        { status: 404 }
      );
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true }
    });

    if (!user || Number(user.balance) < Number(meme.tabzValue)) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Process purchase
    await prisma.$transaction([
      // Deduct user balance
      prisma.user.update({
        where: { id: session.user.id },
        data: { balance: { decrement: meme.tabzValue } }
      }),

      // Record transaction
      prisma.bankTransaction.create({
        data: {
          userId: session.user.id,
          type: 'PURCHASE',
          tokenType: 'TABZ',
          amount: meme.tabzValue,
          fromAddress: session.user.id,
          toAddress: 'BANK',
          memeHash: meme.memeHash,
          metadata: { title: meme.title }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error purchasing meme:', error);
    return NextResponse.json(
      { error: 'Failed to purchase meme' },
      { status: 500 }
    );
  }
}