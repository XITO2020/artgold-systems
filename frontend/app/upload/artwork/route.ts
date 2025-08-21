// frontend/app/upload/artwork/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import { prisma } from '@lib/db';
import { validateArtworkContent } from '@lib/admin';
import { generateQRCode, generateSerialNumber } from '@lib/artwork';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const title = String(formData.get('title') || '');
    const description = String(formData.get('description') || '');
    const category = String(formData.get('category') || '');
    const image = formData.get('image') as File | null;

    if (!title || !description || !category || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // champs JSON optionnels
    const safeParseJson = <T = any>(raw: FormDataEntryValue | null): T | null => {
      if (!raw) return null;
      try { return JSON.parse(String(raw)) as T; } catch { return null; }
    };

    const location = safeParseJson(formData.get('location'));
    const dimensions = safeParseJson(formData.get('dimensions'));
    const weight = safeParseJson(formData.get('weight'));
    const materials = safeParseJson(formData.get('materials'));

    // ===== Upload local (dev) =====
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = (image.name.split('.').pop() || 'bin').toLowerCase();
    const filename = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'artworks', session.user.id);
    await fs.mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const imageUrl = `${baseUrl}/uploads/artworks/${session.user.id}/${filename}`;

    // ===== Validation de contenu (si tu veux vérifier l’image) =====
    const validation = await validateArtworkContent(image);
    if (!validation?.isValid) {
      return NextResponse.json({ error: validation?.reason || 'Invalid content' }, { status: 400 });
    }

    // ===== Identifiants uniques =====
    const serialNumber = await generateSerialNumber();
    const qrCode = await generateQRCode(serialNumber);

    // ===== Création en base =====
    const artwork = await prisma.artwork.create({
      data: {
        title,
        description,
        category,
        serialNumber,
        qrCode,
        imageUrl,
        location,
        dimensions,
        weight,
        materials,
        artistId: session.user.id,
        points: 0, // à calculer selon ta logique
        isFirst: true, // idem
      },
    });

    // Ex: mise à jour du niveau artiste (si ta route existe côté front)
    try {
      await fetch(`${baseUrl}/api/artist/level`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, artworkId: artwork.id }),
      });
    } catch (e) {
      // ne bloque pas l’upload si ça échoue
      console.warn('artist/level call failed:', e);
    }

    return NextResponse.json({
      success: true,
      artwork,
      serialNumber,
      qrCode,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload artwork' },
      { status: 500 }
    );
  }
}
