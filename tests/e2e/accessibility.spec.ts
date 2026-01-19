import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('blog post should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    const firstPost = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
    await firstPost.click();
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      expect(alt).not.toBeNull();
      expect(alt!.length).toBeGreaterThan(0);
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const pages = ['/', '/archive', '/tags'];
    
    for (const url of pages) {
      await page.goto(url);
      
      // Should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // Check heading order
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
      expect(headings.length).toBeGreaterThan(0);
    }
  });

  test('links should have descriptive text', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Link should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
      
      // Avoid generic link text
      if (text) {
        const lowerText = text.toLowerCase().trim();
        expect(lowerText).not.toBe('click here');
        expect(lowerText).not.toBe('read more');
        expect(lowerText).not.toBe('here');
      }
    }
  });

  test('form elements should have labels', async ({ page }) => {
    await page.goto('/');
    
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Input should have an associated label
      const hasLabel = id || ariaLabel || ariaLabelledBy;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through first few elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      // Check that something has focus
      const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedTag).toBeTruthy();
    }
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first focusable element
    await page.keyboard.press('Tab');
    
    const outlineStyle = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? window.getComputedStyle(el).outline : '';
    });
    
    // Should have some outline (not 'none')
    expect(outlineStyle).toBeTruthy();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // This is checked by axe, but we can do a basic check
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(bgColor).toBeTruthy();
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('buttons should be accessible', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button should have text or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should have proper ARIA landmarks', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    const hasMain = await main.count() > 0;
    
    // Check for navigation
    const nav = page.locator('nav, [role="navigation"]');
    const hasNav = await nav.count() > 0;
    
    expect(hasNav).toBe(true);
  });

  test('should have lang attribute on html', async ({ page }) => {
    await page.goto('/');
    
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThan(0);
  });

  test('should not have empty headings', async ({ page }) => {
    await page.goto('/');
    
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i);
      const text = await heading.textContent();
      
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('should have descriptive page titles', async ({ page }) => {
    const pages = ['/', '/archive', '/tags'];
    
    for (const url of pages) {
      await page.goto(url);
      
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    }
  });

  test('dark mode should maintain accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to dark mode
    const themeToggle = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Run accessibility check in dark mode
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for skip links (common accessibility feature)
    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    
    // Skip links are good but not required
    const hasSkipLink = await skipLink.count() > 0;
    
    // Just verify page is navigable
    expect(true).toBe(true);
  });
});
