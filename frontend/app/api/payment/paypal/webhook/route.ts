import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@lib/db';

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

export async function POST(req: Request) {
  try {
    // Vérification du token JWT
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string' || !decoded.id) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }
    
    const userId = decoded.id;

    const body = await req.json();
    const amount = Number(body.amount);
    
    if (isNaN(amount)) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      );
    }

    // Récupération du token d'accès PayPal
    const accessToken = await getPayPalAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Échec de la récupération du token d\'accès PayPal' },
        { status: 500 }
      );
    }

    // Création de la commande PayPal
    const order = await createPayPalOrder(accessToken, amount, userId);

    // Enregistrement de la transaction en attente
    await prisma.transaction.create({
      data: {
        userId: userId,
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