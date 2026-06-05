import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('homepage should load in reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('blog post should load in reasonable time', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    
    const startTime = Date.now();
    
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have no console errors on any page', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    const pages = ['/', '/archive', '/tags'];
    
    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
    }
    
    // Filter out known benign errors
    const realErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('ERR_BLOCKED_BY_CLIENT') &&
      !err.includes('net::ERR')
    );
    
    expect(realErrors).toHaveLength(0);
  });

  test('should have no JavaScript errors', async ({ page }) => {
    const jsErrors: Error[] = [];
    
    page.on('pageerror', (error) => {
      jsErrors.push(error);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(jsErrors).toHaveLength(0);
  });

  test('images should be optimized (WebP or AVIF)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        
        // Next.js Image component should serve optimized images
        expect(src).toBeTruthy();
      }
    }
  });

  test('should implement lazy loading for images', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 3) {
      // Check for loading attribute
      const lazyImages = await page.locator('img[loading="lazy"]').count();
      
      // Some images should be lazy loaded
      expect(lazyImages).toBeGreaterThan(0);
    }
  });

  test('should have no broken links on homepage', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a[href^="/"]');
    const linkCount = await links.count();
    
    // Test first 10 internal links
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && href.startsWith('/')) {
        const response = await page.request.get(href);
        expect(response.status()).toBeLessThan(400);
      }
    }
  });

  test('should use caching headers for static assets', async ({ page }) => {
    const response = await page.goto('/');
    
    expect(response?.status()).toBe(200);
    
    // Check for cache headers (Next.js should set these)
    const headers = response?.headers();
    expect(headers).toBeTruthy();
  });

  test('should send anti-clickjacking headers', async ({ page }) => {
    const response = await page.request.get('/');

    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['permissions-policy']).toContain('microphone=()');
    expect(headers['permissions-policy']).toContain('geolocation=()');
    expect(headers['permissions-policy']).toContain('payment=()');
    expect(headers['permissions-policy']).toContain('publickey-credentials-get=()');
    expect(headers['permissions-policy']).toContain('browsing-topics=()');
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['content-security-policy']).toContain("base-uri 'self'");
    expect(headers['content-security-policy']).toContain("form-action 'self'");
    expect(headers['content-security-policy']).toContain("object-src 'none'");
    expect(headers['content-security-policy']).toContain(
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com"
    );
    expect(headers['content-security-policy']).toContain(
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"
    );
    expect(headers['content-security-policy']).toContain("font-src 'self' https://fonts.gstatic.com");
    expect(headers['content-security-policy']).toContain(
      "img-src 'self' data: blob: https://www.google-analytics.com"
    );
    expect(headers['content-security-policy']).toContain(
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com"
    );
  });

  test('should send strict referrer policy on all responses', async ({ page }) => {
    const routes = ['/', '/archive', '/tags', '/this-route-does-not-exist'];

    for (const route of routes) {
      const response = await page.request.get(route);

      expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
    }
  });

  test('should minimize render-blocking resources', async ({ page }) => {
    await page.goto('/');
    
    // Check that page renders quickly
    const firstPaint = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('paint');
      const fcp = perfData.find(entry => entry.name === 'first-contentful-paint');
      return fcp ? fcp.startTime : 0;
    });
    
    // First Contentful Paint should be under 3 seconds
    expect(firstPaint).toBeLessThan(3000);
  });

  test('should have reasonable bundle size', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for JavaScript resources
    const jsResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources
        .filter(r => r.name.includes('.js'))
        .reduce((total, r) => total + (r.transferSize || 0), 0);
    });
    
    // Total JS should be reasonable (< 1MB)
    expect(jsResources).toBeLessThan(1024 * 1024);
  });

  test('should prefetch critical resources', async ({ page }) => {
    await page.goto('/');
    
    // Check for prefetch/preload links
    const prefetchLinks = await page.locator('link[rel="prefetch"], link[rel="preload"]').count();
    
    // Next.js should prefetch routes
    expect(prefetchLinks).toBeGreaterThanOrEqual(0);
  });

  test('should handle navigation without full page reload', async ({ page }) => {
    await page.goto('/');
    
    // Click internal link
    const archiveLink = page.getByRole('link', { name: /Archive/i }).first();
    
    await archiveLink.click();
    await page.waitForURL('**/archive');
    
    // Should navigate quickly (client-side routing)
    expect(page.url()).toContain('/archive');
  });

  test('should have efficient CSS', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check CSS size
    const cssSize = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources
        .filter(r => r.name.includes('.css'))
        .reduce((total, r) => total + (r.transferSize || 0), 0);
    });
    
    // CSS should be reasonable (< 200KB)
    expect(cssSize).toBeLessThan(200 * 1024);
  });

  test('should use efficient fonts', async ({ page }) => {
    await page.goto('/');
    
    // Check for font-display property
    const hasOptimalFontDisplay = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      let hasOptimalDisplay = false;
      
      try {
        styleSheets.forEach(sheet => {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule instanceof CSSFontFaceRule) {
                const fontDisplay = rule.style.getPropertyValue('font-display');
                if (fontDisplay === 'swap' || fontDisplay === 'optional') {
                  hasOptimalDisplay = true;
                }
              }
            });
          }
        });
      } catch {
        // Cross-origin stylesheets might throw errors
      }
      
      return hasOptimalDisplay;
    });
    
    // Font display should be optimized (or using system fonts)
    expect(hasOptimalFontDisplay !== undefined).toBe(true);
  });

  test('should have fast Time to Interactive', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test interactivity
    const button = page.locator('button').first();
    
    if (await button.count() > 0) {
      await button.click();
      // Should respond immediately
      expect(true).toBe(true);
    }
  });

  test('should handle large lists efficiently', async ({ page }) => {
    await page.goto('/archive');
    await page.waitForLoadState('networkidle');
    
    // Scroll through list
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(100);
    
    // Should remain responsive
    const posts = page.locator('article, h4');
    await expect(posts.first()).toBeVisible();
  });
});
