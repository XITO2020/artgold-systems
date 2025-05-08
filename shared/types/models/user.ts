import { Account, Session, Artwork, Token, Transaction, Exchange, FraudAttempt, ArtworkPurchase, ArtistCategorySubmission } from '@prisma/client';
import { z } from 'zod';

export const UserStatusEnum = z.enum(['ACTIVE', 'FROZEN', 'BANNED']);
export type UserStatus = z.infer<typeof UserStatusEnum>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().url().nullable(),
  balance: z.number().min(0),
  artworkCount: z.number().min(0),
  isAdmin: z.boolean(),
  status: UserStatusEnum,
  discordVerified: z.boolean(),
  discordRoles: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLogin: z.date().optional(),
  loginCount: z.number().min(0).default(0),
});

export type User = z.infer<typeof UserSchema> & {
  // Relations
  accounts?: Account[];
  sessions?: Session[];
  artworks?: Artwork[];
  tokens?: Token[];
  transactions?: Transaction[];
  exchanges?: Exchange[];
  fraudAttempts?: FraudAttempt[];
  artworkPurchases?: ArtworkPurchase[];
  artistCategorySubmissions?: ArtistCategorySubmission[];
};