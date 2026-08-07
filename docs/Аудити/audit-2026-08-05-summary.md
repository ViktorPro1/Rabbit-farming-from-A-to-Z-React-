# Звіт: Аудит 2026-08-05 та оптимізація бандла

Проєкт: **Кролівництво від А до Я** (React/TypeScript)

---

## Гілка 1: `feature/audit-2026-08-05` (змерджено в `main`, PR #3)

### Негайні пункти аудиту

- **`test:coverage`** — додано сценарій `npm run test:coverage` (Vitest + `@vitest/coverage-v8`), налаштовано `exclude` для конфігів, типів, CSS. Покриття: 87.5% statements.
- **`lint:fix`** — додано сценарій `npm run lint:fix` (`eslint . --fix`).
- **CI-документація** — `docs/DEVELOPER_GUIDE.md` синхронізовано з реальним `.github/workflows/ci.yml` (4 окремі jobs: Lint, Typecheck, Tests, Build замість описаного одного).
- **E2e-тести** — впроваджено Playwright:
  - Тільки Chromium (економія хвилин GitHub Actions)
  - `webServer` піднімає `npm run preview` (продакшн-збірку, не dev-сервер)
  - `e2e/routing.spec.ts` — 7 тестів (публічні сторінки, 404, гейтинг `/admin`, `/registry`, `/calculator`)
  - `e2e/pwa.spec.ts` — 3 тести (service worker, manifest, офлайн-екран)
  - Окремий `e2e/tsconfig.json` з DOM-типами
  - CI job `E2E (Playwright)` запускається **лише на `pull_request`**, не на кожен `push` — свідома економія хвилин безкоштовного плану GitHub Actions

### Середньострокові пункти аудиту

- **Error boundaries** — розширено `ErrorBoundary.tsx`:
  - Логування через централізований `logError()` замість голого `console.error`
  - Новий пропс `boundaryName` — назва секції для трасування
  - Новий пропс `fallback?: ReactNode` — кастомний UI замість дефолтної картки (для некритичних віджетів)
  - Обгорнуто: `Assistant` (fallback=null), 15 маршрутів особистого кабінету, `Admin`, `Calculator`
- **Централізоване логування** — `logError()` додано в усі async-операції 4 файлів, де його ще не було: `RabbitRegistry.tsx`, `GrainRecipesHistory.tsx`, `Calculator.tsx`, `Paddocks.tsx`. В `Paddocks.tsx` кілька операцій (`handleAddFemale`, `handleRemoveFemale`, `handleDeletePaddock`, `handleDeleteMating`, `handleDeleteLitter`) взагалі не мали обробки помилок — додано.

**Результат:** 38 unit-тестів (7 файлів), 10 e2e-тестів, усі CI-перевірки зелені.

---

## Гілка 2: `feature/bundle-size-optimization` (у роботі)

### Проблема

Аналіз бандла (`rollup-plugin-visualizer`) показав, що чанк `AppRoutes.js` важив **297.81 kB** — переважно через важкий масив даних `src/data/sectionCards/groups` (236KB, 4755 рядків: заголовки, описи, ключові слова для пошуку Асистента), який тягнувся в основний бандл двома шляхами.

### Причина 1 — `Breadcrumbs` і `RunningTicker`

Обидва компоненти рендеряться на кожній сторінці й імпортували **весь** важкий масив `groups`, хоча потребували лише кількох легких полів (`path`, `title`, `icon`).

**Рішення:** build-time скрипт `scripts/generate-nav-map.ts` (запускається через `npx tsx`) генерує легкий файл `src/data/navMap.generated.ts` (гітігнорений) із двома експортами:
- `PATH_TO_SECTION` — мапа "шлях → назва розділу" для `Breadcrumbs`
- `LIGHT_CARDS` — масив `{icon, title, path}` для `RunningTicker`

### Причина 2 — `Home` та `Assistant` не були лінивими

- `Home.tsx` рендерить `<SectionCards />`, який теж імпортує важкий `groups` напряму
- `Assistant`/`AssistantPromo` рендеряться в `App.tsx` і залежать від `getBotResponse.ts`, який теж імпортує `groups`

Обидва компоненти імпортувались **eager** (не через `lazy()`), тому вся ця вага лишалась в основному бандлі незалежно від фіксу `Breadcrumbs`/`RunningTicker`.

**Рішення:** переведено обидва на `lazy()` з `Suspense`:
```tsx
const Home = lazy(() => import("../../pages/Home"));
const Assistant = lazy(() => import("./components/Assistant/Assistant"));
const AssistantPromo = lazy(() => import("./components/AssistantPromo/AssistantPromo"));
```

### Результати (до → після)

| Чанк | До | Після | Зміна |
|---|---|---|---|
| `AppRoutes.js` | 297.81 kB | 111.58 kB | **-62%** |
| Спільний чанк з важкими даними (проміжний етап) | 173.65 kB | — | — |
| `navMap.generated.js` | — | 23.22 kB | легкий, як і задумано |
| `Assistant.js` | — | 11.41 kB | окремий лінивий чанк |

**Перевірка:** 38/38 unit-тестів, 10/10 e2e-тестів — усе пройшло без регресій.

---

## Що залишилось з аудиту (не в цих гілках)

- Рефактор інших сторінок під `PageLayout` (мігровано поки що лише `BeginnerGuide` і `BuyingRabbit` з ~149) — запланована окрема гілка
- i18n-структура — не пріоритетна, сайт лишається українською
