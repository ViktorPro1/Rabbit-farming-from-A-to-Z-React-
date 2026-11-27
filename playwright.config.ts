import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:4173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Тільки Chromium — для маршрутизації/PWA крос-браузерність не критична,
     а це втричі коротший прогін і менше витрат хвилин CI.
     Firefox/WebKit можна додати пізніше вибірково, якщо знадобиться. */
  projects: [
    {
      name: 'chromium',
      testIgnore: /mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    /* Мобільний екран (Pixel 5). Запускає лише мобільні сценарії з
       e2e/mobile.spec.ts, щоб не подвоювати час прогону всіх тестів.
       Зміна 2026-11-27: було закоментовано, тепер увімкнено. */
    {
      name: 'Mobile Chrome',
      testMatch: /mobile\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* Піднімаємо production-preview (не dev-сервер!) — тестуємо саме
     той білд, що піде в продакшн (prerendered сторінки, sw.js тощо).
     Перед запуском тестів потрібен `npm run build`. */
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});