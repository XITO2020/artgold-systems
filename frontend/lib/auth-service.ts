import { cookies } from 'next/headers';
import { generateToken, verifyToken } from './jwt';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export async function login(email: string, password: string): Promise<{ user: User | null; error?: string }> {
  // TODO: Remplacer par un appel à votre API backend
  if (email === 'admin@naim.com' && password === '7654321') {
    const user = { id: '1', email, name: 'Admin', role: 'admin' };
    const token = generateToken(user);
    return { user };
  }
  return { user: null, error: 'Invalid credentials' };
}

export function logout() {
  cookies().delete('auth_token');
}

export function getCurrentUser(): User | null {
  const token = cookies().get('auth_token')?.value;
  if (!token) return null;
  
  try {
    return verifyToken(token) as User;
  } catch (error) {
    return null;
  }
}

export function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}
