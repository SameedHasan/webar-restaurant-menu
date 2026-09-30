import type { AIStatus, Category, MenuItem, MenuPageData, Table } from '@/lib/types/database';

/** Placeholder GLB until AI-generated food models are available (Phase 4). */
export const SAMPLE_MODEL_URL = '/models/sample-burger.glb';

const RESTAURANT_ID = 'a0000000-0000-4000-8000-000000000001';

function createInitialStore(): MenuPageData {
  return {
    restaurant: {
      id: RESTAURANT_ID,
      name: 'Demo Bistro',
      slug: 'demo-bistro',
      description: 'A cozy spot for WebAR menu testing',
      logo_url: null,
      created_at: new Date().toISOString(),
    },
    table: {
      id: 'b0000000-0000-4000-8000-000000000003',
      restaurant_id: RESTAURANT_ID,
      table_number: 3,
      qr_code_path: null,
    },
    categories: [
      {
        id: 'c0000000-0000-4000-8000-000000000001',
        restaurant_id: RESTAURANT_ID,
        name: 'Starters',
        sort_order: 1,
        items: [
          {
            id: 'd0000000-0000-4000-8000-000000000001',
            category_id: 'c0000000-0000-4000-8000-000000000001',
            restaurant_id: RESTAURANT_ID,
            name: 'Truffle Fries',
            description: 'Crispy fries with truffle oil and parmesan',
            price: 8.5,
            image_url:
              'https://images.unsplash.com/photo-1573080496219-bf080d1e5194?w=600&h=400&fit=crop',
            model_url: null,
            is_available: true,
            sort_order: 1,
          },
          {
            id: 'd0000000-0000-4000-8000-000000000002',
            category_id: 'c0000000-0000-4000-8000-000000000001',
            restaurant_id: RESTAURANT_ID,
            name: 'Caesar Salad',
            description: 'Romaine, croutons, house dressing',
            price: 9.0,
            image_url:
              'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop',
            model_url: null,
            is_available: true,
            sort_order: 2,
          },
        ],
      },
      {
        id: 'c0000000-0000-4000-8000-000000000002',
        restaurant_id: RESTAURANT_ID,
        name: 'Mains',
        sort_order: 2,
        items: [
          {
            id: 'd0000000-0000-4000-8000-000000000003',
            category_id: 'c0000000-0000-4000-8000-000000000002',
            restaurant_id: RESTAURANT_ID,
            name: 'Classic Burger',
            description: 'Angus beef, cheddar, pickles, brioche bun',
            price: 14.5,
            image_url:
              'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
            model_url: SAMPLE_MODEL_URL,
            is_available: true,
            sort_order: 1,
          },
          {
            id: 'd0000000-0000-4000-8000-000000000004',
            category_id: 'c0000000-0000-4000-8000-000000000002',
            restaurant_id: RESTAURANT_ID,
            name: 'Grilled Salmon',
            description: 'Atlantic salmon, lemon butter, seasonal veg',
            price: 22.0,
            image_url:
              'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
            model_url: null,
            is_available: true,
            sort_order: 2,
          },
        ],
      },
      {
        id: 'c0000000-0000-4000-8000-000000000003',
        restaurant_id: RESTAURANT_ID,
        name: 'Desserts',
        sort_order: 3,
        items: [
          {
            id: 'd0000000-0000-4000-8000-000000000005',
            category_id: 'c0000000-0000-4000-8000-000000000003',
            restaurant_id: RESTAURANT_ID,
            name: 'Chocolate Lava Cake',
            description: 'Warm molten center, vanilla ice cream',
            price: 7.5,
            image_url:
              'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop',
            model_url: null,
            is_available: true,
            sort_order: 1,
          },
        ],
      },
    ],
  };
}

let store: MenuPageData | null = null;
const tables: Table[] = [
  {
    id: 'b0000000-0000-4000-8000-000000000001',
    restaurant_id: RESTAURANT_ID,
    table_number: 1,
    qr_code_path: null,
  },
  {
    id: 'b0000000-0000-4000-8000-000000000002',
    restaurant_id: RESTAURANT_ID,
    table_number: 2,
    qr_code_path: null,
  },
  {
    id: 'b0000000-0000-4000-8000-000000000003',
    restaurant_id: RESTAURANT_ID,
    table_number: 3,
    qr_code_path: null,
  },
];

function getStore(): MenuPageData {
  if (!store) {
    store = createInitialStore();
  }
  return store;
}

export function getMockStoreSnapshot(): MenuPageData {
  return getStore();
}

