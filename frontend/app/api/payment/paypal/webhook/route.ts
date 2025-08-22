import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@lib/db';

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const amount = Number(body.amount);
    
    if (isNaN(amount)) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to get PayPal access token' },
        { status: 500 }
      );
    }

    // Vérification de l'ID utilisateur
    if (!session.user.id) {
      return NextResponse.json(
        { error: 'User ID is missing' },
        { status: 400 }
      );
    }

    // Create PayPal order
    const order = await createPayPalOrder(accessToken, amount, session.user.id);

    // Record the pending transaction
    await prisma.transaction.create({
      data: {
        userId: session.user.id || '',
        amount: amount,
        type: 'PURCHASE',
        status: 'PENDING',
        paymentId: order.id,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('PayPal error:', error);
    return NextResponse.json(
      { error: 'PayPal payment initialization failed' },
      { status: 500 }
    );
  }
}

async function getPayPalAccessToken() {
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

async function createPayPalOrder(accessToken: string, amount: number, userId: string) {
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
          currency_code: 'USD',
          value: amount.toString(),
        },
        custom_id: userId,
      }],
    }),
  });

  return response.json();
}