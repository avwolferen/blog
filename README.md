# Alex van Wolferen's Blog

> Just another blog about Sitecore, tips and tricks

A modern, high-performance blog built with Next.js 16, React 19, TypeScript, and Tailwind CSS. This blog focuses on Sitecore architecture, development tips, Azure, and web technologies.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 16 (App Router), React 19, and TypeScript 5.7
- **Markdown-Based Content**: Write blog posts in Markdown with frontmatter metadata
- **Theme Support**: Light, dark, and christmas theme switching with system preference detection
- **Optimized Images**: Next.js Image optimization with AVIF and WebP support
- **Responsive Design**: Mobile-first design with Tailwind CSS and responsive typography
- **Reading Progress Bar**: Visual indicator of reading progress on blog posts
- **Infinite Scroll**: Smooth infinite scrolling for browsing posts
- **Auto-Scroll Navigation**: Automatic scroll to next post functionality
- **Tag & Category System**: Organize and filter posts by tags and categories
- **Archive View**: Browse posts chronologically
- **SEO Optimized**: Built-in metadata, Open Graph, and Twitter Card support
- **Google Analytics**: Integrated analytics tracking
- **Comprehensive Testing**: E2E testing with Playwright and anti-flakiness patterns

## 📋 Prerequisites

- **Node.js**: >= 22.0.0
- **pnpm**: >= 9.0.0

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/avwolferen/blog.git
cd blog
```

2. Install dependencies:
```bash
pnpm install
```

## ☁️ GitHub Codespaces

This repository is configured for GitHub Codespaces, providing a complete development environment in the cloud.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/avwolferen/blog)

### Quick Start with Codespaces

1. Click the "Open in GitHub Codespaces" badge above or create a new codespace from the repository
2. Wait for the environment to build (first time setup takes ~2-3 minutes)
3. Once ready, the dependencies are automatically installed
4. Start developing immediately with `pnpm dev`

### What's Included

- **Node.js 22** with TypeScript support
- **Pre-installed VS Code extensions** for Next.js, React, Tailwind CSS, and Playwright
- **Playwright browsers** automatically installed and configured
- **Port forwarding** for the Next.js dev server (port 3000)
- **GitHub CLI** for repository management
- **Docker support** for containerized workflows

All configurations are in [`.devcontainer/`](.devcontainer/) directory.

## 🏃‍♂️ Running the Application

### Development Mode

Start the development server with Turbopack (faster):
```bash
pnpm dev
```

Or use Webpack:
```bash
pnpm dev:webpack
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

### Production Build
```bash
pnpm build
pnpm start
```

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
```

## 🧪 Testing

This project uses Playwright for end-to-end testing with comprehensive anti-flakiness patterns.

### Run All Tests
```bash
pnpm test
```

### Run Tests with UI Mode
```bash
pnpm test:ui
```

### Run Tests in Specific Browser
```bash
pnpm test:chromium
pnpm test:firefox
pnpm test:webkit
```

### Run Mobile Tests
```bash
pnpm test:mobile
```

### Run Tests with Retries (CI-like)
```bash
pnpm test:stable
```

### Additional Testing Resources

- [Test Summary](TEST_SUMMARY.md) - Overview of all tests
- [Anti-Flakiness Configuration](PLAYWRIGHT_ANTI_FLAKINESS_CONFIG.md) - Detailed Playwright setup
- [Anti-Flakiness Quick Reference](ANTI_FLAKINESS_QUICK_REF.md) - Best practices guide
- [Quick Start Testing Guide](QUICK_START_TESTING.md) - Getting started with tests

## 📁 Project Structure

```
blog/
├── .devcontainer/           # GitHub Codespaces configuration
├── .github/                 # GitHub Actions and workflows
├── app/                     # Next.js App Router pages
│   ├── page.tsx            # Homepage with featured posts
│   ├── layout.tsx          # Root layout with metadata
│   ├── globals.css         # Global styles
│   ├── api/                # API routes (content endpoint)
│   ├── archive/            # Archive page for all posts
│   ├── blog/[slug]/        # Dynamic blog post pages
│   ├── content/[...path]/  # Dynamic content pages
│   ├── tags/               # Tag listing and filtering
│   └── not-found.tsx       # 404 page
├── components/             # React components
│   ├── Header.tsx          # Site header with navigation
│   ├── Footer.tsx          # Site footer
│   ├── ThemeProvider.tsx   # Light/dark/christmas theme provider
│   ├── GoogleAnalytics.tsx # Analytics component
│   ├── ReadingProgressBar.tsx  # Reading progress indicator
│   ├── InfiniteScrollBlog.tsx  # Infinite scroll component
│   └── AutoScrollNext.tsx  # Auto-scroll navigation
├── content/                # Blog content (Markdown files)
│   ├── blog/               # Individual blog posts
│   │   └── [post-slug]/
│   │       ├── index.md    # Post content with frontmatter
│   │       └── *.png/jpg   # Post images
│   └── assets/             # Shared assets
├── lib/                    # Utility functions
│   └── markdown.ts         # Markdown processing utilities
├── types/                  # TypeScript type definitions
│   └── blog.ts             # Blog post types
├── tests/                  # Playwright E2E tests
│   ├── e2e/                # End-to-end test files
│   ├── helpers/            # Test helper utilities
│   └── *.md                # Testing documentation
├── public/                 # Static assets
│   └── robots.txt          # SEO robots file
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── playwright.config.ts    # Playwright test configuration
└── eslint.config.mjs       # ESLint configuration (flat config)
```

## ✍️ Creating a Blog Post

1. Create a new folder in `content/blog/` with your post slug:
```bash
mkdir content/blog/my-new-post
```

2. Create an `index.md` file with frontmatter:
```markdown
---
title: "My New Post Title"
date: "2026-01-19"
categories: ["Sitecore", "Development"]
tags: ["next.js", "typescript", "tutorial"]
img: ./cover.jpg
---

