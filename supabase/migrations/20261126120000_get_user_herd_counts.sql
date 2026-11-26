-- Міграція: функція get_user_herd_counts для адмінки.
-- Повертає кількість голів по кожному користувачу. Лише для адміністраторів.
-- Існуючу get_user_data_usage не змінює.
--
-- Що рахує:
--   реєстр (активні кролики)
--   + відгодівля (самці + самки + невідомі, активні записи)
--   + карантин (активні записи без rabbit_id, щоб не рахувати двічі
--     кроликів із реєстру)
--   + самки у вольєрах, яких немає в реєстрі (rabbit_id порожній)
-- Молодняк з окролів не входить, тому цифра може бути трохи нижчою
-- за блок "Статистика" в застосунку.

create or replace function public.get_user_herd_counts()
returns table(uid uuid, herd_count bigint)
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if not exists (select 1 from admins where admins.user_id = auth.uid()) then
    raise exception 'Доступ заборонено: лише для адміністраторів';
  end if;

  return query
  select u.owner_id, sum(u.cnt)::bigint
  from (
    select r.user_id as owner_id, count(*)::bigint as cnt
    from rabbits r
    where r.is_active is not false
    group by r.user_id

    union all

    select f.user_id, sum(coalesce(f.males, 0) + coalesce(f.females, 0) + coalesce(f.unknown, 0))::bigint
    from fattening f
    where f.is_active is not false
    group by f.user_id

    union all

    select q.user_id, count(*)::bigint
    from quarantine q
    where q.is_active is not false and q.rabbit_id is null
    group by q.user_id

    union all

    select p.user_id, count(*)::bigint
    from paddock_females x
    join paddocks p on p.id = x.paddock_id
    where x.rabbit_id is null
    group by p.user_id
  ) u
  where u.owner_id is not null
  group by u.owner_id;
end;
$function$;

revoke all on function public.get_user_herd_counts() from public, anon;
grant execute on function public.get_user_herd_counts() to authenticated;
