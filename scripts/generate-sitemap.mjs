import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://rabbit-farming-from-a-to-z-react.vercel.app';

// Джерело правди — той самий масив, що й для prerender
const routesFilePath = path.resolve(__dirname, '../src/prerender-routes.ts');
const outputPath = path.resolve(__dirname, '../public/sitemap.xml');

const fileContent = fs.readFileSync(routesFilePath, 'utf-8');

// Витягуємо всі рядки виду "/шлях" з масиву prerenderRoutes
const routeMatches = [...fileContent.matchAll(/"(\/[^"]*)"/g)].map((m) => m[1]);

if (routeMatches.length === 0) {
    console.error('✗ Не знайдено жодного маршруту в prerender-routes.ts. Перевір шлях до файлу.');
    process.exit(1);
}

const now = new Date().toISOString();

const urlEntries = routeMatches
    .map((route) => {
        const loc = route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}`;
        const priority = route === '/' ? '1.0' : '0.8';
        const changefreq = route === '/' ? 'daily' : 'weekly';
        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

fs.writeFileSync(outputPath, xml, 'utf-8');

console.log(`✓ sitemap.xml згенеровано: ${routeMatches.length} сторінок → ${outputPath}`);
