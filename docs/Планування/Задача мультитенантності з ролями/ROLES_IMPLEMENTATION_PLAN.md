# План реалізації ролей (власник / робітник / бухгалтер / ветлікар)

Документ описує повний обсяг робіт для переходу від одноосібного акаунта до
мультикористувацького доступу з ролями в межах однієї ферми (організації).

Пов'язані файли:
- `multi-role-access-migration.sql` — SQL-міграція (organizations, memberships, RLS)
- `useOrganization.ts` — готовий hook (додано в цей пакет)
- `JoinOrganization.tsx/.css` — готова сторінка активації коду (додано)
- `ManageInvites.tsx/.css` — готова сторінка керування запрошеннями (додано)

Файли з позначкою **[ГОТОВО]** нижче вже створені і лежать поруч у цій видачі —
просто скопіюйте їх у проєкт за вказаним шляхом. Файли з позначкою **[ПРАВКА]**
вже існують у проєкті — їх треба відредагувати вручну, оскільки я не бачив їхній
поточний вміст і не хочу перезаписувати щось наосліп.

---

## Крок 0. База даних

- [ ] Застосувати `multi-role-access-migration.sql` через Supabase SQL Editor
- [ ] Виконати розділ 9 міграції (бекфіл): створити організацію для себе,
      додати себе як `owner` у `memberships`, проставити `organization_id`
      у всіх існуючих рядках `rabbits`, `matings`, `litters`, `fattening`,
      `weighings`, `quarantine`, `sales`, `disinfection_log`
- [ ] Перевірити старі публічні (`qual=true`) RLS-політики, якщо лишились
      з попереднього аудиту — звузити або видалити

## Крок 1. Фундамент (hook + guard)

- [ ] **[ГОТОВО]** Скопіювати `useOrganization.ts` → `src/hooks/useOrganization.ts`
- [ ] **[ПРАВКА]** `src/components/AccessGuard/AccessGuard.tsx` — додати:
  - виклик `useOrganization()` всередині
  - поки `loading` — показати спінер/заглушку
  - якщо `hasMembership === false` — редірект на `/join`
  - якщо є membership — пропускати далі як зараз
- [ ] **[ПРАВКА]** `src/pages/Auth/Auth.tsx` — переконатись, що після успішного
      логіну користувача веде на маршрут, де `AccessGuard` підхопить перевірку
      membership (найімовірніше додаткових змін тут не буде потрібно, якщо
      guard живе на рівні маршрутів кабінету — перевірте разом з наступним пунктом)

## Крок 2. Нові сторінки

- [ ] **[ГОТОВО]** Скопіювати `JoinOrganization.tsx` + `.css` →
      `src/pages/JoinOrganization/`
- [ ] **[ГОТОВО]** Скопіювати `ManageInvites.tsx` + `.css` →
      `src/pages/ManageInvites/`
- [ ] **[ПРАВКА]** `src/routes/groups/cabinetRoutes.tsx` — додати маршрути:
  ```tsx
  <Route path="/join" element={<JoinOrganization />} />
  <Route path="/manage-invites" element={<ManageInvites />} />
  ```
  (з відповідними lazy-імпортами за наявним у файлі патерном)

## Крок 3. Файли з insert/update — додати `organization_id`

Для кожного файлу: отримати `organizationId` через `useOrganization()`
на початку компонента, і передати його в кожен `.insert(...)` /
`.update(...)` виклик до Supabase.

- [ ] `src/pages/RabbitRegistry/RabbitRegistry.tsx`
- [ ] `src/pages/RabbitEdit/RabbitEdit.tsx`
- [ ] `src/pages/Matings/Matings.tsx`
- [ ] `src/pages/Paddocks/Paddocks.tsx`
- [ ] `src/pages/Fattening/Fattening.tsx`
- [ ] `src/pages/Quarantine/Quarantine.tsx`
- [ ] `src/pages/Weighing/Weighing.tsx`
- [ ] `src/pages/DisinfectionLog/DisinfectionLog.tsx`
- [ ] `src/pages/Archive/Archive.tsx`
- [ ] `src/pages/GrainRecipesHistory/GrainRecipesHistory.tsx`
- [ ] `src/pages/MyTreatments/MyTreatments.tsx`
- [ ] `src/pages/MyVaccinations/MyVaccinations.tsx`
- [ ] `src/pages/FinancesPage/FinancesPage.tsx`
- [ ] `src/pages/AptechkaPage/AptechkaPage.tsx`

Приклад правки (патерн, не готовий diff — підставте під реальний код файлу):

```tsx
const { organizationId } = useOrganization();
// ...
await supabase.from("rabbits").insert({
  ...formData,
  organization_id: organizationId,
});
```

## Крок 4. Файли тільки на читання — ймовірно без змін

RLS сам відфільтрує рядки, тож нічого руками фільтрувати не треба.
Просто перевірити після Кроку 0, що дані досі відображаються коректно:

- [ ] `src/pages/CageSearch/CageSearch.tsx`
- [ ] `src/pages/Statistics/Statistics.tsx`
- [ ] `src/pages/Calculator/Calculator.tsx`
- [ ] `src/pages/CalendarPage/CalendarPage.tsx`
- [ ] `src/pages/Pedigree/Pedigree.tsx`
- [ ] `src/pages/Admin/Admin.tsx` (окремо перевірити — можливо тут своя
      логіка, не пов'язана з фермою)

## Крок 5. Не чіпати

- `src/pages/RabbitPublic/RabbitPublic.tsx` — публічна QR-сторінка через RPC,
  навмисно без прив'язки до ролі
- `src/pages/FatteningPublic/FatteningPublic.tsx` — те саме
- `src/pages/NpsSurvey/NpsSurvey.tsx` — загальний фідбек сайту, не кабінетні дані

## Крок 6. UI під ролі

- [ ] Знайти компонент з пунктами меню кабінету (Реєстр, Оточення,
      Продажі, Карантин тощо — ймовірно в `Header.tsx` або окремо в
      `cabinetRoutes.tsx`) і додати умовний рендер за `role` з
      `useOrganization()`. Приклад мапи видимості:

  | Пункт меню            | owner | worker | accountant | vet |
  |------------------------|:-----:|:------:|:----------:|:---:|
  | Реєстр / Матінги / Оточення / Відгодівля / Зважування | ✓ | ✓ | – | – |
  | Карантин / Дезінфекція | ✓ | ✓ | – | ✓ |
  | Продажі / Фінанси      | ✓ | – | ✓ | – |
  | Керування запрошеннями | ✓ | – | – | – |

  (Це орієнтовний розподіл — узгодьте з реальними потребами кожної ролі.)

## Крок 7. Перевірка

- [ ] Створити тестового користувача, видати йому код з роллю `worker`,
      переконатись що він бачить тільки дозволені розділи і не може
      писати туди, куди не повинен (спробувати insert напряму через
      консоль — має впасти на RLS)
- [ ] Повторити для `accountant` і `vet`
- [ ] Перевірити, що власний (owner) доступ не зламався після міграції