Your post content goes here...
```

3. Add images to the same folder and reference them in your markdown:
```markdown
![Alt text](./image.png)
```

### Frontmatter Fields

- **title** (required): Post title
- **date** (required): Publication date in YYYY-MM-DD format
- **categories** (required): Array of category names
- **tags** (optional): Array of tag names for filtering
- **img** (optional): Path to cover image (relative to post folder)

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` to customize the color scheme. The blog includes light, dark, and christmas themes with custom color definitions.

### Site Metadata

Update metadata in `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Blog Title',
  description: 'Your description',
  // ...
}
```

### Google Analytics

Configure Google Analytics by setting the tracking ID in the `GoogleAnalytics` component in `components/GoogleAnalytics.tsx`.
Analytics loading is gated by explicit user consent via `components/AnalyticsConsent.tsx`.

### Content Security Policy (`script-src`) note

`script-src` currently keeps `'unsafe-inline'`.

We tested removing `'unsafe-inline'` and observed breakage:
- browser CSP errors for blocked inline scripts (`Executing inline script violates ... script-src`)
- runtime/hydration failures (for example: `Expected a request ID to be defined for the document via self.__next_r`)
- consent banner interaction tests failing as a side effect of blocked runtime scripts

For now, `'unsafe-inline'` is retained for compatibility with Next.js App Router runtime scripts. A stronger follow-up mitigation is to migrate to a nonce-based CSP (and pass nonces to all framework and analytics scripts) so `script-src` can be tightened without breaking functionality.

## 🧰 Technologies Used

### Core Framework
- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript 5.7](https://www.typescriptlang.org/) - Type safety

### Styling & UI
- [Tailwind CSS 3.4](https://tailwindcss.com/) - Utility-first CSS framework
- [@tailwindcss/typography](https://github.com/tailwindcss/typography) - Beautiful typographic defaults for prose content
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons

### Content Processing
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Parse frontmatter from Markdown files
- [marked](https://marked.js.org/) - Fast Markdown parser and compiler
- [Prism.js](https://prismjs.com/) - Lightweight syntax highlighting

### Utilities
- [date-fns](https://date-fns.org/) - Modern JavaScript date utility library
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing

### Testing
- [Playwright](https://playwright.dev/) - End-to-end testing framework
- [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) - Accessibility testing

### Development Tools
- [ESLint](https://eslint.org/) - JavaScript/TypeScript linting (flat config)
- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [PostCSS](https://postcss.org/) - CSS transformation
- [Autoprefixer](https://github.com/postcss/autoprefixer) - CSS vendor prefixing

## 👤 Author

**Alex van Wolferen**
- Sitecore MVP Technology 2018, 2021, and 2022
- Twitter: [@avwolferen](https://twitter.com/avwolferen)
- Website: [alexvanwolferen.nl](https://www.alexvanwolferen.nl)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

**Note**: This blog focuses on Sitecore architecture, Azure development, and modern web technologies. Content reflects personal experiences and technical insights from a Sitecore MVP.
