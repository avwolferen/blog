import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Just another blog about Sitecore/i);
  });

  test('should display main heading', async ({ page }) => {
    const heading = page.getByRole('heading', { 
      name: /Just another blog about Sitecore, tips and tricks/i,
      level: 1 
    });
    await expect(heading).toBeVisible();
  });

  test('should display MVP tagline', async ({ page }) => {
    const tagline = page.getByText(/Sitecore MVP Technology 2018, 2021 and 2022/i);
    await expect(tagline).toBeVisible();
  });

  test('should display featured posts', async ({ page }) => {
    // Wait for posts to load
    await page.waitForSelector('article', { timeout: 5000 });
    
    // Check that there are posts displayed
    const articles = page.locator('article');
    const count = await articles.count();
    
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(10); // Should show max 10 featured posts
  });

  test('should display post card with required elements', async ({ page }) => {
    const firstPost = page.locator('article').first();
    
    // Check for title
    const title = firstPost.getByRole('heading', { level: 2 });
    await expect(title).toBeVisible();
    
    // Check for date
    const time = firstPost.locator('time');
    await expect(time).toBeVisible();
    
    // Check for reading time
    const readingTime = firstPost.getByText(/min read/i);
    await expect(readingTime).toBeVisible();
    
    // Check for excerpt
    const excerpt = firstPost.locator('p');
    await expect(excerpt.first()).toBeVisible();
  });

  test('should have working post card links', async ({ page }) => {
    const firstPostLink = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    const href = await firstPostLink.getAttribute('href');
    
    expect(href).toBeTruthy();
    expect(href).toMatch(/^\/blog\//);
    
    // Click and verify navigation
    await firstPostLink.click();
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/blog/');
  });

  test('should display and work with tags', async ({ page }) => {
    // Find first post with tags
    const tagLink = page.locator('article a[href^="/tags/"]').first();
    
    if (await tagLink.count() > 0) {
      const tagHref = await tagLink.getAttribute('href');
      expect(tagHref).toMatch(/^\/tags\/.+/);
      
      await tagLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/tags/');
    }
  });

  test('should display images with proper alt text', async ({ page }) => {
    const images = page.locator('article img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt?.length).toBeGreaterThan(0);
      }
    }
  });

  test('should show "View All Posts" button when many posts exist', async ({ page }) => {
    const articles = page.locator('article');
    const count = await articles.count();
    
    if (count === 10) {
      const viewAllButton = page.getByRole('link', { name: /View All Posts/i });
      await expect(viewAllButton).toBeVisible();
      
      await viewAllButton.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/archive');
    }
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check that layout adapts
      const container = page.locator('.max-w-7xl').first();
      await expect(container).toBeVisible();
      
      // Posts should stack vertically on mobile
      const articles = page.locator('article');
      const firstArticle = articles.first();
      await expect(firstArticle).toBeVisible();
    }
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(errors).toHaveLength(0);
  });

  test('should display hover effects on post cards', async ({ page, isMobile }) => {
    if (!isMobile) {
      const firstPost = page.locator('article').first();
      
      // Hover over the card
      await firstPost.hover();
      
      // Shadow should change (checking class exists is enough)
      const hasTransition = await firstPost.evaluate((el) => {
        return window.getComputedStyle(el).transition.length > 0;
      });
      
      expect(hasTransition).toBeTruthy();
    }
  });
});
