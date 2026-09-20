-- Інвайт-код перевіряється і погашається в базі в момент створення користувача.
-- Раніше код перевірявся лише в браузері, тому реєстрація напряму через API
-- створювала профіль (без коду) з безстроковим доступом.
--
-- Тепер handle_new_user() бере код з метаданих реєстрації (invite_code),
-- атомарно позначає його використаним і лише тоді створює профіль.
-- Якщо коду немає, він неправильний або вже використаний, виникає помилка,
-- і створення користувача скасовується цілком (разом з рядком у auth.users).
--
-- Наслідок: користувачів не можна створювати вручну в панелі Supabase
-- (Authentication -> Users -> Add user), бо там немає інвайт-коду.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  code_input text;
  claimed_id uuid;
begin
  code_input := upper(btrim(coalesce(new.raw_user_meta_data ->> 'invite_code', '')));

  if code_input = '' then
    raise exception 'invite_code_required';
  end if;

  -- Один UPDATE замість "перевірити, потім позначити": два користувачі
  -- одночасно не можуть погасити той самий код.
  update public.invite_codes
     set is_used = true,
         used_by = new.id
   where code = code_input
     and coalesce(is_used, false) = false
  returning id into claimed_id;

  if claimed_id is null then
    raise exception 'invite_code_invalid_or_used';
  end if;

  insert into public.profiles (id, email)
  values (new.id, new.email);

  return new;
end;
$function$;

-- ВІДКАТ (якщо потрібно повернути стару поведінку): виконати замість вищого блоку
--
-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer
-- set search_path to 'public'
-- as $function$
-- begin
--   insert into public.profiles (id, email)
--   values (new.id, new.email);
--   return new;
-- end;
-- $function$;
