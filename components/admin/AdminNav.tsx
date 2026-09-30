'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/admin/menu', label: 'Menu' },
  { href: '/admin/qr-codes', label: 'QR Codes' },
];

export function AdminNav({ restaurantName }: { restaurantName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-amber-700">Admin</p>
          <p className="text-sm font-semibold text-stone-900">{restaurantName}</p>
        </div>
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}>
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="ml-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-900">
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
