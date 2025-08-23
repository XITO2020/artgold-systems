"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decode } from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  // Ajoutez d'autres propriétés utilisateur selon vos besoins
}

export function useSession() {
  const [session, setSession] = useState<{ user: User | null; status: 'loading' | 'authenticated' | 'unauthenticated' }>({ 
    user: null, 
    status: 'loading' 
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setSession({ user: null, status: 'unauthenticated' });
          return;
        }

        // Vérifier si le token est expiré
        const decoded = decode(token) as any;
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp < currentTime) {
          // Token expiré, déconnexion
          localStorage.removeItem('token');
          setSession({ user: null, status: 'unauthenticated' });
          return;
        }

        // Récupérer les informations utilisateur depuis le token
        const user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          isAdmin: decoded.isAdmin || false,
        };

        setSession({ user, status: 'authenticated' });
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('token');
        setSession({ user: null, status: 'unauthenticated' });
      }
    };

    checkAuth();

    // Écouter les changements de stockage pour la déconnexion depuis d'autres onglets
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        setSession({ user: null, status: 'unauthenticated' });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Échec de la connexion');
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);
      
      // Déclencher un événement de stockage pour mettre à jour les autres onglets
      window.dispatchEvent(new Event('storage'));
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    // Déclencher un événement de stockage pour mettre à jour les autres onglets
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  return {
    data: session.user ? { user: session.user } : null,
    status: session.status,
    update: () => window.dispatchEvent(new Event('storage')),
    signIn,
    signOut,
  };
}
