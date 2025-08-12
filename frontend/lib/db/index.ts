import { prisma } from './prisma';

// Re-export prisma instance
export { prisma };

// Export database utilities
export * from './queries.js';
export * from './mutations.js';