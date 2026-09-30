import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { getAdminContext } from '@/lib/admin/auth';
import { shouldUseMockData } from '@/lib/config/env';

export default async function AdminLoginPage() {
  const existing = await getAdminContext();
  if (existing) redirect('/admin/menu');

  const mode = shouldUseMockData() ? 'mock' : 'supabase';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200/80">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-700">TableAR Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-stone-900">Restaurant dashboard</h1>
        <p className="mt-2 text-sm text-stone-500">Manage your menu, photos, and table QR codes.</p>

        <div className="mt-8">
          <LoginForm mode={mode} />
        </div>

        <Link href="/" className="mt-6 block text-center text-sm text-stone-400 hover:text-stone-600">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
