# RabbitRegistry: рефакторинг і карта файлів

Цей файл описує, що було зроблено зі сторінкою «Мої кролики» (`RabbitRegistry`), де тепер лежить кожна частина і що шукати в разі потреби. Покладіть його в папку `src/pages/RabbitRegistry/` як `README.md`.

## 1. Що зроблено

Файл `RabbitRegistry.tsx` розрісся до 2148 рядків і поєднував у собі все: типи, довідку, завантаження даних, експорт CSV, фото, налаштування, форму, шість модальних вікон і розмітку. Його розбили на менші файли за відповідальністю.

| Етап | Що винесено | Розмір `RabbitRegistry.tsx` після етапу |
|------|-------------|-----------------------------------------|
| Початок | нічого, один файл | 2148 |
| 1 | типи, константи, довідка, експорт CSV | 1488 |
| 2 | презентаційні компоненти (модалки, статистика, картка, навігація, зноска) | 967 |
| 3а | `ArchiveModal`, `SettingsModal`, `NewRabbitForm` | 434 |
| 3б | хуки `useRabbits`, `useArchiveRabbit`, `usePhotoViewer` | 179 |

Головне правило: **поведінка не змінилась**. Це чисте перенесення коду.

Як це перевірено на кожному етапі:

- Усі 27 тестів у `RabbitRegistry.test.tsx` проходять без жодної правки тесту.
- `tsc --noEmit` без помилок, `eslint` без зауважень.
- Окремо порівняно HTML-розмітку сторінки до і після у 18 станах (завантажено, навігація, довідка, QR, перегляд фото, форма заповнена/прихована/відкрита знову, налаштування, архівування та інші). Розмітка збіглася.
- Окремо порівняно файл експорту CSV до і після. Він ідентичний.

## 2. Структура папки

```
src/pages/RabbitRegistry/
  RabbitRegistry.tsx        склад сторінки (179 рядків)
  RabbitRegistry.css        усі стилі сторінки (не розбивався)
  RabbitRegistry.test.tsx   тести (без змін)
  SkeletonCard.tsx          заглушка картки під час завантаження
  types.ts                  типи Rabbit, Stats
  constants.ts              emptyForm, archiveReasons
  helpItems.ts              текст вікна «Як користуватись»
  exportAllCSV.ts           експорт усіх даних у один CSV
  hooks/
    useRabbits.ts           список кроликів, статистика, мініатюри
    useArchiveRabbit.ts     потік архівування
    usePhotoViewer.ts       перегляд повного фото
  components/
    NavPanel.tsx            «Панель кролівництва» (навігація)
    StatsBar.tsx            картки зі статистикою
    RabbitCard.tsx          картка одного кролика
    NewRabbitForm.tsx       форма «Новий кролик»
    SettingsModal.tsx       налаштування (ім'я, аватар, push)
    ArchiveModal.tsx        вікно «Причина архівування?»
    HelpModal.tsx           вікно «Як користуватись»
    QrModal.tsx             вікно з QR-кодами
    PhotoViewer.tsx         повне фото поверх сторінки
    BreedingAgeInfo.tsx     зноска про вік утримання
```

## 3. Що де шукати

### За симптомом або завданням

