-- Міграція: реакції під повідомленнями чату (подобається, не подобається,
-- рукостискання). Запускати в Supabase -> SQL Editor ПІСЛЯ попередніх
-- міграцій чату.
-- Правило: одна реакція від людини на повідомлення. Натиснув іншу, і вона
-- замінила попередню. Натиснув ту саму, і реакцію знято.
-- Хто саме поставив реакцію, інші користувачі не бачать: клієнт отримує лише
-- кількості та позначку "це моя".

create table public.chat_reactions (
  message_id uuid not null
             references public.chat_messages (id) on delete cascade,
  user_id    uuid not null default auth.uid()
             references auth.users (id) on delete cascade,
  kind       text not null check (kind in ('up', 'down', 'handshake')),
  created_at timestamptz not null default now(),
  primary key (message_id, user_id)
);

alter table public.chat_reactions enable row level security;

grant select, insert, update, delete on public.chat_reactions to authenticated;

-- Напряму з таблиці користувач бачить і змінює лише свої реакції.
-- Видалення повідомлення (в тому числі автоматичне через 3 дні) прибирає
-- і його реакції каскадом, тому окремого прибирання не потрібно.
create policy "chat_reactions select own"
  on public.chat_reactions for select
  to authenticated
  using (user_id = auth.uid());

create policy "chat_reactions insert own"
  on public.chat_reactions for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "chat_reactions update own"
  on public.chat_reactions for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "chat_reactions delete own"
  on public.chat_reactions for delete
  to authenticated
  using (user_id = auth.uid());

-- Поставити / замінити / зняти реакцію однією атомарною дією.
-- security invoker: працюють звичайні правила доступу (повідомлення, яке ти
-- не бачиш, наприклад прострочене, реакції не приймає).
create or replace function public.chat_set_reaction(
  p_message_id uuid,
  p_kind text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_existing text;
begin
  if p_kind not in ('up', 'down', 'handshake') then
    raise exception 'invalid reaction kind';
  end if;

  if not exists (
    select 1 from public.chat_messages where id = p_message_id
  ) then
    raise exception 'message not found';
  end if;

  select kind into v_existing
  from public.chat_reactions
  where message_id = p_message_id and user_id = auth.uid();

  if v_existing = p_kind then
    delete from public.chat_reactions
    where message_id = p_message_id and user_id = auth.uid();
  else
    insert into public.chat_reactions (message_id, user_id, kind)
    values (p_message_id, auth.uid(), p_kind)
    on conflict (message_id, user_id) do update set kind = excluded.kind;
  end if;
end;
$$;

-- Зведення для екрана: по кожному повідомленню й виду реакції кількість і
-- чи є серед них моя. security definer, бо чужі реакції напряму недоступні.
-- Видимість вимкнених RLS тут задано вручну: тільки залогінені і тільки
-- повідомлення молодші за 3 дні.
create or replace function public.chat_reaction_counts()
returns table (message_id uuid, kind text, cnt integer, mine boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select
    r.message_id,
    r.kind,
    count(*)::integer,
    coalesce(bool_or(r.user_id = auth.uid()), false)
  from public.chat_reactions r
  join public.chat_messages m on m.id = r.message_id
  where auth.uid() is not null
    and m.created_at > now() - interval '3 days'
  group by r.message_id, r.kind;
$$;

revoke all on function public.chat_set_reaction(uuid, text) from public;
revoke execute on function public.chat_set_reaction(uuid, text) from anon;
grant execute on function public.chat_set_reaction(uuid, text) to authenticated;

revoke all on function public.chat_reaction_counts() from public;
revoke execute on function public.chat_reaction_counts() from anon;
grant execute on function public.chat_reaction_counts() to authenticated;
