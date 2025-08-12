import { CreatePaymentParams } from './types';
import { PAYMENT_CONFIG } from './config';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateTransaction(params: CreatePaymentParams): ValidationResult {
  const errors: string[] = [];

  // Validate amount
  if (params.amount < PAYMENT_CONFIG.minimumAmount) {
    errors.push(`Amount must be at least ${PAYMENT_CONFIG.minimumAmount}`);
  }
  if (params.amount > PAYMENT_CONFIG.maximumAmount) {
    errors.push(`Amount cannot exceed ${PAYMENT_CONFIG.maximumAmount}`);
  }

  // Validate currency
  if (!PAYMENT_CONFIG.currencies.includes(params.currency.toUpperCase())) {
    errors.push('Invalid currency');
  }

  // Validate metadata
  if (!params.metadata.userId) {
    errors.push('User ID is required');
  }

  // Validate payment type
  if (!['artwork', 'token'].includes(params.type)) {
    errors.push('Invalid payment type');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}