| Потрібно | Файл |
|----------|------|
| Не завантажується список кроликів / повідомлення «Не вдалося завантажити список» | `hooks/useRabbits.ts` (`loadData`) |
| Неправильні цифри у статистиці / «Не вдалося завантажити статистику» | `hooks/useRabbits.ts` (`loadStats`), відображення в `components/StatsBar.tsx` |
| Не показуються мініатюри фото в картках | `hooks/useRabbits.ts` (запит `getThumbUrls`), відображення в `components/RabbitCard.tsx` |
| Не архівується кролик / помилка в модалці архівування | `hooks/useArchiveRabbit.ts` (запис у БД), вигляд у `components/ArchiveModal.tsx` |
| Додати або змінити причину архівування | `constants.ts` (`archiveReasons`) |
| Не відкривається повне фото | `hooks/usePhotoViewer.ts`, вигляд у `components/PhotoViewer.tsx` |
| Не додається кролик / не вантажиться фото при додаванні | `components/NewRabbitForm.tsx` (`handleAdd`) |
| Додати поле у форму нового кролика | `components/NewRabbitForm.tsx` (розмітка), `constants.ts` (`emptyForm`), `types.ts` (`Rabbit`, якщо поле показується в картці) |
| Змінити вигляд картки кролика, смугу віку | `components/RabbitCard.tsx` |
| Додати кнопку або розділ у «Панель кролівництва» | `components/NavPanel.tsx` (масив `navSections`) |
| Зміни в блоці «Сервіс» (Архів, QR, Експорт, Довідка) | `components/NavPanel.tsx` (кнопки в кінці файлу) |
| Змінити текст довідки «Як користуватись» | `helpItems.ts` |
| Змінити, які дані потрапляють в експорт CSV | `exportAllCSV.ts` |
| Кнопка експорту (стан «Формую файл...», повідомлення про помилку) | `RabbitRegistry.tsx` (`handleExportAll`) |
| Не змінюється ім'я господарства | `components/SettingsModal.tsx` (`handleSaveDisplayName`) |
| Проблеми з фото кабінету (аватар) | `components/SettingsModal.tsx` (`handleAvatarChange`, `handleAvatarDelete`) |
| Push-сповіщення не вмикаються | `components/SettingsModal.tsx` (`handleTogglePush`) |
| QR-коди кліток, кнопка «Зберегти PNG» | `components/QrModal.tsx` |
| Текст зноски про вік утримання | `components/BreedingAgeInfo.tsx` |
| Додати нову картку статистики | `types.ts` (`Stats`), `hooks/useRabbits.ts` (підрахунок), `components/StatsBar.tsx` (картка) |
| Порожній стан реєстру, скелетон завантаження | `RabbitRegistry.tsx` (розмітка), `SkeletonCard.tsx` |
| Загальний склад сторінки, які вікна відкриті | `RabbitRegistry.tsx` |

### Де який запит до бази

| Запит | Де |
|-------|----|
| Читання активних кроликів (`rabbits`) | `hooks/useRabbits.ts` |
| Статистика: `litters`, `paddock_litters`, `paddock_females`, `fattening`, `quarantine` | `hooks/useRabbits.ts` |
| Архівування (`update` у `rabbits`: `is_active`, `archive_reason`, `archive_date`) | `hooks/useArchiveRabbit.ts` |
| Створення кролика (`insert`) і запис `photo_path` | `components/NewRabbitForm.tsx` |
| Ім'я господарства та аватар (`supabase.auth.updateUser`) | `components/SettingsModal.tsx` |
| Усі таблиці для експорту CSV (18 запитів) | `exportAllCSV.ts` |

### Де які повідомлення про помилки

| Текст | Де |
|-------|----|
| «Не вдалося завантажити список кроликів...», «...статистику господарства...» | `hooks/useRabbits.ts` |
| «Не вдалося архівувати кролика...» | `hooks/useArchiveRabbit.ts` |
| «Не вдалося відкрити фото...» | `hooks/usePhotoViewer.ts` |
| «Помилка збереження», «Оберіть файл із зображенням», «Фото завелике...» (форма) | `components/NewRabbitForm.tsx` |
| «Кролика збережено, але фото завантажити не вдалося...» | `components/NewRabbitForm.tsx` (виводиться на сторінці через `photoError`) |
| Помилки імені, аватара, push | `components/SettingsModal.tsx` |
| «Не вдалося сформувати експорт...» | `RabbitRegistry.tsx` |

### Де які стилі

Усі стилі лишились в одному файлі `RabbitRegistry.css`. Орієнтуйтесь за префіксом класу:

