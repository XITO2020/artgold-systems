import { prisma } from './prisma';
import { ArtCategory } from 'T/artist';
import type { User, Artwork } from '@prisma/client';

export async function getArtistLevel(userId: string): Promise<(User & {
  artworks: Pick<Artwork, 'id' | 'category' | 'points' | 'createdAt'>[];
}) | null> {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      artworks: {
        select: {
          id: true,
          category: true,
          points: true,
          createdAt: true
        }
      }
    }
  });
}


export async function getArtistArtworks(userId: string, category?: ArtCategory) {
  return await prisma.artwork.findMany({
    where: {
      artistId: userId,
      ...(category && { category })
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}