
import { prisma } from '../db';
import type { CreateTransactionParams, TransactionValidation } from './types';

export async function validateTransaction(
  params: CreateTransactionParams
): Promise<TransactionValidation> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check user exists
  const user = await prisma.user.findUnique({
    where: { id: params.userId }
  });

  if (!user) {
    errors.push('User not found');
    return { isValid: false, errors, warnings };
  }

  // Validate amount
  if (params.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  // Validate artwork if present
  if (params.metadata?.artworkId) {
    const artwork = await prisma.artwork.findUnique({
      where: { id: params.metadata.artworkId }
    });

    if (!artwork) {
      errors.push('Artwork not found');
    } else if (artwork.status !== 'APPROVED') {
      errors.push('Artwork not approved for transactions');
    }
  }

  // Check for duplicate payment ID
  if (params.paymentId) {
    const existingTransaction = await prisma.transaction.findFirst({
      where: { paymentId: params.paymentId }
    });

    if (existingTransaction) {
      errors.push('Duplicate payment ID');
    }
  }

  // Add warnings for large amounts
  if (params.amount > 10000) {
    warnings.push('Large transaction amount detected');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
