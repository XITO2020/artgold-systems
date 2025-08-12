import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from './jwt';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Format: Bearer <token>

  if (!token) return res.status(401).json({ error: 'Token manquant' });

  const user = verifyJwt<{ userId: string; role: string }>(token);
  if (!user) return res.status(403).json({ error: 'Token invalide ou expiré' });

  req.user = user as Express.AuthUser; // injecte dans req
  next();
}
