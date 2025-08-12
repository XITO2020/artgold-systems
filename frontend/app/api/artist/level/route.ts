import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '~/db';
import { reviewContent } from '~/content-validation';
import { ArtCategory } from 'T/artwork';

interface ArtworkData {
  id: string;
  category: ArtCategory;
  title: string;
  serialNumber: string;
  qrCode: string;
  imageUrl: string;
  location: Record<string, any>;
  dimensions: Record<string, any>;
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const artworkData = await req.json() as ArtworkData;
    const artist = await prisma.user.findUnique({
      where: { id: session.user.id },
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
    
    // Check if artist has artwork in this category
    const isFirst = !artist?.artworks.some(art => 
      art.category === artworkData.category
    );

    // Create artwork
    const updatedArtist = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        artworkCount: { increment: 1 },
        artworks: {
          create: {
            ...artworkData,
            points: isFirst ? 10 : 0,
            isFirst
          }
        }
      },
      include: {
        artworks: true
      }
    });

    return NextResponse.json({
      success: true,
      artist: updatedArtist
    });
  } catch (error) {
    console.error('Error updating artist level:', error);
    return NextResponse.json(
      { error: 'Failed to update artist level' },
      { status: 500 }
    );
  }
}