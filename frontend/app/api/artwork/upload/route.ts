import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '~/db';
import { validateArtworkContent } from '~/admin';
import { generateQRCode, generateSerialNumber } from '~/artwork';
import { pinFileToIPFS } from '$/services/pinataServices';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, category, ipfsCid } = await req.json();

    // Generate serial number first
    const serialNumber = await generateSerialNumber();
    const qrCode = await generateQRCode(serialNumber);

    // Create artwork record with IPFS media reference
    const artwork = await prisma.artwork.create({
      data: {
        title,
        description,
        category,
        serialNumber,
        qrCode,
        imageId: ipfsCid,
        location: { latitude: 0, longitude: 0, address: "Digital Content" },
        dimensions: { width: 1920, height: 1080, unit: "px" },
        artistId: session.user.id,
        points: 0,
        isFirst: true,
        currentValue: 0
      },
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