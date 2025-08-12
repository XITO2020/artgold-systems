import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleWebhook } from '~/webhooks';

export async function POST(req: NextRequest) {
  try {
    const result = await handleWebhook(req, 'stripe');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}