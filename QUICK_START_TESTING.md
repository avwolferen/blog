# Quick Start - Running E2E Tests

## Prerequisites
✅ Node.js 22+ installed
✅ Dependencies installed (`npm install`)
✅ Playwright browsers installed

## Installation (One-Time Setup)

```powershell
# Install Playwright browsers (if not already done)
npx playwright install
```

## Running Tests

### 1. Run All Tests (Headless)
```powershell
npm test
```

### 2. Run Tests with UI (Recommended)
```powershell
npm run test:ui
```
This opens an interactive UI where you can:
- See all tests
- Run individual tests
- Watch tests execute
- Debug failures

### 3. Run Tests with Browser Visible
```powershell
npm run test:headed
```

### 4. Debug Specific Test
```powershell
npm run test:debug
```

### 5. Run Specific Browser
```powershell
npm run test:chromium    # Chrome only
npm run test:firefox     # Firefox only
npm run test:webkit      # Safari only
```

### 6. Run Mobile Tests Only
```powershell
npm run test:mobile
```

### 7. Run Specific Test File
```powershell
npx playwright test tests/e2e/homepage.spec.ts
```

### 8. Run Specific Test by Name
```powershell
npx playwright test -g "should display main heading"
```

### 9. View Test Report
```powershell
npm run test:report
```

## Test Results

After running tests, you'll see:
- ✅ Passed tests (green)
- ❌ Failed tests (red)
- ⏭️ Skipped tests (gray)

## Common Issues

### Dev server not starting
```powershell
# Start manually in a separate terminal
npm run dev

# Then run tests without auto-start
npx playwright test --config=playwright.config.ts
```

### Port already in use
```powershell
# Kill process on port 3000
npx kill-port 3000

# Or change port in playwright.config.ts
```

### Tests failing randomly
```powershell
# Run with retries
npx playwright test --retries=2
```

### Slow tests
```powershell
# Run in parallel (multiple workers)
npx playwright test --workers=4
```

## Test Organization

```
tests/
├── e2e/
│   ├── homepage.spec.ts        # ⭐ HIGH PRIORITY
│   ├── blog-post.spec.ts       # ⭐ HIGH PRIORITY  
│   ├── navigation.spec.ts      # ⭐ HIGH PRIORITY
│   ├── archive.spec.ts         # 🔶 MEDIUM PRIORITY
│   ├── tags.spec.ts            # 🔶 MEDIUM PRIORITY
│   ├── tag-filter.spec.ts      # 🔶 MEDIUM PRIORITY
│   ├── dark-mode.spec.ts       # 🔶 MEDIUM PRIORITY
│   ├── seo.spec.ts             # 🔵 LOW PRIORITY
│   ├── accessibility.spec.ts   # 🔵 LOW PRIORITY
│   ├── performance.spec.ts     # 🔵 LOW PRIORITY
│   ├── mobile.spec.ts          # 🔵 LOW PRIORITY
│   └── not-found.spec.ts       # 🔵 LOW PRIORITY
└── helpers/
    └── test-helpers.ts         # Shared utilities
```

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:headed` | Show browser |
| `npm run test:debug` | Debug mode |
| `npm run test:chromium` | Chrome only |
| `npm run test:firefox` | Firefox only |
| `npm run test:webkit` | Safari only |
| `npm run test:mobile` | Mobile devices |
| `npm run test:report` | View HTML report |

## Example Output

```
Running 198 tests using 4 workers

  ✅ homepage.spec.ts (13/13)
  ✅ blog-post.spec.ts (25/25)
  ✅ navigation.spec.ts (16/16)
  ...

  198 passed (2m 34s)
```

## Next Steps

1. ✅ Run `npm test` to verify setup
2. ✅ Check `npm run test:report` for detailed results
3. ✅ Use `npm run test:ui` for development
4. ✅ Add tests to CI/CD pipeline

## Need Help?

- 📖 Full docs: `tests/README.md`
- 📊 Test summary: `TEST_SUMMARY.md`
- 🌐 Playwright docs: https://playwright.dev
- 🐛 Issues: Check test output and logs

---

**Ready to test?** Run `npm run test:ui` to get started! 🚀
