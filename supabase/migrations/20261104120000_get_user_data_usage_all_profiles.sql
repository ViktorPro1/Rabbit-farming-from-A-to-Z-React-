-- Міграція: get_user_data_usage повертає всіх зареєстрованих користувачів.
-- Застосована в Supabase (проєкт rabbit-registry) 2026-11-04 під назвою
-- get_user_data_usage_all_profiles.
--
-- Що змінено відносно попередньої версії функції:
-- 1. Стартовий елемент parts - заглушка з 0 рядків, щоб запит будувався
--    навіть коли жодної таблиці з даними не знайдено.
-- 2. left join profiles замінено на full outer join profiles: у результаті є
--    всі зареєстровані (навіть без записів, з 0 байт) і ті, чий профіль
--    видалено, а дані лишились (email = null).
-- 3. Сортування: за data_bytes за спаданням, потім за email.
-- Сигнатура (user_id, email, total_bytes, data_bytes) не змінилась,
-- права доступу до функції зберігаються (CREATE OR REPLACE).

CREATE OR REPLACE FUNCTION public.get_user_data_usage()
 RETURNS TABLE(user_id uuid, email text, total_bytes bigint, data_bytes bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  tbl text;
  tbl_size bigint;
  -- Змінено: стартовий елемент-заглушка (0 рядків), щоб запит будувався
  -- навіть коли жодна таблиця з даними не знайдена. Раніше в такому
  -- випадку функція просто повертала порожній результат.
  parts text[] := array['select null::uuid as uid, 0::numeric as data_b, 0::numeric as disk_b where false'];
  final_sql text;
begin
  if not exists (select 1 from admins where admins.user_id = auth.uid()) then
    raise exception 'Доступ заборонено: лише для адміністраторів';
  end if;

  -- total_bytes: частка користувача в місці таблиць на диску (сторінки по 8 КБ,
  -- тому росте стрибками). data_bytes: чистий розмір його записів, росте з
  -- кожним доданим рядком.
  for tbl in
    select c.table_name
    from information_schema.columns c
    join information_schema.tables t
      on t.table_schema = c.table_schema and t.table_name = c.table_name
     and t.table_type = 'BASE TABLE'
    where c.table_schema = 'public' and c.column_name = 'user_id'
      and c.table_name <> 'admins'
    order by 1
  loop
    tbl_size := pg_total_relation_size(format('%I', tbl)::regclass);
    parts := parts || format(
      'select t.user_id as uid, sum(pg_column_size(t.*) + 24)::numeric as data_b, (%s::numeric * sum(pg_column_size(t.*) + 24) / nullif((select sum(pg_column_size(x.*) + 24) from %I x), 0)) as disk_b from %I t where t.user_id is not null group by t.user_id',
      tbl_size, tbl, tbl
    );
  end loop;

  for tbl in
    select c.table_name
    from information_schema.columns c
    join information_schema.tables t
      on t.table_schema = c.table_schema and t.table_name = c.table_name
     and t.table_type = 'BASE TABLE'
    where c.table_schema = 'public' and c.column_name = 'rabbit_id'
      and not exists (
        select 1 from information_schema.columns u
        where u.table_schema = 'public' and u.table_name = c.table_name
          and u.column_name = 'user_id'
      )
    order by 1
  loop
    tbl_size := pg_total_relation_size(format('%I', tbl)::regclass);
    parts := parts || format(
      'select rb.user_id as uid, sum(pg_column_size(t.*) + 24)::numeric as data_b, (%s::numeric * sum(pg_column_size(t.*) + 24) / nullif((select sum(pg_column_size(x.*) + 24) from %I x), 0)) as disk_b from %I t join rabbits rb on rb.id = t.rabbit_id where rb.user_id is not null group by rb.user_id',
      tbl_size, tbl, tbl
    );
  end loop;

  -- Змінено: full outer join з profiles замість left join. Тепер у списку
  -- є всі зареєстровані користувачі (навіть без жодного запису, з 0 байт),
  -- а також ті, чий профіль видалено, але дані лишились (email = null).
  final_sql := 'select coalesce(u.uid, p.id) as user_id, p.email, coalesce(round(sum(u.disk_b)), 0)::bigint as total_bytes, coalesce(round(sum(u.data_b)), 0)::bigint as data_bytes from ('
    || array_to_string(parts, ' union all ')
    || ') u full outer join profiles p on p.id = u.uid group by coalesce(u.uid, p.id), p.email order by 4 desc, 2';

  return query execute final_sql;
end;
$function$;