export function getMockTables(): Table[] {
  return [...tables].sort((a, b) => a.table_number - b.table_number);
}

export function getMockMenuByTable(
  restaurantSlug: string,
  tableNumber: number,
): MenuPageData | null {
  const data = getStore();
  if (restaurantSlug !== data.restaurant.slug) return null;

  const table = tables.find((t) => t.table_number === tableNumber);
  if (!table) return null;

  return {
    restaurant: data.restaurant,
    table,
    categories: data.categories.map((category) => ({
      ...category,
      items: category.items.filter((item) => item.is_available),
    })),
  };
}

export function getMockMenuItemForAR(
  restaurantSlug: string,
  tableNumber: number,
  itemId: string,
): { restaurant: MenuPageData['restaurant']; table: Table; item: MenuItem } | null {
  const menu = getMockMenuByTable(restaurantSlug, tableNumber);
  if (!menu) return null;

  const item = getStore()
    .categories.flatMap((c) => c.items)
    .find((i) => i.id === itemId);

  if (!item?.model_url) return null;

  return { restaurant: menu.restaurant, table: menu.table, item };
}

export function getMockCategories(): Category[] {
  return getStore().categories.map(({ items, ...category }) => {
    void items;
    return category;
  });
}

export function getMockMenuItemById(itemId: string): MenuItem | null {
  return (
    getStore()
      .categories.flatMap((c) => c.items)
      .find((i) => i.id === itemId) ?? null
  );
}

export function createMockMenuItem(input: {
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
}): MenuItem {
  const data = getStore();
  const category = data.categories.find((c) => c.id === input.category_id);
  if (!category) throw new Error('Category not found');

  const item: MenuItem = {
    id: crypto.randomUUID(),
    restaurant_id: data.restaurant.id,
    category_id: input.category_id,
    name: input.name,
    description: input.description,
    price: input.price,
    image_url: input.image_url,
    model_url: null,
    is_available: input.is_available,
    sort_order: category.items.length + 1,
    ai_status: 'none',
  };

  category.items.push(item);
  return item;
}

export function updateMockMenuItem(
  itemId: string,
  input: Partial<
    Pick<
      MenuItem,
      | 'name'
      | 'description'
      | 'price'
      | 'image_url'
      | 'is_available'
      | 'category_id'
      | 'ai_job_id'
      | 'ai_status'
      | 'ai_error'
      | 'model_url'
    >
  >,
): MenuItem | null {
  const data = getStore();

  for (const category of data.categories) {
    const index = category.items.findIndex((i) => i.id === itemId);
    if (index === -1) continue;

    const existing = category.items[index];

    if (input.category_id && input.category_id !== category.id) {
      const target = data.categories.find((c) => c.id === input.category_id);
      if (!target) return null;

      category.items.splice(index, 1);
      const updated = { ...existing, ...input, category_id: input.category_id };
      target.items.push(updated);
      return updated;
    }

    const updated = { ...existing, ...input };
    category.items[index] = updated;
    return updated;
  }

  return null;
}

export function deleteMockMenuItem(itemId: string): boolean {
  const data = getStore();
  for (const category of data.categories) {
    const index = category.items.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      category.items.splice(index, 1);
      return true;
    }
  }
  return false;
}

export function updateMockMenuItemAI(
  itemId: string,
  update: {
    ai_job_id?: string | null;
    ai_status?: AIStatus;
    ai_error?: string | null;
    model_url?: string | null;
  },
): MenuItem | null {
  const data = getStore();

  for (const category of data.categories) {
    const index = category.items.findIndex((i) => i.id === itemId);
    if (index === -1) continue;

    const updated: MenuItem = {
      ...category.items[index],
      ...(update.ai_job_id !== undefined && { ai_job_id: update.ai_job_id }),
      ...(update.ai_status !== undefined && { ai_status: update.ai_status }),
      ...(update.ai_error !== undefined && { ai_error: update.ai_error }),
      ...(update.model_url !== undefined && { model_url: update.model_url }),
    };

    category.items[index] = updated;
    return updated;
  }

  return null;
}

export function addMockTable(tableNumber: number): Table | null {
  if (tables.some((t) => t.table_number === tableNumber)) return null;

  const table: Table = {
    id: crypto.randomUUID(),
    restaurant_id: RESTAURANT_ID,
    table_number: tableNumber,
    qr_code_path: null,
  };

  tables.push(table);
  tables.sort((a, b) => a.table_number - b.table_number);
  return table;
}
