// Frontend must NEVER access the database directly. Use the API client in `lib/db/prisma.ts`.
export function getPrismaOnFrontend(): never {
  throw new Error('Direct Prisma access is disabled on the frontend. Use apiClient in lib/db/prisma.ts');
}