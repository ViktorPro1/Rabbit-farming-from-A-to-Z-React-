-- Міграція: таблиця breeding_plan для сторінки «План підбору» (Блок 3: список запланованих злучок).
--
-- Нова таблиця. Існуючі таблиці не змінюються і не видаляються.
-- Сторінка BreedingPlan.tsx (Блок 1) цієї таблиці не потребує: вона читає rabbits, matings, litters.
-- Таблиця знадобиться, коли в «Плані підбору» з'явиться кнопка «Запланувати злучку».

create table public.breeding_plan (
    id              uuid primary key default gen_random_uuid(),
    user_id         uuid not null references auth.users (id) on delete cascade,

    -- Самка обов'язкова. Якщо її видалять з реєстру, план для неї втрачає сенс.
    female_id       uuid not null references public.rabbits (id) on delete cascade,

    -- Самець і запасний самець необов'язкові. Якщо самця видалять, план залишається.
    male_id         uuid references public.rabbits (id) on delete set null,
    backup_male_id  uuid references public.rabbits (id) on delete set null,

    planned_date    date not null,

    -- planned: заплановано, done: виконано, cancelled: скасовано
    status          text not null default 'planned',

    notes           text,

    -- Заповнюється, коли за планом створено справжню злучку в matings.
    mating_id       uuid references public.matings (id) on delete set null,

    created_at      timestamptz not null default now(),

    constraint breeding_plan_status_check
        check (status in ('planned', 'done', 'cancelled')),
    constraint breeding_plan_male_differs_check
        check (male_id is null or male_id <> female_id),
    constraint breeding_plan_backup_differs_check
        check (backup_male_id is null or backup_male_id <> female_id)
);

comment on table public.breeding_plan is
    'План підбору: запланована злучка самки з самцем на певну дату.';
comment on column public.breeding_plan.status is
    'planned (заплановано), done (виконано), cancelled (скасовано).';
comment on column public.breeding_plan.mating_id is
    'Посилання на злучку в matings, створену за цим планом.';

-- Індекси під запити сторінки: «мої заплановані злучки за датою» і «план для самки».
create index breeding_plan_user_status_date_idx
    on public.breeding_plan (user_id, status, planned_date);
create index breeding_plan_female_idx
    on public.breeding_plan (female_id);

-- Доступ: кожен бачить і змінює лише свої рядки (як у matings, paddocks, quarantine).
alter table public.breeding_plan enable row level security;

create policy owner_breeding_plan
    on public.breeding_plan
    for all
    to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

-- Відкат (виконувати вручну, лише якщо потрібно скасувати міграцію):
-- drop table public.breeding_plan;
