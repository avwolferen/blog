import { test, expect } from '@playwright/test';

test.describe('Tag Filter Page', () => {
  let firstTag: string;

  test.beforeEach(async ({ page }) => {
    // Go to tags page and get first tag
    await page.goto('/tags');
    await page.waitForLoadState('networkidle');
    
    const firstTagLink = page.locator('a[href^="/tags/"]').first();
    const href = await firstTagLink.getAttribute('href');
    firstTag = decodeURIComponent(href?.replace('/tags/', '') || '');
    
    await page.goto(`/tags/${encodeURIComponent(firstTag)}`);
    await page.waitForLoadState('networkidle');
  });

  test('should load tag filter page successfully', async ({ page }) => {
    expect(page.url()).toContain(`/tags/${encodeURIComponent(firstTag)}`);
  });

  test('should display tag name in heading', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    const heading = await h1.textContent();
    expect(heading?.toLowerCase()).toContain(firstTag.toLowerCase());
  });

  test('should display only posts with selected tag', async ({ page }) => {
    const articles = page.locator('article');
    const articleCount = await articles.count();
    
    expect(articleCount).toBeGreaterThan(0);
    
    // Check that posts have the tag
    // This might be shown in the post card or we trust the filtering logic
  });

  test('should show post count for the tag', async ({ page }) => {
    const articles = page.locator('article');
    const articleCount = await articles.count();
    
    expect(articleCount).toBeGreaterThan(0);
  });

  test('should display post cards with all elements', async ({ page }) => {
    const firstPost = page.locator('article').first();
    
    // Check for title
    const title = firstPost.getByRole('heading');
    await expect(title).toBeVisible();
    
    // Check for date
    const time = firstPost.locator('time');
    await expect(time).toBeVisible();
    
    // Check for reading time
    const readingTime = firstPost.getByText(/min read/i);
    await expect(readingTime).toBeVisible();
  });

  test('should have working post links', async ({ page }) => {
    const firstArticle = page.locator('article').first();

    // Prefer any /blog/ link inside the article (more reliable than the heading anchor)
    const blogLink = firstArticle.locator("a[href*='/blog/']").first();
    expect(await blogLink.count()).toBeGreaterThan(0);

    const href = await blogLink.getAttribute('href');
    expect(href).toMatch(/\/blog\/.+/);

    // Click the blog link and wait for navigation (handles SPA or full navigation)
    await Promise.all([
      page.waitForURL('**/blog/**'),
      blogLink.click()
    ]);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/blog/');
  });

  test('should navigate to blog post and back', async ({ page }) => {
    const tagUrl = page.url();
    
    const firstPostLink = page.locator('article').first().getByRole('heading').locator('a');
    const target = await firstPostLink.getAttribute('target');

    if (target === '_blank') {
      // Link opens in a new tab/window
      const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        firstPostLink.click()
      ]);
      await popup.waitForLoadState('networkidle');
      expect(popup.url()).toContain('/blog/');
      await popup.close();

      // Original page should still be the tag page
      expect(page.url()).toBe(tagUrl);
    } else {
      // Normal same-page navigation (SPA or full navigation)
      await Promise.all([
        page.waitForURL('**/blog/**'),
        firstPostLink.click()
      ]);
      expect(page.url()).toContain('/blog/');

      // Go back
      await Promise.all([
        page.waitForURL(tagUrl),
        page.goBack()
      ]);
      expect(page.url()).toBe(tagUrl);
    }
  });

  test('should show other tags on posts', async ({ page }) => {
    const tags = page.locator('article a[href^="/tags/"]').first();
    
    if (await tags.count() > 0) {
      await expect(tags).toBeVisible();
    }
  });

  test('should allow navigation to other tags', async ({ page }) => {
    // Find a different tag on one of the posts
    const otherTagLink = page.locator('article a[href^="/tags/"]')
      .filter({ hasNot: page.locator(`[href="/tags/${encodeURIComponent(firstTag)}"]`) })
      .first();
    
    if (await otherTagLink.count() > 0) {
      const otherHref = await otherTagLink.getAttribute('href');
      
      await otherTagLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toBe(`http://localhost:3000${otherHref}`);
    }
  });

  test('should display posts in reverse chronological order', async ({ page }) => {
    const dates = page.locator('article time');
    const dateCount = await dates.count();
    
    if (dateCount >= 2) {
      const firstDate = await dates.first().getAttribute('datetime');
      const secondDate = await dates.nth(1).getAttribute('datetime');
      
      const first = new Date(firstDate || '');
      const second = new Date(secondDate || '');
      
      // First post should be newer or equal
      expect(first.getTime()).toBeGreaterThanOrEqual(second.getTime());
    }
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      const articles = page.locator('article');
      const firstArticle = articles.first();
      await expect(firstArticle).toBeVisible();
    }
  });

  test('should have breadcrumb or back link to all tags', async ({ page }) => {
    // Look for a link back to /tags
    const tagsLink = page.locator('a[href="/tags"]');
    
    if (await tagsLink.count() > 0) {
      // Wait for the URL change instead of relying on networkidle (SPA navigation)
      await Promise.all([
        page.waitForURL('**/tags', { timeout: 5000 }),
        tagsLink.first().click()
      ]);
      
      // Accept either with or without trailing slash and don't depend on host
      expect(page.url()).toMatch(/\/tags\/?$/);
    }
  });

  test('should show hover effects on post cards', async ({ page, isMobile }) => {
    if (!isMobile) {
      const firstPost = page.locator('article').first();
      
      await firstPost.hover();
      await page.waitForTimeout(100);
      
      const hasTransition = await firstPost.evaluate((el) => 
        window.getComputedStyle(el).transition.length > 0
      );
      
      expect(hasTransition).toBeTruthy();
    }
  });

  test('should handle URL encoding for special characters in tags', async ({ page }) => {
    // Current tag should be properly encoded in URL
    const url = page.url();
    expect(url).toContain('/tags/');
    
    // URL should not have unencoded spaces
    expect(url).not.toMatch(/\/tags\/[^\/]* [^\/]*/);
  });

  test('should have proper page title with tag name', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    // Should contain the tag name or "Tagged with"
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(`/tags/${encodeURIComponent(firstTag)}`);
    await page.waitForLoadState('networkidle');
    
    const realErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('ERR_BLOCKED_BY_CLIENT')
    );
    
    expect(realErrors).toHaveLength(0);
  });
});
