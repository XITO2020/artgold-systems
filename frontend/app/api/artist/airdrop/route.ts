import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getArtistLevel } from '~/db/queries';
import { processAirdrop } from '~/db/mutations';
import { isAirdropEligible, calculateAirdropAmount } from '~/artist-level';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const artist = await getArtistLevel(session.user.id);

    if (!artist || !isAirdropEligible(artist.artworkCount)) {
      return NextResponse.json(
        { error: 'Not eligible for airdrop' },
        { status: 400 }
      );
    }

    const airdropAmount = calculateAirdropAmount(artist.artworkCount);
    
    // Process airdrop with transaction
    await processAirdrop(artist.id, airdropAmount);

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