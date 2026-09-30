'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

interface LoginFormProps {
  mode: 'mock' | 'supabase';
}

export function LoginForm({ mode }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDemoLogin() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/login', { method: 'POST' });
      if (!response.ok) throw new Error('Login failed');
      router.push('/admin/menu');
      router.refresh();
    } catch {
      setError('Could not start demo session');
    } finally {
      setLoading(false);
    }
  }

  async function handleSupabaseLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.push('/admin/menu');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  if (mode === 'mock') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-stone-500">
          Demo mode — no Supabase required. Changes persist until the dev server restarts.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50">
          {loading ? 'Signing in…' : 'Continue as Demo Admin'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSupabaseLogin} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
