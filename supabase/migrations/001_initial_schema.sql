-- WebAR Restaurant Menu — Initial Schema
-- Run in Supabase SQL Editor or via Supabase CLI

-- Restaurants
create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  created_at timestamptz not null default now()
);

-- Tables (physical restaurant tables for QR mapping)
create table if not exists tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  table_number integer not null,
  qr_code_path text,
  created_at timestamptz not null default now(),
  unique (restaurant_id, table_number)
);

-- Menu categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Menu items
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  model_url text,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  ai_job_id text,
  ai_status text not null default 'none'
    check (ai_status in ('none', 'pending', 'processing', 'completed', 'failed')),
  ai_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_tables_restaurant on tables(restaurant_id);
create index if not exists idx_categories_restaurant on categories(restaurant_id);
create index if not exists idx_menu_items_category on menu_items(category_id);
create index if not exists idx_menu_items_restaurant on menu_items(restaurant_id);
create index if not exists idx_restaurants_slug on restaurants(slug);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger menu_items_updated_at
  before update on menu_items
  for each row execute function update_updated_at();

-- Row Level Security
alter table restaurants enable row level security;
alter table tables enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;

-- Public read for customer menu (anon users)
create policy "Public read restaurants"
  on restaurants for select using (true);

create policy "Public read tables"
  on tables for select using (true);

create policy "Public read categories"
  on categories for select using (true);

create policy "Public read available menu items"
  on menu_items for select using (is_available = true);

-- Admin policies added in Phase 3 (restaurant_users table + auth)
