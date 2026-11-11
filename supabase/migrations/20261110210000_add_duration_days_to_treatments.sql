-- Скільки днів підряд давати препарат (тривалість курсу).
-- Поле course_days далі означає "через скільки днів повтор".
alter table public.treatments
  add column if not exists duration_days integer;

comment on column public.treatments.duration_days is
  'Скільки днів підряд давати препарат (тривалість курсу). NULL або 1 - разовий прийом.';
