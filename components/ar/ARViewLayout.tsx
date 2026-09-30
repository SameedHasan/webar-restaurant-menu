'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import type { MenuItem, Restaurant, Table } from '@/lib/types/database';

const ModelViewerAR = dynamic(
  () => import('@/components/ar/ModelViewerAR').then((mod) => mod.ModelViewerAR),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center bg-stone-900 text-stone-400">
        Loading 3D viewer…
      </div>
    ),
  },
);

interface ARViewLayoutProps {
  restaurant: Restaurant;
  table: Table;
  item: MenuItem;
}

export function ARViewLayout({ restaurant, table, item }: ARViewLayoutProps) {
  const isMobile = useIsMobile();

  const backHref = `/${restaurant.slug}/table/${table.table_number}`;

  return (
    <div className="flex min-h-screen flex-col bg-stone-900 text-white">
      <header className="flex items-center gap-3 border-b border-stone-700/80 px-4 py-3">
        <Link
          href={backHref}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-800 text-lg leading-none transition-colors hover:bg-stone-700"
          aria-label="Back to menu">
          ←
        </Link>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          <p className="truncate text-xs text-stone-400">
            {restaurant.name} · Table {table.table_number}
          </p>
        </div>
      </header>

      <div className="relative flex-1">
        <ModelViewerAR
          src={item.model_url!}
          alt={item.name}
          poster={item.image_url}
          enableAR={isMobile}
        />
      </div>

      <footer className="border-t border-stone-700/80 px-4 py-4 text-center text-sm text-stone-400">
        {isMobile ? (
          <p>
            Tap the <span className="font-medium text-amber-400">View in AR</span> button on the
            model to place it on your table.
          </p>
        ) : (
          <p>Drag to rotate · Scroll to zoom · AR available on mobile devices</p>
        )}
      </footer>
    </div>
  );
}
