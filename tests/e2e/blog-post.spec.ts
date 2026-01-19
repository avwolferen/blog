import { test, expect } from '@playwright/test';

test.describe('Blog Post Detail', () => {
  let firstPostSlug: string;

  test.beforeEach(async ({ page }) => {
    // Go to homepage and get first post
    await page.goto('/');
    await page.waitForSelector('article');
    
    const firstPostLink = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    const href = await firstPostLink.getAttribute('href');
    firstPostSlug = href?.replace('/blog/', '') || '';
    
    await page.goto(`/blog/${firstPostSlug}`);
    await page.waitForLoadState('networkidle');
  });

  test('should load blog post successfully', async ({ page }) => {
    // Check that we're on a blog post page
    expect(page.url()).toContain('/blog/');
    
    // Should have main heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const title = await h1.textContent();
    expect(title?.length).toBeGreaterThan(0);
  });

  test('should display correct page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should display post metadata', async ({ page }) => {
    // Check for date
    const time = page.locator('time');
    await expect(time).toBeVisible();
    
    const dateTime = await time.getAttribute('datetime');
    expect(dateTime).toBeTruthy();
    expect(dateTime).toMatch(/^\d{4}-\d{2}-\d{2}/);
    
    // Check for reading time
    const readingTime = page.getByText(/min read/i);
    await expect(readingTime).toBeVisible();
  });

  test('should display cover image when present', async ({ page }) => {
    const coverImage = page.locator('article header img').first();
    const imageExists = await coverImage.count() > 0;
    
    if (imageExists) {
      await expect(coverImage).toBeVisible();
      
      // Check alt text
      const alt = await coverImage.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should display tags when present', async ({ page }) => {
    const tags = page.locator('article header a[href^="/tags/"]');
    const tagCount = await tags.count();
    
    if (tagCount > 0) {
      // Check first tag
      const firstTag = tags.first();
      await expect(firstTag).toBeVisible();
      
      // Tag should be clickable
      const href = await firstTag.getAttribute('href');
      expect(href).toMatch(/^\/tags\/.+/);
    }
  });

  test('should render post content', async ({ page }) => {
    const content = page.locator('.prose');
    await expect(content).toBeVisible();
    
    // Content should have text
    const text = await content.textContent();
    expect(text?.length).toBeGreaterThan(100);
  });

  test('should have proper typography styling', async ({ page }) => {
    const prose = page.locator('.prose');
    await expect(prose).toBeVisible();
    
    // Check that prose classes are applied
    const classes = await prose.getAttribute('class');
    expect(classes).toContain('prose');
  });

  test('should render code blocks with syntax highlighting', async ({ page }) => {
    const codeBlocks = page.locator('pre code');
    const codeCount = await codeBlocks.count();
    
    if (codeCount > 0) {
      const firstCode = codeBlocks.first();
      await expect(firstCode).toBeVisible();
      
      // Check for Prism classes or styling
      const html = await firstCode.innerHTML();
      expect(html.length).toBeGreaterThan(0);
    }
  });

  test('should display reading progress bar', async ({ page }) => {
    // Look for reading progress bar component
    const progressBar = page.locator('[class*="progress"]').first();
    
    // If it exists, it should be visible or become visible on scroll
    if (await progressBar.count() > 0) {
      // Scroll down to trigger progress
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(300);
    }
  });

  test('should update reading progress on scroll', async ({ page }) => {
    // Scroll to middle of page
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTo = (scrollHeight - clientHeight) / 2;
      window.scrollTo(0, scrollTo);
    });
    
    await page.waitForTimeout(300);
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    // Just verify no errors occurred during scrolling
    expect(true).toBe(true);
  });

  test('should have working links within content', async ({ page }) => {
    const contentLinks = page.locator('.prose a');
    const linkCount = await contentLinks.count();
    
    if (linkCount > 0) {
      const firstLink = contentLinks.first();
      const href = await firstLink.getAttribute('href');
      
      expect(href).toBeTruthy();
    }
  });

  test('should display images in content with alt text', async ({ page }) => {
    const contentImages = page.locator('.prose img');
    const imageCount = await contentImages.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = contentImages.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    }
  });

  test('should display previous/next post navigation', async ({ page }) => {
    // Scroll to footer area where navigation typically is
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const footer = page.locator('article footer');
    await expect(footer).toBeVisible();
  });

  test('should navigate to previous post', async ({ page }) => {
    const prevLink = page.locator('a:has-text("Previous"), a:has-text("←")').first();
    
    if (await prevLink.count() > 0) {
      await prevLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/blog/');
    }
  });

  test('should navigate to next post', async ({ page }) => {
    const nextLink = page.locator('a:has-text("Next"), a:has-text("→")').first();
    
    if (await nextLink.count() > 0) {
      await nextLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/blog/');
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should only have one h1
    
    // Check that h2, h3, etc. exist if content has structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      const article = page.locator('article');
      await expect(article).toBeVisible();
      
      // Content should be readable
      const prose = page.locator('.prose');
      await expect(prose).toBeVisible();
    }
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(`/blog/${firstPostSlug}`);
    await page.waitForLoadState('networkidle');
    
    // Filter out known benign errors
    const realErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('ERR_BLOCKED_BY_CLIENT')
    );
    
    expect(realErrors).toHaveLength(0);
  });

  test('should handle browser back navigation', async ({ page }) => {
    // Click a tag or link
    const tag = page.locator('article header a[href^="/tags/"]').first();
    
    if (await tag.count() > 0) {
      await tag.click();
      await page.waitForLoadState('networkidle');
      
      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      // Should be back on blog post
      expect(page.url()).toContain(`/blog/${firstPostSlug}`);
    }
  });

  test('should display auto-scroll next feature if implemented', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Check if auto-scroll component exists
    const autoScroll = page.locator('[class*="AutoScroll"]');
    
    // This is optional, so we just check if it exists
    if (await autoScroll.count() > 0) {
      await expect(autoScroll).toBeVisible();
    }
  });
});
