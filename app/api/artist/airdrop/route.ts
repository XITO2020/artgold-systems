import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { isAirdropEligible, calculateAirdropAmount } from '@/lib/artist-level';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const artist = await prisma.artist.findUnique({
      where: { userId: session.user.id }
    });

    if (!artist || !isAirdropEligible(artist.level)) {
      return NextResponse.json(
        { error: 'Not eligible for airdrop' },
        { status: 400 }
      );
    }

    const airdropAmount = calculateAirdropAmount(artist.level);

    // Implement token transfer logic here
    // This is a placeholder for the actual token transfer
    console.log(`Airdropping ${airdropAmount} TABZ to artist ${artist.id}`);

    return NextResponse.json({
      success: true,
      amount: airdropAmount
    });
  } catch (error) {
    console.error('Error processing airdrop:', error);
    return NextResponse.json(
      { error: 'Failed to process airdrop' },
      { status: 500 }
    );
  }
}