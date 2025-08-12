import { prisma } from '../db';
import { validateTransaction } from './validation';
import { StripeProvider } from './providers/stripe';
import { PayPalProvider } from './providers/paypal';
import { PAYMENT_CONFIG } from './config';
import { distributeValue } from '../value-distribution';
import type { CreatePaymentParams, PaymentIntent, PaymentProvider } from './types';
import type { TransactionType } from 'T/models/transaction';

export class PaymentService {
  private providers: Record<PaymentProvider, any>;

  constructor() {
    this.providers = {
      stripe: new StripeProvider(),
      paypal: new PayPalProvider()
    };
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentIntent> {
    // Validate amount
    if (params.amount < PAYMENT_CONFIG.minimumAmount || 
        params.amount > PAYMENT_CONFIG.maximumAmount) {
      throw new Error('Invalid amount');
    }

    const provider = this.providers[params.provider];
    const paymentIntent = await provider.createPayment(params);

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: params.metadata.userId,
        type: params.type === 'artwork' ? 'PURCHASE' : 'SALE',
        amount: params.amount,
        status: 'PENDING',
        paymentId: paymentIntent.id,
        provider: params.provider,
        metadata: {
          artworkId: params.metadata.artworkId,
          tokenType: params.metadata.tokenType,
          type: params.type
        }
      }
    });

    return paymentIntent;
  }

  async handleWebhook(
    provider: PaymentProvider,
    eventType: string,
    data: any
  ): Promise<void> {
    if (eventType === 'payment_success') {
      const transaction = await prisma.transaction.findFirst({
        where: { paymentId: data.id }
      });

      if (!transaction) return;

      await prisma.$transaction(async (tx) => {
        // Update transaction status
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: 'COMPLETED' }
        });

        // Handle artwork purchase
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
  }
}

export const paymentService = new PaymentService();