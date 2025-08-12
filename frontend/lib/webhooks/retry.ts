
import { prisma } from '../db';
import { processWebhook } from './processors';

export async function processRetries() {
  const now = new Date();
  
  const retries = await prisma.webhookRetry.findMany({
    where: {
      nextAttempt: {
        lte: now
      },
      attempts: {
        lt: 3
      }
    }
  });

  for (const retry of retries) {
    try {
      const event = await prisma.webhookEvent.findUnique({
        where: { id: retry.eventId }
      });

      if (!event) continue;

      await processWebhook(event, event.provider);

      // Success - delete retry record
      await prisma.webhookRetry.delete({
        where: { id: retry.id }
      });
    } catch (error) {
      // Update retry count and next attempt
      await prisma.webhookRetry.update({
        where: { id: retry.id },
        data: {
          attempts: retry.attempts + 1,
          nextAttempt: new Date(Date.now() + Math.pow(2, retry.attempts + 1) * 60 * 1000) // Exponential backoff
        }
      });
    }
  }
}
