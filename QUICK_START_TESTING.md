# Quick Start - Running E2E Tests

## Prerequisites
✅ Node.js 24+ installed
✅ Dependencies installed (`pnpm install`)
✅ Playwright browsers installed

## Installation (One-Time Setup)

```powershell
# Install Playwright browsers (if not already done)
pnpm exec playwright install
```

## Running Tests

### 1. Run All Tests (Headless)
```powershell
pnpm test
```

### 2. Run Tests with UI (Recommended)
```powershell
pnpm test:ui
```
This opens an interactive UI where you can:
- See all tests
- Run individual tests
- Watch tests execute
- Debug failures

### 3. Run Tests with Browser Visible
```powershell
pnpm test:headed
```

### 4. Debug Specific Test
```powershell
pnpm test:debug
```

### 5. Run Specific Browser
```powershell
pnpm test:chromium    # Chrome only
pnpm test:firefox     # Firefox only
pnpm test:webkit      # Safari only
```

### 6. Run Mobile Tests Only
```powershell
pnpm test:mobile
```

### 7. Run Specific Test File
```powershell
pnpm exec playwright test tests/e2e/homepage.spec.ts
```

### 8. Run Specific Test by Name
```powershell
pnpm exec playwright test -g "should display main heading"
```

### 9. View Test Report
```powershell
pnpm test:report
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
pnpm dev

# Then run tests without auto-start
pnpm exec playwright test --config=playwright.config.ts
```

### Port already in use
```powershell
# Kill the process using port 3000 (Linux/macOS)
fuser -k 3000/tcp

# Or change port in playwright.config.ts
```

### Tests failing randomly
```powershell
# Run with retries
pnpm exec playwright test --retries=3
```

### Slow tests
```powershell
# Run in parallel (multiple workers)
pnpm exec playwright test --workers=4
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
| `pnpm test` | Run all tests |
| `pnpm test:ui` | Interactive UI mode |
| `pnpm test:headed` | Show browser |
| `pnpm test:debug` | Debug mode |
| `pnpm test:chromium` | Chrome only |
| `pnpm test:firefox` | Firefox only |
| `pnpm test:webkit` | Safari only |
| `pnpm test:mobile` | Mobile devices |
| `pnpm test:report` | View HTML report |

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

1. ✅ Run `pnpm test` to verify setup
2. ✅ Check `pnpm test:report` for detailed results
3. ✅ Use `pnpm test:ui` for development
4. ✅ Add tests to CI/CD pipeline

## Need Help?

- 📖 Full docs: `tests/README.md`
- 📊 Test summary: `TEST_SUMMARY.md`
- 🌐 Playwright docs: https://playwright.dev
- 🐛 Issues: Check test output and logs

---

**Ready to test?** Run `pnpm test:ui` to get started! 🚀
