import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@lib/db';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [
    pendingValidations,
    recentArtworks,
    userStats,
    fraudAttempts
  ] = await Promise.all([
    // Get pending validations
    prisma.artworkValidation.count({
      where: { status: 'PENDING_REVIEW' }
    }),

    // Get recent artworks
    prisma.artwork.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { artist: true }
    }),

    // Get user statistics
    prisma.user.aggregate({
      _count: { id: true },
      _sum: { 
        balance: true,
        artworkCount: true
      }
    }),

    // Get recent fraud attempts
    prisma.fraudAttempt.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ]);

  return NextResponse.json({
    pendingValidations,
    recentArtworks,
    userStats: {
      totalUsers: userStats._count.id,
      totalBalance: userStats._sum.balance,
      totalArtworks: userStats._sum.artworkCount
    },
    fraudAttempts
  });
}