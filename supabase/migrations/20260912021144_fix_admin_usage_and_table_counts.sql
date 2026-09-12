-- Це поточний стан двох функцій, які вже застосовані напряму в Supabase
-- (raw SQL editor), але досі не існували як файл міграції в репозиторії.
--
-- Що виправлено (сумарно за три послідовні правки):
-- 1. get_table_counts(): "weight_log" (застаріла, 0 рядків) замінено на
--    "weighings"; додано таблиці, яких у підрахунку не було взагалі
--    (аптечка, фінанси, дезінфекція, рецепти, самки у вольєрах).
-- 2. get_user_data_usage(): замість "сирого" розміру значень (pg_column_size)
--    тепер рахується реальний розмір таблиці НА ДИСКУ (дані + індекси + TOAST,
--    pg_total_relation_size), розподілений між користувачами пропорційно
--    кількості їхніх рядків у кожній таблиці.
-- 3. Прибрано тимчасову таблицю (temp table) з get_user_data_usage() —
--    у зв'язці з пулером з'єднань Supabase (transaction-режим) вона іноді
--    повертала порожній результат. Замінено на один динамічний запит,
--    виконаний через RETURN QUERY EXECUTE.

CREATE OR REPLACE FUNCTION public.get_table_counts()
 RETURNS json
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  select json_build_object(
    'rabbits',             (select count(*) from rabbits),
    'matings',             (select count(*) from matings),
    'litters',             (select count(*) from litters),
    'fattening',           (select count(*) from fattening),
    'quarantine',          (select count(*) from quarantine),
    'paddocks',            (select count(*) from paddocks),
    'paddock_matings',     (select count(*) from paddock_matings),
    'paddock_litters',     (select count(*) from paddock_litters),
    'paddock_females',     (select count(*) from paddock_females),
    'weighings',           (select count(*) from weighings),
    'health_log',          (select count(*) from health_log),
    'treatments',          (select count(*) from treatments),
    'vaccinations',        (select count(*) from vaccinations),
    'medication_batches',  (select count(*) from medication_batches),
    'cage_disinfections',  (select count(*) from cage_disinfections),
    'sales',               (select count(*) from sales),
    'expenses',            (select count(*) from expenses),
    'other_income',        (select count(*) from other_income),
    'grain_recipes',       (select count(*) from grain_recipes),
    'profiles',            (select count(*) from profiles),
    'invite_codes',        (select count(*) from invite_codes)
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_user_data_usage()
 RETURNS TABLE(user_id uuid, email text, total_bytes bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  direct_tables text[] := array[
    'rabbits','matings','litters','fattening','quarantine','paddocks',
    'paddock_matings','paddock_litters','treatments','vaccinations','weighings',
    'medication_batches','cage_disinfections','sales','expenses','other_income',
    'grain_recipes','push_subscriptions'
  ];
  rabbit_tables text[] := array['health_log','paddock_females'];
  tbl text;
  total_rows bigint;
  total_size bigint;
  per_row numeric;
  parts text[] := '{}';
  final_sql text;
begin
  if not exists (select 1 from admins where admins.user_id = auth.uid()) then
    raise exception 'Доступ заборонено: лише для адміністраторів';
  end if;

  -- Таблиці з власною колонкою user_id
  foreach tbl in array direct_tables loop
    execute format('select count(*) from %I', tbl) into total_rows;
    if total_rows > 0 then
      total_size := pg_total_relation_size(tbl::regclass);
      per_row := total_size::numeric / total_rows;
      parts := parts || format(
        'select user_id as uid, count(*)::numeric * %s as bytes from %I where user_id is not null group by user_id',
        per_row, tbl
      );
    end if;
  end loop;

  -- Таблиці без user_id, прив'язані через rabbit_id -> власник кроля
  foreach tbl in array rabbit_tables loop
    execute format('select count(*) from %I', tbl) into total_rows;
    if total_rows > 0 then
      total_size := pg_total_relation_size(tbl::regclass);
      per_row := total_size::numeric / total_rows;
      parts := parts || format(
        'select rb.user_id as uid, count(*)::numeric * %s as bytes from %I t join rabbits rb on rb.id = t.rabbit_id where rb.user_id is not null group by rb.user_id',
        per_row, tbl
      );
    end if;
  end loop;

  if array_length(parts, 1) is null then
    return;
  end if;

  final_sql := 'select u.uid, p.email, round(sum(u.bytes))::bigint as total_bytes from ('
    || array_to_string(parts, ' union all ')
    || ') u left join profiles p on p.id = u.uid group by u.uid, p.email order by 3 desc';

  return query execute final_sql;
end;
$function$;
