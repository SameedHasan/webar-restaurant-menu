import { shouldUseMockData } from '@/lib/config/env';
import { addMockTable, getMockTables } from '@/lib/data/mock-store';
import { createServerClient } from '@/lib/supabase/server';
import type { Table } from '@/lib/types/database';

export async function getAdminTables(restaurantId: string): Promise<Table[]> {
  if (shouldUseMockData()) {
    return getMockTables();
  }

  const supabase = await createServerClient();
  const { data } = await supabase
    .from('tables')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('table_number');

  return data ?? [];
}

export async function createAdminTable(
  restaurantId: string,
  tableNumber: number,
): Promise<Table> {
  if (shouldUseMockData()) {
    const table = addMockTable(tableNumber);
    if (!table) throw new Error('Table number already exists');
    return table;
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('tables')
    .insert({ restaurant_id: restaurantId, table_number: tableNumber })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
