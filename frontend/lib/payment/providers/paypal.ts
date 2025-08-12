
import { PaymentProviderInterface, PaymentIntent, CreatePaymentParams } from '../types';
import { PAYMENT_CONFIG } from '../config';

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

export class PayPalProvider implements PaymentProviderInterface {
  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentIntent> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: params.currency.toUpperCase(),
            value: params.amount.toString(),
          },
          custom_id: JSON.stringify(params.metadata),
        }],
      }),
    });

    const data = await response.json();

    return {
      id: data.id,
      amount: params.amount,
      currency: params.currency,
      status: 'pending',
      metadata: params.metadata
    };
  }

  async confirmPayment(paymentId: string): Promise<PaymentIntent> {
    const accessToken = await this.getAccessToken();
    
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    const metadata = JSON.parse(data.purchase_units[0].custom_id);

    return {
      id: data.id,
      amount: parseFloat(data.purchase_units[0].amount.value),
      currency: data.purchase_units[0].amount.currency_code.toLowerCase(),
      status: data.status === 'COMPLETED' ? 'completed' : 'failed',
      metadata
    };
  }

  async refundPayment(paymentId: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    
    await fetch(`${PAYPAL_API}/v2/payments/captures/${paymentId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
