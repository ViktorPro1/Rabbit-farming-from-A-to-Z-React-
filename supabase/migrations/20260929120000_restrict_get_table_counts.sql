-- Аудит 2026-09-29: get_table_counts() була SECURITY DEFINER без перевірки ролі
-- і без явних REVOKE у міграціях. Будь-який авторизований користувач міг
-- отримати глобальні кількості рядків.
--
-- Що робить ця міграція:
-- 1. Перевизначає get_table_counts() на plpgsql (у LANGUAGE sql не можна
--    зробити RAISE) з тією ж перевіркою адміна, що й get_user_data_usage():
--    наявність auth.uid() у таблиці admins.
-- 2. Додає SET search_path (обов'язково для SECURITY DEFINER).
-- 3. Явно відкликає EXECUTE у PUBLIC/anon і дає лише authenticated, щоб стан
--    прав відтворювався з репозиторію (на проді anon уже false).
-- 4. Те саме для get_user_data_usage(): перевірка адміна там уже є,
--    тут лише фіксуються права.
--
-- Сигнатура та тип результату (json) не змінені, фронтенд (Admin.tsx) без змін.

CREATE OR REPLACE FUNCTION public.get_table_counts()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not exists (select 1 from admins where admins.user_id = auth.uid()) then
    raise exception 'Доступ заборонено: лише для адміністраторів'
      using errcode = '42501';
  end if;

  return json_build_object(
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
end;
$function$;

REVOKE EXECUTE ON FUNCTION public.get_table_counts()    FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_table_counts()    TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_user_data_usage() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_user_data_usage() TO authenticated;
