import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '~/db';
import Stripe from 'stripe';
import { CONVERSION_FEES } from '~/constants';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { artworkId, amount, currency, paymentMethod } = await req.json();

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: 'PURCHASE',
        amount,
        status: 'PENDING',
        metadata: {
          artworkId,
          paymentMethod,
          currency
        }
      }
    });

    // Handle payment based on method
    if (paymentMethod === 'STRIPE') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          orderId: transaction.id,
          userId: session.user.id,
          artworkId
        },
      });

      return NextResponse.json({
        orderId: transaction.id,
        clientSecret: paymentIntent.client_secret,
      });
    }

    if (paymentMethod === 'CRYPTO') {
      // Generate crypto payment address
      const paymentAddress = await generateCryptoPaymentAddress(currency);
      
      return NextResponse.json({
        orderId: transaction.id,
        paymentAddress,
        amount: calculateCryptoAmount(amount, currency),
      });
    }

    return NextResponse.json({ orderId: transaction.id });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

async function generateCryptoPaymentAddress(currency: string): Promise<string> {
  // Implement crypto address generation based on currency
  return 'DEMO_ADDRESS';
}

function calculateCryptoAmount(fiatAmount: number, currency: string): number {
  // Implement conversion logic
  return fiatAmount;
}