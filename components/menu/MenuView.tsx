'use client';

import { useState } from 'react';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { MenuHeader } from '@/components/menu/MenuHeader';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import type { MenuPageData } from '@/lib/types/database';

interface MenuViewProps {
  data: MenuPageData;
}

export function MenuView({ data }: MenuViewProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(data.categories[0]?.id ?? '');

  const activeCategory =
    data.categories.find((c) => c.id === activeCategoryId) ?? data.categories[0];

  return (
    <div className="min-h-screen bg-stone-50">
      <MenuHeader restaurant={data.restaurant} table={data.table} />

      {data.categories.length > 1 && (
        <CategoryTabs
          categories={data.categories}
          activeCategoryId={activeCategory?.id ?? ''}
          onSelect={setActiveCategoryId}
        />
      )}

      <main className="mx-auto max-w-lg px-4 py-5">
        {activeCategory && (
          <>
            <h2 className="mb-4 text-lg font-semibold text-stone-800">{activeCategory.name}</h2>
            <ul className="flex flex-col gap-4">
              {activeCategory.items.map((item) => (
                <li key={item.id}>
                  <MenuItemCard
                    item={item}
                    restaurantSlug={data.restaurant.slug}
                    tableNumber={data.table.table_number}
                  />
                </li>
              ))}
            </ul>
          </>
        )}

        {data.categories.length === 0 && (
          <p className="py-12 text-center text-stone-500">No menu items available.</p>
        )}
      </main>

      <footer className="mx-auto max-w-lg px-4 py-8 text-center text-xs text-stone-400">
        Scan, browse, and visualize your meal in AR
      </footer>
    </div>
  );
}
