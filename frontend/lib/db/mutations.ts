import { prisma } from './prisma';
import type { Prisma } from '@prisma/client';
import type { ArtCategory } from 'T/artwork';
import type { TransactionType } from 'T/models/transaction';

export async function createArtwork(
  userId: string,
  data: {
    id: string;
    category: ArtCategory;
    title: string;
    serialNumber: string;
    qrCode: string;
    imageUrl: string;
    location: Prisma.InputJsonValue;
    dimensions: Prisma.InputJsonValue;
    points: number;
    isFirst: boolean;
  }
) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      artworkCount: { increment: 1 },
      artworks: {
        create: {
          id: data.id,
          category: data.category,
          title: data.title,
          serialNumber: data.serialNumber,
          qrCode: data.qrCode,
          imageUrl: data.imageUrl,
          location: data.location,
          dimensions: data.dimensions,
          points: data.points,
          isFirst: data.isFirst,
          currentValue: 0,
          totalLikes: 0,
          status: 'PENDING',
          createdAt: new Date()
        }
      }
    },
    include: {
      artworks: true
    }
  });
}

export async function processAirdrop(
  userId: string,
  amount: number
) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        balance: { increment: amount }
      }
    });

    await tx.transaction.create({
      data: {
        userId,
        type: 'AIRDROP' as TransactionType,
        amount,
        status: 'COMPLETED'
      }
    });

    return user;
  });
}