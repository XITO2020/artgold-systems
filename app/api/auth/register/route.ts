import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: crypto.randomUUID(), // Generate random password for email-only auth
      options: {
        data: {
          name,
          created_at: new Date().toISOString(),
        }
      }
    });

    if (authError) {
      throw authError;
    }

    // Create user profile in our database
    const user = await prisma.user.create({
      data: {
        id: authData.user!.id,
        email,
        name,
        emailVerified: null,
        balance: 0,
        artworkCount: 0,
        isAdmin: false,
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}