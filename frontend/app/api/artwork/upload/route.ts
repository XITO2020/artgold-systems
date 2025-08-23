import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import apiClient from '@lib/db/prisma';
import { validateArtworkContent } from '@lib/admin';
import { generateQRCode, generateSerialNumber } from '@lib/artwork';

export async function POST(req: Request) {
  try {
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

    const { title, description, category, ipfsCid } = await req.json();

    // Optionally validate content before sending to backend
    // await validateArtworkContent({ title, description, category });

    // Prepare identifiers required by backend
    const id = crypto.randomUUID();
    const serialNumber = await generateSerialNumber();
    const qrCode = await generateQRCode(serialNumber);

    // Create artwork via backend API; backend handles media record creation
    const artwork = await apiClient.post(`/users/${userId}/artworks`, {
      id,
      title,
      description,
      category,
      serialNumber,
      qrCode,
      imageUrl: ipfsCid,
      location: { latitude: 0, longitude: 0, address: 'Digital Content' },
      dimensions: { width: 1920, height: 1080, unit: 'px' },
      points: 0,
      isFirst: true
    });

    // Update artist level
    await fetch('/api/artist/level', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        artworkId: artwork.id,
      }),
    });

    return NextResponse.json({
      success: true,
      artwork
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload artwork' },
      { status: 500 }
    );
  }
}