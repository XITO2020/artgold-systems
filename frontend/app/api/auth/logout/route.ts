import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/jwt';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    removeAuthCookie();
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
