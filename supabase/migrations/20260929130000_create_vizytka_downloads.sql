-- Аудит 2026-09-29: таблиця vizytka_downloads (лічильник завантажень візитки)
-- існувала лише на проді (створена вручну), але не відтворювалась з міграцій.
--
-- Ця міграція описує поточний стан прода і безпечна для повторного запуску:
--  * на проді CREATE TABLE IF NOT EXISTS нічого не змінює, політики
--    перестворюються ідентично, GRANT ідемпотентні;
--  * на новій базі створюється таблиця, ввімкнений RLS і політики.
--
-- Використання:
--  * Vizytka.tsx: insert({}) від anon/authenticated (тому id і created_at
--    мають значення за замовчуванням);
--  * Admin.tsx: select count(*) — лише для адмінів.

CREATE TABLE IF NOT EXISTS public.vizytka_downloads (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vizytka_downloads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can log a download" ON public.vizytka_downloads;
CREATE POLICY "Anyone can log a download"
  ON public.vizytka_downloads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can read download log" ON public.vizytka_downloads;
CREATE POLICY "Only admins can read download log"
  ON public.vizytka_downloads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admins WHERE admins.user_id = auth.uid())
  );

-- Мінімально необхідні права (RLS додатково обмежує читання лише адмінами)
GRANT INSERT ON public.vizytka_downloads TO anon, authenticated;
GRANT SELECT ON public.vizytka_downloads TO authenticated;
