import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { prisma } from '~/db';
import { CONVERSION_RATES } from '~/token-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, tokenType, artworkId } = await req.json();

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        userId: session.user.id,
        tokenType,
        artworkId,
        conversionRate: tokenType === 'TABZ' ? 
          CONVERSION_RATES.EUR_TO_TABZ.toString() : 
          CONVERSION_RATES.EUR_TO_AGT.toString(),
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