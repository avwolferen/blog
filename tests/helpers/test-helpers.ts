import { Page } from '@playwright/test';

/**
 * Helper function to wait for a page to be fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Helper function to check if an element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.locator(selector).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
}

/**
 * Helper function to scroll to element
 */
export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Helper function to get the first blog post slug
 */
export async function getFirstPostSlug(page: Page): Promise<string> {
  await page.goto('/');
  await waitForPageLoad(page);
  
  const firstPostLink = page.locator('article').first().getByRole('heading', { level: 2 }).locator('a');
  const href = await firstPostLink.getAttribute('href');
  
  return href?.replace('/blog/', '') || '';
}

/**
 * Helper function to toggle dark mode
 */
export async function toggleDarkMode(page: Page): Promise<void> {
  const themeToggle = page.locator('button').filter({ 
    has: page.locator('svg') 
  }).first();
  
  await themeToggle.click();
  await page.waitForTimeout(300);
}

/**
 * Helper function to check if page is in dark mode
 */
export async function isDarkMode(page: Page): Promise<boolean> {
  const htmlClass = await page.locator('html').getAttribute('class');
  return htmlClass?.includes('dark') || false;
}

/**
 * Helper function to navigate to a random blog post
 */
export async function navigateToRandomPost(page: Page): Promise<string> {
  await page.goto('/');
  await waitForPageLoad(page);
  
  const articles = page.locator('article');
  const count = await articles.count();
  const randomIndex = Math.floor(Math.random() * Math.min(count, 10));
  
  const postLink = articles.nth(randomIndex).getByRole('heading', { level: 2 }).locator('a');
  const href = await postLink.getAttribute('href');
  
  await postLink.click();
  await waitForPageLoad(page);
  
  return href || '';
}

/**
 * Helper function to check for console errors
 */
export async function getConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return errors;
}

/**
 * Helper function to filter out benign errors
 */
export function filterBenignErrors(errors: string[]): string[] {
  return errors.filter(err => 
    !err.includes('favicon') && 
    !err.includes('ERR_BLOCKED_BY_CLIENT') &&
    !err.includes('net::ERR') &&
    !err.includes('Failed to load resource')
  );
}

/**
 * Helper function to check if element has transition
 */
export async function hasTransition(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector);
  
  return await element.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.transition !== 'none' && style.transition.length > 0;
  });
}

/**
 * Helper function to get all tags
 */
export async function getAllTags(page: Page): Promise<string[]> {
  await page.goto('/tags');
  await waitForPageLoad(page);
  
  const tagLinks = page.locator('a[href^="/tags/"]');
  const count = await tagLinks.count();
  const tags: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const href = await tagLinks.nth(i).getAttribute('href');
    const tag = href?.replace('/tags/', '');
    if (tag) {
      tags.push(tag);
    }
  }
  
  return tags;
}
