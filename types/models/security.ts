import { User } from '@prisma/client';

export interface FraudAttempt {
  id: string;
  userId: string;
  type: FraudType;
  confidence: number;
  details: Record<string, any>;
  createdAt: Date;
  
  // Relations
  user?: User;
}

export interface AIDetectionLog {
  id: string;
  confidence: number;
  patterns: string[];
  warnings: string[];
  scores: Record<string, number>;
  createdAt: Date;
}

export type FraudType = 'AI_GENERATED' | 'DUPLICATE' | 'PRINT';