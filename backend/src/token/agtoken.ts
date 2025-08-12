import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../auth/middleware';

const router = Router();
const prisma = new PrismaClient();

// ✅ Obtenir le solde AGT d'un utilisateur
router.get('/balance', authenticateToken, async (req, res) => {
  const userId = (req.user as any).userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json({ agtBalance: user?.agtBalance ?? 0 });
});

// ✅ Créditer des AGT tokens (mint)
router.post('/mint', authenticateToken, async (req, res) => {
  const userId = (req.user as any).userId;
  const { amount } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { agtBalance: { increment: amount } },
  });

  res.json({ success: true, agtBalance: user.agtBalance });
});

export default router;
