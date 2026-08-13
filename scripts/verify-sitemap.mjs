// Перевіряє, скільки <url> реально віддає прод-сайт у /sitemap.xml,
// і порівнює з кількістю маршрутів у src/prerender-routes.ts.
// Якщо різниця завелика — падає з помилкою (exit code 1),
// щоб CI/CD показав червоний статус і не дав тихо проґавити
// "куций" sitemap (як сталося 27 липня).
//
// Запуск: node scripts/verify-sitemap.mjs
// Опційно: SITEMAP_URL=https://... node scripts/verify-sitemap.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITEMAP_URL =
    process.env.SITEMAP_URL ||
    'https://rabbit-farming-from-a-to-z-react.vercel.app/sitemap.xml';

// Дозволена похибка: якщо реальних URL менше, ніж
// (очікувана кількість * MIN_RATIO), вважаємо це проблемою.
const MIN_RATIO = 0.9;

// Скільки разів повторити спробу, якщо перший запит "зловив"
// нестабільний момент деплою (той самий race condition, що 27 липня).
const RETRIES = 3;
const RETRY_DELAY_MS = 15000;

function getExpectedRouteCount() {
    const routesFilePath = path.resolve(__dirname, '../src/prerender-routes.ts');
    const fileContent = fs.readFileSync(routesFilePath, 'utf-8');
    const matches = [...fileContent.matchAll(/"(\/[^"]*)"/g)];
    return matches.length;
}

function countSitemapUrls(xmlText) {
    const matches = xmlText.match(/<loc>/g);
    return matches ? matches.length : 0;
}

async function fetchSitemap(url) {
    const res = await fetch(url, { headers: { 'User-Agent': 'sitemap-verify-script' } });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} при завантаженні ${url}`);
    }
    return res.text();
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    const expected = getExpectedRouteCount();
    console.log(`Очікувана кількість маршрутів (prerender-routes.ts): ${expected}`);
    console.log(`Sitemap URL: ${SITEMAP_URL}`);

    let actual = 0;
    let lastError = null;

    for (let attempt = 1; attempt <= RETRIES; attempt++) {
        try {
            const xml = await fetchSitemap(SITEMAP_URL);
            actual = countSitemapUrls(xml);
            console.log(`Спроба ${attempt}/${RETRIES}: знайдено ${actual} <loc> записів`);

            if (actual >= expected * MIN_RATIO) {
                console.log(`✓ OK: ${actual} з ${expected} очікуваних (поріг ${Math.ceil(expected * MIN_RATIO)})`);
                process.exit(0);
            }

            console.warn(
                `⚠ Замало URL (спроба ${attempt}): ${actual} з ${expected} очікуваних. ` +
                (attempt < RETRIES ? `Повтор через ${RETRY_DELAY_MS / 1000}с (можливо, CDN ще прогріває новий білд)...` : '')
            );
        } catch (err) {
            lastError = err;
            console.warn(`⚠ Помилка на спробі ${attempt}: ${err.message}`);
        }

        if (attempt < RETRIES) {
            await sleep(RETRY_DELAY_MS);
        }
    }

    console.error(
        `✗ ПОМИЛКА: після ${RETRIES} спроб sitemap віддає лише ${actual} URL ` +
        `замість очікуваних ~${expected}. ` +
        (lastError ? `Остання помилка мережі: ${lastError.message}` : 'Файл, схоже, "куций" — перевір деплой вручну.')
    );
    process.exit(1);
}

main();
