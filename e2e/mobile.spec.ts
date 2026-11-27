import { test, expect } from '@playwright/test';

// Мобільні сценарії. Запускаються лише в проєкті «Mobile Chrome»
// (див. playwright.config.ts), екран Pixel 5: 393x727.

test.describe('Мобільна версія', () => {
    test('шапка показує бургер-кнопку', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('button', { name: 'Меню', exact: true })).toBeVisible();
    });

    test('бургер відкриває і закриває мобільне меню', async ({ page }) => {
        await page.goto('/');
        const burger = page.getByRole('button', { name: 'Меню', exact: true });
        const drawer = page.getByRole('navigation', { name: 'Мобільне меню' });

        await expect(burger).toHaveAttribute('aria-expanded', 'false');
        await expect(drawer).not.toHaveClass(/drawer--open/);

        await burger.click();
        await expect(burger).toHaveAttribute('aria-expanded', 'true');
        await expect(drawer).toHaveClass(/drawer--open/);

        await page.getByRole('button', { name: 'Закрити меню' }).click();
        await expect(burger).toHaveAttribute('aria-expanded', 'false');
        await expect(drawer).not.toHaveClass(/drawer--open/);
    });

    for (const path of ['/', '/breeds', '/beginner-guide']) {
        test(`сторінка ${path} без горизонтальної прокрутки`, async ({ page }) => {
            await page.goto(path);
            await expect(page.locator('h1').first()).toBeVisible();
            const overflow = await page.evaluate(
                () => document.documentElement.scrollWidth - window.innerWidth,
            );
            expect(overflow).toBeLessThanOrEqual(0);
        });
    }
});
