-- Phase 4: Storage bucket for AI-generated 3D models

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ar-models',
  'ar-models',
  true,
  52428800,
  array['model/gltf-binary', 'application/octet-stream']
)
on conflict (id) do nothing;

create policy "Public read ar models"
  on storage.objects for select
  using (bucket_id = 'ar-models');

create policy "Service upload ar models"
  on storage.objects for insert
  with check (bucket_id = 'ar-models' and auth.uid() is not null);

create policy "Service update ar models"
  on storage.objects for update
  using (bucket_id = 'ar-models' and auth.uid() is not null);

create policy "Service delete ar models"
  on storage.objects for delete
  using (bucket_id = 'ar-models' and auth.uid() is not null);
