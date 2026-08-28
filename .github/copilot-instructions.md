# GitHub Copilot Instructions

## Project Overview

This is a modern blog application built with Next.js, TypeScript, and Markdown-based content. The blog focuses on Sitecore architecture, development tips, Azure, and web technologies.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 6.0 with strict mode enabled
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4 with @tailwindcss/typography
- **Content**: Markdown with gray-matter for frontmatter parsing
- **Testing**: Playwright 1.62 for end-to-end tests
- **Package manager**: pnpm 11
- **Deployment**: Azure Static Web Apps (Node.js 24+)

## Build & Test Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm dev:webpack` - Start development server with Webpack
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run Playwright tests
- `pnpm test:ui` - Run Playwright tests with UI mode
- `pnpm test:headed` / `pnpm test:debug` - Run tests headed / with the debugger
- `pnpm test:chromium` / `pnpm test:firefox` / `pnpm test:webkit` / `pnpm test:mobile` - Run tests against a specific project
- `pnpm test:stable` - Run tests with retries for CI stability (`--workers=1 --retries=3`)
- `pnpm test:repeat` - Repeat tests to catch flakiness (`--repeat-each=5`)
- `pnpm test:report` - Show the last Playwright HTML report

## Command & Safety Workflow

### Aikido safe-chain package age (NEVER bypass)
- All `pnpm install`/`pnpm add`/`pnpm update` commands are gated by aikido safe-chain's mandatory 48-hour minimum package age.
- NEVER pass a flag, env var, or config to skip, bypass, shorten, or override that minimum age — this includes any argument that specifies the package age in hours to work around the check.
- If an install is blocked by the age policy, wait and retry later, or ask the user how to proceed. Do not look for a workaround.

### Repo sync check (on opening the repo)
- Run `git fetch origin`, then `git log HEAD..origin/main --oneline` to see if `main` has commits not yet in the current branch.
- If it does, suggest a safe rebase: `git fetch origin && git rebase origin/main`.
- Never use a merge-based `git pull` for this, and never force-push without explicit user confirmation.
- If the rebase produces conflicts, stop and surface them to the user instead of auto-resolving.

### Dependency updates
- Always suggest running `pnpm update` to update packages within their allowed semver ranges.
- Never introduce a major-version bump that conflicts with peer dependencies or introduces breaking changes — flag those for the user to decide instead of applying them.
- Only add new dependencies if absolutely necessary; prefer built-in Next.js/React features first.

### Verification pipeline (run in this order before considering a change done)
1. `pnpm build`
2. `pnpm lint`
3. Refresh Playwright browsers: `pnpm exec playwright uninstall --all && pnpm exec playwright install` (removes old/unreferenced browsers first, even if shared with other repositories, then reinstalls the required ones)
4. `pnpm test`

### Keep pnpm itself updated
- When a newer pnpm version is available, suggest updating it (e.g. `corepack use pnpm@latest` or `pnpm self-update`) and keep the `packageManager` and `engines.pnpm` fields in `package.json` in sync.

### Vulnerable packages → check Dependabot
- If a vulnerable package is found (e.g. via `pnpm audit` or safe-chain), first run `gh auth status` to confirm CLI auth.
- Then check for open Dependabot alerts/PRs for that package, e.g. `gh api repos/avwolferen/blog/dependabot/alerts` or `gh pr list` filtered for Dependabot.
- If a fixing PR already exists, warn the user and suggest reviewing/merging that PR before continuing other work — safety first.

### Keep README in sync
- Whenever dependency versions, scripts, or the tech stack change (after `pnpm update`, a pnpm self-update, or Next.js/React/Node version bumps), also check `README.md` at the repo root and update its stated tech stack, version numbers, or command references so it stays accurate to the actual implementation.

## Code Style

### TypeScript
- Use TypeScript strict mode (already configured)
- Prefer explicit types over `any`
- Use `interface` for object types, `type` for unions/intersections
- Leverage Next.js types (`Metadata`, `PageProps`, etc.)

### React
- Use functional components with hooks
- Prefer React 19 features (no need for `React.FC`)
- No need to import React in JSX files
- Use async Server Components when possible (App Router)
- Client Components only when needed (use `'use client'` directive)

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use existing color tokens from `tailwind.config.ts`
- Maintain dark mode support (system preference detection)

### Code Organization
- Keep components small and focused
- Co-locate related files (components, types, utilities)
- Use path alias `@/*` for imports from root
- Follow existing file naming conventions (PascalCase for components)

## Project Structure

```
/app              - Next.js App Router pages and layouts
/components       - React components (Header, Footer, ThemeProvider, etc.)
/content/blog     - Markdown blog posts (structured as folders with index.md)
/lib              - Utility functions (markdown processing, etc.)
/types            - TypeScript type definitions
/tests            - Playwright E2E tests
/public           - Static assets
```

## Markdown Content

- Blog posts are in `/content/blog/[slug]/index.md`
- Required frontmatter: `title`, `date`, `categories`, `tags`
- Optional frontmatter: `coverImage`, `excerpt`
- Images should be relative paths within the post folder
- Use proper Markdown formatting with syntax highlighting support

## Testing

- All tests use Playwright for E2E testing, located in `/tests/e2e/`
- Tests run against a local dev server (`http://localhost:3000`)
- Include accessibility tests using `@axe-core/playwright` when relevant
- Use anti-flakiness patterns as documented in the repository (see `tests/FLAKY_TEST_PREVENTION.md`)
- Write new tests for new features following existing patterns; don't remove or weaken working tests without good reason
- Before considering any change complete, run the full verification pipeline above (build → lint → Playwright refresh → test)

## Best Practices

### DO
- Follow existing code patterns and conventions
- Use TypeScript types consistently
- Verify responsive design and dark mode support
- Keep components pure and side-effect-free where possible
- Use Next.js Image component for images
- Optimize performance (use React.memo, useMemo when needed)

### DON'T
- Don't modify `/node_modules` or generated files
- Don't commit secrets or sensitive data
- Don't break existing API contracts
- Don't use `any` type unless absolutely necessary
- Don't modify `/content` structure without updating markdown processing logic

## Deployment

- Configured for Azure Static Web Apps
- Uses standalone output mode (`next.config.js`)
- Requires Node.js >= 24.0.0
- Build output goes to `.next/` directory
- Configuration in `/public/staticwebapp.config.json`

## Special Notes

- EditorConfig is enforced (2-space indent, LF line endings)
- ESLint config uses flat config format (`eslint.config.mjs`)
- TypeScript path alias `@/*` maps to project root
- Playwright tests use retry logic and anti-flakiness patterns
- Development server supports both Turbopack and Webpack
