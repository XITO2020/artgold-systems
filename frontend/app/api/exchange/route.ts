import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '~/db';
import { CONVERSION_RATES, LIMITS } from '~/token-config';
import { isTokenLocked } from '~/exchange';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, fromToken, toToken, walletAddress } = await req.json();

    // Get user's token data
    const token = await prisma.token.findFirst({
      where: {
        userId: session.user.id,
        type: fromToken,
      },
    });

    if (!token) {
      return NextResponse.json(
        { error: 'No tokens found' },
        { status: 404 }
      );
    }

    // Check lockup period
    if (isTokenLocked(token.createdAt)) {
      return NextResponse.json(
        { error: 'Tokens are still in lockup period' },
        { status: 403 }
      );
    }

    // Calculate exchange amount
    const exchangeRate = toToken === 'ETH' ?
      (fromToken === 'TABZ' ? CONVERSION_RATES.TABZ_TO_ETH : CONVERSION_RATES.AGT_TO_ETH) :
      (fromToken === 'TABZ' ? CONVERSION_RATES.TABZ_TO_SOL : CONVERSION_RATES.AGT_TO_SOL);

    const receivedAmount = amount * exchangeRate;

    // Create exchange record
    const exchange = await prisma.exchange.create({
      data: {
        userId: session.user.id,
        fromToken,
        toToken,
        amount,
        receivedAmount,
        walletAddress,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      exchangeId: exchange.id,
      receivedAmount
    });
  } catch (error) {
    console.error('Exchange error:', error);
    return NextResponse.json(
      { error: 'Exchange failed' },
      { status: 500 }
    );
  }
}