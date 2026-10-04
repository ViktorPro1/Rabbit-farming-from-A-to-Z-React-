-- Міграція: get_user_data_usage()
--
-- Проблема: функція брала pg_total_relation_size таблиці, ділила на кількість
-- рядків і множила на рядки користувача. Розмір таблиці росте лише блоками
-- по 8 КБ, тому цифра по користувачу не змінювалась після нових записів.
--
-- Зараз:
--   total_bytes: місце користувача в базі на диску (дані + індекси + TOAST).
--                Частка повного розміру таблиці, пропорційна до розміру
--                рядків користувача. Росте ступінчасто, блоками по 8 КБ.
--   data_bytes:  чистий розмір записів користувача (pg_column_size + 24 байти
--                заголовка кортежу). Росте з кожним записом.
--
-- Таблиці знаходяться автоматично:
--   1) усі базові таблиці public із колонкою user_id (крім admins);
--   2) таблиці з rabbit_id без user_id (власник через rabbits).
-- Нова таблиця з user_id потрапляє в підрахунок без змін у функції.
--
-- Колонка total_bytes збережена, тому Admin.tsx змінювати не треба.
-- Тип результату змінюється (додано data_bytes), тому спочатку DROP.

DROP FUNCTION IF EXISTS public.get_user_data_usage();

CREATE FUNCTION public.get_user_data_usage()
 RETURNS TABLE(user_id uuid, email text, total_bytes bigint, data_bytes bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  tbl text;
  tbl_size bigint;
  parts text[] := '{}';
  final_sql text;
begin
  if not exists (select 1 from admins where admins.user_id = auth.uid()) then
    raise exception 'Доступ заборонено: лише для адміністраторів';
  end if;

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

  if array_length(parts, 1) is null then
    return;
  end if;

  final_sql := 'select u.uid, p.email, round(sum(u.disk_b))::bigint as total_bytes, round(sum(u.data_b))::bigint as data_bytes from ('
    || array_to_string(parts, ' union all ')
    || ') u left join profiles p on p.id = u.uid group by u.uid, p.email order by 3 desc';

  return query execute final_sql;
end;
$function$;
