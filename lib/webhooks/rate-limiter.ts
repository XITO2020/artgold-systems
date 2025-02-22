
import { Redis } from 'ioredis';
import { SECURITY_CONFIG } from '../config';

const redis = new Redis(process.env.REDIS_URL);

export class WebhookRateLimiter {
  private readonly window: number;
  private readonly max: number;

  constructor() {
    this.window = SECURITY_CONFIG.rateLimit.window;
    this.max = SECURITY_CONFIG.rateLimit.max;
  }

  async isAllowed(provider: string): Promise<boolean> {
    const key = `webhook:${provider}:count`;
    const now = Date.now();

    const multi = redis.multi();
    multi.zremrangebyscore(key, 0, now - this.window);
    multi.zadd(key, now, now.toString());
    multi.zcard(key);
    
    const [, , count] = await multi.exec();
    
    return (count as number) <= this.max;
  }

  async recordAttempt(provider: string): Promise<void> {
    const key = `webhook:${provider}:count`;
    const now = Date.now();
    
    await redis.zadd(key, now, now.toString());
    await redis.expire(key, Math.ceil(this.window / 1000));
  }
}

export const rateLimiter = new WebhookRateLimiter();
