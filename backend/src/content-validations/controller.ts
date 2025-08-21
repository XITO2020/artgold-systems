import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireAuth } from '../auth/middleware';

const router = Router();

// POST /api/content-validations
router.post('/', authenticate, requireAuth, async (req, res) => {
  try {
    const { contentId, reviewerId, status, confidence, details } = req.body || {};
    if (!contentId || !reviewerId || !status || typeof confidence !== 'number') {
      return res.status(400).json({ error: 'missing_fields' });
    }
    const record = await prisma.contentValidation.create({
      data: { contentId, reviewerId, status, confidence, details: details ?? {} },
    });
    res.json(record);
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'server_error' });
  }
});

export default router;
