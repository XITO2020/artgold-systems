// frontend/hooks/useAuth.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@lib/api';

type Me = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  isAdmin: boolean;
  status: string;
  discordVerified: boolean;
  discordRoles: string[];
  roles?: string[];
};

export function useAuth() {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const me = await api('/auth/me', { auth: true });
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await refreshMe();
  }, [refreshMe]);

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  return { user, loading, login, logout, refreshMe, isAuthenticated: !!user };
}
