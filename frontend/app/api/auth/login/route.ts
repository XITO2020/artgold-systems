import { NextResponse } from 'next/server';
import { login } from '@/lib/auth-service';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const { user, error } = await login(email, password);
    
    if (!user || error) {
      return NextResponse.json(
        { error: error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user);
    const response = NextResponse.json({ user });
    
    // Définir le cookie de session
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 semaine
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
