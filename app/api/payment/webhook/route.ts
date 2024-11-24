import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { sendPaymentConfirmation } from '@/lib/mail';
import { generateInvoice } from '@/lib/invoice';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Get order details
      const order = await prisma.order.findUnique({
        where: { id: paymentIntent.metadata.orderId },
        include: { artwork: true, user: true },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Generate invoice
      await generateInvoice({
        orderId: order.id,
        amount: order.amount,
        artworkTitle: order.artwork.title,
        buyerEmail: order.user.email,
        paymentMethod: 'stripe',
      });

      // Send confirmation email
      await sendPaymentConfirmation(order.user.email, {
        orderId: order.id,
        amount: order.amount,
        artworkTitle: order.artwork.title,
        paymentMethod: 'stripe',
      });

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}