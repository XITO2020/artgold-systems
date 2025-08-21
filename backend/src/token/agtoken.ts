import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../auth/middleware';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/token/agt/balance
router.get('/balance', authenticate, async (req, res) => {
  const userId = req.user!.sub;
  const agg = await prisma.token.aggregate({
    where: { userId, type: 'AGT' },
    _sum: { amount: true },
  });
  const agtBalance = agg._sum.amount ? Number(agg._sum.amount) : 0;
  res.json({ agtBalance });
});

// POST /api/token/agt/mint-dev { amount: number }
router.post('/mint-dev', authenticate, async (req, res) => {
  const userId = req.user!.sub;
  const amountNum = Number(req.body?.amount || 0);
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: 'invalid_amount' });
  }

  await prisma.token.create({
    data: {
      userId,
      type: 'AGT',
      symbol: 'AGT',
      amount: amountNum, // number accepté pour Decimal
    },
  });

  const agg = await prisma.token.aggregate({
    where: { userId, type: 'AGT' },
    _sum: { amount: true },
  });
  res.json({ success: true, agtBalance: Number(agg._sum.amount ?? 0) });
});

export default router;
