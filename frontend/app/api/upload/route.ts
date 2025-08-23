import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@lib/db';
import { validateArtworkContent } from '@lib/admin';
import { generateQRCode, generateSerialNumber } from '@lib/artwork';
import { ArtCategory } from '@t/artwork';
import { pinFileToIPFS } from '@/services/pinataServices';

export async function POST(req: Request) {
  try {
    // Vérification du token JWT
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string' || !decoded.id) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }
    const userId = decoded.id;

    const formData = await req.formData();
    
    // Récupération et validation des champs requis
    const title = String(formData.get('title') || '');
    const description = String(formData.get('description') || '');
    const category = formData.get('category') as ArtCategory | null;
    const image = formData.get('image');
    
    // Vérification des champs requis
    if (!title || !description || !category || !(image instanceof File)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Parsing des champs JSON
    let location, dimensions, weight, materials;
    
    try {
      location = formData.get('location') ? 
        JSON.parse(String(formData.get('location'))) : 
        null;
      dimensions = formData.get('dimensions') ? 
        JSON.parse(String(formData.get('dimensions'))) : 
        null;
      weight = formData.get('weight') ? 
        JSON.parse(String(formData.get('weight'))) : 
        null;
      materials = formData.get('materials') ? 
        JSON.parse(String(formData.get('materials'))) : 
        [];
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON data in form fields' },
        { status: 400 }
      );
    }

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
    const pinataResponse = await pinFileToIPFS(buffer, image.name || 'artwork', {
      userId: String(userId),
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
        status: 'UPLOADED',
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
        userId: userId,
        points: 0,
        isFirst: true,
        currentValue: 0
      },
    });

    // Update artist level
    await fetch('/api/artist/level', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
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