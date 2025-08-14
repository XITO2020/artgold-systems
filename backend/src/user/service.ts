import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function createUserWithPassword(data: {
  email: string;
  password: string;
  name?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('email_taken');

  const hash = await bcrypt.hash(data.password, 12);

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name ?? null,
      passwordHash: hash,
      status: 'ACTIVE',
    },
  });
}

export async function validatePasswordLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

// Rétro-compat si ton controller attendait ces noms :
export { createUserWithPassword as createUser, validatePasswordLogin as validateUser };
