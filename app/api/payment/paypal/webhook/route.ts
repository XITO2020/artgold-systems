import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendPaymentConfirmation } from '@/lib/mail';
import { generateInvoice } from '@/lib/invoice';

export async function POST(req: Request) {
  const paypalHeaders = headers();
  const event = await req.json();

  try {
    // Verify PayPal webhook signature
    const isValid = await verifyPayPalWebhook(
      event,
      paypalHeaders.get('paypal-auth-algo')!,
      paypalHeaders.get('paypal-cert-url')!,
      paypalHeaders.get('paypal-transmission-id')!,
      paypalHeaders.get('paypal-transmission-sig')!,
      paypalHeaders.get('paypal-transmission-time')!
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const order = await prisma.order.findUnique({
        where: { id: event.resource.custom_id },
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
        paymentMethod: 'paypal',
      });

      // Send confirmation email
      await sendPaymentConfirmation(order.user.email, {
        orderId: order.id,
        amount: order.amount,
        artworkTitle: order.artwork.title,
        paymentMethod: 'paypal',
      });

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function verifyPayPalWebhook(
  event: any,
  authAlgo: string,
  certUrl: string,
  transmissionId: string,
  transmissionSig: string,
  transmissionTime: string
): Promise<boolean> {
  // Implement PayPal webhook verification
  // https://developer.paypal.com/api/rest/webhooks/
  return true; // Replace with actual verification
}