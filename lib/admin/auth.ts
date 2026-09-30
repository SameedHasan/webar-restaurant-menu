import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DEV_ADMIN_COOKIE, shouldUseMockData } from '@/lib/config/env';
import { getMockStoreSnapshot } from '@/lib/data/mock-store';
import { createServerClient } from '@/lib/supabase/server';
import type { Restaurant } from '@/lib/types/database';

export interface AdminContext {
  mode: 'mock' | 'supabase';
  restaurant: Restaurant;
  userId: string | null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (shouldUseMockData()) {
    const cookieStore = await cookies();
    return cookieStore.get(DEV_ADMIN_COOKIE)?.value === '1';
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return Boolean(user);
}

export async function getAdminContext(): Promise<AdminContext | null> {
  if (shouldUseMockData()) {
    const cookieStore = await cookies();
    if (cookieStore.get(DEV_ADMIN_COOKIE)?.value !== '1') return null;

    const store = getMockStoreSnapshot();
    return {
      mode: 'mock',
      restaurant: store.restaurant,
      userId: null,
    };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: membership } = await supabase
    .from('restaurant_users')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (membership?.restaurant_id) {
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', membership.restaurant_id)
      .single();

    if (restaurant) {
      return {
        mode: 'supabase',
        restaurant,
        userId: user.id,
      };
    }
  }

  const { data: ownedRestaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle();

  if (ownedRestaurant) {
    return {
      mode: 'supabase',
      restaurant: ownedRestaurant,
      userId: user.id,
    };
  }

  return null;
}

export async function requireAdminContext(): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context) {
    redirect('/admin/login');
  }
  return context;
}
