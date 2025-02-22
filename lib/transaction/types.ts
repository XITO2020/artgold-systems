import type { Prisma } from '@prisma/client';

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type TransactionType = 'PURCHASE' | 'SALE' | 'EXCHANGE' | 'CONVERSION' | 'AIRDROP';

export interface TransactionMetadata {
  artworkId?: string;
  tokenType?: 'TABZ' | 'AGT';
  provider?: 'stripe' | 'paypal' | 'crypto';
  exchangeRate?: number;
  walletAddress?: string;
  [key: string]: any; // Allow additional properties
}

export interface CreateTransactionParams {
  userId: string;
  type: TransactionType;
  amount: number;
  metadata?: TransactionMetadata;
  paymentId?: string;
}

export interface TransactionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}