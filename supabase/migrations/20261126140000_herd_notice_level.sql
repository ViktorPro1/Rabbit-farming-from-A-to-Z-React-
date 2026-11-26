-- Автоматичний лист про ліміт поголів'я (перевірка checkHerdLimit у api/_lib/reminders.ts).
--
-- 1) profiles.herd_notice_level: рівень останнього надісланого листа,
--    щоб лист не йшов щодня.
--    0 = нічого не надсилали, 1 = "наближаєтесь до 100", 2 = "перевищило 100".
-- 2) get_herd_counts_for_cron(): кількість голів по користувачах.
--    Правило підрахунку те саме, що в get_user_herd_counts (для адмінки), але
--    без перевірки адміна, бо викликається з cron під service role.
--    Доступ мають лише service_role: звичайні користувачі її викликати не можуть.

alter table public.profiles
  add column if not exists herd_notice_level smallint not null default 0;

comment on column public.profiles.herd_notice_level is
  'Рівень останнього листа про ліміт поголів''я: 0 нічого, 1 наближається до 100, 2 перевищило 100';

create or replace function public.get_herd_counts_for_cron()
returns table(uid uuid, herd_count bigint)
language sql
stable
security definer
set search_path to 'public'
as $function$
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
$function$;

revoke all on function public.get_herd_counts_for_cron() from public, anon, authenticated;
grant execute on function public.get_herd_counts_for_cron() to service_role;
