import { apiClient } from '@lib/db/prisma';
import { ArtCategory } from '@t/artwork';
import { POINTS_SYSTEM } from './artist-level';

interface CategoryStats {
  totalArtworks: number;
  uniqueArtists: number;
  averageValue: number;
  popularityScore: number;
}

export async function getCategoryStats(category: ArtCategory): Promise<CategoryStats> {
  return apiClient.get(`/categories/${category}/stats`);
}

export async function getArtistCategoryProgress(userId: string): Promise<Record<ArtCategory, number>> {
  const artworks: Array<{ category: ArtCategory; _count: { _all: number } }> = await apiClient.get(`/users/${userId}/category-progress`);

  const progress: Record<ArtCategory, number> = Object.keys(POINTS_SYSTEM).reduce((acc, c) => {
    acc[c as ArtCategory] = 0;
    return acc;
  }, {} as Record<ArtCategory, number>);

  artworks.forEach(({ category, _count }) => {
    if (category in POINTS_SYSTEM) {
      progress[category as ArtCategory] = _count._all;
    }
  });

  return progress;
}

export async function getTopArtistsInCategory(category: ArtCategory, limit = 10) {
  return apiClient.get(`/categories/${category}/top-artists?limit=${limit}`);
}

export async function suggestNextCategory(userId: string): Promise<ArtCategory> {
  const data = await apiClient.get(`/users/${userId}/suggest-next-category`);
  return data?.category as ArtCategory;
}