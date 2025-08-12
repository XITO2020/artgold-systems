
import { prisma } from '../db';
import { paymentService } from '../payment';
import { distributeValue } from '../value-distribution';

export async function processWebhook(event: any, provider: string) {
  switch (provider) {
    case 'stripe':
      return processStripeWebhook(event);
    case 'paypal':
      return processPayPalWebhook(event);
    default:
      throw new Error('Unsupported provider');
  }
}

async function processStripeWebhook(event: any) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      return handleSuccessfulPayment(
        event.data.object.id,
        'stripe',
        event.data.object.metadata
      );

    case 'payment_intent.payment_failed':
      return handleFailedPayment(
        event.data.object.id,
        'stripe',
        event.data.object.metadata
      );

    // Add other event types as needed
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }
}

async function processPayPalWebhook(event: any) {
  switch (event.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      return handleSuccessfulPayment(
        event.resource.id,
        'paypal',
        JSON.parse(event.resource.custom_id)
      );

    case 'PAYMENT.CAPTURE.DENIED':
      return handleFailedPayment(
        event.resource.id,
        'paypal',
        JSON.parse(event.resource.custom_id)
      );

    // Add other event types as needed
    default:
      console.log(`Unhandled PayPal event type: ${event.event_type}`);
  }
}

async function handleSuccessfulPayment(
  paymentId: string,
  provider: string,
  metadata: any
) {
  const transaction = await prisma.transaction.findFirst({
    where: { paymentId }
  });

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  await prisma.$transaction(async (tx) => {
    // Update transaction status
    await tx.transaction.update({
      where: { id: transaction.id },
      data: { status: 'COMPLETED' }
    });

    // Handle artwork purchase
    if (metadata.artworkId) {
      await distributeValue(
        metadata.artworkId,
        transaction.amount,
        'SALE'
      );
    }

    // Handle token purchase
    if (metadata.tokenType) {
      await tx.user.update({
        where: { id: transaction.userId },
        data: { balance: { increment: transaction.amount } }
      });
    }
  });

  return { success: true };
}

async function handleFailedPayment(
  paymentId: string,
  provider: string,
  metadata: any
) {
  await prisma.transaction.updateMany({
    where: { paymentId },
    data: { status: 'FAILED' }
  });

  return { success: true };
}
