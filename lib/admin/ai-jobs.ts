import { shouldUseMockData } from '@/lib/config/env';
import { updateMockMenuItemAI } from '@/lib/data/mock-store';
import { createServerClient } from '@/lib/supabase/server';
import type { AIStatus, MenuItem } from '@/lib/types/database';

export interface AIJobUpdate {
  ai_job_id?: string | null;
  ai_status?: AIStatus;
  ai_error?: string | null;
  model_url?: string | null;
}

export async function updateMenuItemAI(
  restaurantId: string,
  itemId: string,
  update: AIJobUpdate,
): Promise<MenuItem> {
  if (shouldUseMockData()) {
    const updated = updateMockMenuItemAI(itemId, update);
    if (!updated) throw new Error('Item not found');
    return updated;
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('menu_items')
    .update(update)
    .eq('id', itemId)
    .eq('restaurant_id', restaurantId)
    .select('*')
    .single();

  if (error) throw error;
  return { ...data, price: Number(data.price) };
}
