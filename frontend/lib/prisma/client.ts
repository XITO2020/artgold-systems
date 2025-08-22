import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Création d'une instance unique de PrismaClient
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// En mode développement, on garde la même instance entre les rechargements
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };

export * from '@prisma/client';
