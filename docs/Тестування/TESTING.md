# Testing

Цей документ описує тестову стратегію для проєкту.

## Поточний стан

Проєкт має робочу тестову інфраструктуру:

- Unit та integration тести — Vitest + React Testing Library
- E2E тести — Playwright (публічні маршрути, 404, захищені маршрути без сесії, service worker, manifest, offline-банер)
- Coverage — вимірюється через `vitest run --coverage`
- CI (`.github/workflows/ci.yml`) запускає lint, typecheck, unit-тести й build на кожен push/PR; E2E запускається на pull request

Тестове покриття є в тому числі для: `ErrorBoundary`, `App`, `CookieConsent`, `WelcomePopup`, `usePublicPresence`, Supabase-модуля.

## Інструменти

- **Vitest** — для unit та integration тестів.
- **React Testing Library** — для тестування React-компонентів.
- **Playwright** — для e2e тестів.

## Як запускати тестування

Команди вже налаштовані в `package.json`:

```bash
npm run test            # прогнати всі тести один раз
npm run test:watch      # тести в режимі watch
npm run test:ui         # UI для перегляду тестів
npm run test:coverage   # тести з розрахунком покриття
```

E2E-тести (Playwright):

```bash
npx playwright test
```

## Куди рухатись далі

Тестова база вже покриває основні компоненти й маршрути. Наступні кроки для розширення покриття:

- Сценарії обліку (злучки, окроли) — edge-cases
- Розширення auth-сценаріїв (більше кейсів неавторизованого доступу)
- Мобільний viewport у Playwright (Mobile Chrome — наразі закоментовано в конфігу)
- Запуск E2E не тільки на pull request, а й на push у `main` (наразі свідомо обмежено заради швидшого CI)

## Загальні рекомендації

- Покривайте компонент `AppRoutes` та сторінки з авторизацією.
- Тестуйте логіку auth та випадки, коли користувач не авторизований.
- Перевіряйте рендеринг важливих UI-компонентів, таких як `Header`, `Footer`, `CookieConsent`.
