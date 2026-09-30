-- Sample seed data for Demo Bistro
-- Run after 001_initial_schema.sql

insert into restaurants (id, name, slug, description, logo_url)
values (
  'a0000000-0000-4000-8000-000000000001',
  'Demo Bistro',
  'demo-bistro',
  'A cozy spot for WebAR menu testing',
  null
) on conflict (slug) do nothing;

insert into tables (id, restaurant_id, table_number)
values
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 1),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 2),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 3)
on conflict do nothing;

insert into categories (id, restaurant_id, name, sort_order)
values
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Starters', 1),
  ('c0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Mains', 2),
  ('c0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Desserts', 3)
on conflict do nothing;

insert into menu_items (id, restaurant_id, category_id, name, description, price, image_url, model_url, sort_order)
values
  (
    'd0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000001',
    'c0000000-0000-4000-8000-000000000001',
    'Truffle Fries',
    'Crispy fries with truffle oil and parmesan',
    8.50,
    'https://images.unsplash.com/photo-1573080496219-bf080d1e5194?w=600&h=400&fit=crop',
    null,
    1
  ),
  (
    'd0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000001',
    'c0000000-0000-4000-8000-000000000001',
    'Caesar Salad',
    'Romaine, croutons, house dressing',
    9.00,
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop',
    null,
    2
  ),
  (
    'd0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000001',
    'c0000000-0000-4000-8000-000000000002',
    'Classic Burger',
    'Angus beef, cheddar, pickles, brioche bun',
    14.50,
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
    '/models/sample-burger.glb',
    1
  ),
  (
    'd0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000001',
    'c0000000-0000-4000-8000-000000000002',
    'Grilled Salmon',
    'Atlantic salmon, lemon butter, seasonal veg',
    22.00,
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
    null,
    2
  ),
  (
    'd0000000-0000-4000-8000-000000000005',
    'a0000000-0000-4000-8000-000000000001',
    'c0000000-0000-4000-8000-000000000003',
    'Chocolate Lava Cake',
    'Warm molten center, vanilla ice cream',
    7.50,
    'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop',
    null,
    1
  )
on conflict do nothing;
