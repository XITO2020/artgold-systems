import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function deriveRoles(userId: string, isAdmin: boolean) {
  const [artworks, portfolio, artistSub, purchases, artPurchases, tokens] = await Promise.all([
    prisma.artwork.count({ where: { artistId: userId } }),
    prisma.portfolioItem.count({ where: { userId } }),
    prisma.artistCategorySubmission.count({ where: { userId } }),
    prisma.purchase.count({ where: { userId } }),
    prisma.artworkPurchase.count({ where: { buyerId: userId } }),
    prisma.token.aggregate({ where: { userId, amount: { gt: 0 } }, _sum: { amount: true } }),
  ]);

  const roles = new Set<string>();
  roles.add("member");
  const tokenSum = tokens._sum.amount ? Number(tokens._sum.amount) : 0;
  if (isAdmin) roles.add("admin");
  if (artworks > 0 || portfolio > 0 || artistSub > 0) roles.add("creator");
  if (purchases > 0 || artPurchases > 0 || tokenSum > 0) roles.add("buyer");

  return Array.from(roles);
}
