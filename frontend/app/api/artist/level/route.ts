import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import apiClient from '@lib/db/prisma';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch latest artist level/state from backend
    const artist = await apiClient.get(`/users/${session.user.id}/level`);
    return NextResponse.json({ success: true, artist });
  } catch (error) {
    console.error('Error updating artist level:', error);
    return NextResponse.json(
      { error: 'Failed to update artist level' },
      { status: 500 }
    );
  }
}