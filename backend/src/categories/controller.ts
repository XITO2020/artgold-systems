import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/categories/:category/stats
router.get('/:category/stats', async (req, res) => {
  try {
    const category = req.params.category as string;
    const stats = await prisma.artwork.aggregate({
      where: { category: category as any },
      _count: { _all: true, artistId: true },
      _avg: { currentValue: true, totalLikes: true },
    });
    res.json({
      totalArtworks: stats._count._all ?? 0,
      uniqueArtists: (stats as any)._count.artistId ?? 0,
      averageValue: Number(stats._avg.currentValue ?? 0),
      popularityScore: Number(stats._avg.totalLikes ?? 0),
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// GET /api/categories/:category/top-artists?limit=10
router.get('/:category/top-artists', async (req, res) => {
  try {
    const category = req.params.category as string;
    const limit = Math.max(parseInt((req.query.limit as string) || '10', 10), 1);
    const users = await prisma.user.findMany({
      where: { artworks: { some: { category: category as any } } },
      select: {
        id: true,
        name: true,
        artworks: { where: { category: category as any }, select: { currentValue: true, totalLikes: true } },
        _count: { select: { artworks: true } },
      },
      take: limit,
      orderBy: { artworks: { _count: 'desc' } },
    });
    res.json(users);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

export default router;
