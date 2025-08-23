// app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@lib/db';
import { verifyToken } from '@/lib/jwt';
import {
  createArtistCategorySubmission,
  getExistingSubmission,
} from '@t/artistCategorySubmission';

export async function POST(request: Request) {
  try {
    // 1) Vérification du token JWT
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string' || !decoded.id) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }
    
    const userId: string = decoded.id;

    // 2) Body + validations
    const body = await request.json().catch(() => null as any);
    const rawImageUrl = body?.imageUrl;
    const rawCategoryId = body?.categoryId;

    const imageUrl = typeof rawImageUrl === 'string' ? rawImageUrl.trim() : '';
    // Les helpers attendent un number → on convertit proprement
    const categoryIdNum =
      typeof rawCategoryId === 'number'
        ? rawCategoryId
        : Number(typeof rawCategoryId === 'string' ? rawCategoryId.trim() : NaN);

    if (!imageUrl) {
      return NextResponse.json({ error: 'missing_imageUrl' }, { status: 400 });
    }
    if (!Number.isInteger(categoryIdNum) || categoryIdNum <= 0) {
      return NextResponse.json({ error: 'invalid_categoryId' }, { status: 400 });
    }

    // 3) Doublon ?
    const existing = await getExistingSubmission(prisma, userId, categoryIdNum);
    if (existing) {
      return NextResponse.json(
        { error: 'already_submitted', submission: existing },
        { status: 409 }
      );
    }

    // 4) Création
    const submission = await createArtistCategorySubmission(
      prisma,
      userId,
      imageUrl,
      categoryIdNum
    );

    return NextResponse.json({ submission }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'server_error', detail: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
