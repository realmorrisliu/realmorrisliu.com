# realmorrisliu.com

Morris Liu's personal website – a minimalist, letter-like experience built with modern web technologies.

🌐 **Live**: [realmorrisliu.com](https://realmorrisliu.com) | 📝 **Blog**: [/thoughts](https://realmorrisliu.com/thoughts)

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

## Tech Stack

- **Astro** 5.11+ for static generation
- **Tailwind CSS** v4 with Typography plugin
- **TypeScript** with strict Content Collections
- **Fontsource** (Inter + EB Garamond)
- **Cloudflare Pages** deployment

## Commands

| Command         | Action                               |
| --------------- | ------------------------------------ |
| `pnpm dev`      | Start dev server at `localhost:4321` |
| `pnpm build`    | Build to `./dist/`                   |
| `pnpm preview`  | Preview build locally                |
| `pnpm prettier` | Format all files                     |

## Architecture

```
src/
├── content/blog/        # Markdown posts (Content Collections)
├── components/          # Reusable Astro components
├── layouts/             # Base + BlogPost layouts
├── pages/              # Routes (index, so-far, thoughts/*)
└── styles/global.css   # Design system + typography
```

## Features

- **Letter-style navigation** – No traditional headers, embedded in content flow
- **Responsive components** – Mobile-first Link, GitHubIcon, Timeline, Project components
- **SEO optimized** – Structured data, sitemap, social meta tags
- **Performance first** – Static generation, local fonts, minimal JS
- **Hidden easter egg** – Terminal OG image generator (`/og-generator`) with functional TypeScript architecture

## Content

- **Homepage** (`/`) – Natural greeting and navigation
- **Thoughts** (`/thoughts`) – Technical blog with RSS feed
- **So Far** (`/so-far`) – Professional timeline and projects

---

📖 **See `CLAUDE.md`** for comprehensive development guidelines, design system, and architectural decisions.
