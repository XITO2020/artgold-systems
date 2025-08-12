import { prisma } from './db';
import { ArtCategory } from 'T/artwork';
import { POINTS_SYSTEM } from './artist-level';

interface CategoryStats {
  totalArtworks: number;
  uniqueArtists: number;
  averageValue: number;
  popularityScore: number;
}

export async function getCategoryStats(category: ArtCategory): Promise<CategoryStats> {
  const stats = await prisma.artwork.aggregate({
    where: { category },
    _count: {
      _all: true,
      artistId: true
    },
    _avg: {
      currentValue: true,
      totalLikes: true
    }
  });

  return {
    totalArtworks: stats._count._all || 0,
    uniqueArtists: stats._count.artistId || 0,
    averageValue: Number(stats._avg.currentValue) || 0,
    popularityScore: Number(stats._avg.totalLikes) || 0
  };
}

export async function getArtistCategoryProgress(userId: string): Promise<Record<ArtCategory, number>> {
  const artworks = await prisma.artwork.groupBy({
    by: ['category'],
    where: { artistId: userId },
    _count: {
      _all: true
    }
  });

  const progress: Record<string, number> = {};
  
  // Initialize all categories with 0
  Object.keys(POINTS_SYSTEM).forEach(category => {
    progress[category as ArtCategory] = 0;
  });

  // Update counts for categories with artworks
  artworks.forEach(({ category, _count }) => {
    if (category in POINTS_SYSTEM) {
      progress[category as ArtCategory] = _count._all;
    }
  });

  return progress as Record<ArtCategory, number>;
}

export async function getTopArtistsInCategory(category: ArtCategory, limit = 10) {
  return await prisma.user.findMany({
    where: {
      artworks: {
        some: { category }
      }
    },
    select: {
      id: true,
      name: true,
      artworks: {
        where: { category },
        select: {
          currentValue: true,
          totalLikes: true
        }
      },
      _count: {
        select: { artworks: true }
      }
    },
    take: limit,
    orderBy: {
      artworks: {
        _count: 'desc'
      }
    }
  });
}

export async function suggestNextCategory(userId: string): Promise<ArtCategory> {
  // Get user's current categories
  const userCategories = await prisma.artwork.findMany({
    where: { artistId: userId },
    select: { category: true }
  });

  const existingCategories = new Set(userCategories.map(a => a.category));

  // Find categories user hasn't tried yet
  const unusedCategories = Object.keys(POINTS_SYSTEM).filter(
    category => !existingCategories.has(category)
  ) as ArtCategory[];

  if (unusedCategories.length === 0) {
    // If user has tried all categories, suggest one with fewest submissions
    const leastUsedCategory = await prisma.artwork.groupBy({
      by: ['category'],
      _count: true,
      orderBy: {
        _count: {
          _all: 'asc'
        }
      },
      take: 1
    });

    return leastUsedCategory[0].category as ArtCategory;
  }

  // Suggest a random unused category
  return unusedCategories[Math.floor(Math.random() * unusedCategories.length)];
}