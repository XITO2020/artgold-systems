import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { detectAIArtwork } from '~/ai-detection';
import { prisma } from '~/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { artworkData, imageBuffer } = await req.json();

    // Run AI validation checks
    const aiAnalysis = await detectAIArtwork(Buffer.from(imageBuffer));

    if (aiAnalysis.isAIGenerated) {
      // Record fraud attempt
      await prisma.fraudAttempt.create({
        data: {
          userId: session.user.id,
          type: 'AI_GENERATED',
          confidence: aiAnalysis.confidence,
          details: aiAnalysis.details
        }
      });

      // Freeze user account
      await prisma.user.update({
        where: { id: session.user.id },
        data: { status: 'FROZEN' }
      });

      return NextResponse.json({
        success: false,
        error: 'AI-generated artwork detected',
        consequences: {
          accountFrozen: true,
          legalAction: true,
          assetsForfeited: true
        }
      }, { status: 403 });
    }

    // Record validation result
    await prisma.artworkValidation.create({
      data: {
        artworkId: artworkData.id,
        aiScore: aiAnalysis.confidence,
        patterns: aiAnalysis.details.patterns,
        status: 'PENDING_HUMAN_REVIEW'
      }
    });

    return NextResponse.json({
      success: true,
      status: 'pending_human_review',
      aiAnalysis
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Validation process failed' },
      { status: 500 }
    );
  }
}