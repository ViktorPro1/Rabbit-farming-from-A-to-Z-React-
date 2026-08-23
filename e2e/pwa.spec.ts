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

    test('офлайн показує банер "Немає з\'єднання з інтернетом"', async ({ page, context }) => {
        await page.goto('/');
        await expect(page.locator('.offline-banner')).not.toBeVisible();

        await context.setOffline(true);

        await expect(
            page.getByText(/Немає з'єднання з інтернетом/i)
        ).toBeVisible({ timeout: 10000 });

        await context.setOffline(false);
    });
});