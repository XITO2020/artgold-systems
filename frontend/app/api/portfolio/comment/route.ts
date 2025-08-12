import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@LIB/db';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { itemId, content } = await req.json();

    const comment = await prisma.portfolioComment.create({
      data: {
        content,
        userId: session.user.id,
        itemId
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}