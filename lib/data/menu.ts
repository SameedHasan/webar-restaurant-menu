import { shouldUseMockData } from '@/lib/config/env';
import { getMockMenuByTable, getMockMenuItemForAR } from '@/lib/data/mock-menu';
import { createServerClient } from '@/lib/supabase/server';
import type { ARPageData, CategoryWithItems, MenuPageData } from '@/lib/types/database';

export async function getMenuByTable(
  restaurantSlug: string,
  tableNumber: number,
): Promise<MenuPageData | null> {
  if (shouldUseMockData()) {
    return getMockMenuByTable(restaurantSlug, tableNumber);
  }

  const supabase = await createServerClient();

  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', restaurantSlug)
    .single();

  if (restaurantError || !restaurant) return null;

  const { data: table, error: tableError } = await supabase
    .from('tables')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('table_number', tableNumber)
    .single();

  if (tableError || !table) return null;

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('sort_order');

  if (categoriesError || !categories) return null;

  const { data: items, error: itemsError } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_available', true)
    .order('sort_order');

  if (itemsError) return null;

  const categoriesWithItems: CategoryWithItems[] = categories.map((category) => ({
    ...category,
    items: (items ?? [])
      .filter((item) => item.category_id === category.id)
      .map((item) => ({
        ...item,
        price: Number(item.price),
      })),
  }));

  return {
    restaurant,
    table,
    categories: categoriesWithItems.filter((c) => c.items.length > 0),
  };
}

export async function getMenuItemForAR(
  restaurantSlug: string,
  tableNumber: number,
  itemId: string,
): Promise<ARPageData | null> {
  if (shouldUseMockData()) {
    return getMockMenuItemForAR(restaurantSlug, tableNumber, itemId);
  }

  const menu = await getMenuByTable(restaurantSlug, tableNumber);
  if (!menu) return null;

  const item = menu.categories.flatMap((c) => c.items).find((i) => i.id === itemId);

  if (!item?.model_url) return null;

  return {
    restaurant: menu.restaurant,
    table: menu.table,
    item,
  };
}
