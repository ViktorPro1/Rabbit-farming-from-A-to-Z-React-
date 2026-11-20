-- Міграція: лічильник нових повідомлень чату (червоний кружечок у хедері).
-- Запускати в Supabase -> SQL Editor ПІСЛЯ міграцій чату і Засновника.
-- Для кожного користувача зберігається один час: коли він востаннє
-- відкривав чат. Нові = чужі повідомлення, створені після цього часу.

create table public.chat_reads (
  user_id      uuid primary key default auth.uid()
               references auth.users (id) on delete cascade,
  last_read_at timestamptz not null default now()
);

alter table public.chat_reads enable row level security;

grant select, insert, update on public.chat_reads to authenticated;

create policy "chat_reads select own"
  on public.chat_reads for select
  to authenticated
  using (user_id = auth.uid());

create policy "chat_reads insert own"
  on public.chat_reads for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "chat_reads update own"
  on public.chat_reads for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- "Я прочитав чат": час ставить база, а не годинник пристрою
create or replace function public.chat_mark_read()
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.chat_reads (user_id, last_read_at)
  values (auth.uid(), now())
  on conflict (user_id) do update set last_read_at = excluded.last_read_at;
$$;

-- Скільки нових (чужих, молодших за 3 дні, створених після останнього
-- відкриття чату). Якщо користувач ще жодного разу не відкривав чат,
-- нові всі чужі повідомлення, що ще живуть.
create or replace function public.chat_unread_count()
returns integer
language sql
stable
security invoker
set search_path = ''
as $$
  select count(*)::integer
  from public.chat_messages m
  where m.user_id <> auth.uid()
    and m.created_at > now() - interval '3 days'
    and m.created_at > coalesce(
      (select r.last_read_at from public.chat_reads r where r.user_id = auth.uid()),
      '-infinity'::timestamptz
    );
$$;

revoke all on function public.chat_mark_read() from public;
revoke execute on function public.chat_mark_read() from anon;
grant execute on function public.chat_mark_read() to authenticated;

revoke all on function public.chat_unread_count() from public;
revoke execute on function public.chat_unread_count() from anon;
grant execute on function public.chat_unread_count() to authenticated;
