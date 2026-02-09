# Playwright Global Setup
# This file contains best practices to prevent flaky tests

## Wait Strategies

### Always use explicit waits
- Use `waitForLoadState('networkidle')` after navigation
- Use `waitForSelector()` with visible state
- Avoid `waitForTimeout()` unless absolutely necessary

### Example:
```typescript
await page.goto('/');
await page.waitForLoadState('networkidle');
await page.waitForSelector('article', { state: 'visible' });
```

## Locator Strategies

### Use stable locators
- Prefer `getByRole()`, `getByText()`, `getByLabel()`
- Avoid CSS selectors that depend on structure
- Add `data-testid` attributes for complex cases

### Example:
```typescript
// Good
await page.getByRole('button', { name: /submit/i });

// Avoid
await page.locator('div > button:nth-child(3)');
```

## Auto-waiting

Playwright automatically waits for elements to be:
- Attached to DOM
- Visible
- Stable (not animating)
- Enabled
- Editable (for inputs)

## Retries Configuration

Tests are configured to retry:
- **Local**: 1 retry
- **CI**: 3 retries

## Timeouts

- Global test timeout: 30 seconds
- Navigation timeout: 30 seconds
- Action timeout: 15 seconds
- Expect timeout: 10 seconds

## Common Flaky Test Causes

1. **Race Conditions**: Wait for specific states, not arbitrary timeouts
2. **Animation**: Wait for animations to complete
3. **Network Delays**: Use `waitForLoadState('networkidle')`
4. **Hover Effects**: Only test on non-mobile devices
5. **Dynamic Content**: Wait for specific elements, not generic timeouts

## Best Practices

### 1. Use Auto-waiting
```typescript
// Playwright waits automatically
await page.locator('button').click();
```

### 2. Check Visibility Before Interaction
```typescript
await expect(page.locator('button')).toBeVisible();
await page.locator('button').click();
```

### 3. Wait for Network Idle
```typescript
await page.goto('/');
await page.waitForLoadState('networkidle');
```

### 4. Use Soft Assertions for Non-Critical Checks
```typescript
await expect.soft(page.locator('.optional')).toBeVisible();
```

### 5. Isolate Tests
```typescript
test.beforeEach(async ({ page }) => {
  // Fresh state for each test
  await page.goto('/');
});
```

## Debugging Flaky Tests

### 1. Enable Trace
```bash
npx playwright test --trace on
```

### 2. Enable Video
```bash
npx playwright test --video on
```

### 3. Run in Headed Mode
```bash
npx playwright test --headed --workers=1
```

### 4. Run Single Test Multiple Times
```bash
npx playwright test --repeat-each=10 tests/e2e/homepage.spec.ts
```

### 5. Use UI Mode
```bash
npm run test:ui
```
