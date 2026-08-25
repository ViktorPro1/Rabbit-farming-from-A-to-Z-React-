# 🐰 Кролівництво від А до Я

<p align="center">
  <img src="docs/images/home.webp" alt="Кролівництво від А до Я" width="1000">
</p>

Сучасний **PWA-застосунок** для кролівників, який поєднує великий тематичний довідник, систему обліку господарства та практичні інструменти для щоденної роботи.

Проєкт розроблений на **React 19 + TypeScript + Vite + Supabase** з акцентом на продуктивність, SEO, офлайн-режим і модульну архітектуру.

---

# Live Demo

**Відкрити застосунок**

https://rabbit-farming-from-a-to-z-react.vercel.app/

---

# Основні можливості

- Великий довідник із кролівництва
- Понад 200 тематичних сторінок
- Симптоматичний пошук
- Довідник хвороб
- Практичні рекомендації
- Реєстр кролів
- Облік злучок
- Облік окролів
- Push-сповіщення (нагадування про злучки, окроли, маточник, відлучення, забій, лікування, вакцинації)
- Календар господарства (всі заплановані події в одному місці)
- Статистика господарства
- QR-паспорти кролів
- Калькулятори
- PWA (офлайн-режим)
- Android-застосунок (TWA)
- Адаптивний дизайн
- SEO-оптимізація
- Швидка навігація

---

## 📱 Android-застосунок (TWA)

Проєкт упаковано в Android-застосунок через **Trusted Web Activity (TWA)** — PWA працює як нативна програма без WebView-обгортки, зі своєю іконкою та швидким запуском як окрема програма.

Реалізовано:

- Підготовка PWA до встановлення (manifest, service worker, іконки)
- Збірка APK-файлу
- Цифровий підпис застосунку ключем
- Digital Asset Links (`.well-known/assetlinks.json`) для верифікації домену
- Тестування встановлення на телефоні
- Перевірка роботи всіх основних функцій

**Статус:** APK доступний для прямого встановлення. Публікація в Google Play відкладена до сплати одноразового реєстраційного внеску розробника (25 USD).

---

## 🔔 Push-сповіщення

Кабінет господарства надсилає push-сповіщення про ключові події.

Реалізовано:

- Self-hosted Web Push через VAPID — без сторонніх сервісів, без лімітів і без облікових записів
- Підписка/відписка прямо з налаштувань кабінету
- Service worker (`src/sw.ts`) обробляє показ сповіщень і перехід за кліком
- Щоденна серверна перевірка (Vercel Serverless Function) по всіх ключових датах:
  - контрольна злучка (перша й повторна)
  - очікуваний окріл (перший і повторний)
  - підготовка маточника
  - відлучення молодняку
  - планова дата забою
  - наступний прийом препарату (лікування)
  - наступна вакцинація
- Автоматичний щоденний запуск через GitHub Actions cron (08:00 за Києвом)
- Перевірено наскрізно на Android (TWA)

---

## 📅 Календар господарства

Єдиний календар, який збирає в одне місце всі заплановані події з різних розділів обліку — без дублювання даних, напряму з існуючих таблиць.

Реалізовано:

- Агрегація подій з усіх модулів: злучки, контрольні дати, окроли, відлучення, вакцинації, лікування, дезінфекція, забій, зважування, продажі
- Групування подій по днях з швидкими підписами «Сьогодні» / «Завтра»
- Перегляд на тиждень, місяць або 2 місяці
- Фільтри за типом події
- Клік по події — миттєвий перехід у відповідний розділ обліку

---

## Lighthouse

<img src="docs/images/lighthouse.webp" alt="Lighthouse Report" width="700">

**Оцінка продуктивності:**

| Метрика        | Значення |
| -------------- | -------: |
| Performance    |      100 |
| Accessibility  |       96 |
| Best Practices |       92 |
| SEO            |      100 |

---

## 🚀 GTmetrix

Результати останнього аналізу продуктивності.

<p align="center">
  <img src="docs/images/gtmetrix.webp" alt="GTmetrix Report" width="700">
</p>

- Grade: **A**
- Performance: **87%**
- Structure: **96%**
- LCP: **1.1 s**
- TBT: **127 ms**
- CLS: **0**

---

## 🔒 Security Report

Перевірка HTTP-заголовків безпеки.

<p align="center">
  <img src="docs/images/security-report.webp" alt="Security Report" width="700">
</p>

