import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { validateArtworkContent } from '@/lib/admin';

export async function POST(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { artworkId, action, reason } = await req.json();

    if (action === 'reject') {
      // Record rejection
      await rejectArtwork(artworkId, reason);
      
      return NextResponse.json({
        success: true,
        message: 'Artwork rejected successfully'
      });
    }

    if (action === 'approve') {
      // Validate content before approval
      const validation = await validateArtworkContent(artworkId);
      
      if (!validation.isValid) {
        return NextResponse.json({
          success: false,
          error: validation.reason
        }, { status: 400 });
      }

      // Record approval
      await approveArtwork(artworkId);
      
      return NextResponse.json({
        success: true,
        message: 'Artwork approved successfully'
      });
    }

    return NextResponse.json({
      error: 'Invalid action'
    }, { status: 400 });
  } catch (error) {
    console.error('Moderation error:', error);
    return NextResponse.json(
      { error: 'Moderation action failed' },
      { status: 500 }
    );
  }
}

async function rejectArtwork(artworkId: string, reason: string) {
  // Implement rejection logic
}

async function approveArtwork(artworkId: string) {
  // Implement approval logic
}