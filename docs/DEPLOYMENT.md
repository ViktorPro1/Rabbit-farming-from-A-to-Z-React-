# Deployment

Цей документ описує варіанти деплою проекту.

## Публікація на Vercel

1. Підключіть репозиторій до Vercel.
2. Встановіть команди:

- Build command: `npm run build`
- Output directory: `dist`

3. Додайте змінні оточення:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Налаштування змінних оточення

У Vercel перейдіть до `Settings > Environment Variables` і додайте ті самі значення, які використовуєте локально.

## Рекомендації щодо кешу / CDN

- Використовуйте стандартний кеш Vercel для статичних ресурсів.
- Очищуйте кеш при оновленнях, якщо змінюється `service worker`.
- `robots.txt` та `sitemap.xml` вже присутні в `public/`.

## Альтернативні платформи

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Додайте змінні оточення аналогічно Vercel.

### Static hosting

- Побудуйте проект: `npm run build`
- Завантажте вміст `dist/` на сервер.
- Переконайтеся, що маршрути SPA обробляються сервером коректно (fallback на `index.html`).
