import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var globalPrisma: PrismaClient | undefined;
}

if (!global.globalPrisma) {
  global.globalPrisma = new PrismaClient();
}

prisma = global.globalPrisma;

export default prisma;
