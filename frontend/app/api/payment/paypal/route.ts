import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '~/db';
import { sendPaymentConfirmation } from '~/mail';
import { generateInvoice } from '~/invoice';

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
      const transaction = await prisma.transaction.findFirst({
        where: { paymentId: event.resource.id },
        include: {
          user: true
        }
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const metadata = transaction.metadata as { artworkId?: string };

      // Generate invoice
      await generateInvoice({
        orderId: transaction.id,
        amount: Number(transaction.amount), // Convert Decimal to number
        artworkTitle: metadata.artworkId ? 'Artwork Purchase' : 'Token Purchase',
        buyerEmail: transaction.user.email!,
        paymentMethod: 'paypal'
      });

      // Send confirmation email
      await sendPaymentConfirmation(transaction.user.email!, {
        orderId: transaction.id,
        amount: Number(transaction.amount), // Convert Decimal to number
        artworkTitle: metadata.artworkId ? 'Artwork Purchase' : 'Token Purchase',
        paymentMethod: 'paypal'
      });

      // Update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' }
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