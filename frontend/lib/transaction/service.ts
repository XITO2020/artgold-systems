import { prisma } from '../db';
import { validateTransaction } from './validation';
import type { CreateTransactionParams, TransactionStatus } from './types';
import type { Prisma } from '@prisma/client';

export class TransactionService {
  async createTransaction(params: CreateTransactionParams) {
    // Validate transaction
    const validation = await validateTransaction(params);
    if (!validation.isValid) {
      throw new Error(`Invalid transaction: ${validation.errors.join(', ')}`);
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: params.userId,
        type: params.type as Prisma.TransactionCreateInput['type'],
        amount: params.amount,
        status: 'PENDING',
        paymentId: params.paymentId,
        metadata: params.metadata as Prisma.JsonObject || null
      }
    });

    return transaction;
  }

  async updateStatus(id: string, status: TransactionStatus) {
    return await prisma.transaction.update({
      where: { id },
      data: { 
        status: status as Prisma.TransactionUpdateInput['status']
      }
    });
  }

  async getTransactionHistory(userId: string) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true
      }
    });
  }

  async getTransactionStats(userId: string) {
    const stats = await prisma.transaction.groupBy({
      by: ['type'],
      where: { 
        userId,
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      },
      _count: true
    });

    return stats;
  }
}

export const transactionService = new TransactionService();