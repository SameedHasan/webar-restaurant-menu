'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';
import type { MenuItem } from '@/lib/types/database';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantSlug: string;
  tableNumber: number;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function MenuItemCard({ item, restaurantSlug, tableNumber }: MenuItemCardProps) {
  const hasAR = Boolean(item.model_url);
  const isMobile = useIsMobile();

  const arHref = `/${restaurantSlug}/table/${tableNumber}/ar/${item.id}`;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/80">
      <div className="relative aspect-[4/3] w-full bg-stone-100">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {hasAR && (
          <div className="absolute right-3 top-3">
            <Badge variant="ar">AR Ready</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-stone-900">{item.name}</h3>
          <span className="shrink-0 text-base font-bold text-amber-700">
            {formatPrice(item.price)}
          </span>
        </div>

        {item.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{item.description}</p>
        )}

        {hasAR ? (
          <Link
            href={arHref}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800">
            {isMobile ? 'View on Table' : 'Preview in 3D'}
          </Link>
        ) : (
          <p className="mt-3 text-xs text-stone-400">3D model coming soon</p>
        )}
      </div>
    </article>
  );
}
