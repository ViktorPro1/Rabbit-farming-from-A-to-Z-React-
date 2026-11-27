-- Аудит 2026-11-27 (радники безпеки Supabase + перевірка прав функцій).
--
-- Що знайдено:
-- 1. get_db_size() була SECURITY DEFINER без перевірки ролі: будь-який
--    авторизований користувач міг викликати її через /rest/v1/rpc і дізнатися
--    розмір бази. Інші адмін-функції (get_table_counts, get_user_data_usage,
--    get_storage_usage, get_user_herd_counts, get_deactivated_users) перевірку
--    адміна вже мають.
-- 2. get_user_data_usage() на проді доступна ролям PUBLIC і anon (міграція
--    20260929120000 мала це закрити, але фактичні права на проді інші).
--    Для не-адміна функція й так кидає помилку, тож це лише гігієна прав.
-- 3. П'ять функцій без фіксованого search_path (попередження радника
--    function_search_path_mutable).
--
-- Що робить ця міграція:
-- 1. Перевизначає get_db_size() на plpgsql з тією ж перевіркою адміна, що й
--    get_table_counts(): наявність auth.uid() у таблиці admins. Сигнатура та
--    тип результату (bigint) не змінені, фронтенд (Admin.tsx) без змін.
-- 2. Явно відкликає EXECUTE у PUBLIC/anon для get_db_size() і get_user_data_usage()
--    і дає лише authenticated (адмін-панель викликає їх із сесії користувача).
-- 3. Задає SET search_path = public для п'яти функцій. Значення public збігається
--    з рештою функцій проєкту, тому звернення до таблиць без префікса працюють
--    як і раніше.
--
-- Навмисно не змінюється: тригерні функції handle_new_user, rls_auto_enable,
-- create_feed_batch_from_expense, create_medication_batch_from_expense (REST їх
-- викликати не може, а зміна прав ризикує зламати реєстрацію), а також публічні
-- get_public_* і validate_invite_code (потрібні QR-сторінці та реєстрації).

-- 1. get_db_size(): додано перевірку адміністратора
CREATE OR REPLACE FUNCTION public.get_db_size()
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not exists (select 1 from public.admins a where a.user_id = auth.uid()) then
    raise exception 'Доступ заборонено: лише для адміністраторів'
      using errcode = '42501';
  end if;

  return pg_database_size(current_database());
end;
$function$;

-- 2. Права: лише authenticated (адмін перевіряється всередині функцій)
REVOKE EXECUTE ON FUNCTION public.get_db_size() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_db_size() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_user_data_usage() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_user_data_usage() TO authenticated;

-- 3. Фіксований search_path для функцій, де він не був заданий
ALTER FUNCTION public.create_medication_batch_from_expense() SET search_path = public;
ALTER FUNCTION public.touch_medication_batch()               SET search_path = public;
ALTER FUNCTION public.touch_feed_batch()                     SET search_path = public;
ALTER FUNCTION public.chat_messages_before_update()          SET search_path = public;
ALTER FUNCTION public.chat_messages_before_insert()          SET search_path = public;

-- Відкат (за потреби):
--   CREATE OR REPLACE FUNCTION public.get_db_size() RETURNS bigint
--     LANGUAGE sql SECURITY DEFINER
--     AS $f$ select pg_database_size(current_database()); $f$;
--   ALTER FUNCTION public.<ім'я>() RESET search_path;  -- для п'яти функцій з пункту 3
