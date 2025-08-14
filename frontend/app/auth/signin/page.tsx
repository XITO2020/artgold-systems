'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Card } from '@ui/card';
import { Label } from '@ui/label';

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await login(email, password);        // appelle /auth/login → cookies
      router.push('/fr/dashboard');        // où tu veux
    } catch (e: any) {
      setErr(e?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          {err && <p className="text-destructive text-sm">{err}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Loading…' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
