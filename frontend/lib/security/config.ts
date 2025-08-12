export const SECURITY_CONFIG = {
  rateLimit: {
    window: 60 * 1000, // 1 minute
    max: 100 // requests
  },
  webhooks: {
    allowedIPs: process.env.WEBHOOK_ALLOWED_IPS?.split(',') || [],
    timeoutMs: 10000
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  },
  auth: {
    sessionDuration: 30 * 24 * 60 * 60, // 30 days
    passwordMinLength: 8,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16
  }
};