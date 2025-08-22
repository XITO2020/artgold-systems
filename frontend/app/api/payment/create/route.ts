import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { prisma } from '@lib/db';
import { CONVERSION_RATES } from '@lib/token-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
  timeout: 80000,
  maxNetworkRetries: 3,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const amount = Number(body.amount);
    const tokenType = String(body.tokenType || '');
    const artworkId = body.artworkId ? String(body.artworkId) : undefined;

    if (isNaN(amount) || !tokenType) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        userId: session.user.id || '',
        tokenType: tokenType || '',
        artworkId: artworkId || '',
        conversionRate: (tokenType === 'TABZ' ? 
          CONVERSION_RATES.EUR_TO_TABZ : 
          CONVERSION_RATES.EUR_TO_AGT
        ).toString(),
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount,
        type: artworkId ? 'PURCHASE' : 'SALE',
        status: 'PENDING',
        paymentId: paymentIntent.id,
        metadata: {
          artworkId,
          tokenType
        }
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}