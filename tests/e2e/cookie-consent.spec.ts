import { test, expect } from '@playwright/test';

test.describe('Cookie consent for analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show consent banner on first visit and not load analytics script', async ({ page }) => {
    await expect(page.getByText(/We use Google Analytics cookies/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accept' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reject' })).toBeVisible();
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
  });

  test('should load analytics after accepting consent', async ({ page }) => {
    await page.getByRole('button', { name: 'Accept' }).click();
    await expect.poll(() => page.evaluate(() => window.localStorage.getItem('analytics-consent')), { timeout: 1000 }).toBe('accepted');

    await expect(page.getByText(/We use Google Analytics cookies/i)).toHaveCount(0);
    await page.waitForSelector('script[src*="googletagmanager.com/gtag/js"]', { state: 'attached' });
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);
  });

  test('should not load analytics after rejecting consent', async ({ page }) => {
    await page.getByRole('button', { name: 'Reject' }).click();
    await expect.poll(() => page.evaluate(() => window.localStorage.getItem('analytics-consent')), { timeout: 1000 }).toBe('rejected');

    await expect(page.getByText(/We use Google Analytics cookies/i)).toHaveCount(0);
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
  });

  test('should persist accepted consent across reloads', async ({ page }) => {
    await page.getByRole('button', { name: 'Accept' }).click();
    await page.waitForSelector('script[src*="googletagmanager.com/gtag/js"]', { state: 'attached' });

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByText(/We use Google Analytics cookies/i)).toHaveCount(0);
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1);
  });

  test('should persist rejected consent across reloads', async ({ page }) => {
    await page.getByRole('button', { name: 'Reject' }).click();

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByText(/We use Google Analytics cookies/i)).toHaveCount(0);
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
  });
});
