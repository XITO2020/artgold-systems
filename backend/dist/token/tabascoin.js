"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const middleware_1 = require("../auth/middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// ✅ Obtenir le solde TabascoCoin d’un utilisateur
router.get('/balance', middleware_1.authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    res.json({ tabascoBalance: user?.tabascoBalance ?? 0 });
});
// ✅ Récompenser un like d’un NFT avec des tabascoCoins
router.post('/reward-like/:nftId', middleware_1.authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const nftId = req.params.nftId;
    const rewardAmount = 2; // à ajuster selon tes règles de scoring
    const user = await prisma.user.update({
        where: { id: userId },
        data: { tabascoBalance: { increment: rewardAmount } },
    });
    res.json({ success: true, tabascoBalance: user.tabascoBalance });
});
exports.default = router;
