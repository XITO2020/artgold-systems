import { prisma } from '../lib/db/prisma';

async function createUser() {
  const user = await prisma.user.create({
    data: {
      id: 'some-unique-id', // Tu peux générer un ID unique comme un UUID si nécessaire
      name: 'John Doe',
      email: 'john.doe@example.com',
      emailVerified: new Date(), // Exemple d'une date d'email vérifié
      image: 'https://example.com/image.jpg',
      balance: 100, // Solde de l'utilisateur
      artworkCount: 5, // Nombre d'œuvres de l'utilisateur
      isAdmin: false, // Admin ou non
      status: 'ACTIVE', // Statut de l'utilisateur (ACTIVE, FROZEN, BANNED)
      discordVerified: true, // Vérification Discord
      discordRoles: ['admin', 'moderator'], // Liste des rôles Discord
      createdAt: new Date(), // Date de création de l'utilisateur
      updatedAt: new Date(), // Date de mise à jour de l'utilisateur
      tokens: {
        create: [
          {
            type: 'TABZ',
            amount: 50,
            lockedUntil: new Date('2025-12-31'), // Exemple de verrouillage de jetons
          },
          {
            type: 'AGT',
            amount: 100,
            lockedUntil: new Date('2025-12-31'),
          }
        ]
      },
      transactions: {
        create: [
          {
            type: 'PURCHASE',
            amount: 50,
            status: 'COMPLETED',
            paymentId: 'some-payment-id',
            orderId: 'order-id-123'
          },
          {
            type: 'SALE',
            amount: 200,
            status: 'COMPLETED',
            paymentId: 'some-payment-id-2',
            orderId: 'order-id-456'
          }
        ]
      },
      exchanges: {
        create: [
          {
            fromToken: 'TABZ',
            toToken: 'ETH',
            amount: 100,
            receivedAmount: 0.1,
            walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
            status: 'COMPLETED'
          }
        ]
      },
      fraudAttempts: {
        create: [
          {
            type: 'AI_GENERATED',
            confidence: 0.85,
            details: { pattern: 'suspicious_activity' },
          }
        ]
      },
      artworkPurchases: {
        create: [
          {
            artworkId: 'artwork-id-123',
            amount: 100,
            sharePercent: 50
          }
        ]
      },
      artistCategorySubmissions: {
        create: [
          {
            categoryId: 1,
            points: 10,
            isFirst: true,
          }
        ]
      }
    }
  });

  console.log('Utilisateur créé avec succès:', user);
}

createUser().catch((error) => {
  console.error('Erreur lors de la création de l\'utilisateur:', error);
  process.exit(1);
});
