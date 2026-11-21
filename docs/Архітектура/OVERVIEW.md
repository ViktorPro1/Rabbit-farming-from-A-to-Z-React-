# Огляд проєкту

> Розділ технічної документації. Короткий огляд проєкту — у [головному README](../../README.md).

## Статистика проєкту

| Показник                 |                           Значення |
| ------------------------ | ---------------------------------: |
| Маршрутна логіка         | 14 груп (16 файлів у `src/routes`) |
| Публічних сторінок       |                                202 |
| React-компонентів        |                                 54 |
| Data-модулів             |                                 30 |
| Unit-тестів              |                                598 |
| Test Suites              |                                 48 |
| E2E сценаріїв            |                                 10 |
| TypeScript               |                                Так |
| PWA                      |                                Так |
| Push-сповіщення          |                                Так |
| Android-застосунок (TWA) |                                Так |
| SEO                      |                                Так |
| Supabase                 |                                Так |

## Технології

### Frontend

- React 19
- TypeScript 5
- React Router 7
- Vite 7

### Backend

- Supabase
- PostgreSQL
- Authentication
- Realtime
- Vercel Serverless Functions (push-сповіщення, email)
- Nodemailer (Gmail SMTP)
- GitHub Actions (щоденний cron)
- Sentry (error tracking)

### Аналітика та трекінг

- Google Analytics 4
- Google Search Console
- Meta Pixel (Facebook Pixel)

### Оптимізація

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
- llms-full.txt (розширений контекст для ШІ)
- AI-каталог (`sync-ai-catalog.mjs`)
- Prerender

## Структура каталогів

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
├── _lib/
│   ├── auth.ts                 # Авторизація серверних запитів
│   ├── dates.ts
│   ├── email-templates/        # 17 HTML-шаблонів листів
│   ├── email-templates.ts
│   ├── email.ts
│   ├── push.ts
│   └── reminders.ts
├── daily-reminders.ts
├── notify-payment-receipt.ts
├── notify-subscription-activated.ts
├── notify-subscription-cancelled.ts
├── send-email.ts
├── send-feature-announcement.ts
├── send-notification.ts
└── welcome-email.ts
```

Детальний опис файлів і папок — у [STRUCTURE.md](./STRUCTURE.md), маршрутів — у [approutes-map.md](./approutes-map.md).
