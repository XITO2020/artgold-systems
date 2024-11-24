import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';
import { CONVERSION_FEES } from '@/lib/constants';

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

    // Create order record
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        artworkId,
        amount,
        currency,
        status: 'PENDING',
        paymentMethod,
      },
    });

    // Handle payment based on method
    if (paymentMethod === 'STRIPE') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          orderId: order.id,
          userId: session.user.id,
        },
      });

      return NextResponse.json({
        orderId: order.id,
        clientSecret: paymentIntent.client_secret,
      });
    }

    if (paymentMethod === 'CRYPTO') {
      // Generate crypto payment address
      const paymentAddress = await generateCryptoPaymentAddress(currency);
      
      return NextResponse.json({
        orderId: order.id,
        paymentAddress,
        amount: calculateCryptoAmount(amount, currency),
      });
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

async function generateCryptoPaymentAddress(currency: string) {
  // Implement crypto address generation based on currency
  return 'DEMO_ADDRESS';
}

function calculateCryptoAmount(fiatAmount: number, currency: string) {
  // Implement conversion logic
  return fiatAmount;
}