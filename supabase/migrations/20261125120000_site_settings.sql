-- 2026-11-25: site_settings — прості налаштування сайту (ключ → значення jsonb).
-- Перший ключ: festive_mode (святкові гірлянди й сніг, вмикається галочкою в адмінці).
--
-- Безпечна для повторного запуску.
--  * читати може будь-хто (гості теж бачать свято);
--  * змінювати можуть лише адміни (таблиця public.admins).

CREATE TABLE IF NOT EXISTS public.site_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Only admins can insert site settings" ON public.site_settings;
CREATE POLICY "Only admins can insert site settings"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE admins.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can update site settings" ON public.site_settings;
CREATE POLICY "Only admins can update site settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admins WHERE admins.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE admins.user_id = auth.uid())
  );

-- Мінімально необхідні права (RLS додатково обмежує запис лише адмінами)
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;

-- Святковий режим за замовчуванням вимкнений
INSERT INTO public.site_settings (key, value)
VALUES ('festive_mode', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;
