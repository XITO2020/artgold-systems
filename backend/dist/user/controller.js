"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_1 = require("./service");
const session_1 = require("../auth/session");
const middleware_1 = require("../auth/middleware");
const router = (0, express_1.Router)();
router.post('/signup', async (req, res) => {
    try {
        const user = await (0, service_1.createUser)(req.body);
        const session = (0, session_1.createSession)({ id: user.id, role: user.role });
        res.json({ user, ...session });
    }
    catch (err) {
        res.status(400).json({ error: 'Inscription échouée', detail: err });
    }
});
router.post('/login', async (req, res) => {
    try {
        const user = await (0, service_1.validateUser)(req.body.email, req.body.password);
        if (!user)
            return res.status(401).json({ error: 'Identifiants invalides' });
        const session = (0, session_1.createSession)({ id: user.id, role: user.role });
        res.json({ user, ...session });
    }
    catch (err) {
        res.status(400).json({ error: 'Connexion échouée', detail: err });
    }
});
router.get('/me', middleware_1.authenticateToken, async (req, res) => {
    try {
        const user = await (0, service_1.getUserByEmail)(req.user.userId);
        if (!user)
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        const { password, ...safeUser } = user;
        res.json(safeUser);
    }
    catch (err) {
        res.status(500).json({ error: 'Erreur serveur', detail: err });
    }
});
exports.default = router;
