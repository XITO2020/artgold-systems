import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ethers } from 'ethers';
import { prisma } from '@/lib/db';
import { CONVERSION_RATES } from '@/lib/token-config';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, tokenType, ethAddress } = await req.json();

    // Verify user has enough tokens
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    });

    if (!user || user.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Calculate ETH amount
    const ethAmount = amount * (
      tokenType === 'TABZ' ? 
        CONVERSION_RATES.TABZ_TO_ETH : 
        CONVERSION_RATES.AGT_TO_ETH
    );

    // In production, implement actual ETH transfer here
    console.log(`Converting ${amount} ${tokenType} to ${ethAmount} ETH`);
    console.log(`Sending to address: ${ethAddress}`);

    // Update user balance
    await prisma.user.update({
      where: { id: session.user.id },
      data: { balance: { decrement: amount } },
    });

    // Record transaction
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount,
        type: 'CONVERSION',
        status: 'COMPLETED',
        metadata: {
          tokenType,
          ethAmount,
          ethAddress,
        },
      },
    });

    return NextResponse.json({
      success: true,
      ethAmount,
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Conversion failed' },
      { status: 500 }
    );
  }
}