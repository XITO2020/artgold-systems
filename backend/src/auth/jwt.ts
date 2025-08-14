// src/auth/jwt.ts
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export function signToken(
  payload: JwtPayload | object,
  expiresIn: SignOptions['expiresIn'] = '1h' // garantit le bon type
) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// Alias pour compat compat
export const signJwt = signToken;
