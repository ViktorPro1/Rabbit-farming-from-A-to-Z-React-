-- Міграція: облік запасів кормів (таблиця feed_batches).
-- Партії кормів створюються автоматично з витрат категорії "feed"
-- (тригер на expenses). Працює за тим самим принципом, що й
-- medication_batches (Аптечка).

-- 1. Таблиця партій кормів
create table public.feed_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expense_id uuid references public.expenses(id) on delete set null,
  name text not null,
  purchase_date date not null,
  quantity_purchased numeric check (quantity_purchased > 0),
  quantity_remaining numeric check (quantity_remaining >= 0),
  needs_details boolean not null default true,
  used_up boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Одна витрата створює не більше однієї партії
create unique index feed_batches_expense_id_key
  on public.feed_batches (expense_id)
  where expense_id is not null;

create index idx_feed_batches_user_date
  on public.feed_batches (user_id, purchase_date desc);

-- 2. Службова логіка партії (кількість, залишок, "використано все")
create or replace function public.touch_feed_batch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  -- вписали кількість: знімаємо позначку "потребує уточнення"
  -- і виставляємо залишок рівним закупленому, якщо його ще немає
  if new.quantity_purchased is not null then
    new.needs_details = false;
    if new.quantity_remaining is null then
      new.quantity_remaining = new.quantity_purchased;
    end if;
  end if;

  -- "Використано все"
  if new.used_up = true then
    new.quantity_remaining = 0;
  end if;

  -- залишок дійшов до нуля: партію закрито
  if new.quantity_purchased is not null
     and new.quantity_remaining is not null
     and new.quantity_remaining <= 0 then
    new.used_up = true;
  end if;

  return new;
end;
$$;

create trigger trg_touch_feed_batch
  before insert or update on public.feed_batches
  for each row execute function public.touch_feed_batch();

-- 3. Автоматичне створення партії з нової витрати категорії "feed"
create or replace function public.create_feed_batch_from_expense()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.category = 'feed' then
    insert into public.feed_batches (user_id, expense_id, name, purchase_date)
    values (
      new.user_id,
      new.id,
      coalesce(nullif(trim(new.description), ''), 'Корм (без опису)'),
      new.expense_date
    );
  end if;
  return new;
end;
$$;

create trigger trg_create_feed_batch
  after insert on public.expenses
  for each row execute function public.create_feed_batch_from_expense();

-- 4. Захист даних: кожен бачить лише свої записи
alter table public.feed_batches enable row level security;

create policy feed_batches_select_own on public.feed_batches
  for select using ((select auth.uid()) = user_id);
create policy feed_batches_insert_own on public.feed_batches
  for insert with check ((select auth.uid()) = user_id);
create policy feed_batches_update_own on public.feed_batches
  for update using ((select auth.uid()) = user_id);
create policy feed_batches_delete_own on public.feed_batches
  for delete using ((select auth.uid()) = user_id);

-- 5. Перенесення вже існуючих витрат на корм.
-- Витрати за останні 30 днів потрапляють у "Потребують уточнення"
-- (треба вписати кількість), старіші одразу позначаються як використані,
-- щоб не засмічувати список.
insert into public.feed_batches
  (user_id, expense_id, name, purchase_date, needs_details, used_up)
select
  e.user_id,
  e.id,
  coalesce(nullif(trim(e.description), ''), 'Корм (без опису)'),
  e.expense_date,
  e.expense_date >= current_date - 30,
  e.expense_date < current_date - 30
from public.expenses e
where e.category = 'feed'
  and not exists (
    select 1 from public.feed_batches b where b.expense_id = e.id
  );