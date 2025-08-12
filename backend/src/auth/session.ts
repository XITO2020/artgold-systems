import { signJwt } from './jwt';

export function createSession(user: { id: string; role: string }) {
  const token = signJwt({ userId: user.id, role: user.role });
  return { token, expiresIn: '7d' };
}
