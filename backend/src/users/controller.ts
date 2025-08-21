import { Router } from 'express';
import { authenticate, requireAuth } from '../auth/middleware';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/users/:id/level
router.get('/:id/level', authenticate, requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        artworks: {
          select: { id: true, category: true, points: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user) return res.status(404).json({ error: 'not_found' });
    res.json(user);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// GET /api/users/:id/artworks
router.get('/:id/artworks', authenticate, requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query as { category?: string };
    const artworks = await prisma.artwork.findMany({
      where: { artistId: id, ...(category ? { category: category as any } : {}) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(artworks);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// POST /api/users/:id/artworks
router.post('/:id/artworks', authenticate, requireAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { id, category, title, serialNumber, qrCode, imageUrl, imageId: providedImageId, location, dimensions, points, isFirst } = req.body || {};
    if (!id || !category || !title) return res.status(400).json({ error: 'missing_fields' });

    const result = await prisma.$transaction(async (tx) => {
      // ensure media exists
      let imageId = providedImageId as string | undefined;
      if (!imageId) {
        const media = await tx.iPFSMedia.create({
          data: {
            cid: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
            filename: 'artwork-image',
            mimeType: 'image/*',
            size: 0,
            status: 'PENDING',
            url: imageUrl ?? null,
          },
        });
        imageId = media.id;
      }

      const artwork = await tx.artwork.create({
        data: {
          id,
          artistId: userId,
          category,
          title,
          serialNumber,
          qrCode,
          imageId,
          location: (location ?? {}) as any,
          dimensions: (dimensions ?? {}) as any,
          points: points ?? 0,
          isFirst: !!isFirst,
          currentValue: 0,
          totalLikes: 0,
          status: 'PENDING',
          createdAt: new Date(),
        },
      });

      await tx.user.update({ where: { id: userId }, data: { artworkCount: { increment: 1 } } });
      return artwork;
    });

    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// POST /api/users/:id/airdrop
router.post('/:id/airdrop', authenticate, requireAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { amount } = req.body || {};
    if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'invalid_amount' });

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          userId,
          type: 'EXCHANGE',
          amount,
          status: 'COMPLETED',
          provider: 'system',
          metadata: { subtype: 'AIRDROP' } as any,
        },
      });

      return user;
    });

    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// GET /api/users/:id/bonus-eligibility
router.get('/:id/bonus-eligibility', authenticate, requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        artworks: { where: { status: 'SOLD' }, select: { id: true } },
        tokens: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'not_found' });

    const soldArtworks = user.artworks.length;
    const tabzBalance = Number(user.tokens.find(t => t.type === 'TABZ')?.amount ?? 0);
    const agtBalance = Number(user.tokens.find(t => t.type === 'AGT')?.amount ?? 0);

    const eligible = soldArtworks >= 12 && (tabzBalance >= 4000 || agtBalance >= 27000) && (user.bonusSlots ?? 0) === 0;
    res.json({ eligible, soldArtworks, tabzBalance, agtBalance, bonusSlots: user.bonusSlots ?? 0 });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// GET /api/users/:id/category-progress
router.get('/:id/category-progress', authenticate, requireAuth, async (req, res) => {
  try {
    const artworks = await prisma.artwork.groupBy({
      by: ['category'],
      where: { artistId: req.params.id },
      _count: { _all: true },
    });
    res.json(artworks);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// GET /api/users/:id/suggest-next-category
router.get('/:id/suggest-next-category', authenticate, requireAuth, async (req, res) => {
  try {
    const userCategories = await prisma.artwork.findMany({
      where: { artistId: req.params.id },
      select: { category: true },
    });
    const existing = new Set(userCategories.map(a => a.category));

    // Find the least used category globally if all tried
    const allCategories = await prisma.artwork.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'asc' } },
      take: 1,
    });

    // Simple heuristic: if user has tried all categories seen in DB, suggest the global least-used; otherwise return any unused
    const allSeen = new Set((await prisma.artwork.findMany({ select: { category: true }, distinct: ['category'] })).map(a => a.category));
    const unused = Array.from(allSeen).filter(c => !existing.has(c));
    const suggestion = unused.length > 0 ? unused[Math.floor(Math.random() * unused.length)] : allCategories[0]?.category;
    res.json({ category: suggestion });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

export default router;
