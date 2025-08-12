
import { prisma } from '../db';
import { WebhookEvent } from './types';

export class WebhookErrorHandler {
  async logError(error: Error, event?: WebhookEvent) {
    await prisma.webhookError.create({
      data: {
        message: error.message,
        stack: error.stack,
        eventId: event?.id,
        eventType: event?.type,
        timestamp: new Date()
      }
    });
  }

  async handleDuplicateEvent(event: WebhookEvent) {
    console.warn(`Duplicate webhook event received: ${event.id}`);
    // No action needed - idempotency is maintained
  }

  async handleValidationError(error: Error, event: WebhookEvent) {
    await this.logError(error, event);
    throw new Error(`Webhook validation failed: ${error.message}`);
  }

  async handleProcessingError(error: Error, event: WebhookEvent) {
    await this.logError(error, event);
    
    // Determine if the error is retryable
    const isRetryable = !error.message.includes('PERMANENT_');
    
    if (isRetryable) {
      await prisma.webhookRetry.create({
        data: {
          eventId: event.id,
          attempts: 0,
          maxAttempts: 3,
          nextAttempt: new Date(Date.now() + 5 * 60 * 1000) // Retry in 5 minutes
        }
      });
    }

    throw error;
  }
}

export const webhookErrorHandler = new WebhookErrorHandler();
