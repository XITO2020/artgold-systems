// src/types/express.d.ts
import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface AuthUser extends JwtPayload {
      userId: string;
      email?: string;
      role?: string;
    }
    interface Request {
      user?: AuthUser;
    }
  }
}
export {};
