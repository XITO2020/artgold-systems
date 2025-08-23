"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from '@hooks/use-toast';
import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  email?: string;
  isAdmin?: boolean;
}

export default function ShopPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!authLoading) {
          setUser(authUser);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
        toast({
          title: 'Error',
          description: 'Failed to load shop data',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [authLoading, authUser, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading shop...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-destructive">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shop</h1>
      
      <div className="bg-muted text-muted-foreground p-8 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <p className="mb-4">Our shop is currently under construction. Please check back later!</p>
        
        {!user ? (
          <div className="mt-6">
            <p className="text-sm mb-4">
              Sign in to be notified when the shop is ready
            </p>
            <button 
              onClick={() => window.location.href = '/auth/signin'}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-sm">
              You'll be notified when we launch!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}