| Класи | Компонент |
|-------|-----------|
| `.registry-header*`, `.registry-nav-*`, `.nav-section*` | `NavPanel` (шапка частково в `RabbitRegistry.tsx`) |
| `.registry-stat*` | `StatsBar` |
| `.rabbit-*` | `RabbitCard` |
| `.registry-form*` | `NewRabbitForm` |
| `.settings-*` | `SettingsModal` |
| `.archive-reason-*`, `.confirm-*` | `ArchiveModal` |
| `.help-*` | `HelpModal`; також спільна основа для всіх вікон (`.help-overlay`, `.help-modal`, `.help-close`) |
| `.qr-*` | `QrModal` |
| `.photo-viewer*` | `PhotoViewer` |
| `.registry-info*` | `BreedingAgeInfo` |
| `.skeleton*` | `SkeletonCard` |
| `.registry-empty-*` | порожній стан у `RabbitRegistry.tsx` |

Увага: `.help-overlay` використовують майже всі вікна, тому зміна цього класу вплине на всі модалки одразу.

## 4. Опис файлів

### `RabbitRegistry.tsx`
Збирає сторінку з частин. Тримає лише те, що потрібно кільком частинам одночасно:

- прапорці відкриття вікон: `showForm`, `showHelp`, `showQrModal`, `showSettings`;
- стан кнопки експорту: `exportingAll`, `exportError` і функцію `handleExportAll`;
- виклики трьох хуків і розмітку (шапка, порожній стан, сітка карток).

### `types.ts` і `constants.ts`
- `types.ts`: інтерфейси `Rabbit` (поля кролика, включно з `photo_path`) і `Stats` (усі цифри статистики).
- `constants.ts`: `emptyForm` (початкові значення форми) і `archiveReasons` (варіанти причини архівування).

### `helpItems.ts`
Масив елементів довідки: `{ icon, title, desc }`. Використовується в `HelpModal`.

### `exportAllCSV.ts`
Функція `exportAllCSV(uid)`: читає дані з усіх таблиць господарства, збирає один CSV з окремими блоками і запускає завантаження файлу. Не ловить помилки, їх обробляє виклик у `RabbitRegistry.tsx`. Допоміжні `csvCell`, `csvSection`, `genderLabel` приховані всередині файлу.

### Хуки (`hooks/`)

| Хук | Приймає | Повертає |
|-----|---------|----------|
| `useRabbits(userId)` | id користувача | `rabbits`, `loading`, `loadError`, `stats`, `thumbUrls`, `reload` |
| `useArchiveRabbit(onArchived)` | функцію, що оновлює список | `confirmArchiveId`, `selectedReason`, `setSelectedReason`, `archiveError`, `openArchive(id)`, `cancelArchive()`, `confirmArchive()` |
| `usePhotoViewer()` | нічого | `photoViewer`, `photoError`, `setPhotoError`, `openPhoto(rabbit)`, `closePhoto()` |

`reload` з `useRabbits` передається в `useArchiveRabbit` і в `NewRabbitForm` (`onSaved`), щоб після архівування або додавання список оновлювався.

### Компоненти (`components/`)

| Компонент | Пропси | Чим володіє сам |
|-----------|--------|-----------------|
| `NavPanel` | `onOpenQr`, `onOpenHelp`, `onExport`, `exporting`, `exportError` | відкрито/закрито акордеон, перехід за маршрутами (`useNavigate`), масив секцій навігації |
| `StatsBar` | `stats` | нічого |
| `RabbitCard` | `rabbit`, `thumbUrl`, `onOpenPhoto`, `onEdit`, `onArchive` | нічого |
| `NewRabbitForm` | `open`, `userId`, `onClose`, `onSaved`, `onPhotoError` | поля форми, обране фото, стан збереження, помилка, `handleAdd` |
| `SettingsModal` | `open`, `session`, `onClose` | ім'я господарства, аватар, push-сповіщення та їхні обробники |
| `ArchiveModal` | `selectedReason`, `error`, `onSelectReason`, `onCancel`, `onConfirm` | нічого |
| `HelpModal` | `onClose` | нічого |
| `QrModal` | `rabbits`, `onClose` | завантаження PNG (`downloadQr`) |
| `PhotoViewer` | `url`, `name`, `onClose` | нічого |
| `BreedingAgeInfo` | без пропсів | розгорнуто/згорнуто |

