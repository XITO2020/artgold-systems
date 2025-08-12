import { NextResponse } from 'next/server';
import { addUncannyStamp } from '~/ai-detection';

export async function POST(req: Request) {
  try {
    const { imageBuffer } = await req.json();

    // Add uncanny stamp to the image
    const stampedImage = await addUncannyStamp(Buffer.from(imageBuffer));

    return NextResponse.json({
      success: true,
      stampedImage: stampedImage.toString('base64')
    });
  } catch (error) {
    console.error('Error adding stamp:', error);
    return NextResponse.json(
      { error: 'Failed to add stamp to image' },
      { status: 500 }
    );
  }
}