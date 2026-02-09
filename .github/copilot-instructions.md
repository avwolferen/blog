# GitHub Copilot Instructions

## Project Overview

This is a modern blog application built with Next.js, TypeScript, and Markdown-based content. The blog focuses on Sitecore architecture, development tips, Azure, and web technologies.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.7 with strict mode enabled
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4 with @tailwindcss/typography
- **Content**: Markdown with gray-matter for frontmatter parsing
- **Testing**: Playwright for end-to-end tests
- **Deployment**: Azure Static Web Apps (Node.js 22+)

## Build Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run Playwright tests
- `npm run test:ui` - Run Playwright tests with UI mode
- `npm run test:stable` - Run tests with retries for CI stability

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

## Testing

- All tests use Playwright for E2E testing
- Tests are in `/tests/e2e/` directory
- Always run existing tests before making changes
- Write new tests for new features following existing patterns
- Tests run against local dev server (`http://localhost:3000`)
- Include accessibility tests using `@axe-core/playwright` when relevant
- Use anti-flakiness patterns as documented in repository

## Markdown Content

- Blog posts are in `/content/blog/[slug]/index.md`
- Required frontmatter: `title`, `date`, `categories`, `tags`
- Optional frontmatter: `coverImage`, `excerpt`
- Images should be relative paths within the post folder
- Use proper Markdown formatting with syntax highlighting support

## Best Practices

### DO
- Follow existing code patterns and conventions
- Use TypeScript types consistently
- Test changes with `npm run lint` and `npm run type-check`
- Verify responsive design and dark mode support
- Keep components pure and side-effect-free where possible
- Use Next.js Image component for images
- Optimize performance (use React.memo, useMemo when needed)

### DON'T
- Don't modify `/node_modules` or generated files
- Don't commit secrets or sensitive data
- Don't break existing API contracts
- Don't remove or modify working tests without good reason
- Don't use `any` type unless absolutely necessary
- Don't add unnecessary dependencies
- Don't modify `/content` structure without updating markdown processing logic

## Dependencies

- Only add dependencies if absolutely necessary
- Prefer built-in Next.js/React features
- Check compatibility with Node.js 22+ and React 19
- Update `package.json` with specific versions
- Run `npm install` after adding dependencies

## Deployment

- Configured for Azure Static Web Apps
- Uses standalone output mode (`next.config.js`)
- Requires Node.js >= 22.0.0
- Build output goes to `.next/` directory
- Configuration in `/public/staticwebapp.config.json`

## Special Notes

- EditorConfig is enforced (2-space indent, LF line endings)
- ESLint config uses flat config format (`eslint.config.mjs`)
- TypeScript path alias `@/*` maps to project root
- Playwright tests use retry logic and anti-flakiness patterns
- Development server supports both Turbopack and Webpack
