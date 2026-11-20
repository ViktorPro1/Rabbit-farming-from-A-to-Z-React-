-- Міграція: бейдж "Засновник" у чаті та право Засновника видаляти будь-які
-- повідомлення. Запускати в Supabase -> SQL Editor ПІСЛЯ попередньої міграції
-- чату. Засновник = profiles.plan_type = 'founder'.
-- Тип плану (vip тощо) інших користувачів клієнту не віддається: у повідомленні
-- зберігається лише прапорець "автор - засновник".

-- 1) Прапорець у повідомленні
alter table public.chat_messages
  add column author_is_founder boolean not null default false;

-- 2) Заповнити прапорець для вже існуючих повідомлень
--    (робити ДО оновлення тригера нижче, бо новий тригер замороження
--    не дав би змінити це поле)
update public.chat_messages m
set author_is_founder = exists (
  select 1 from public.profiles p
  where p.id = m.user_id and p.plan_type = 'founder'
);

-- 3) Функція "поточний користувач - засновник?".
--    security definer: читає profiles з правами власника, бо звичайний
--    користувач не бачить чужих профілів. Без параметрів, тож про інших
--    користувачів через неї нічого не дізнатися.
create or replace function public.is_founder()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and plan_type = 'founder'
  );
$$;

revoke all on function public.is_founder() from public;
revoke execute on function public.is_founder() from anon;
grant execute on function public.is_founder() to authenticated;

-- 4) При створенні повідомлення прапорець ставить база, а не клієнт
--    (підробити "я засновник" з клієнта не вийде)
create or replace function public.chat_messages_before_insert()
returns trigger
language plpgsql
as $$
begin
  new.author_is_founder := public.is_founder();
  return new;
end;
$$;

create trigger chat_messages_before_insert
  before insert on public.chat_messages
  for each row execute function public.chat_messages_before_insert();

-- 5) Тригер редагування: додано заморожування прапорця
create or replace function public.chat_messages_before_update()
returns trigger
language plpgsql
as $$
begin
  new.user_id            := old.user_id;
  new.created_at         := old.created_at;
  new.reply_to           := old.reply_to;
  new.author_is_founder  := old.author_is_founder;
  if new.body is distinct from old.body then
    new.edited_at := now();
  end if;
  return new;
end;
$$;

-- 6) Видалення: своє, або будь-яке, якщо ти засновник
drop policy "chat delete own" on public.chat_messages;

create policy "chat delete own or founder"
  on public.chat_messages for delete
  to authenticated
  using (user_id = auth.uid() or public.is_founder());
