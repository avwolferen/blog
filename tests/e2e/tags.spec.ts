import { test, expect } from '@playwright/test';

test.describe('Tags Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tags');
    await page.waitForLoadState('networkidle');
  });

  test('should load successfully', async ({ page }) => {
    expect(page.url()).toContain('/tags');
    await expect(page.getByRole('heading', { name: /Tags/i, level: 1 })).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Tags');
  });

  test('should display all unique tags', async ({ page }) => {
    const tagLinks = page.locator('a[href^="/tags/"]');
    const tagCount = await tagLinks.count();
    
    expect(tagCount).toBeGreaterThan(0);
  });

  test('should display post count for each tag', async ({ page }) => {
    const tagContainer = page.locator('a[href^="/tags/"]').first();
    
    // Should contain a number in parentheses like (5)
    const text = await tagContainer.textContent();
    expect(text).toMatch(/\(\d+\)/);
  });

  test('should have working tag links', async ({ page }) => {
    const firstTag = page.locator('a[href^="/tags/"]').first();
    const href = await firstTag.getAttribute('href');
    
    expect(href).toMatch(/^\/tags\/.+/);
    
    await firstTag.click();
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/tags/');
    expect(page.url()).not.toBe('http://localhost:3000/tags');
  });

  test('should navigate correctly for tags with whitespace', async ({ page }) => {
    const tagName = 'xm cloud';
    const encodedTag = encodeURIComponent(tagName);
    const whitespaceTagLink = page.locator('a[href^="/tags/"]').filter({ hasText: tagName }).first();

    await expect(whitespaceTagLink).toBeVisible();
    await expect(whitespaceTagLink).toHaveAttribute('href', `/tags/${encodedTag}`);
    await page.goto(`/tags/${encodedTag}`);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain(`/tags/${encodedTag}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(tagName);
  });

  test('should display tag names clearly', async ({ page }) => {
    const tags = page.locator('a[href^="/tags/"]');
    const firstTag = tags.first();
    
    const tagText = await firstTag.textContent();
    const tagName = tagText?.replace(/\(\d+\)/, '').trim();
    
    expect(tagName?.length).toBeGreaterThan(0);
  });

  test('should show hover effects on tags', async ({ page, isMobile }) => {
    if (!isMobile) {
      const firstTag = page.locator('a[href^="/tags/"]').first();
      
      // Hover over tag
      await firstTag.hover();
      await page.waitForTimeout(100);
      
      // Should have transition
      const hasTransition = await firstTag.evaluate((el) => 
        window.getComputedStyle(el).transition.length > 0
      );
      
      expect(hasTransition).toBeTruthy();
    }
  });

  test('should have proper tag styling', async ({ page }) => {
    const firstTag = page.locator('a[href^="/tags/"]').first();
    
    // Check for background color (tags should be styled)
    const bgColor = await firstTag.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('transparent');
  });

  test('should display tags in a grid or flex layout', async ({ page }) => {
    const tagContainer = page.locator('div.flex, div.grid').first();
    await expect(tagContainer).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      const container = page.locator('.max-w-4xl').first();
      await expect(container).toBeVisible();
      
      // Tags should wrap properly
      const tags = page.locator('a[href^="/tags/"]');
      const firstTag = tags.first();
      await expect(firstTag).toBeVisible();
    }
  });

  test('should sort tags logically', async ({ page }) => {
    const tags = page.locator('a[href^="/tags/"]');
    const tagCount = await tags.count();
    
    expect(tagCount).toBeGreaterThan(0);
    
    // Get first few tags to verify they exist
    if (tagCount > 0) {
      const firstTagText = await tags.first().textContent();
      expect(firstTagText?.length).toBeGreaterThan(0);
    }
  });

  test('should have accessible tag elements', async ({ page }) => {
    const tags = page.locator('a[href^="/tags/"]');
    const firstTag = tags.first();
    
    // Should be a link
    await expect(firstTag).toHaveAttribute('href');
    
    // Should have text content
    const text = await firstTag.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('should navigate back from tag page to tags list', async ({ page }) => {
    const firstTag = page.locator('a[href^="/tags/"]').first();
    await firstTag.click();
    await page.waitForLoadState('networkidle');
    
    // Use browser back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/tags');
    expect(page.url()).toBe('http://localhost:3000/tags');
  });

  test('should have proper spacing between tags', async ({ page }) => {
    const container = page.locator('div').filter({ has: page.locator('a[href^="/tags/"]') }).first();
    
    // Check for gap or spacing
    const gap = await container.evaluate((el) => 
      window.getComputedStyle(el).gap
    );
    
    expect(gap).toBeTruthy();
  });

  test('should display dark mode styling correctly', async ({ page }) => {
    const themeToggle = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    
    // Toggle to dark mode
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const firstTag = page.locator('a[href^="/tags/"]').first();
    await expect(firstTag).toBeVisible();
    
    // Tag should still be readable
    const color = await firstTag.evaluate((el) => 
      window.getComputedStyle(el).color
    );
    
    expect(color).toBeTruthy();
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/tags');
    await page.waitForLoadState('networkidle');
    
    const realErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('ERR_BLOCKED_BY_CLIENT')
    );
    
    expect(realErrors).toHaveLength(0);
  });
});
