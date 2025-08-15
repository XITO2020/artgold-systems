import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@lib/db';
import type { Prisma } from '@prisma/client';
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
        
        // Find transaction by payment ID
        const transaction = await prisma.transaction.findFirst({
          where: { paymentId: paymentIntent.id }
        });

        if (transaction) {
          await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Update transaction status
            await tx.transaction.update({
              where: { id: transaction.id },
              data: { status: 'COMPLETED' }
            });

            // Handle artwork purchase if artworkId exists in metadata
            const metadata = transaction.metadata as { artworkId?: string };
            if (metadata?.artworkId) {
              await distributeValue(
                metadata.artworkId,
                transaction.amount,
                'SALE'
              );
            }

            // Handle token purchase
            if (!metadata?.artworkId) {
              await tx.user.update({
                where: { id: transaction.userId },
                data: { balance: { increment: transaction.amount } }
              });
            }
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await prisma.transaction.updateMany({
          where: { paymentId: paymentIntent.id },
          data: { status: 'FAILED' }
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