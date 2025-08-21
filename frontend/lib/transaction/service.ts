import { apiClient } from '../db/prisma';
import { validateTransaction } from './validation';
import type { CreateTransactionParams, TransactionStatus } from './types';

export class TransactionService {
  async createTransaction(params: CreateTransactionParams) {
    // Validate transaction
    const validation = await validateTransaction(params);
    if (!validation.isValid) {
      throw new Error(`Invalid transaction: ${validation.errors.join(', ')}`);
    }

    // Create transaction via backend API
    const transaction = await apiClient.post('/transactions', {
      userId: params.userId,
      type: params.type,
      amount: params.amount,
      status: 'PENDING',
      paymentId: params.paymentId,
      metadata: params.metadata ?? null
    });

    return transaction;
  }

  async updateStatus(id: string, status: TransactionStatus) {
    return await apiClient.put(`/transactions/${id}/status`, { status });
  }

  async getTransactionHistory(userId: string) {
    const qs = new URLSearchParams({ userId });
    return await apiClient.get(`/transactions/history?${qs.toString()}`);
  }

  async getTransactionStats(userId: string) {
    const qs = new URLSearchParams({ userId });
    return await apiClient.get(`/transactions/stats?${qs.toString()}`);
  }
}

export const transactionService = new TransactionService();