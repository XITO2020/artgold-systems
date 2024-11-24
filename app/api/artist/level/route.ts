import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { calculatePoints, calculateLevel, isAirdropEligible, calculateNextAirdropThreshold } from '@/lib/artist-level';
import { ArtCategory } from '@/types/artwork';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { category, artworkId } = await req.json();

    const artist = await prisma.artist.findUnique({
      where: { userId: session.user.id },
      include: { artworks: true }
    });

    const isFirst = !artist?.artworks.some(art<artist?.artwork> => art.category === category);
    const points = calculatePoints(category as ArtCategory, isFirst);

    const updatedArtist = await prisma.artist.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        level: calculateLevel(points),
        totalPoints: points,
        artworks: {
          create: {
            id: artworkId,
            category,
            isFirst,
            points
          }
        }
      },
      update: {
        totalPoints: { increment: points },
        level: calculateLevel((artist?.totalPoints || 0) + points),
        artworks: {
          create: {
            id: artworkId,
            category,
            isFirst,
            points
          }
        }
      }
    });

    return NextResponse.json({
      level: updatedArtist.level,
      totalPoints: updatedArtist.totalPoints,
      isAirdropEligible: isAirdropEligible(updatedArtist.level),
      nextThreshold: calculateNextAirdropThreshold(updatedArtist.level)
    });
  } catch (error) {
    console.error('Error updating artist level:', error);
    return NextResponse.json(
      { error: 'Failed to update artist level' },
      { status: 500 }
    );
  }
}