import { PrismaClient } from '@prisma/client';

// Déclaration du type global pour TypeScript
type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

// Création de l'instance PrismaClient avec une configuration optimisée
const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
};

// Création de l'instance PrismaClient
const prisma = (global as GlobalWithPrisma).prisma || new PrismaClient(prismaClientOptions);

// En mode développement, on conserve l'instance entre les rechargements
if (process.env.NODE_ENV !== 'production') {
  (global as GlobalWithPrisma).prisma = prisma;
}

export { prisma };
export * from '@prisma/client';
