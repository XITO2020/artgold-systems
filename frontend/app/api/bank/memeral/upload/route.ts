import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '~/db';
import { pinFileToIPFS } from '$/services/pinataServices';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const price = parseInt(formData.get('price') as string) || 1000;

    // Upload to IPFS
    const buffer = Buffer.from(await file.arrayBuffer());
    const pinataResponse = await pinFileToIPFS(buffer, file.name, {
      title,
      type: 'meme'
    });

    // Add to memeral reserve
    const meme = await prisma.memeralReserve.create({
      data: {
        memeHash: pinataResponse.IpfsHash,
        title,
        url: `https://gateway.pinata.cloud/ipfs/${pinataResponse.IpfsHash}`,
        addedBy: session.user.id,
        tabzValue: price
      }
    });

    return NextResponse.json(meme);
  } catch (error) {
    console.error('Error uploading meme:', error);
    return NextResponse.json(
      { error: 'Failed to upload meme' },
      { status: 500 }
    );
  }
}