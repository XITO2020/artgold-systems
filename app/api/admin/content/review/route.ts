import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { reviewContent } from '~/content-validation';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { contentId, isArtwork, baseValue, notes } = await req.json();

    const result = await reviewContent(
      contentId,
      session.user.id,
      isArtwork,
      baseValue,
      notes
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Content review error:', error);
    return NextResponse.json(
      { error: 'Failed to review content' },
      { status: 500 }
    );
  }
}