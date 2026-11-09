-- Функція для адмінки: скільки місця займають файли (фото) у Supabase Storage.
-- Повертає json: { "total_bytes": число, "file_count": число }.
-- Доступна лише адміністраторам (таблиця public.admins).

create or replace function public.get_storage_usage()
returns json
language plpgsql
security definer
set search_path = public, storage
as $$
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'forbidden';
  end if;

  return (
    select json_build_object(
      'total_bytes', coalesce(sum((metadata->>'size')::bigint), 0),
      'file_count', count(*)
    )
    from storage.objects
  );
end;
$$;

revoke all on function public.get_storage_usage() from public, anon;
grant execute on function public.get_storage_usage() to authenticated;