## 5. Важливі нюанси: що не варто ламати

1. **`SettingsModal` і `NewRabbitForm` змонтовані завжди.** Коли вікно закрите (`open=false`), вони просто повертають `null`. Це зроблено навмисно: так введені значення і обране фото зберігаються, якщо закрити форму й відкрити знову, як було до рефакторингу. Якщо перейти на умовний рендер (`{showForm && <NewRabbitForm />}`), стан скидатиметься при кожному закритті.
2. **Порядок операцій перевіряється тестами.** У `handleAdd` (`NewRabbitForm`): спочатку створення кролика, потім завантаження фото, потім запис шляху. У `handleAvatarChange` (`SettingsModal`): файл, потім метадані, потім видалення старого. Не міняйте послідовність.
3. **Тексти повідомлень перевіряються тестами за точним збігом.** Змінюючи формулювання помилки, оновіть і тест.
4. **Тест мокає модулі за шляхами** (`lib/supabase`, `utils/photoStorage`, `utils/pushNotifications`). Мок діє на будь-який файл, що імпортує ці модулі, тому нові файли в підпапках працюють з ним без змін. Якщо нова частина імпортує інший модуль із запитами до мережі, додайте його в мок у `RabbitRegistry.test.tsx`.
5. **Блок «Сервіс» у `NavPanel` описаний вручну**, а не через масив: у ньому особливі кнопки (QR з окремим класом, експорт зі станом, довідка, повідомлення про помилку).
6. **Помилка фото з форми показується у `RabbitRegistry.tsx`.** `NewRabbitForm` передає її вгору через `onPhotoError`, а поле `photoError` живе в `usePhotoViewer`, бо той самий блок показує і помилку відкриття фото.

## 6. Як зробити типові зміни

| Завдання | Кроки |
|----------|-------|
| Нова кнопка в навігації | додати `{ label, path }` у потрібну секцію масиву `navSections` у `NavPanel.tsx` |
| Новий пункт довідки | додати об'єкт у масив в `helpItems.ts` |
| Новий розділ в експорті CSV | додати запит у `Promise.all` і новий `csvSection(...)` у `exportAllCSV.ts` |
| Нова причина архівування | додати `{ value, label }` у `archiveReasons` в `constants.ts` |
| Нове поле кролика у формі | `emptyForm` у `constants.ts`, поле в розмітці `NewRabbitForm.tsx`, при потребі `types.ts` і `RabbitCard.tsx` |
| Нове вікно | створити файл у `components/`, прапорець `showX` у `RabbitRegistry.tsx`, при потребі користуватись класами `.help-overlay` і `.help-modal` |

## 7. Робота з git

Рефакторинг велся в гілці `refactor/rabbit-registry`. Рекомендовані коміти:

1. Етапи 1 і 2 разом: типи, константи, довідка, експорт CSV, презентаційні компоненти.
2. Етап 3а: `ArchiveModal`, `SettingsModal`, `NewRabbitForm`.
3. Етап 3б: хуки.

Перед злиттям у `main` запустіть повний набір: `npm test`, `npx tsc --noEmit`, `npx eslint src/pages/RabbitRegistry`. Якщо щось зламається, відкотити можна окремий коміт.

## 8. Що лишилось і можливі кроки далі

- **CSS.** Файл `RabbitRegistry.css` не розбивався (близько 1250 рядків). Його можна поділити на модалки, скелетон, навігацію тощо, але стилі глобальні, тому порядок підключення важливий.
- **Тести хуків і компонентів.** Наявні тести перевіряють сторінку цілком. Окремі тести для `useRabbits`, `useArchiveRabbit` і `exportAllCSV` дали б точнішу діагностику. Зараз експорт CSV наявними тестами не покритий.
- **Скидання форми при закритті.** Зараз введені дані зберігаються (див. нюанс 1). Якщо захочеться скидати їх при закритті, це окреме рішення про поведінку, а не рефакторинг.
