import { test, expect } from '@playwright/test';

test.describe('PWA', () => {
    test('service worker реєструється', async ({ page }) => {
        await page.goto('/');
        const swRegistered = await page.evaluate(async () => {
            if (!('serviceWorker' in navigator)) return false;
            const registration = await navigator.serviceWorker.getRegistration();
            return !!registration;
        });
        expect(swRegistered).toBe(true);
    });

    test('manifest.webmanifest доступний і валідний', async ({ page, request }) => {
        await page.goto('/');
        const response = await request.get('/manifest.webmanifest');
        expect(response.ok()).toBe(true);
        const manifest = await response.json();
        expect(manifest.name).toBe('Кролівництво від А до Я');
        expect(manifest.short_name).toBe('Кролівництво');
    });

    test('офлайн показує екран "Не вдалося підключитися"', async ({ page, context }) => {
        await context.setOffline(true);
        await page.goto('/', { timeout: 5000 }).catch(() => { });

        await expect(
            page.getByRole('heading', { name: 'Не вдалося підключитися' })
        ).toBeVisible({ timeout: 35000 });
        await expect(
            page.getByRole('button', { name: 'Оновити сторінку' })
        ).toBeVisible();

        await context.setOffline(false);
    });
});