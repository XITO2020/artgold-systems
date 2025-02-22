import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { likeContent } from '~/content-validation';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { contentId } = await req.json();
    const result = await likeContent(contentId, session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Like content error:', error);
    return NextResponse.json(
      { error: 'Failed to like content' },
      { status: 500 }
    );
  }
}