import { test, expect } from '@playwright/test';

test.describe('Публічні маршрути', () => {
    test('головна сторінка завантажується', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Кролівництво/);
    });

    test('сторінка "Породи" відкривається', async ({ page }) => {
        await page.goto('/breeds');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('сторінка "Гід для новачків" відкривається', async ({ page }) => {
        await page.goto('/beginner-guide');
        await expect(page.locator('h1')).toBeVisible();
    });

    // Додано 2026-11-27: калькулятор дат публічний, доступний без входу
    test('калькулятор дат відкривається гостю без входу', async ({ page }) => {
        await page.goto('/dates-calculator');
        await expect(page.getByRole('heading', { name: 'Калькулятор дат розведення' })).toBeVisible();
    });

    // Додано 2026-11-27: старий /calculator веде на калькулятор дат, а не на 404
    test('старий /calculator перенаправляє на /dates-calculator', async ({ page }) => {
        await page.goto('/calculator');
        await expect(page).toHaveURL(/\/dates-calculator$/);
    });

    test('невідомий шлях показує 404', async ({ page }) => {
        await page.goto('/this-page-does-not-exist');
        await expect(page.getByRole('heading', { name: 'Сторінку не знайдено' })).toBeVisible();
    });
});

test.describe('Захищені маршрути (без сесії)', () => {
    test('/admin без сесії показує форму входу, не адмін-панель', async ({ page }) => {
        await page.goto('/admin');
        await expect(
            page.getByRole('button', { name: 'Увійти' })
        ).toBeVisible();
    });

    test('/registry без сесії показує форму входу, не реєстр', async ({ page }) => {
        await page.goto('/registry');
        await expect(
            page.getByRole('button', { name: 'Увійти' })
        ).toBeVisible();
    });

    // Зміна 2026-11-27: було '/calculator'. Єдиний калькулятор розділено (2026-11-24),
    // закритим у кабінеті лишився зерновий — /grain-calculator.
    test('/grain-calculator без сесії показує форму входу', async ({ page }) => {
        await page.goto('/grain-calculator');
        await expect(
            page.getByRole('button', { name: 'Увійти' })
        ).toBeVisible();
        // після успішного логіну мало б повернути на /grain-calculator (returnTo),
        // це поведінка, яку реальний логін-флоу не перевіримо без тестового акаунту —
        // саму форму та факт її показу вже покриваємо
    });
});