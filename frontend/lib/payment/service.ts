import { validateTransaction } from './validation';
import { StripeProvider } from './providers/stripe';
import { PayPalProvider } from './providers/paypal';
import { PAYMENT_CONFIG } from './config';
import type { CreatePaymentParams, PaymentIntent, PaymentProvider } from './types';
import type { TransactionType } from '@t/models/transaction';
import apiClient from '../db/prisma';

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

    // Create transaction record via backend
    await apiClient.post('/transactions', {
      userId: params.metadata.userId,
      type: params.type === 'artwork' ? 'PURCHASE' : 'SALE',
      amount: params.amount,
      status: 'PENDING',
      paymentId: paymentIntent.id,
      metadata: {
        artworkId: params.metadata.artworkId,
        tokenType: params.metadata.tokenType,
        type: params.type
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
      // Prefer backend to resolve by paymentId; if we have transactionId, update directly
      const transactionId = data?.metadata?.transactionId as string | undefined;
      const artworkId = data?.metadata?.artworkId as string | undefined;
      const amount = (data?.amount as number | undefined) ?? undefined;

      if (transactionId) {
        await apiClient.put(`/transactions/${transactionId}/status`, { status: 'COMPLETED' });
      }

      // Notify backend to distribute value for artwork sales when data is sufficient
      if (artworkId && typeof amount === 'number' && amount > 0) {
        await apiClient.post(`/artworks/${artworkId}/distribute`, {
          valueIncrease: amount,
          reason: 'SALE'
        });
      }
    }
  }
}

export const paymentService = new PaymentService();