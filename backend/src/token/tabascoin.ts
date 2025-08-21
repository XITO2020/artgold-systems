import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../auth/middleware';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/token/tabascoin/balance
router.get('/balance', authenticate, async (req, res) => {
  const userId = req.user!.sub;
  const agg = await prisma.token.aggregate({
    where: { userId, type: 'TABZ' },
    _sum: { amount: true },
  });
  const tabascoBalance = agg._sum.amount ? Number(agg._sum.amount) : 0;
  res.json({ tabascoBalance });
});

// POST /api/token/tabascoin/reward-dev { amount: number }
router.post('/reward-dev', authenticate, async (req, res) => {
  const userId = req.user!.sub;
  const rewardNum = Number(req.body?.amount || 0);
  if (!Number.isFinite(rewardNum) || rewardNum <= 0) {
    return res.status(400).json({ error: 'invalid_amount' });
  }

  await prisma.token.create({
    data: {
      userId,
      type: 'TABZ',
      symbol: 'TABZ',
      amount: rewardNum, // number accepté pour Decimal,
    },
  });

  const agg = await prisma.token.aggregate({
    where: { userId, type: 'TABZ' },
    _sum: { amount: true },
  });
  res.json({ success: true, tabascoBalance: Number(agg._sum.amount ?? 0) });
});

export default router;
