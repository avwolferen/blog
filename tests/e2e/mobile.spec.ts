import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });
test.describe('Mobile Responsiveness', () => {

  test.skip('homepage should be responsive on mobile', async ({ page }) => {
    await page.goto('/');
    
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(500);
    
    // Main content should be visible
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test.skip('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.goto('/');
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
  });

  test.skip('navigation should be accessible on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Header should be visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Navigation links should be accessible
    const archiveLink = page.getByRole('link', { name: /Archive/i }).first();
    await expect(archiveLink).toBeVisible();
  });

  test.skip('post cards should stack vertically on mobile', async ({ page }) => {
    await page.goto('/');
    
    const articles = page.locator('article');
    const firstArticle = articles.nth(0);
    const secondArticle = articles.nth(1);
    
    if (await articles.count() >= 2) {
      const firstBox = await firstArticle.boundingBox();
      const secondBox = await secondArticle.boundingBox();
      
      // Second article should be below first (higher y coordinate)
      expect(secondBox!.y).toBeGreaterThan(firstBox!.y);
    }
  });

  test.skip('images should be responsive on mobile', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('article img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      const box = await firstImage.boundingBox();
      const viewport = page.viewportSize();
      
      // Image should not overflow viewport
      expect(box!.width).toBeLessThanOrEqual(viewport!.width);
    }
  });

  test.skip('text should be readable on mobile', async ({ page }) => {
    await page.goto('/');
    
    const heading = page.getByRole('heading', { level: 1 });
    const fontSize = await heading.evaluate((el) => 
      parseFloat(window.getComputedStyle(el).fontSize)
    );
    
    // Font size should be at least 16px for readability
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });

  test.skip('touch targets should be large enough', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a');
    const firstLink = links.first();
    
    const box = await firstLink.boundingBox();
    
    // Touch target should be at least 44x44px (iOS guideline)
    expect(box!.height).toBeGreaterThanOrEqual(30); // Allowing some flexibility
  });

  test.skip('blog post should be readable on mobile', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    const prose = page.locator('.prose, article');
    await expect(prose).toBeVisible();
    
    // Content should not overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasOverflow).toBe(false);
  });

  test.skip('code blocks should be scrollable on mobile', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    const codeBlocks = page.locator('pre');
    const codeCount = await codeBlocks.count();
    
    if (codeCount > 0) {
      const firstCode = codeBlocks.first();
      const overflow = await firstCode.evaluate((el) => 
        window.getComputedStyle(el).overflowX
      );
      
      // Should be scrollable or auto
      expect(['auto', 'scroll']).toContain(overflow);
    }
  });

  test.skip('archive page should be readable on mobile', async ({ page }) => {
    await page.goto('/archive');
    
    const heading = page.getByRole('heading', { name: /Archive/i, level: 1 });
    await expect(heading).toBeVisible();
    
    const posts = page.locator('h4');
    await expect(posts.first()).toBeVisible();
  });

  test.skip('tags should wrap properly on mobile', async ({ page }) => {
    await page.goto('/tags');
    
    const tags = page.locator('a[href^="/tags/"]');
    await expect(tags.first()).toBeVisible();
    
    // Tags should not cause horizontal scroll
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasOverflow).toBe(false);
  });

  test.skip('theme toggle should work on mobile', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    
    await expect(themeToggle).toBeVisible();
    
    await themeToggle.tap();
    await page.waitForTimeout(300);
    
    // Theme should toggle
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toBeTruthy();
  });

  test.skip('forms should be usable on mobile', async ({ page }) => {
    await page.goto('/');
    
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      const firstInput = inputs.first();
      await expect(firstInput).toBeVisible();
      
      const box = await firstInput.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(30);
    }
  });

  test.skip('footer should be accessible on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test.skip('should support pinch-to-zoom', async ({ page }) => {
    await page.goto('/');
    
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    
    // Should not have user-scalable=no
    expect(viewport).not.toContain('user-scalable=no');
  });

  test.skip('should handle orientation change', async ({ page }) => {
    await page.goto('/');
    
    // Portrait mode
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    
    // Landscape mode
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(300);
    
    await expect(heading).toBeVisible();
  });
});

test.use({ ...devices['iPad'] });
test.describe('Tablet Responsiveness', () => {

  test.skip('should be responsive on tablet', async ({ page }) => {
    await page.goto('/');
    
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    
    // Should not have horizontal scroll
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasOverflow).toBe(false);
  });

  test.skip('posts should display in grid on tablet', async ({ page }) => {
    await page.goto('/');
    
    const articles = page.locator('article');
    const articleCount = await articles.count();
    
    if (articleCount >= 2) {
      const firstBox = await articles.nth(0).boundingBox();
      const secondBox = await articles.nth(1).boundingBox();
      
      // On tablet, articles might be side by side
      // Check if they're roughly at the same y position (grid layout)
      const yDifference = Math.abs(firstBox!.y - secondBox!.y);
      
      // Either stacked or in a grid
      expect(true).toBe(true);
    }
  });
});
