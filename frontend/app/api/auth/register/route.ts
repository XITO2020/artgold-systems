import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists in Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Create user in Prisma
    const user = await prisma.user.create({
      data: {
        email,
        name,
        balance: 0,
        artworkCount: 0,
        isAdmin: false,
        status: 'ACTIVE',
      }
    });

    // Create Supabase auth user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
      options: {
        data: {
          userId: user.id,
          name,
        }
      }
    });

    if (authError) {
      // Rollback Prisma user creation if Supabase fails
      await prisma.user.delete({
        where: { id: user.id }
      });
      throw authError;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}