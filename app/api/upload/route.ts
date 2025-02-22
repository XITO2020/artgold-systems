import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '~/db';
import { validateArtworkContent } from '~/admin';
import { generateQRCode, generateSerialNumber } from '~/artwork';
import { ArtCategory } from 'T/artwork';
import { pinFileToIPFS } from '~/pinata';
import { IPFSStatus } from '~/media-upload'; // Import from our local enum

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as ArtCategory;
    const image = formData.get('image') as File;
    const location = JSON.parse(formData.get('location') as string);
    const dimensions = JSON.parse(formData.get('dimensions') as string);
    const weight = JSON.parse(formData.get('weight') as string);
    const materials = JSON.parse(formData.get('materials') as string);

    // Validate content
    const validation = await validateArtworkContent(image);
    if (!validation.isValid) {
      return NextResponse.json({
        error: validation.reason
      }, { status: 400 });
    }

    // Convert File to Buffer for IPFS upload
    const buffer = Buffer.from(await image.arrayBuffer());

    // Upload to IPFS via Pinata
    const pinataResponse = await pinFileToIPFS(buffer, image.name, {
      userId: session.user.id,
      artworkTitle: title,
      category
    });

    // Create IPFS media record
    const media = await prisma.iPFSMedia.create({
      data: {
        cid: pinataResponse.IpfsHash,
        filename: image.name,
        mimeType: image.type,
        size: pinataResponse.PinSize,
        status: IPFSStatus.UPLOADED,
        url: `https://gateway.pinata.cloud/ipfs/${pinataResponse.IpfsHash}`
      }
    });

    // Generate unique identifiers
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
        imageId: media.id, // Use imageId field directly
        location,
        dimensions,
        weight,
        materials,
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
      artwork,
      serialNumber,
      qrCode,
      mediaId: media.id
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload artwork' },
      { status: 500 }
    );
  }
}