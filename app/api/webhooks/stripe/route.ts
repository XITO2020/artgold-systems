import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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
        
        // Update order status
        await prisma.order.update({
          where: { id: paymentIntent.metadata.orderId },
          data: { status: 'COMPLETED' },
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId: paymentIntent.metadata.userId,
            amount: paymentIntent.amount / 100,
            type: 'PURCHASE',
            status: 'COMPLETED',
            paymentId: paymentIntent.id,
            orderId: paymentIntent.metadata.orderId,
          },
        });

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await prisma.order.update({
          where: { id: paymentIntent.metadata.orderId },
          data: { status: 'FAILED' },
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