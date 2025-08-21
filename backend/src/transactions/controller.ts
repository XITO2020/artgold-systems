import { Router } from 'express';
import { authenticate, requireAuth } from '../auth/middleware';
import prisma from '../lib/prisma';

const router = Router();

// POST /api/transactions
router.post('/', authenticate, requireAuth, async (req, res) => {
  try {
    const { userId, type, amount, status = 'PENDING', paymentId, metadata } = req.body || {};
    if (!userId || !type || typeof amount !== 'number') {
      return res.status(400).json({ error: 'missing_fields' });
    }
    const tx = await prisma.transaction.create({
      data: { userId, type, amount, status, paymentId: paymentId ?? null, metadata: (metadata ?? null) as any },
    });
    res.json(tx);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// PUT /api/transactions/:id/status
router.put('/:id/status', authenticate, requireAuth, async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: 'missing_status' });
    const tx = await prisma.transaction.update({ where: { id: req.params.id }, data: { status } });
    res.json(tx);
  } catch (e: any) {
    if ((e as any)?.code === 'P2025') return res.status(404).json({ error: 'not_found' });
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// GET /api/transactions/history?userId=...
router.get('/history', authenticate, requireAuth, async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'missing_userId' });
    const list = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    res.json(list);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

// GET /api/transactions/stats?userId=...
router.get('/stats', authenticate, requireAuth, async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) return res.status(400).json({ error: 'missing_userId' });
    const grouped = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId, status: 'COMPLETED' },
      _sum: { amount: true },
      _count: true,
    });
    res.json(grouped);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

export default router;
