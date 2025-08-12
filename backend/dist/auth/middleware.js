"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jwt_1 = require("./jwt");
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Format: Bearer <token>
    if (!token)
        return res.status(401).json({ error: 'Token manquant' });
    const user = (0, jwt_1.verifyJwt)(token);
    if (!user)
        return res.status(403).json({ error: 'Token invalide ou expiré' });
    req.user = user; // injecte dans req
    next();
}
