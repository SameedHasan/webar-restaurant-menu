-- Phase 3: Admin auth, restaurant users, storage, and RLS write policies

alter table restaurants
  add column if not exists owner_id uuid references auth.users(id);

create table if not exists restaurant_users (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'manager',
  created_at timestamptz not null default now(),
  unique (restaurant_id, user_id)
);

create index if not exists idx_restaurant_users_user on restaurant_users(user_id);
create index if not exists idx_restaurant_users_restaurant on restaurant_users(restaurant_id);

-- Helper: check if current user manages a restaurant
create or replace function public.user_manages_restaurant(restaurant_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from restaurant_users
    where restaurant_id = restaurant_uuid
      and user_id = auth.uid()
  ) or exists (
    select 1 from restaurants
    where id = restaurant_uuid
      and owner_id = auth.uid()
  );
$$;

-- Admin read policies (all items, including unavailable)
create policy "Admins read all menu items"
  on menu_items for select
  using (public.user_manages_restaurant(restaurant_id));

create policy "Admins manage menu items"
  on menu_items for all
  using (public.user_manages_restaurant(restaurant_id))
  with check (public.user_manages_restaurant(restaurant_id));

create policy "Admins manage categories"
  on categories for all
  using (public.user_manages_restaurant(restaurant_id))
  with check (public.user_manages_restaurant(restaurant_id));

create policy "Admins manage tables"
  on tables for all
  using (public.user_manages_restaurant(restaurant_id))
  with check (public.user_manages_restaurant(restaurant_id));

create policy "Admins read own restaurant"
  on restaurants for select
  using (public.user_manages_restaurant(id) or owner_id = auth.uid());

create policy "Admins update own restaurant"
  on restaurants for update
  using (public.user_manages_restaurant(id) or owner_id = auth.uid());

-- Storage bucket for food images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'food-images',
  'food-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Public read food images"
  on storage.objects for select
  using (bucket_id = 'food-images');

create policy "Admins upload food images"
  on storage.objects for insert
  with check (
    bucket_id = 'food-images'
    and auth.uid() is not null
  );

create policy "Admins update food images"
  on storage.objects for update
  using (bucket_id = 'food-images' and auth.uid() is not null);

create policy "Admins delete food images"
  on storage.objects for delete
  using (bucket_id = 'food-images' and auth.uid() is not null);
