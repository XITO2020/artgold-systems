import { NextRequest } from 'next/server';
import { verifyWebhook } from './verification';
import { processWebhook } from './processors';
import { SECURITY_CONFIG } from '../security/config';

export async function handleWebhook(
  req: NextRequest,
  provider: 'stripe' | 'paypal'
) {
  // Verify IP address
  const clientIP = req.ip || '';
  if (!SECURITY_CONFIG.webhooks.allowedIPs.includes(clientIP)) {
    throw new Error('Unauthorized IP address');
  }

  // Set timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Webhook timeout')), 
      SECURITY_CONFIG.webhooks.timeoutMs
    );
  });

  // Process webhook with timeout
  const processingPromise = (async () => {
    const body = await req.text();
    const signature = req.headers.get(`${provider}-signature`);

    if (!signature) {
      throw new Error('Missing signature');
    }

    // Verify webhook signature
    const event = await verifyWebhook(body, signature, provider);

    // Process webhook event
    return processWebhook(event, provider);
  })();

  return Promise.race([processingPromise, timeoutPromise]);
}