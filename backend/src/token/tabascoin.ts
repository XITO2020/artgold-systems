import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../auth/middleware';

const router = Router();
const prisma = new PrismaClient();

// ✅ Obtenir le solde TabascoCoin d’un utilisateur
router.get('/balance', authenticateToken, async (req, res) => {
  const userId = (req.user as any).userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json({ tabascoBalance: user?.tabascoBalance ?? 0 });
});

// ✅ Récompenser un like d’un NFT avec des tabascoCoins
router.post('/reward-like/:nftId', authenticateToken, async (req, res) => {
  const userId = (req.user as any).userId;
  const nftId = req.params.nftId;

  const rewardAmount = 2; // à ajuster selon tes règles de scoring

  const user = await prisma.user.update({
    where: { id: userId },
    data: { tabascoBalance: { increment: rewardAmount } },
  });

  res.json({ success: true, tabascoBalance: user.tabascoBalance });
});

export default router;
