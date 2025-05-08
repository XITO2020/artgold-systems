import { User } from '@prisma/client';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  paymentId: string | null;
  orderId: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
}

export type TransactionType = 'PURCHASE' | 'SALE' | 'EXCHANGE' | 'CONVERSION' | 'AIRDROP';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Exchange {
  id: string;
  userId: string;
  fromToken: TransactionTokenType;
  toToken: CryptoToken;
  amount: number;
  receivedAmount: number;
  walletAddress: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
}

export type TransactionTokenType = 'TABZ' | 'AGT';
export type CryptoToken = 'ETH' | 'SOL';