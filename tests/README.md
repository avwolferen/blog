# E2E Tests for Blog

This directory contains end-to-end tests for the blog application using Playwright.

## Test Structure

```
tests/
├── e2e/                    # End-to-end test files
│   ├── homepage.spec.ts    # Homepage tests
│   ├── blog-post.spec.ts   # Individual blog post tests
│   ├── navigation.spec.ts  # Navigation and header/footer tests
│   ├── archive.spec.ts     # Archive page tests
│   ├── tags.spec.ts        # Tags page tests
│   ├── tag-filter.spec.ts  # Tag filter page tests
│   ├── dark-mode.spec.ts   # Dark mode functionality tests
│   ├── seo.spec.ts         # SEO and metadata tests
│   ├── accessibility.spec.ts # Accessibility tests
│   ├── performance.spec.ts  # Performance tests
│   ├── mobile.spec.ts      # Mobile responsiveness tests
│   └── not-found.spec.ts   # 404 page tests
└── helpers/                # Test helper functions
    └── test-helpers.ts     # Shared utility functions
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (recommended for development)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### Run specific browser tests
```bash
npm run test:chromium    # Chrome/Chromium only
npm run test:firefox     # Firefox only
npm run test:webkit      # Safari/WebKit only
npm run test:mobile      # Mobile devices only
```

### View test report
```bash
npm run test:report
```

## Test Priorities

### High Priority (Critical Path)
- ✅ **Homepage** - Main entry point tests
- ✅ **Blog Post** - Individual post rendering
- ✅ **Navigation** - Site navigation and routing

### Medium Priority (Important Features)
- ✅ **Archive** - Blog archive functionality
- ✅ **Tags** - Tag listing page
- ✅ **Tag Filter** - Tag-based filtering
- ✅ **Dark Mode** - Theme switching

### Low Priority (Quality Assurance)
- ✅ **SEO** - Search engine optimization
- ✅ **Accessibility** - WCAG compliance
- ✅ **Performance** - Load times and optimization
- ✅ **Mobile** - Responsive design
- ✅ **404** - Error handling

## Test Coverage

- **Homepage**: Post cards, navigation, responsiveness
- **Blog Posts**: Content rendering, metadata, reading progress
- **Navigation**: Header, footer, theme toggle, routing
- **Archive**: Chronological organization, filtering
- **Tags**: Tag listing, post filtering
- **Dark Mode**: Theme persistence, styling
- **SEO**: Meta tags, Open Graph, Twitter Cards
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation
- **Performance**: Load times, image optimization
- **Mobile**: Touch targets, responsive layout
- **404**: Error handling, navigation from error pages

## Configuration

Test configuration is in `playwright.config.ts`:

- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Devices**: iPhone 12, Pixel 5, iPad
- **Base URL**: http://localhost:3000
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure only
- **Traces**: On first retry

## Writing New Tests

1. Create a new `.spec.ts` file in `tests/e2e/`
2. Use the test helpers from `tests/helpers/test-helpers.ts`
3. Follow the existing test structure
4. Group related tests using `test.describe()`
5. Use `beforeEach` for common setup
6. Add descriptive test names

Example:
```typescript
import { test, expect } from '@playwright/test';
import { waitForPageLoad } from '../helpers/test-helpers';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-page');
    await waitForPageLoad(page);
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    expect(true).toBe(true);
  });
});
```

## Best Practices

1. **Wait for state**: Always wait for `networkidle` or specific elements
2. **Isolate tests**: Each test should be independent
3. **Use locators**: Prefer role-based selectors over CSS
4. **Handle async**: Use `await` for all Playwright operations
5. **Filter errors**: Ignore benign errors like favicon 404s
6. **Mobile testing**: Test both portrait and landscape
7. **Accessibility**: Run axe tests on all major pages
8. **Performance**: Set reasonable thresholds for load times

## CI/CD Integration

Tests are configured to run in CI with:
- Parallel execution disabled
- 2 retries per test
- HTML report generation
- Screenshot capture on failure

## Troubleshooting

### Tests are slow
- Use `test.only()` to run specific tests
- Check `networkidle` waits - they can be slow
- Use UI mode for faster iteration

### Flaky tests
- Add explicit waits for dynamic content
- Increase timeout for specific tests
- Check for race conditions

### Browser issues
- Update Playwright: `npx playwright install`
- Clear cache: `npx playwright cache clear`
- Check browser versions: `npx playwright --version`

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Guide](https://playwright.dev/docs/ci)
