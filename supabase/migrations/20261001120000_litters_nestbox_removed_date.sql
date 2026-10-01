-- Дата, коли маточник забрано з клітки після окролу (нагадування на 20-й день).
-- Застосовано в Supabase 2026-10-01; файл збережено для історії схеми.
alter table public.litters
  add column if not exists nestbox_removed_date date;
