import { apiClient } from './prisma';
import type { ArtCategory } from '@t/artwork';

export async function createArtwork(
  userId: string,
  data: {
    id: string;
    category: ArtCategory;
    title: string;
    serialNumber: string;
    qrCode: string;
    imageUrl: string;
    location: Record<string, any>;
    dimensions: Record<string, any>;
    points: number;
    isFirst: boolean;
  }
) {
  return await apiClient.post(`/users/${userId}/artworks`, data);
}

export async function processAirdrop(
  userId: string,
  amount: number
) {
  return await apiClient.post(`/users/${userId}/airdrop`, { amount });
}