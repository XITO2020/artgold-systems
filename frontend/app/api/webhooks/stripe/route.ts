import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { apiClient } from '@lib/db/prisma';
import { distributeValue } from '@lib/value-distribution';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil' as Stripe.LatestApiVersion,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Récupérer la transaction depuis le backend (via API)
        const transaction = await apiClient.get(`/transactions/by-payment/${paymentIntent.id}`);

        if (transaction) {
          // Marquer la transaction comme complétée (via API)
          await apiClient.post('/transactions/complete', {
            transactionId: transaction.id,
            paymentId: paymentIntent.id
          });

          // Répartition de valeur éventuelle (si oeuvre)
          const metadata = transaction.metadata as { artworkId?: string };
          if (metadata?.artworkId) {
            await distributeValue(
              metadata.artworkId,
              transaction.amount,
              'SALE'
            );
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await apiClient.post('/transactions/fail', {
          paymentId: paymentIntent.id
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}