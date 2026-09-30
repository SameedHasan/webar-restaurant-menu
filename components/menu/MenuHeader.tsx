import type { Restaurant, Table } from '@/lib/types/database';

interface MenuHeaderProps {
  restaurant: Restaurant;
  table: Table;
}

export function MenuHeader({ restaurant, table }: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-amber-700">
              Table {table.table_number}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-stone-900">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="mt-1 text-sm text-stone-500">{restaurant.description}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
