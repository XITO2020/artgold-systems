import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { detectAIArtwork } from '@lib/ai-detection';
import { prisma } from '@lib/db';

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

    const { artworkData, imageBuffer } = await req.json();

    // Run AI validation checks
    const aiAnalysis = await detectAIArtwork(Buffer.from(imageBuffer));

    if (aiAnalysis.isAIGenerated) {
      // Record fraud attempt
      await prisma.fraudAttempt.create({
        data: {
          userId: userId,
          type: 'AI_GENERATED',
          confidence: aiAnalysis.confidence,
          details: aiAnalysis.details
        }
      });

      // Freeze user account
      await prisma.user.update({
        where: { id: userId },
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