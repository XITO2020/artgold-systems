import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import apiClient from '@lib/db/prisma';
import { validateArtworkContent } from '@lib/admin';
import { generateQRCode, generateSerialNumber } from '@lib/artwork';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, category, ipfsCid } = await req.json();

    // Optionally validate content before sending to backend
    // await validateArtworkContent({ title, description, category });

    // Prepare identifiers required by backend
    const id = crypto.randomUUID();
    const serialNumber = await generateSerialNumber();
    const qrCode = await generateQRCode(serialNumber);

    // Create artwork via backend API; backend handles media record creation
    const artwork = await apiClient.post(`/users/${session.user.id}/artworks`, {
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