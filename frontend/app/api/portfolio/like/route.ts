import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@LIB/db';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { itemId } = await req.json();

    // Check if user already liked the item
    const existingLike = await prisma.portfolioLike.findUnique({
      where: {
        userId_itemId: {
          userId: session.user.id,
          itemId
        }
      }
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error adding likes:', error);
    return NextResponse.json(
      { error: 'Failed to add likes' },
      { status: 500 }
    );
  }
};    