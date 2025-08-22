import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { apiClient } from '@lib/db/prisma';
import { distributeValue } from '@lib/value-distribution';

// Vérification des variables d'environnement
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
}

// Initialisation de Stripe avec la version d'API spécifiée
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-07-30.basil' as Stripe.LatestApiVersion,
  typescript: true,
  timeout: 80000,
  maxNetworkRetries: 3,
});

interface TransactionMetadata {
  artworkId?: string;
  [key: string]: any;
}

export async function POST(req: Request) {
  // Vérification de la méthode HTTP
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  // Récupération du corps et de la signature
  const body = await req.text();
  const signature = headers().get('stripe-signature');
  
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    // Gestion des événements Stripe
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        try {
          // Récupérer la transaction depuis le backend (via API)
          const response = await apiClient.get(`/transactions/by-payment/${paymentIntent.id}`);
          const transaction = response.data;

          if (!transaction) {
            console.error('Transaction not found for payment intent:', paymentIntent.id);
            return NextResponse.json(
              { error: 'Transaction not found' },
              { status: 404 }
            );
          }

          // Validation des données de transaction
          if (!transaction.id || !transaction.amount) {
            throw new Error('Invalid transaction data received');
          }

          // Marquer la transaction comme complétée (via API)
          await apiClient.post('/transactions/complete', {
            transactionId: transaction.id,
            paymentId: paymentIntent.id
          });

          // Répartition de valeur éventuelle (si œuvre)
          const metadata = transaction.metadata as TransactionMetadata | undefined;
          if (metadata?.artworkId) {
            try {
              await distributeValue(
                metadata.artworkId,
                transaction.amount,
                'SALE'
              );
            } catch (distributeError) {
              console.error('Error in distributeValue:', distributeError);
              // On ne renvoie pas d'erreur pour ne pas faire échouer le webhook
              // car la transaction est déjà marquée comme complétée
            }
          }
        } catch (error) {
          console.error('Error processing payment_intent.succeeded:', error);
          return NextResponse.json(
            { error: 'Error processing payment' },
            { status: 500 }
          );
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        try {
          await apiClient.post('/transactions/fail', {
            paymentId: paymentIntent.id
          });
        } catch (error) {
          console.error('Error processing payment_intent.payment_failed:', error);
          return NextResponse.json(
            { error: 'Error processing failed payment' },
            { status: 500 }
          );
        }
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