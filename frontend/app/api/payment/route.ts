import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { prisma } from '@lib/db';

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
    const paymentMethod = String(body.paymentMethod || '');
    
    if (isNaN(amount) || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' }, 
        { status: 400 }
      );
    }

    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        metadata: {
          userId: session.user.id || '',
          conversionRate: '1', // 1 USD = 1 TABZ
        } as const,
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    }

    if (paymentMethod === 'paypal') {
      // Vérification de l'ID utilisateur
      if (!session.user.id) {
        return NextResponse.json(
          { error: 'User ID is missing' },
          { status: 400 }
        );
      }
      
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