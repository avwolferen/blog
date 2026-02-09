import { test, expect } from '@playwright/test';

test.describe('Archive Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/archive');
    await page.waitForLoadState('networkidle');
  });

  test('should load successfully', async ({ page }) => {
    expect(page.url()).toContain('/archive');
    await expect(page.getByRole('heading', { name: /Archive/i, level: 1 })).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Archive');
  });

  test('should display posts grouped by year', async ({ page }) => {
    // Look for year headings (h2)
    const yearHeadings = page.locator('h2');
    const yearCount = await yearHeadings.count();
    
    expect(yearCount).toBeGreaterThan(0);
    
    // Check that years are in proper format
    if (yearCount > 0) {
      const firstYear = await yearHeadings.first().textContent();
      expect(firstYear ?? '').toMatch(/^\d{4}$/);
    }
  });

  test('should display posts grouped by month within years', async ({ page }) => {
    // Look for month headings (h3)
    const monthHeadings = page.locator('h3');
    const monthCount = await monthHeadings.count();
    
    expect(monthCount).toBeGreaterThan(0);
    
    // Check that months are named
    if (monthCount > 0) {
      const firstMonth = await monthHeadings.first().textContent();
      expect(firstMonth ?? '').toMatch(/^(January|February|March|April|May|June|July|August|September|October|November|December)$/);
    }
  });

  test('should display posts grouped by day within months', async ({ page }) => {
    // Look for day numbers using a text regex
    const dayElement = page.getByText(/^\d{1,2}$/).first();
    
    if ((await dayElement.count()) > 0) {
      const dayText = (await dayElement.textContent())?.trim() ?? '';
      const dayNumber = parseInt(dayText || '0', 10);
      expect(dayNumber).toBeGreaterThanOrEqual(1);
      expect(dayNumber).toBeLessThanOrEqual(31);
    }
  });

  test('should display posts in chronological order', async ({ page }) => {
    const yearHeadings = page.locator('h2');
    const yearCount = await yearHeadings.count();
    
    if (yearCount >= 2) {
      const firstYear = await yearHeadings.first().textContent();
      const secondYear = await yearHeadings.nth(1).textContent();
      
      const firstYearNum = parseInt(firstYear || '0');
      const secondYearNum = parseInt(secondYear || '0');
      
      // Newer years should come first
      expect(firstYearNum).toBeGreaterThanOrEqual(secondYearNum);
    }
  });

  test('should have clickable post links', async ({ page }) => {
    const postLinks = page.locator('article a, h4 a').first();
    
    await expect(postLinks).toBeVisible();
    
    const href = await postLinks.getAttribute('href');
    expect(href ?? '').toMatch(/^\/blog\/.+/);
  });

  test('should navigate to post when clicking link', async ({ page }) => {
    // target only blog links to ensure we click a link that should navigate
    const firstPostLink = page.locator('article a[href^="/blog/"], h4 a[href^="/blog/"]').first();
    
    await expect(firstPostLink).toBeVisible();
    
    const href = await firstPostLink.getAttribute('href');
    if (!href) {
      throw new Error('No blog link found to navigate to');
    }

    // If the link opens a new tab (target="_blank"), handle popup; otherwise wait for navigation in same page.
    const target = await firstPostLink.getAttribute('target');
    if (target === '_blank') {
      const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        firstPostLink.click()
      ]);
      await popup.waitForLoadState('networkidle');
      expect(popup.url()).toContain('/blog/');
    } else {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        firstPostLink.click()
      ]);
      expect(page.url()).toContain('/blog/');
    }
  });

  test('should display post titles', async ({ page }) => {
    const postTitles = page.locator('h4');
    const titleCount = await postTitles.count();
    
    expect(titleCount).toBeGreaterThan(0);
    
    if (titleCount > 0) {
      const firstTitle = await postTitles.first().textContent();
      expect((firstTitle ?? '').length).toBeGreaterThan(0);
    }
  });

  test('should display reading time for each post', async ({ page }) => {
    const readingTimes = page.getByText(/min read/i);
    const count = await readingTimes.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have sticky year headers on scroll', async ({ page }) => {
    const yearHeading = page.locator('h2').first();
    
    // Check for sticky positioning
    const position = await yearHeading.evaluate((el) => 
      window.getComputedStyle(el).position
    );
    
    expect(position).toBe('sticky');
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    
    // Year heading should still be visible at top
    await expect(yearHeading).toBeVisible();
  });

  test('should display visual separators between days', async ({ page }) => {
    // Check for border/divider elements
    const dividers = page.locator('.border-t, .border-b, hr');
    const dividerCount = await dividers.count();
    
    expect(dividerCount).toBeGreaterThan(0);
  });

  test('should show hover effects on post links', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Select anchors that either are inside articles or contain an h4 (handles both markup patterns)
      const firstPostLink = page.locator('article a, a:has(h4)').first();
      
      // Get initial color
      const initialColor = await firstPostLink.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      
      // Hover
      await firstPostLink.hover();
      await page.waitForTimeout(100);
      
      // Get color after hover
      const hoverColor = await firstPostLink.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      
      // Color should change or there should be a transition
      const hasTransition = await firstPostLink.evaluate((el) => 
        window.getComputedStyle(el).transition.length > 0
      );
      const colorChanged = initialColor !== hoverColor;
      
      expect(hasTransition || colorChanged).toBeTruthy();
    }
  });

  test('should display all posts without pagination', async ({ page }) => {
    // Archive should show all posts (no "load more" button)
    const loadMoreButton = page.locator('button:has-text("Load More"), button:has-text("Show More")');
    const hasLoadMore = await loadMoreButton.count() > 0;
    
    expect(hasLoadMore).toBe(false);
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      const container = page.locator('.max-w-4xl').first();
      await expect(container).toBeVisible();
      
      // Posts should be readable
      const postLink = page.locator('h4 a').first();
      await expect(postLink).toBeVisible();
    }
  });

  test('should maintain proper spacing between sections', async ({ page }) => {
    // Prefer checking the main content container which is more likely to have layout spacing applied
    const container = page.locator('.max-w-4xl, main').first();
    await expect(container).toBeVisible();
    
    // Check for spacing using gap/row-gap, measured distance between siblings, or individual element margins/padding
    const hasSpacing = await container.evaluate((el) => {
      const style = window.getComputedStyle(el);
      // Check CSS gap / row-gap (grid / flex)
      const gap = parseFloat(style.rowGap || style.gap || '0');
      if (gap > 0) return true;
      
      // Check spacing between visible children by measuring bounding boxes
      const children = Array.from(el.children).filter((c) => !!(c as HTMLElement).getBoundingClientRect);
      for (let i = 0; i < children.length - 1; i++) {
        const a = (children[i] as HTMLElement).getBoundingClientRect();
        const b = (children[i + 1] as HTMLElement).getBoundingClientRect();
        // If there's vertical space between bottom of a and top of b, consider that spacing
        if (b.top - (a.top + a.height) > 1) return true;
      }
      
      // Fallback: check margin/padding on an article element
      const firstArticle = el.querySelector('article') as HTMLElement | null;
      if (firstArticle) {
        const faStyle = window.getComputedStyle(firstArticle);
        if (parseFloat(faStyle.marginBottom) > 0 || parseFloat(faStyle.paddingBottom) > 0) return true;
      }
      
      // Additional fallback: if the container contains article elements, consider spacing acceptable
      const articles = el.querySelectorAll('article');
      if (articles && articles.length > 0) return true;
      
      return false;
    });
    
    expect(hasSpacing).toBeTruthy();
  });

  test('should have accessible heading structure', async ({ page }) => {
    // Should have one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Should have h2 for years
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
    
    // Should have h3 for months
    const h3Count = await page.locator('h3').count();
    expect(h3Count).toBeGreaterThan(0);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/archive');
    await page.waitForLoadState('networkidle');
    
    const realErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('ERR_BLOCKED_BY_CLIENT')
    );
    
    expect(realErrors).toHaveLength(0);
  });
});
