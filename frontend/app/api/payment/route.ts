import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { prisma } from '~/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, paymentMethod } = await req.json();

    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        metadata: {
          userId: session.user.id,
          conversionRate: '1', // 1 USD = 1 TABZ
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    }

    if (paymentMethod === 'paypal') {
      // Create PayPal order
      const order = await createPayPalOrder(amount, session.user.id);
      return NextResponse.json(order);
    }

    return NextResponse.json(
      { error: 'Invalid payment method' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

async function createPayPalOrder(amount: number, userId: string) {
  // Implement PayPal order creation
  // https://developer.paypal.com/docs/api/orders/v2/
  return {
    id: 'test_order',
    status: 'CREATED',
  };
}