- Rating: **A**
- Content-Security-Policy
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

---

# Статистика проєкту

| Показник                 |                 Значення |
| ------------------------ | -----------------------: |
| Маршрутна логіка         | 13 файлів у `src/routes` |
| Сторінок (`src/pages`)   |                      406 |
| React-компонентів        |                       54 |
| Data-модулів             |                       26 |
| Unit-тестів              |                       41 |
| Test Suites              |                        7 |
| E2E сценаріїв            |                       10 |
| TypeScript               |                      Так |
| PWA                      |                      Так |
| Push-сповіщення          |                      Так |
| Android-застосунок (TWA) |                      Так |
| SEO                      |                      Так |
| Supabase                 |                      Так |

---

# Скріншоти

| Головна                    | Реєстр                         |
| -------------------------- | ------------------------------ |
| ![](docs/images/home.webp) | ![](docs/images/registry.webp) |

| Хвороби                        | Калькулятор                      |
| ------------------------------ | -------------------------------- |
| ![](docs/images/diseases.webp) | ![](docs/images/calculator.webp) |

| Статистика                       | Симптоми                       |
| -------------------------------- | ------------------------------ |
| ![](docs/images/statistics.webp) | ![](docs/images/symptoms.webp) |

---

# Технології

## Frontend

- React 19
- TypeScript 5
- React Router 7
- Vite 7

## Backend

- Supabase
- PostgreSQL
- Authentication
- Realtime
- Vercel Serverless Functions (push-сповіщення)
- GitHub Actions (щоденний cron)

## Оптимізація

- PWA
- TWA (Trusted Web Activity)
- Service Worker
- Web Push / VAPID
- Code Splitting
- React.lazy()
- Lazy Loading
- SEO
- JSON-LD
- Sitemap
- robots.txt
- llms.txt
- Prerender

---

# Архітектура

```
src/

├── assets/
├── components/
├── data/
├── hooks/
├── lib/
├── pages/
├── routes/
├── seo/
├── test/
├── sw.ts
├── App.tsx
├── entry-prerender.tsx
├── main.tsx
└── prerender-routes.ts

api/
├── send-push.ts
└── daily-reminders.ts
```

---

# Якість проєкту

Проєкт проходить автоматичні перевірки:

- ESLint
- TypeScript
- Unit Tests
- Coverage
- Playwright E2E
- Production Build
- GitHub Actions CI

---

# Покриття тестами

| Метрика    | Покриття |
| ---------- | -------: |
| Statements |   88.15% |
| Branches   |   85.00% |
| Functions  |   80.43% |
| Lines      |   89.20% |

---

# Безпека

Реалізовано:

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- Permissions Policy
- Cookie Consent
- Захищене підключення до Supabase
- HTTPS
- Digital Asset Links (для TWA)

---

# Встановлення

Клонувати репозиторій

```bash
git clone https://github.com/ViktorPro1/Rabbit-farming-from-A-to-Z-React-.git
```

Перейти до папки

```bash
cd Rabbit-farming-from-A-to-Z-React-
```

Встановити залежності

```bash
npm install
```

Запустити

```bash
npm run dev
```

---

# Production Build

```bash
npm run build
```

---

# Документація

```
docs/
```

Основні документи:

- [docs/Розробка/DEVELOPER_GUIDE.md](docs/Розробка/DEVELOPER_GUIDE.md)
- [docs/Тестування/TESTING.md](docs/Тестування/TESTING.md)
- [LICENSE](LICENSE)
- [LICENSE.uk.md](LICENSE.uk.md)

---

# Деплой

Проєкт автоматично розгортається через **Vercel**.

Використовується:

- CDN
- HTTPS
- SPA Rewrite
- Автоматичний Production Build

---

# Roadmap

## Версія 1.0

- Великий довідник
- PWA
- Реєстр господарства
- Статистика
- SEO
- Supabase
- Автоматичне тестування
- Android-застосунок (TWA)
- Push-сповіщення
- Календар господарства

---

# Автор

**Viktor Pro1**

Проєкт створений вручну у **Visual Studio Code**.

Під час розробки використовувалися AI-інструменти як допоміжний засіб для аналізу, перевірки архітектури, оптимізації та документування. Усі ключові технічні рішення, реалізація функціональності та інтеграція компонентів виконані автором.

---

# Ліцензія

MIT License

Додатково:

- LICENSE
- LICENSE.uk.md
