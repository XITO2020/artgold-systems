import { User } from '@prisma/client';

export interface Token {
  id: string;
  userId: string;
  type: TokenType;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  lockedUntil: Date;
  
  // Relations
  user?: User;
}

export type TokenType = 'TABZ' | 'AGT';