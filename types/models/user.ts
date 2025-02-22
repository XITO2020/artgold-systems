import { Account, Session, Artwork, Token, Transaction, Exchange, FraudAttempt, ArtworkPurchase, ArtistCategorySubmission } from '@prisma/client';

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  balance: number;
  artworkCount: number;
  isAdmin: boolean;
  status: UserStatus;
  discordVerified: boolean;
  discordRoles: string[];
  createdAt: Date;
  updatedAt: Date;
  
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
}

export type UserStatus = 'ACTIVE' | 'FROZEN' | 'BANNED';