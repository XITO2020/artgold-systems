import { NextResponse } from 'next/server';
import { cleanupInactiveContent } from '@LIB/content-cleanup';
import { prisma } from '@LIB/db';

// Constants for cleanup configuration
const CLEANUP_CONFIG = {
  INACTIVE_DAYS: 90,
  MIN_LIKES: 100,
  MAX_BATCH_SIZE: 100,
  RETENTION_CATEGORIES: ['masterpiece', 'historical', 'featured'],
  PROTECTED_STATUSES: ['SOLD', 'FEATURED', 'MASTERPIECE']
};

// Interface for cleanup results
interface CleanupResult {
  deletedCount: number;
  archivedCount: number;
  notifiedUsers: string[];
  errors: string[];
}

export async function POST(req: Request) {
  try {
    // Verify CRON secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get cleanup parameters from request if provided
    const params = await req.json().catch(() => ({}));
    const dryRun = params.dryRun || false;
    const batchSize = Math.min(params.batchSize || CLEANUP_CONFIG.MAX_BATCH_SIZE, CLEANUP_CONFIG.MAX_BATCH_SIZE);

    // Initialize cleanup result
    const result: CleanupResult = {
      deletedCount: 0,
      archivedCount: 0,
      notifiedUsers: [],
      errors: []
    };

    // Run cleanup in transaction
    await prisma.$transaction(async (tx) => {
      // Find inactive content
      const inactiveContent = await tx.content.findMany({
        where: {
          AND: [
            {
              createdAt: {
                lt: new Date(Date.now() - CLEANUP_CONFIG.INACTIVE_DAYS * 24 * 60 * 60 * 1000)
              }
            },
            { likes: { lt: CLEANUP_CONFIG.MIN_LIKES } },
            { status: { notIn: CLEANUP_CONFIG.PROTECTED_STATUSES } },
            { category: { notIn: CLEANUP_CONFIG.RETENTION_CATEGORIES } },
            { purchases: { none: {} } }
          ]
        },
        include: {
          artist: true
        },
        take: batchSize
      });

      // Process each piece of content
      for (const content of inactiveContent) {
        try {
          if (!dryRun) {
            // Archive content instead of deleting
            await tx.content.update({
              where: { id: content.id },
              data: { 
                status: 'ARCHIVED',
                archivedAt: new Date(),
                archiveReason: 'INACTIVE'
              }
            });

            // Create cleanup record
            await tx.contentCleanup.create({
              data: {
                contentId: content.id,
                reason: 'INACTIVE',
                details: {
                  age: Date.now() - content.createdAt.getTime(),
                  likes: content.likes,
                  category: content.category
                }
              }
            });

            result.archivedCount++;

            // Track notified users
            if (content.artist?.email && !result.notifiedUsers.includes(content.artist.email)) {
              result.notifiedUsers.push(content.artist.email);
            }
          }
        } catch (error) {
          result.errors.push(`Failed to process content ${content.id}: ${error}`);
          console.error(`Cleanup error for content ${content.id}:`, error);
        }
      }
    });

    // Send notifications in parallel after transaction
    if (!dryRun && result.notifiedUsers.length > 0) {
      await Promise.allSettled(
        result.notifiedUsers.map(email => 
          fetch('/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'CONTENT_ARCHIVED',
              email,
              data: {
                reason: 'inactivity',
                daysInactive: CLEANUP_CONFIG.INACTIVE_DAYS,
                minLikes: CLEANUP_CONFIG.MIN_LIKES
              }
            })
          })
        )
      );
    }

    // Log cleanup results
    await prisma.cleanupLog.create({
      data: {
        type: 'CONTENT',
        result: result as any,
        dryRun,
        timestamp: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      dryRun,
      ...result,
      message: dryRun ? 'Dry run completed' : 'Cleanup completed'
    });

  } catch (error) {
    console.error('Content cleanup error:', error);
    return NextResponse.json(
      { 
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check cleanup status and configuration
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const lastCleanup = await prisma.cleanupLog.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    const pendingCleanup = await prisma.content.count({
      where: {
        AND: [
          {
            createdAt: {
              lt: new Date(Date.now() - CLEANUP_CONFIG.INACTIVE_DAYS * 24 * 60 * 60 * 1000)
            }
          },
          { likes: { lt: CLEANUP_CONFIG.MIN_LIKES } },
          { status: { notIn: CLEANUP_CONFIG.PROTECTED_STATUSES } },
          { category: { notIn: CLEANUP_CONFIG.RETENTION_CATEGORIES } }
        ]
      }
    });

    return NextResponse.json({
      config: CLEANUP_CONFIG,
      lastCleanup,
      pendingCleanup,
      nextScheduledCleanup: lastCleanup ? 
        new Date(lastCleanup.timestamp.getTime() + 24 * 60 * 60 * 1000) : 
        new Date()
    });

  } catch (error) {
    console.error('Error fetching cleanup status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cleanup status' },
      { status: 500 }
    );
  }
}