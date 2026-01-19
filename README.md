# Alex van Wolferen's Blog

> Just another blog about Sitecore, tips and tricks

A modern, high-performance blog built with Next.js 14, TypeScript, and Tailwind CSS. This blog focuses on Sitecore architecture, development tips, Azure, and web technologies.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 14 (App Router), React 18, and TypeScript
- **Markdown-Based Content**: Write blog posts in Markdown with frontmatter metadata
- **Dark Mode Support**: Automatic dark/light theme switching with system preference detection
- **Optimized Images**: Next.js Image optimization with AVIF and WebP support
- **Syntax Highlighting**: Code blocks with Prism.js syntax highlighting
- **SEO Optimized**: Built-in metadata, Open Graph, and Twitter Card support
- **Reading Time Estimation**: Automatic calculation of reading time for each post
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Tag & Category System**: Organize posts by tags and categories
- **Archive View**: Browse posts chronologically
- **RSS Feed Support**: Auto-generated RSS feed for blog posts
- **Google Analytics**: Integrated analytics tracking
- **Azure Static Web Apps Ready**: Configured for deployment to Azure

## 📋 Prerequisites

- **Node.js**: >= 22.0.0
- **npm**: >= 10.0.0

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/avwolferen/blog.git
cd blog
```

2. Install dependencies:
```bash
npm install
```

3. Copy content to public directory (if needed):
```bash
cp -r content public/
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the blog.

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
blog/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Homepage with featured posts
│   ├── layout.tsx           # Root layout with metadata
│   ├── archive/             # Archive page for all posts
│   ├── blog/[slug]/         # Dynamic blog post pages
│   └── tags/                # Tag listing and filtering
├── components/              # React components
│   ├── Header.tsx           # Site header with navigation
│   ├── Footer.tsx           # Site footer
│   ├── ThemeProvider.tsx    # Dark mode theme provider
│   ├── GoogleAnalytics.tsx  # Analytics component
│   └── ...
├── content/                 # Blog content (Markdown files)
│   ├── blog/                # Individual blog posts
│   │   └── [post-slug]/
│   │       ├── index.md     # Post content with frontmatter
│   │       └── *.png/jpg    # Post images
│   └── assets/              # Shared assets
├── lib/                     # Utility functions
│   └── markdown.ts          # Markdown processing utilities
├── types/                   # TypeScript type definitions
│   └── blog.ts              # Blog post types
├── public/                  # Static assets
│   ├── staticwebapp.config.json  # Azure Static Web Apps config
│   └── robots.txt           # SEO robots file
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── azure-pipelines.yaml     # Azure DevOps CI/CD pipeline
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
coverImage: "./cover.png"
---

Your post content goes here...
```

3. Add images to the same folder and reference them in your markdown:
```markdown
![Alt text](./image.png)
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts` to customize the color scheme:
```typescript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Site Metadata
Update metadata in `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Blog Title',
  description: 'Your description',
  // ...
}
```

## 🚢 Deployment

### Azure Static Web Apps

This blog is configured for deployment to Azure Static Web Apps:

1. The `staticwebapp.config.json` file contains routing and header configurations
2. The `azure-pipelines.yaml` file provides CI/CD pipeline setup
3. Use Node.js 22 runtime as specified in the configuration

### Other Platforms

The app uses `output: 'standalone'` mode, making it compatible with:
- Vercel
- Netlify
- Docker containers
- Traditional Node.js hosting

## 🧰 Technologies Used

### Core
- [Next.js 14](https://nextjs.org/) - React framework
- [React 18](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### Styling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [@tailwindcss/typography](https://github.com/tailwindcss/typography) - Prose styling

### Content & Markdown
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter parsing
- [marked](https://marked.js.org/) - Markdown parsing
- [Prism.js](https://prismjs.com/) - Syntax highlighting

### Utilities
- [date-fns](https://date-fns.org/) - Date manipulation
- [Sharp](https://sharp.pixelplumbing.com/) - Image optimization
- [Heroicons](https://heroicons.com/) - SVG icons

## 👤 Author

**Alex van Wolferen**
- Sitecore MVP Technology 2018, 2021, and 2022
- Twitter: [@avwolferen](https://twitter.com/avwolferen)
- Website: [alexvanwolferen.nl](https://www.alexvanwolferen.nl)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📊 Build Status

The project includes Azure DevOps pipeline configuration for:
- Dependency installation
- Code linting
- Type checking
- Production builds

---

**Note**: This blog focuses on Sitecore architecture, Azure development, and modern web technologies. Content reflects personal experiences and technical insights from a Sitecore MVP.
