# Codespace Configuration

This directory contains the configuration for GitHub Codespaces and VS Code Dev Containers.

## Features

- **Base Image**: Node.js 22 with TypeScript support
- **Pre-installed Tools**:
  - GitHub CLI (`gh`)
  - Docker-in-Docker support
  
## VS Code Extensions

The following extensions are automatically installed:
- ESLint - JavaScript/TypeScript linting
- Prettier - Code formatting
- Tailwind CSS IntelliSense - Tailwind CSS class suggestions
- Playwright Test - End-to-end testing support
- Markdown All in One - Enhanced Markdown editing
- Code Spell Checker - Spell checking for code and comments
- GitHub Copilot - AI pair programmer
- GitHub Copilot Chat - AI assistant

## Automatic Setup

When the codespace is created, it will automatically:
1. Install all npm dependencies
2. Install Playwright browsers and dependencies
3. Forward port 3000 for the Next.js dev server

## Getting Started

Once the codespace is ready:

```bash
# Start the development server
npm run dev

# Run tests
npm test

# Run tests in UI mode
npm run test:ui

# Build the project
npm run build
```

## Port Forwarding

- **Port 3000**: Next.js development server (automatically forwarded)

## Customization

To modify the devcontainer configuration, edit `devcontainer.json` and rebuild the container.
