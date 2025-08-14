import { signToken } from './jwt';

// On accepte soit 'role', soit 'isAdmin' (legacy-friendly)
type CreateSessionInput = {
  id: string;
  role?: string;
  isAdmin?: boolean;
};

export function createSession(input: CreateSessionInput) {
  const role = input.role ?? (input.isAdmin ? 'admin' : 'user');
  const accessToken = signToken({ sub: input.id, role }, '15m');
  return { accessToken, role };
}
