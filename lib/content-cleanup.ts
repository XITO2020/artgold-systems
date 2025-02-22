
import { prisma } from './db';
import { sendContentCleanupNotification } from './mail/notifications';

const CLEANUP_THRESHOLD = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
const MIN_LIKES = 100;

export async function cleanupInactiveContent() {
  const threshold = new Date(Date.now() - CLEANUP_THRESHOLD);

  // Find content to be cleaned up
  const inactiveContent = await prisma.content.findMany({
    where: {
      createdAt: {
        lt: threshold
      },
      likes: {
        lt: MIN_LIKES
      },
      status: 'ACTIVE',
      // Don't delete content that has been sold
      purchases: {
        none: {}
      }
    },
    include: {
      artist: true
    }
  });

  // Process each piece of content
  for (const content of inactiveContent) {
    await prisma.$transaction(async (tx) => {
      // Mark content as deleted
      await tx.content.update({
        where: { id: content.id },
        data: { status: 'DELETED' }
      });

      // Create cleanup record
      await tx.contentCleanup.create({
        data: {
          contentId: content.id,
          reason: 'INACTIVE',
          details: {
            age: Date.now() - content.createdAt.getTime(),
            likes: content.likes
          }
        }
      });
    });

    // Notify artist
    if (content.artist.email) {
      await sendContentCleanupNotification({
        to: content.artist.email,
        content: {
          id: content.id,
          title: content.title,
          type: content.type,
          createdAt: content.createdAt,
          likes: content.likes
        }
      });
    }
  }

  return inactiveContent.length;
}
