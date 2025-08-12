import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '~/db';

export async function GET() {
  try {
    const memes = await prisma.memeralReserve.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(memes);
  } catch (error) {
    console.error('Error fetching memeral reserve:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memeral reserve' },
      { status: 500 }
    );
  }
}