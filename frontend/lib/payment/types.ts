
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
  metadata: Record<string, any>;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentProvider = 'stripe' | 'paypal';
export type PaymentType = 'artwork' | 'token_purchase';

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  provider: PaymentProvider;
  type: PaymentType;
  metadata: {
    userId: string;
    artworkId?: string;
    tokenType?: 'TABZ' | 'AGT';
  };
}

export interface PaymentProviderInterface {
  createPayment(params: CreatePaymentParams): Promise<PaymentIntent>;
  confirmPayment(paymentId: string): Promise<PaymentIntent>;
  refundPayment(paymentId: string): Promise<void>;
}
