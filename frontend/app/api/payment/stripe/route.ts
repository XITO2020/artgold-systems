import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@lib/db';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_SECRET_KEY: string;
    }
  }
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
  timeout: 80000,
  maxNetworkRetries: 3,
});

export async function POST(req: Request) {
  try {
    // Vérification du token JWT
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string' || !decoded.id) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }
    
    const userId = decoded.id;

    const body = await req.json();
    const amount = body.amount as number;
    
    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    // Create PaymentIntent
    // Validation du montant
    const amountInCents = Math.round(Number(amount) * 100);
    if (isNaN(amountInCents) || amountInCents < 50) { // Minimum 0.50 USD
      return NextResponse.json(
        { error: 'Invalid amount' }, 
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        conversionRate: '1', // 1 USD = 1 TABZ
      },
    });

    // Record the pending transaction
    try {
      await prisma.transaction.create({
        data: {
          userId,
          amount: amountInCents / 100, // Stocker en dollars
          type: 'PURCHASE',
          status: 'PENDING',
          paymentId: paymentIntent.id,
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // On ne renvoie pas d'erreur à l'utilisateur pour ne pas bloquer le paiement
      // mais on log l'erreur pour investigation
    }

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