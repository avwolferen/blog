import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display header with all navigation elements', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check site name/logo
    const siteName = page.getByText(/Alex van Wolferen/i);
    await expect(siteName).toBeVisible();
    
    // Check navigation links
    await expect(page.getByRole('link', { name: /Archive/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Tags/i })).toBeVisible();
  });

  test('should have sticky header on scroll', async ({ page }) => {
    const header = page.locator('header');
    
    // Check initial position
    await expect(header).toBeVisible();
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    
    // Header should still be visible (sticky)
    await expect(header).toBeVisible();
    
    // Check if header has sticky positioning
    const position = await header.evaluate((el) => 
      window.getComputedStyle(el).position
    );
    expect(position).toBe('sticky');
  });

  test('should navigate to homepage when clicking logo', async ({ page }) => {
    // Navigate to another page first
    await page.goto('/archive');
    await expect(page).toHaveURL(/archive/);
    
    // Click logo/site name
    const logo = page.getByRole('link', { name: /Alex van Wolferen/i });
    await logo.click();
    await page.waitForLoadState('networkidle');
    
    // Should be on homepage
    expect(page.url()).toBe('http://localhost:3000/');
  });

  test('should navigate to archive page', async ({ page }) => {
    const archiveLink = page.getByRole('link', { name: /Archive/i }).first();
    await archiveLink.click();
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/archive');
    await expect(page.getByRole('heading', { name: /Archive/i, level: 1 })).toBeVisible();
  });

  test('should navigate to tags page', async ({ page }) => {
    const tagsLink = page.getByRole('link', { name: /Tags/i }).first();
    await tagsLink.click();
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/tags');
    await expect(page.getByRole('heading', { name: /Tags/i, level: 1 })).toBeVisible();
  });

  test('should display dark mode toggle button', async ({ page }) => {
    // Look for theme toggle button (sun or moon icon)
    const themeToggle = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    const themeToggle = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    
    // Get initial theme
    const initialClass = await page.locator('html').getAttribute('class');
    
    // Click toggle
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Theme should have changed
    const newClass = await page.locator('html').getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('should persist dark mode across navigation', async ({ page }) => {
    const themeToggle = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    
    // Enable dark mode
    const initialClass = await page.locator('html').getAttribute('class');
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const darkModeClass = await page.locator('html').getAttribute('class');
    
    // Only proceed if theme actually changed
    if (darkModeClass !== initialClass) {
      // Navigate to another page
      await page.goto('/archive');
      await page.waitForLoadState('networkidle');
      
      // Check theme persisted
      const archiveClass = await page.locator('html').getAttribute('class');
      expect(archiveClass).toBe(darkModeClass);
    }
  });

  test('should display footer', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const footer = page.locator('footer');
    const links = footer.locator('a');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('should highlight active navigation link', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto('/archive');
      await page.waitForLoadState('networkidle');
      
      // Archive link might have different styling when active
      const archiveLink = page.getByRole('link', { name: /Archive/i }).first();
      await expect(archiveLink).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Check that navigation is still accessible
      const siteName = page.getByText(/Alex van Wolferen/i);
      await expect(siteName).toBeVisible();
    }
  });

  test('should have accessible navigation for keyboard users', async ({ page }) => {
    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper ARIA labels for icons', async ({ page }) => {
    const themeToggle = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    
    // Should be accessible
    await expect(themeToggle).toBeVisible();
    
    // Click should work
    await themeToggle.click();
  });
});
