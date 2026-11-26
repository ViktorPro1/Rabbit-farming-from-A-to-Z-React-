-- Тариф користувача для квитанції про оплату (api/notify-payment-receipt.ts).
-- base  = базовий тариф (до 100 голів), сума зі змінної Vercel SUBSCRIPTION_PRICE
-- large = для більшого поголів'я, сума зі змінної Vercel SUBSCRIPTION_PRICE_LARGE
-- Усі наявні користувачі отримують base, тож поточна поведінка не змінюється.
-- Тариф змінює адміністратор у таблиці користувачів в адмінці.

alter table public.profiles
  add column if not exists tariff text not null default 'base'
  constraint profiles_tariff_check check (tariff in ('base', 'large'));

comment on column public.profiles.tariff is
  'Тариф для квитанції про оплату: base (до 100 голів) або large (понад 100)';
