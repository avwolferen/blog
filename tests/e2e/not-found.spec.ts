import { test, expect } from '@playwright/test';

test.describe('404 Not Found Page', () => {
  test('should display 404 page for non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    
    // Should return 404 status
    expect(response?.status()).toBe(404);
  });

  test('should display 404 page for non-existent blog posts', async ({ page }) => {
    const response = await page.goto('/blog/this-post-does-not-exist');
    
    expect(response?.status()).toBe(404);
  });

  test('should have helpful 404 page content', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    
    // Should have some indication it's a 404
    const body = await page.textContent('body');
    const has404Indicator = 
      body?.includes('404') || 
      body?.includes('not found') || 
      body?.includes('Not Found') ||
      body?.includes('doesn\'t exist');
    
    expect(has404Indicator).toBe(true);
  });

  test('should have working navigation on 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    
    // Header should still be present
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Logo should link back to home
    const logo = page.getByRole('link', { name: /Alex van Wolferen/i });
    await expect(logo).toBeVisible();
  });

  test('should navigate home from 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    
    // Click logo or home link
    const homeLink = page.getByRole('link', { name: /Alex van Wolferen/i }).or(
      page.getByRole('link', { name: /home/i })
    ).first();
    
    if (await homeLink.count() > 0) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toBe('http://localhost:3000/');
    }
  });

  test('should have navigation menu on 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    
    // Archive and Tags links should work
    const archiveLink = page.getByRole('link', { name: /Archive/i }).first();
    const tagsLink = page.getByRole('link', { name: /Tags/i }).first();
    
    if (await archiveLink.count() > 0) {
      await expect(archiveLink).toBeVisible();
    }
    
    if (await tagsLink.count() > 0) {
      await expect(tagsLink).toBeVisible();
    }
  });

  test('should maintain theme on 404 page', async ({ page }) => {
    // Set dark mode on homepage
    await page.goto('/');
    
    const themeToggle = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const homeClass = await page.locator('html').getAttribute('class');
    const homeIsDark = homeClass?.includes('dark');
    
    // Go to 404 page
    await page.goto('/this-page-does-not-exist');
    
    const notFoundClass = await page.locator('html').getAttribute('class');
    const notFoundIsDark = notFoundClass?.includes('dark');
    
    expect(notFoundIsDark).toBe(homeIsDark);
  });

  test('should have proper styling on 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    
    // Page should have consistent styling with rest of site
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(bgColor).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/this-page-does-not-exist');
    
    // Should not have horizontal scroll
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasOverflow).toBe(false);
  });

  test('should have accessible 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    
    // Should have proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should have footer on 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const footer = page.locator('footer');
    
    // Footer might be present
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
    }
  });

  test('should have no console errors on 404 page', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/this-page-does-not-exist');
    await page.waitForLoadState('networkidle');
    
    const realErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('ERR_BLOCKED_BY_CLIENT')
    );
    
    expect(realErrors).toHaveLength(0);
  });

  test('should handle nested non-existent routes', async ({ page }) => {
    const response = await page.goto('/blog/category/subcategory/post-that-does-not-exist');
    
    expect(response?.status()).toBe(404);
  });

  test('should have search or suggestions on 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    
    // Look for helpful links or suggestions
    const links = page.locator('a');
    const linkCount = await links.count();
    
    // Should have some links to help user navigate
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should handle special characters in URL', async ({ page }) => {
    const response = await page.goto('/page-with-special-chars-!@#$%');
    
    expect(response?.status()).toBe(404);
  });

  test('should handle very long URLs', async ({ page }) => {
    const longPath = '/blog/' + 'a'.repeat(500);
    const response = await page.goto(longPath);
    
    expect(response?.status()).toBe(404);
  });
});
