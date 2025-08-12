"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getCountryFromIP } from '~/localeDetection';

export default function AuthCallback() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function handleRedirect() {
      if (status === 'authenticated') {
        // Get user's preferred language
        const userLang = await getCountryFromIP();
        
        // Redirect to dashboard with language
        router.push(`/${userLang}/dashboard`);
      } else if (status === 'unauthenticated') {
        // Redirect to home page if authentication failed
        const userLang = await getCountryFromIP();
        router.push(`/${userLang}`);
      }
    }

    handleRedirect();
  }, [router, status]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Authentication in progress...</h2>
        <p>Please wait while we redirect you...</p>
      </div>
    </div>
  );
}