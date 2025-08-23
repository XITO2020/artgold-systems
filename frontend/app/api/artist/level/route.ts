import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import apiClient from '@lib/db/prisma';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
    return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
  }
  const userId = decoded.id;

  try {
    // Fetch latest artist level/state from backend
    const artist = await apiClient.get(`/users/${userId}/level`);
    return NextResponse.json({ success: true, artist });
  } catch (error) {
    console.error('Error updating artist level:', error);
    return NextResponse.json(
      { error: 'Failed to update artist level' },
      { status: 500 }
    );
  }
}