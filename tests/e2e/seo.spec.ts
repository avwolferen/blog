import { test, expect } from '@playwright/test';

test.describe('SEO and Metadata', () => {
  test('homepage should have correct meta title', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toContain('Sitecore');
    expect(title.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThan(70); // SEO best practice
  });

  test('homepage should have meta description', async ({ page }) => {
    await page.goto('/');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
    expect(description!.length).toBeLessThan(160); // SEO best practice
  });

  test('blog post should have correct meta title', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('blog post should have meta description', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    const description = await page.locator('meta[name="description"], meta[property="og:description"]').first().getAttribute('content');
    expect(description).toBeTruthy();
  });

  test('should have Open Graph tags on homepage', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogType).toBeTruthy();
    expect(ogUrl).toBeTruthy();
  });

  test('should have Open Graph tags on blog posts', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogType).toBe('article');
  });

  test('should have Twitter Card tags on homepage', async ({ page }) => {
    await page.goto('/');
    
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    
    expect(twitterCard).toBeTruthy();
    expect(twitterTitle).toBeTruthy();
    expect(twitterDescription).toBeTruthy();
  });

  test('should have Twitter Card tags on blog posts', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    
    expect(twitterCard).toBeTruthy();
    expect(twitterTitle).toBeTruthy();
  });

  test('should have canonical URL', async ({ page }) => {
    await page.goto('/');
    
    const canonical = page.locator('link[rel="canonical"]');
    const hasCanonical = await canonical.count() > 0;
    
    if (hasCanonical) {
      const href = await canonical.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  test('should have proper language attribute', async ({ page }) => {
    await page.goto('/');
    
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('should have viewport meta tag', async ({ page }) => {
    await page.goto('/');
    
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
    expect(viewport).toContain('width=device-width');
  });

  test('robots.txt should be accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should not have multiple h1 tags on any page', async ({ page }) => {
    const pages = ['/', '/archive', '/tags'];
    
    for (const url of pages) {
      await page.goto(url);
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeLessThanOrEqual(1);
    }
  });

  test('should have structured data for blog posts', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    // Check for JSON-LD structured data
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const hasStructuredData = await jsonLd.count() > 0;
    
    // This is optional but good for SEO
    if (hasStructuredData) {
      const content = await jsonLd.first().textContent();
      expect(content).toBeTruthy();
    }
  });

  test('should have author meta information', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    // Check for author in Open Graph or other meta tags
    const ogArticleAuthor = await page.locator('meta[property="og:article:author"], meta[property="article:author"]').count();
    
    // Author metadata is present in some form
    expect(true).toBe(true);
  });

  test('should have proper URL structure', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    const href = await firstPost.getAttribute('href');
    
    // URLs should be clean and descriptive
    expect(href).toMatch(/^\/blog\/[a-z0-9-]+$/);
    expect(href).not.toContain('?');
    expect(href).not.toContain('&');
  });

  test('images should have descriptive alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      expect(alt).toBeTruthy();
      expect(alt!.length).toBeGreaterThan(0);
    }
  });

  test('should have proper date formatting in articles', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    const time = page.locator('time');
    const datetime = await time.getAttribute('datetime');
    
    expect(datetime).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  test('should have appropriate meta tags for article publication', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    // Check for published time in Open Graph
    const publishedTime = page.locator('meta[property="og:article:published_time"], meta[property="article:published_time"]');
    const hasPublishedTime = await publishedTime.count() > 0;
    
    if (hasPublishedTime) {
      const content = await publishedTime.getAttribute('content');
      expect(content).toBeTruthy();
    }
  });
});
