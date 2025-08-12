import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '~/db';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!;

export async function POST(req: Request) {
  const body = await req.text();
  const paypalHeaders = headers();

  // Verify webhook signature
  const isValid = await verifyPayPalWebhook(
    body,
    paypalHeaders.get('paypal-auth-algo')!,
    paypalHeaders.get('paypal-cert-url')!,
    paypalHeaders.get('paypal-transmission-id')!,
    paypalHeaders.get('paypal-transmission-sig')!,
    paypalHeaders.get('paypal-transmission-time')!,
    WEBHOOK_ID
  );

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const event = JSON.parse(body);

  try {
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await prisma.transaction.create({
          data: {
            userId: event.resource.custom_id,
            amount: parseFloat(event.resource.amount.value),
            type: 'PURCHASE',
            status: 'COMPLETED',
            paymentId: event.resource.id,
          },
        });
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        await prisma.transaction.create({
          data: {
            userId: event.resource.custom_id,
            amount: parseFloat(event.resource.amount.value),
            type: 'PURCHASE',
            status: 'FAILED',
            paymentId: event.resource.id,
          },
        });
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('PayPal webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function verifyPayPalWebhook(
  body: string,
  authAlgo: string,
  certUrl: string,
  transmissionId: string,
  transmissionSig: string,
  transmissionTime: string,
  webhookId: string
): Promise<boolean> {
  // Implement PayPal webhook verification
  // https://developer.paypal.com/api/rest/webhooks/
  return true; // Replace with actual verification
}