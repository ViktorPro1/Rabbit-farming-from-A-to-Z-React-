# Push-сповіщення для "Кролівництво від А до Я" — з нуля, гілка `feature/push-notifications`

Підхід: **self-hosted Web Push через VAPID**. Без сторонніх сервісів, без лімітів і без "скидання на 0" — воно просто завжди безкоштовне, бо ти сам відправляєш повідомлення напряму в push-сервіси браузерів (Google/Mozilla/Microsoft), а вони роблять це безкоштовно для будь-якого власника сайту.

---

## 0. Перед стартом — чому важливо, що гілка вже видалялась

У тебе вже була спроба (`feature/push-notifications`), яку відкотили — гілку видалили, таблицю `push_subscriptions` дропнули. Причина в пам'яті не збереглась. Раджу перед новою спробою пригадати, що саме пішло не так (складність із service worker? проблема з vite-plugin-pwa? UX підписки?), щоб не повторити ту саму помилку. Якщо згадаєш — скажи, і я підлаштую план.

---

## 1. Створення гілки

```bash
cd "/media/viktor/projects/React/Кролівництво від А до Я"
git checkout main
git pull origin main
git checkout -b feature/push-notifications
```

---

## 2. Генерація VAPID-ключів

VAPID (Voluntary Application Server Identification) — це пара ключів, якою браузер підтверджує, що повідомлення надсилає саме твій сервер.

```bash
npm install web-push --save
npx web-push generate-vapid-keys
```

Отримаєш `Public Key` і `Private Key`. Збережи їх — далі знадобляться.

**Локально** (`.env`, не комітити):
```
VITE_VAPID_PUBLIC_KEY=твій_public_key
VAPID_PRIVATE_KEY=твій_private_key
VAPID_SUBJECT=mailto:твій_email@example.com
```

**На Vercel** — додай ті самі три змінні в Project Settings → Environment Variables (Production + Preview, щоб працювало і в PR-гілках через CI).

---

## 3. Таблиця в Supabase

```sql
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

alter table push_subscriptions enable row level security;

create policy "Users manage own subscriptions"
  on push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Якщо хочеш сповіщення й для неавторизованих (публічних) відвідувачів — `user_id` зроби nullable, і додай окрему policy на insert без auth-перевірки.

---

## 4. Service worker — перевір стратегію vite-plugin-pwa

Це критичний момент, з яким могли бути проблеми минулого разу. У `vite.config.ts` подивись, яка стратегія в `VitePWA({...})`:

- **`strategies: 'generateSW'`** (за замовчуванням) — Workbox сам генерує service worker, і ти не можеш просто дописати туди `push`-обробник напряму. Потрібно перейти на `injectManifest`.
- **`strategies: 'injectManifest'`** — у тебе вже є власний файл service worker (напр. `src/sw.ts`), і туди можна дописати код нижче.

Якщо зараз `generateSW` — доведеться змінити конфіг:

```ts
// vite.config.ts
VitePWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  injectManifest: {
    // існуючі налаштування прекешу
  },
  // ...інші опції як були
})
```

**`src/sw.ts`** (додай до існуючого коду service worker):

```ts
import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? 'Кролівництво від А до Я';
  const options: NotificationOptions = {
    body: data.body ?? '',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    data: { url: data.url ?? '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string })?.url ?? '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const existing = clients.find((c) => c.url === url);
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});
```

---

## 5. Фронтенд — підписка користувача

**`src/utils/pushNotifications.ts`**:

```ts
export async function subscribeToPush(userId: string | null) {
  const registration = await navigator.serviceWorker.ready;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
  });

  const json = subscription.toJSON();
  await supabase.from('push_subscriptions').upsert({
    user_id: userId,
    endpoint: json.endpoint,
    p256dh: json.keys?.p256dh,
    auth: json.keys?.auth,
  });

  return subscription;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
```

Далі — компонент-кнопка "Дозволити сповіщення" в кабінеті (наприклад, у налаштуваннях чи Statistics-сторінці), яка викликає `subscribeToPush`, обгорнута через `logError` за твоєю конвенцією.

---

## 6. Бекенд — відправка (Vercel Serverless Function)

**`api/send-push.ts`**:

```ts
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VITE_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role, не anon — тільки на сервері
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // TODO: захисти цей ендпоінт (напр. секретний токен у заголовку),
  // щоб хтось сторонній не міг розсилати пуші всім підписникам
  const authHeader = req.headers['x-push-secret'];
  if (authHeader !== process.env.PUSH_SEND_SECRET) return res.status(401).end();

  const { title, body, url, userId } = req.body;

  let query = supabase.from('push_subscriptions').select('*');
  if (userId) query = query.eq('user_id', userId);
  const { data: subs, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  const results = await Promise.allSettled(
    (subs ?? []).map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title, body, url })
      ).catch(async (err) => {
        // 410 Gone / 404 = підписка відкликана, чисти таблицю
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
        throw err;
      })
    )
  );

  res.status(200).json({ sent: results.filter((r) => r.status === 'fulfilled').length });
}
```

Додай `PUSH_SEND_SECRET` і `SUPABASE_SERVICE_ROLE_KEY` в Vercel env vars.

---

## 7. Тригери — коли надсилати

Залежно від того, що саме хочеш сповіщати в кабінеті (нагадування про вакцинацію, окіт, тощо), варіанти:
- Виклик `api/send-push` напряму з клієнта одразу після дії користувача (просте, але без розкладу)
- GitHub Actions cron (як твій наявний `keep-alive.yml`) — раз на день перевіряє таблиці й шле нагадування через `api/send-push`

Скажи, які саме події мають тригерити сповіщення (вакцинації, окоти, щось інше) — допоможу з конкретною логікою.

---

## 8. Тестування

1. `npm run build && npm run preview` — service worker працює тільки на HTTPS або localhost
2. Chrome DevTools → Application → Service Workers — перевір реєстрацію
3. Application → Push Messaging — можна відправити тестовий push вручну
4. Перевір notificationclick — чи відкриває правильний URL

---

## 9. Відповідність AGENTS.md

- Нові файли, нічого не видаляємо без дозволу — усе нижче лише додає функціонал
- Коментарі до кожної зміни — постав звідки саме `push`-логіка і чому
- Ніякого `@import` у CSS, ніякого Next.js — не зачіпається
- i18n — не стосується

---

## Порядок дій одним списком

1. `git checkout -b feature/push-notifications`
2. Згенерувати VAPID-ключі, додати в `.env` і Vercel
3. Створити таблицю `push_subscriptions` у Supabase
4. Перевірити/змінити стратегію `vite-plugin-pwa` на `injectManifest`, дописати `push`/`notificationclick` у `src/sw.ts`
5. Додати `subscribeToPush` і кнопку в кабінеті
6. Створити `api/send-push.ts`
7. Задеплоїти preview на Vercel, протестувати наскрізно
8. Вирішити тригери розсилки
9. PR → main
