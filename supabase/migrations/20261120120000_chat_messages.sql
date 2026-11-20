-- Міграція: внутрішній чат для зареєстрованих користувачів (тільки текст).
-- Повідомлення живуть 3 дні, потім видаляються з бази щогодини (pg_cron).
-- УВАГА: у продакшені ці зміни вже застосовані вручну через SQL Editor.
-- Файл потрібен для історії репозиторію та відтворення бази з нуля.

-- ===== Частина 1: таблиця, політики доступу, тригер =====

-- Повідомлення "живе" 3 дні: після цього воно просто перестає віддаватися
-- (правило в RLS). Фізичне видалення рядків додамо наступним кроком.

create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  -- автор підставляється сам з сесії, підробити його з клієнта не вийде
  user_id     uuid not null default auth.uid()
              references auth.users (id) on delete cascade,
  body        text not null
              check (char_length(btrim(body)) between 1 and 1000),
  -- відповідь на інше повідомлення; якщо оригінал зник, поле стане null
  reply_to    uuid references public.chat_messages (id) on delete set null,
  created_at  timestamptz not null default now(),
  edited_at   timestamptz
);

create index chat_messages_created_at_idx
  on public.chat_messages (created_at desc);

alter table public.chat_messages enable row level security;

-- Доступ до таблиці тільки для залогінених (анонімним не даємо нічого)
grant select, insert, update, delete on public.chat_messages to authenticated;

-- Читати: тільки залогінені, тільки повідомлення молодші за 3 дні
create policy "chat read"
  on public.chat_messages for select
  to authenticated
  using (created_at > now() - interval '3 days');

-- Писати: тільки від свого імені
create policy "chat insert own"
  on public.chat_messages for insert
  to authenticated
  with check (user_id = auth.uid());

-- Редагувати: тільки своє і поки воно не прострочене
create policy "chat update own"
  on public.chat_messages for update
  to authenticated
  using (user_id = auth.uid() and created_at > now() - interval '3 days')
  with check (user_id = auth.uid());

-- Видаляти: тільки своє
create policy "chat delete own"
  on public.chat_messages for delete
  to authenticated
  using (user_id = auth.uid());

-- При редагуванні можна змінити тільки текст.
-- Автора, дату створення і reply_to змінити не можна
-- (інакше можна було б "оживити" старе повідомлення).
create or replace function public.chat_messages_before_update()
returns trigger
language plpgsql
as $$
begin
  new.user_id    := old.user_id;
  new.created_at := old.created_at;
  new.reply_to   := old.reply_to;
  if new.body is distinct from old.body then
    new.edited_at := now();
  end if;
  return new;
end;
$$;

create trigger chat_messages_before_update
  before update on public.chat_messages
  for each row execute function public.chat_messages_before_update();

-- ===== Частина 2: автоматичне видалення старих повідомлень =====

-- Видалення виконує сама база даних за розкладом (розширення pg_cron),
-- ні GitHub Actions, ні Vercel-функції для цього не потрібні.

-- 1) Увімкнути планувальник (якщо вже увімкнений, нічого не станеться)
create extension if not exists pg_cron;

-- 2) Задача: щогодини видаляти все, що старше 3 днів.
--    Той самий критерій, що й у правилі читання з кроку 1.
--    Повторний запуск цього файлу оновить задачу, дублів не буде.
select cron.schedule(
  'chat-delete-expired',
  '0 * * * *',
  $$ delete from public.chat_messages
     where created_at < now() - interval '3 days' $$
);

-- 3) Перевірка (запустіть окремо після виконання):
--    select jobid, jobname, schedule, active from cron.job;
--    Через годину:
--    select status, return_message, start_time
--    from cron.job_run_details order by start_time desc limit 5;
