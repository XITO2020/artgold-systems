import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyToken } from '@/lib/jwt';

// Vérification de la clé API Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
  timeout: 80000,
  maxNetworkRetries: 3,
});

export async function POST(req: Request) {
  try {
    // Vérification de l'authentification
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' }, 
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string' || !decoded.id) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' }, 
        { status: 401 }
      );
    }
    const userId = decoded.id;

    // Récupération des données de la requête
    const { amount, paymentMethod } = await req.json();

    // Validation des données
    if (isNaN(amount) || !paymentMethod) {
      return NextResponse.json(
        { error: 'Données de paiement manquantes ou invalides' }, 
        { status: 400 }
      );
    }

    // Traitement en fonction de la méthode de paiement
    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Conversion en centimes
        currency: 'usd',
        metadata: {
          userId: userId,
          conversionRate: '1', // 1 USD = 1 TABZ
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    }

    if (paymentMethod === 'paypal') {
      const order = await createPayPalOrder(amount, userId);
      return NextResponse.json(order);
    }

    // Si la méthode de paiement n'est pas reconnue
    return NextResponse.json(
      { error: 'Méthode de paiement non supportée' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement du paiement' },
      { status: 500 }
    );
  }
}

/**
 * Crée une commande PayPal
 */
async function createPayPalOrder(amount: number, userId: string) {
  // Implémentation de la création de commande PayPal
  // https://developer.paypal.com/docs/api/orders/v2/
  
  // Pour l'instant, on retourne un objet de test
  return {
    id: `order_${Date.now()}`,
    status: 'CREATED',
    amount,
    userId,
    // Ajoutez ici les détails spécifiques à PayPal
  };
}