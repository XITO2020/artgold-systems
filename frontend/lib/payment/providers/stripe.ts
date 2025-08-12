import { PaymentProviderInterface, PaymentIntent, CreatePaymentParams } from '../types';
import Stripe from 'stripe';
import { PAYMENT_CONFIG } from '../config';

export class StripeProvider implements PaymentProviderInterface {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as const
    });
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency.toLowerCase(),
      metadata: {
        userId: params.metadata.userId || '',
        artworkId: params.metadata.artworkId || '',
        tokenType: params.metadata.tokenType || '',
        type: params.type
      }
    });

    return {
      id: paymentIntent.id,
      amount: params.amount,
      currency: params.currency,
      status: 'pending',
      clientSecret: paymentIntent.client_secret!,
      metadata: params.metadata
    };
  }

  async confirmPayment(paymentId: string): Promise<PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
    
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed',
      metadata: paymentIntent.metadata
    };
  }

  async refundPayment(paymentId: string): Promise<void> {
    await this.stripe.refunds.create({
      payment_intent: paymentId
    });
  }
}