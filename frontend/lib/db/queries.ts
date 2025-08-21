import { apiClient } from './prisma';
import { ArtCategory } from '@t/artwork';

export async function getArtistLevel(userId: string) {
  // Délégué au backend
  return await apiClient.get(`/users/${userId}/level`);
}

export async function getArtistArtworks(userId: string, category?: ArtCategory) {
  const qs = new URLSearchParams();
  if (category) qs.set('category', String(category));
  return await apiClient.get(`/users/${userId}/artworks?${qs.toString()}`);
}