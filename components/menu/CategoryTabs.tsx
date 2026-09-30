'use client';

import type { CategoryWithItems } from '@/lib/types/database';

interface CategoryTabsProps {
  categories: CategoryWithItems[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategoryId, onSelect }: CategoryTabsProps) {
  return (
    <nav
      className="sticky top-[88px] z-10 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-sm"
      aria-label="Menu categories">
      <div className="mx-auto max-w-lg">
        <div className="flex gap-1 overflow-x-auto px-4 py-3 scrollbar-hide">
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelect(category.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100'
                }`}>
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
