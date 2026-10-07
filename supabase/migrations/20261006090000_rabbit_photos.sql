-- Міграція: фото племінних кроликів (етап 1, гілка feature/photos)
-- Скрипт ідемпотентний: його можна запускати повторно без шкоди.
-- Застосування: Supabase CLI (supabase db push) або вручну в SQL Editor.

-- 1. Колонка зі шляхом до фото в таблиці rabbits
alter table public.rabbits
  add column if not exists photo_path text;

-- 2. Приватний бакет: ліміт 1 МБ на файл, лише WebP та JPEG
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('rabbit-photos', 'rabbit-photos', false, 1048576, array['image/webp', 'image/jpeg'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 3. Політики: кожен працює лише з файлами у своїй папці <user_id>/
drop policy if exists "rabbit_photos_select_own" on storage.objects;
drop policy if exists "rabbit_photos_insert_own" on storage.objects;
drop policy if exists "rabbit_photos_delete_own" on storage.objects;

create policy "rabbit_photos_select_own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'rabbit-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "rabbit_photos_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'rabbit-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "rabbit_photos_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'rabbit-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
