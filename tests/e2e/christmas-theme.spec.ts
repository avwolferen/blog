import { test, expect } from '@playwright/test';

test.describe('Christmas Theme', () => {
  test('should cycle to christmas theme and persist in localStorage', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const themeToggle = page.getByRole('button', { name: 'Switch theme' });

    await themeToggle.click();
    await page.waitForTimeout(300);
    await themeToggle.click();
    await page.waitForTimeout(300);

    await expect(html).toHaveClass(/christmas/);

    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('christmas');
  });

  test('should persist christmas theme after reload', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      localStorage.setItem('theme', 'christmas');
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('html')).toHaveClass(/christmas/);
  });
});
