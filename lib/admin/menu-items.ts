import { shouldUseMockData } from '@/lib/config/env';
import {
  createMockMenuItem,
  deleteMockMenuItem,
  getMockCategories,
  getMockMenuItemById,
  getMockStoreSnapshot,
  updateMockMenuItem,
} from '@/lib/data/mock-store';
import { createServerClient } from '@/lib/supabase/server';
import type { Category, CategoryWithItems, MenuItem, Restaurant } from '@/lib/types/database';

export interface MenuItemInput {
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
}

export interface AdminMenuData {
  restaurant: Restaurant;
  categories: CategoryWithItems[];
}

export async function getAdminMenu(restaurantId: string): Promise<AdminMenuData> {
  if (shouldUseMockData()) {
    const store = getMockStoreSnapshot();
    return {
      restaurant: store.restaurant,
      categories: store.categories,
    };
  }

  const supabase = await createServerClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('sort_order');

  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('sort_order');

  const categoriesWithItems: CategoryWithItems[] = (categories ?? []).map((category) => ({
    ...category,
    items: (items ?? [])
      .filter((item) => item.category_id === category.id)
      .map((item) => ({ ...item, price: Number(item.price) })),
  }));

  return {
    restaurant: restaurant!,
    categories: categoriesWithItems,
  };
}

export async function getAdminCategories(restaurantId: string): Promise<Category[]> {
  if (shouldUseMockData()) {
    return getMockCategories();
  }

  const supabase = await createServerClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('sort_order');

  return data ?? [];
}

export async function getAdminMenuItem(
  restaurantId: string,
  itemId: string,
): Promise<MenuItem | null> {
  if (shouldUseMockData()) {
    const item = getMockMenuItemById(itemId);
    return item?.restaurant_id === restaurantId ? item : null;
  }

  const supabase = await createServerClient();
  const { data } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', itemId)
    .eq('restaurant_id', restaurantId)
    .maybeSingle();

  return data ? { ...data, price: Number(data.price) } : null;
}

export async function createAdminMenuItem(
  restaurantId: string,
  input: MenuItemInput,
): Promise<MenuItem> {
  if (shouldUseMockData()) {
    return createMockMenuItem(input);
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      restaurant_id: restaurantId,
      category_id: input.category_id,
      name: input.name,
      description: input.description,
      price: input.price,
      image_url: input.image_url,
      is_available: input.is_available,
    })
    .select('*')
    .single();

  if (error) throw error;
  return { ...data, price: Number(data.price) };
}

export async function updateAdminMenuItem(
  restaurantId: string,
  itemId: string,
  input: Partial<MenuItemInput>,
): Promise<MenuItem> {
  if (shouldUseMockData()) {
    const updated = updateMockMenuItem(itemId, input);
    if (!updated) throw new Error('Item not found');
    return updated;
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('menu_items')
    .update(input)
    .eq('id', itemId)
    .eq('restaurant_id', restaurantId)
    .select('*')
    .single();

  if (error) throw error;
  return { ...data, price: Number(data.price) };
}

export async function deleteAdminMenuItem(restaurantId: string, itemId: string): Promise<void> {
  if (shouldUseMockData()) {
    const deleted = deleteMockMenuItem(itemId);
    if (!deleted) throw new Error('Item not found');
    return;
  }

  const supabase = await createServerClient();
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', itemId)
    .eq('restaurant_id', restaurantId);

  if (error) throw error;
}
