# 📧 Email-система

Документація автоматичної розсилки транзакційних листів у проєкті «Кролівництво від А до Я».

---

## Загальна архітектура

- **Відправка:** Gmail SMTP через Nodemailer, без сторонніх email-сервісів (Resend, SendGrid тощо)
- **Шаблони:** 17 готових HTML-листів у `api/_lib/email-templates/`, кешуються в пам'яті після першого читання
- **Три способи запуску листа:**
  1. **Щоденний cron** (GitHub Actions, 08:00 за Києвом) — листи, прив'язані до дати
  2. **Database Webhook / дія в адмінці** — листи, прив'язані до події
  3. **Ручний запуск** — листи, які надсилаються за рішенням адміна (не за розкладом і не за подією)

---

## Файлова структура

```
api/
├── _lib/
│   ├── email.ts                 # транспорт Nodemailer (Gmail SMTP) + sendEmail()
│   ├── email-templates.ts       # завантаження і кешування html-шаблонів, renderTemplate()
│   ├── email-templates/         # 17 html-файлів листів
│   ├── push.ts                  # supabase-клієнт (service_role) + sendToUser()
│   ├── dates.ts                 # addDays(), tomorrowDate()
│   └── reminders.ts             # усі щоденні перевірки (push + email), ALL_CHECKS
├── send-email.ts                       # низькорівневий ендпоінт: {to, subject, html}
├── send-notification.ts                # push-сповіщення (аналогічний принцип)
├── daily-reminders.ts                  # запускає всі перевірки з ALL_CHECKS
├── welcome-email.ts                    # приймає Database Webhook на INSERT у profiles
├── notify-subscription-activated.ts    # викликається з Admin.tsx при типі "Платний"
├── notify-subscription-cancelled.ts    # викликається з Admin.tsx при поверненні на "Пробний"
└── send-feature-announcement.ts        # ручна розсилка всім користувачам

scripts/
├── test-send-email.mjs          # ручна перевірка одного шаблону на одну адресу
└── announce-feature.mjs         # запуск розсилки анонсу нової функції
```

---

## Env-змінні (Vercel)

| Змінна | Призначення |
|---|---|
| `GMAIL_USER` | Адреса відправника (`rabbit.farming.ua@gmail.com`) |
| `GMAIL_APP_PASSWORD` | App Password Gmail-акаунта (не звичайний пароль) |
| `SEND_EMAIL_SECRET` | Секрет для `send-email.ts` та `send-feature-announcement.ts` |
| `SUPABASE_WEBHOOK_SECRET` | Секрет для перевірки запитів від Supabase Database Webhook (`welcome-email.ts`) |

---

## Автоматичні листи за розкладом (щоденний cron)

Усі описані в `api/_lib/reminders.ts`, викликаються з `daily-reminders.ts` разом з push-перевірками.

| # | Перевірка | Умова | Шаблон |
|---|---|---|---|
| 11 | `checkTrialEndingSoon` | `access_until` через 3 дні, `plan_type = 'trial'` | `lyst-probnyi_period_zavershuyetsya_skoro.html` |
| 12 | `checkTrialEndedToday` | `access_until` сьогодні, `plan_type = 'trial'` | `lyst-probnyi_period_zavershено_pidpyska.html` |
| 13 | `checkTrialFeedbackRequest` | `access_until` було 2 дні тому, `plan_type` досі `'trial'` | `lyst-vidguk_pislya_probnogo.html` |
| 14 | `checkInactiveReactivation` | 14 днів без входу (`auth.users.last_sign_in_at`) | `lyst-reaktyvatsiya_neaktyvnykh.html` |

Усі перевірки на основі дати порівнюють діапазон доби (`gte`/`lt`), а не рівність рядка, бо `access_until` — `timestamptz`.

---

## Автоматичні листи за подією

| Лист | Тригер | Механізм |
|---|---|---|
| Вітання після реєстрації | `INSERT` у `profiles` | Supabase Database Webhook → `welcome-email.ts` |
| Підписку активовано | Адмін ставить тип "Платний" | Прямий виклик з `Admin.tsx` → `notify-subscription-activated.ts` |
| Підписку скасовано | Адмін повертає тип на "Пробний" (з попереднього "Платний"/"Засновник") | Прямий виклик з `Admin.tsx` → `notify-subscription-cancelled.ts` |

Обидва ендпоінти для дій адміна перевіряють, що запит справді від адміна — через `supabase.auth.getUser(token)` + перевірку таблиці `admins`, а не просто секретний заголовок.

---

## Ручні листи (запускаються командою)

```bash
# Тест одного шаблону на одну адресу
SEND_EMAIL_SECRET=... node scripts/test-send-email.mjs api/_lib/email-templates/<файл>.html "Тема" email@example.com

# Розсилка анонсу нової функції всім користувачам
SEND_EMAIL_SECRET=... node scripts/announce-feature.mjs "опис нової функції"
```

---

## Ще не автоматизовано

Потребує підключення реальної платіжної системи (LiqPay/Stripe/інше) — наразі її немає:

- Квитанція про оплату (`lyst-kvytantsiya_pro_oplatu.html`)
- Невдала оплата (`lyst-nevdala_oplata.html`)
- Нагадування про автопродовження (`lyst-nagaduvannya_pro_avtoprodovzhennya.html`)

Скидання пароля не потребує окремого коду — налаштовується через Supabase Dashboard → Settings → Auth → SMTP Settings + Email Templates, використовуючи ті самі `GMAIL_USER`/`GMAIL_APP_PASSWORD`.

---

## Тестування нового check у `reminders.ts`

1. Тимчасово виставити потрібну дату в `access_until` (чи `last_sign_in_at` через реальний вхід) для тестового профілю
2. Запустити workflow вручну: GitHub → Actions → Daily Push Reminders → Run workflow
3. Перевірити відповідь у логах кроку (`{"sent": N, "date": "..."}`)
4. Перевірити пошту
5. Повернути тестові дані назад до оригінальних значень
