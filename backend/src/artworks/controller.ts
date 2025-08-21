import { Router } from 'express';
import { authenticate, requireAuth } from '../auth/middleware';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/artworks/:id
router.get('/:id', authenticate, requireAuth, async (req, res) => {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: req.params.id },
      include: {
        artist: true,
        purchases: { include: { buyer: true } },
      },
    });
    if (!artwork) return res.status(404).json({ error: 'not_found' });
    res.json(artwork);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// POST /api/artworks/:id/distribute
// Body: { valueIncrease: number, reason: 'SALE' | 'LIKES' | 'ADMIN' }
router.post('/:id/distribute', authenticate, requireAuth, async (req, res) => {
  try {
    const artworkId = req.params.id;
    const { valueIncrease, reason } = req.body || {};
    if (typeof valueIncrease !== 'number' || valueIncrease <= 0) {
      return res.status(400).json({ error: 'invalid_value_increase' });
    }

    const VALUE_SHARES = { CREATOR: 0.10, OWNER: 0.80, BUYERS: 0.10 } as const;

    const result = await prisma.$transaction(async (tx) => {
      const artwork = await tx.artwork.findUnique({
        where: { id: artworkId },
        include: { artist: true, purchases: true },
      });
      if (!artwork) throw new Error('artwork_not_found');

      const previousValue = Number(artwork.currentValue);
      const newValue = previousValue + valueIncrease;

      const creatorShare = valueIncrease * VALUE_SHARES.CREATOR;
      const ownerShare = valueIncrease * VALUE_SHARES.OWNER;
      const buyersShare = valueIncrease * VALUE_SHARES.BUYERS;

      await tx.artwork.update({
        where: { id: artworkId },
        data: { currentValue: newValue },
      });

      await tx.user.update({
        where: { id: artwork.artistId },
        data: { balance: { increment: ownerShare } },
      });

      await tx.user.update({
        where: { id: artwork.artist.id },
        data: { balance: { increment: creatorShare } },
      });

      if (artwork.purchases.length > 0) {
        const sharePerBuyer = buyersShare / artwork.purchases.length;
        for (const p of artwork.purchases) {
          await tx.user.update({
            where: { id: p.buyerId },
            data: { balance: { increment: sharePerBuyer } },
          });
        }
      }

      await tx.valueDistribution.create({
        data: {
          artworkId,
          previousValue,
          newValue,
          creatorShare,
          ownerShare,
          buyersShare,
          reason,
        },
      });

      return { previousValue, newValue, creatorShare, ownerShare, buyersShare };
    });

    res.json(result);
  } catch (e: any) {
    if (e?.message === 'artwork_not_found') return res.status(404).json({ error: 'not_found' });
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

export default router;
