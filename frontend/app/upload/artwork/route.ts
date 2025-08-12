import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@LIB/db';
import { validateArtworkContent } from '@LIB/admin';
import { generateQRCode, generateSerialNumber } from '@LIB/artwork';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const image = formData.get('image') as File;
    const location = JSON.parse(formData.get('location') as string);
    const dimensions = JSON.parse(formData.get('dimensions') as string);
    const weight = JSON.parse(formData.get('weight') as string);
    const materials = JSON.parse(formData.get('materials') as string);

    // Upload image to Supabase Storage
    const { data: imageData, error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(`${session.user.id}/${Date.now()}-${image.name}`, image);

    if (uploadError) {
      throw new Error('Failed to upload image');
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artworks/${imageData.path}`;

    // Validate content
    const validation = await validateArtworkContent(image);
    if (!validation.isValid) {
      return NextResponse.json({
        error: validation.reason
      }, { status: 400 });
    }

    // Generate unique identifiers
    const serialNumber = await generateSerialNumber();
    const qrCode = await generateQRCode(serialNumber);

    // Create artwork record
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
        points: 0, // Will be calculated based on category
        isFirst: true, // Will be updated by the level system
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