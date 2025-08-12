
import Stripe from 'stripe';
import { PAYMENT_CONFIG } from '../config';
import crypto from 'crypto';

export async function verifyWebhook(
  body: string,
  signature: string,
  provider: 'stripe' | 'paypal'
): Promise<any> {
  switch (provider) {
    case 'stripe':
      return verifyStripeWebhook(body, signature);
    case 'paypal':
      return verifyPayPalWebhook(body, signature);
    default:
      throw new Error('Unsupported provider');
  }
}

function verifyStripeWebhook(body: string, signature: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: PAYMENT_CONFIG.providers.stripe.apiVersion
  });

  return stripe.webhooks.constructEvent(
    body,
    signature,
    PAYMENT_CONFIG.providers.stripe.webhookSecret
  );
}

function verifyPayPalWebhook(body: string, signature: string) {
  const { 
    'paypal-auth-algo': algorithm,
    'paypal-cert-url': certUrl,
    'paypal-transmission-id': transmissionId,
    'paypal-transmission-sig': transmissionSig,
    'paypal-transmission-time': transmissionTime
  } = JSON.parse(signature);

  // Verify webhook signature using PayPal's verification algorithm
  const verificationParams = {
    auth_algo: algorithm,
    cert_url: certUrl,
    transmission_id: transmissionId,
    transmission_sig: transmissionSig,
    transmission_time: transmissionTime,
    webhook_id: PAYMENT_CONFIG.providers.paypal.webhookId,
    webhook_event: body
  };

  // Implement PayPal's verification logic here
  // This is a placeholder - implement actual verification
  return JSON.parse(body);
}
