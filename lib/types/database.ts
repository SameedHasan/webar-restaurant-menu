export type AIStatus = 'none' | 'pending' | 'processing' | 'completed' | 'failed';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  model_url: string | null;
  is_available: boolean;
  sort_order: number;
  ai_job_id?: string | null;
  ai_status?: AIStatus;
  ai_error?: string | null;
}

export interface Table {
  id: string;
  restaurant_id: string;
  table_number: number;
  qr_code_path: string | null;
}

export interface CategoryWithItems extends Category {
  items: MenuItem[];
}

export interface MenuPageData {
  restaurant: Restaurant;
  table: Table;
  categories: CategoryWithItems[];
}

export interface ARPageData {
  restaurant: Restaurant;
  table: Table;
  item: MenuItem;
}
