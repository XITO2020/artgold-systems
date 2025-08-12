"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const middleware_1 = require("../auth/middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// ✅ Obtenir le solde AGT d'un utilisateur
router.get('/balance', middleware_1.authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    res.json({ agtBalance: user?.agtBalance ?? 0 });
});
// ✅ Créditer des AGT tokens (mint)
router.post('/mint', middleware_1.authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { amount } = req.body;
    const user = await prisma.user.update({
        where: { id: userId },
        data: { agtBalance: { increment: amount } },
    });
    res.json({ success: true, agtBalance: user.agtBalance });
});
exports.default = router;
