# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Version:** v4.0 | **Last Updated:** 2025-11-26
Personal website built with Astro + Tailwind CSS. Minimalist blog, portfolio, and photo journal.

## ⚡ Quick Reference

### Essential Commands

| Command              | Action                        | Critical Notes                   |
| -------------------- | ----------------------------- | -------------------------------- |
| `pnpm dev`           | Frontend dev server           | `localhost:4321`, hot reload     |
| `pnpm build`         | Build frontend to `./dist/`   | **ALWAYS run before deploy**     |
| `pnpm typecheck`     | TypeScript validation         | **MUST pass before commit**      |
| `pnpm prettier`      | Format (2-space indent)       | Auto-sorts Tailwind classes      |
| `pnpm check`         | Run all quality checks        | lint + format:check + typecheck  |
| `pnpm new:photo`     | Add photo to Moments          | EXIF extraction + content gen    |
| `pnpm deploy`        | Build + deploy to Cloudflare  | Runs `astro build && wrangler`   |

### Key Paths

```
src/
├── content/
│   ├── blog/               → Blog posts (.md)
│   ├── now/                → Now page updates
│   └── moments/            → Photo journal entries
├── components/
│   ├── Resume/             → PDF-optimized resume components
│   ├── PhotoGrid.astro     → Moments photo gallery
│   ├── PostHog.astro       → Analytics tracking
│   └── [core components]   → Link, Button, IconLink, etc.
├── pages/
│   ├── moments/            → Photo journal (/moments)
│   ├── thoughts/           → Blog (/thoughts)
│   ├── so-far.astro        → Professional timeline
│   └── index.astro         → Homepage
├── utils/
│   ├── tagUtils.ts         → Intelligent tag formatting (120+ mappings)
│   └── dateUtils.ts        → Date formatting utilities
└── styles/
    ├── global.css          → Design system + Tailwind config
    └── prose.css           → Typography overrides
```

### 🚨 CRITICAL RULES

**ALWAYS DO:**
- Use path aliases (`@components/`, `@layouts/`, `@utils/`, etc.) for all imports
- Use existing components (Link, Button, IconLink, Tag)
- Follow Tailwind-first architecture (no inline `<style>` except animations)
- Run `pnpm typecheck` before committing
- Wrap footnote content in `<span>` with `{/* prettier-ignore */}`
- Use `formatTag()` for all tag displays

**NEVER DO:**
- Use relative paths (`../`, `./`) for imports - always use path aliases
- Create new files unless absolutely necessary
- Add H1 tags in blog posts (handled by layout)
- Manually format tag displays (use `formatTag()` utility)
- Commit without passing typecheck

---

## Project Architecture

**Core Concept:** Letter-like aesthetic for correspondence experience, not traditional website navigation.

### Content Collections

| Collection | Location            | Schema                                             | Usage                            |
| ---------- | ------------------- | -------------------------------------------------- | -------------------------------- |
| **blog**   | `src/content/blog/` | `title`, `description`, `pubDate`, `tags`, `draft` | Auto-indexed when `draft: false` |
| **now**    | `src/content/now/`  | `summary`, `lastUpdated`, `title`, `description`   | Latest entry on `/now`           |
| **moments**| `src/content/moments/` | `title`, `image`, `date`, `location`, `camera`, EXIF | Photo journal with metadata   |

### Writing Blog Posts

```yaml
---
title: "Post Title"
description: "Brief description"
pubDate: 2025-01-15
tags: ["tag1", "tag2"]
draft: false
---
```

### Adding Photos to Moments

**Automated Workflow:**

```bash
# 1. Place photos in photos-inbox/ directory
# 2. Run the add-photo script
pnpm new:photo

# Script automatically:
# - Copies photos to src/assets/captured/
# - Extracts EXIF data (camera, lens, ISO, aperture, shutter speed)
# - Generates markdown files in src/content/moments/
# - Slugifies filenames
```

**EXIF Data Extracted:**
- Camera model (e.g., "iPhone 15 Pro")
- Lens (if available)
- ISO, Aperture, Shutter Speed
- Date taken
- Location (if manually added)

**Photo Grid Display:**
- Masonry layout with responsive columns (1-3 columns)
- Click to expand full-size with metadata overlay
- EXIF info displayed in overlay footer
- Smooth fade-in animations

---

## Design System

### Philosophy

**"Less, but better"** - Extreme minimalism with natural navigation embedded in content flow.

### Typography

| Element     | Font        | Size | Line Height | Color                  |
| ----------- | ----------- | ---- | ----------- | ---------------------- |
| Headlines   | EB Garamond | 4xl  | 1.25        | `#1a1a1a`              |
| Subheadings | EB Garamond | 2xl  | tight       | `#1a1a1a`              |
| Body        | Inter       | base | 1.65        | `#4a4a4a`              |
| Meta        | Inter       | sm   | normal      | `#6b6b6b`              |
| Links       | Inter       | base | normal      | `#000000` (weight 500) |
| Code        | Maple Mono  | sm   | normal      | `#1a1a1a`              |

### Color System

5-level grayscale defined in CSS custom properties:

```css
--color-text-primary: #1a1a1a;
--color-text-secondary: #4a4a4a;
--color-text-tertiary: #6b6b6b;
--color-text-muted: #9ca3af;
--color-border: #e5e7eb;
```

Use Tailwind classes: `text-text-primary`, `text-text-secondary`, etc.

### Layout

| Property        | Value            | Usage                          |
| --------------- | ---------------- | ------------------------------ |
| Page padding    | `px-6 py-16`     | 24px horizontal, 64px vertical |
| Section spacing | `mb-16`          | 64px between major sections    |
| Element spacing | `mb-4` to `mb-6` | 16px-24px between elements     |
| Max width       | `max-w-2xl`      | 672px for content              |

---

## Core Components

### Component Registry

| Component                  | Purpose                                          | Key Props                            | Dependencies        |
| -------------------------- | ------------------------------------------------ | ------------------------------------ | ------------------- |
| **Link.astro**             | Unified links, responsive hover                  | `href`, `target`, `class`            | Base component      |
| **Button.astro**           | Buttons with variants                            | `variant`, `size`, `type`            | -                   |
| **IconLink.astro**         | Icon links with consistent opacity               | `href`, `title`, `icon`              | Base for GitHub/RSS |
| **Tag.astro**              | Smart tag display with formatting                | `tag`, `interactive`, `href`, `size` | formatTag utility   |
| **PhotoGrid.astro**        | Masonry photo gallery with lightbox              | `photos`                             | Content Collections |
| **PostHog.astro**          | Analytics tracking component                     | -                                    | PostHog SDK         |
| **SocialShare.astro**      | Blog post social sharing (X + Hacker News)       | `title`, `url`                       | XIcon, HackerNews   |
| **FooterSignature.astro**  | Footer navigation with links                     | `links`, `signature`                 | Link                |
| **InlineNote.astro**       | Global tooltip system for terminology            | -                                    | Global singleton    |
| **InlineNoteRef.astro**    | Inline note triggers with hover tooltips         | `text`, `note`                       | InlineNote          |
| **Footnote.astro**         | Academic footnotes with return links             | `id`, `slot`                         | Link                |
| **FootnoteRef.astro**      | Footnote references with anchor links            | `id`                                 | Link                |

### Resume Components (`src/components/Resume/`)

| Component                    | Purpose                                         | Language Support     |
| ---------------------------- | ----------------------------------------------- | -------------------- |
| **ResumeSection.astro**      | Section headers with language-aware spacing     | `en:`/`zh:` variants |
| **SkillsGrid.astro**         | Skills display with category/stack formatting   | `en:`/`zh:` variants |
| **WorkExperienceList.astro** | Work positions with company/period metadata     | `en:`/`zh:` variants |
| **ProjectsList.astro**       | Project entries with period/GitHub link display | `en:`/`zh:` variants |

**Language-Aware Styling:**
- Custom Tailwind variants: `@variant en (:lang(en) &);` and `@variant zh (:lang(zh) &);`
- Different spacing/line heights for English vs Chinese
- PDF-optimized font sizing via CSS custom properties (`--text-resume-*`)

---

## Tag Display System

**🏷️ Intelligent Tag Formatting** - All tags use smart formatting for professional display.

### Implementation

- **Core function**: `formatTag()` in `src/utils/tagUtils.ts`
- **120+ technical terms mapped** (DevOps, API Design, Machine Learning, etc.)
- **Automatic kebab-case splitting**: `api-design` → `API Design`
- **Display-time formatting only** - tags stored in original kebab-case

### Usage

```typescript
import { formatTag } from "@utils/tagUtils";

// GOOD - Use formatTag utility
<span>{formatTag("api-design")}</span>  // Displays: "API Design"

// BAD - Never manually format
<span>API Design</span>  // Wrong - bypasses intelligent mapping
```

### Rules

- **ALWAYS** use `formatTag()` for tag displays
- **NEVER** manually format tag displays
- Tag data stored in kebab-case for URL consistency
- Add new technical terms to mapping tables in `tagUtils.ts`

---

## Icon System (Iconify)

Uses `astro-icon` v1.x with **local icon sets** to avoid network dependencies.

### Available Icon Sets

| Icon Set             | Package                | Usage         | Examples                          |
| -------------------- | ---------------------- | ------------- | --------------------------------- |
| **Brand Logos**      | `@iconify-json/logos`  | `logos:name`  | `x`, `github-icon`, `ycombinator` |
| **Functional Icons** | `@iconify-json/lucide` | `lucide:name` | `rss`, `mail`, `calendar`         |

### Usage

```astro
import { Icon } from "astro-icon/components";
import IconLink from "@components/IconLink.astro";

<Icon name="logos:github-icon" size={16} />
<Icon name="lucide:rss" size={12} />

<IconLink href={url} title="Share on X">
  <Icon name="logos:x" size={16} />
</IconLink>
```

### Rules

- **Install icon sets locally** - No remote API calls (v1.x requirement)
- **Use semantic naming** - `logos:` for brands, `lucide:` for functional icons
- **Consistent sizing** - 16px for social icons, 12px for RSS
- **Wrap with IconLink** - Maintain design system consistency

---

## Footnote & Inline Note Systems

### Academic Footnotes

**Use for citations and references at page bottom:**

```astro
import FootnoteRef from "@components/FootnoteRef.astro";
import Footnote from "@components/Footnote.astro";

Text with citation.<FootnoteRef id={1} />

<Footnote id={1}>
  {/* prettier-ignore */}
  <span>Source citation here</span>
</Footnote>
```

**Requirements:**
- Wrap content in `<span>` with `{/* prettier-ignore */}`
- Use same numeric ID for both FootnoteRef and Footnote
- Import both components at top of .mdx files

### Inline Notes

**Use for immediate explanations via hover tooltips:**

```astro
import InlineNote from "@components/InlineNote.astro";
import InlineNoteRef from "@components/InlineNoteRef.astro";

// Add global tooltip system (once per page)
<InlineNote />

// Use inline notes for terminology
<InlineNoteRef text="专业术语" note="这里是即时解释，支持中英文混排" />
```

**Key Differences:**
- **Footnotes**: Academic citations, numbered references at page bottom
- **Inline Notes**: Immediate explanations, hover/click tooltips
- **Global System**: InlineNote provides shared tooltip, InlineNoteRef triggers it

---

## Path Aliases & Imports

All imports use path aliases defined in `tsconfig.json`:

| Alias           | Maps to            | Usage                                 |
| --------------- | ------------------ | ------------------------------------- |
| `@/*`           | `src/*`            | General-purpose root directory access |
| `@components/*` | `src/components/*` | All component imports                 |
| `@layouts/*`    | `src/layouts/*`    | Layout component imports              |
| `@styles/*`     | `src/styles/*`     | CSS and style imports                 |
| `@i18n/*`       | `src/i18n/*`       | Internationalization utilities        |
| `@utils/*`      | `src/utils/*`      | Utility functions and helpers         |
| `@content/*`    | `src/content/*`    | Content collection access             |

### Import Order

```typescript
// 1. Astro/framework imports
import { getCollection } from "astro:content";

// 2. Layout imports
import Layout from "@layouts/Layout.astro";

// 3. Component imports (alphabetical)
import Button from "@components/Button.astro";
import Link from "@components/Link.astro";

// 4. Utility imports
import { formatTag } from "@utils/tagUtils";
import { cn } from "@utils/index";

// 5. Style imports (at end)
import "@styles/global.css";
```

### Rules

- **ALWAYS** use path aliases instead of relative paths (`../`, `./`)
- TypeScript + VS Code automatically recognize and autocomplete aliases
- Consistent imports regardless of file location
- Easier refactoring - moving files doesn't break import paths

---

## Analytics Integration

### PostHog Setup

**Component**: `src/components/PostHog.astro`

**Usage**: Automatically included in `Layout.astro` via `<PostHog />` in `<head>`

**Configuration**:
- PostHog SDK loaded from CDN
- Project API key configured in component
- Page view tracking enabled
- Custom event tracking available

**Privacy**:
- Respects Do Not Track (DNT) headers
- No personally identifiable information collected
- Cookie-based session tracking

---

## Internationalization (i18n)

### Supported Languages

| Language          | Route        | Translation File                |
| ----------------- | ------------ | ------------------------------- |
| English (default) | `/so-far`    | `src/i18n/translations/en.json` |
| Chinese           | `/so-far/zh` | `src/i18n/translations/zh.json` |

### i18n Utils (`src/i18n/utils.ts`)

```typescript
import { getTranslations, getLanguageFromPath, createLangSwitchUrl } from "@i18n/utils";

const t = getTranslations("en");
const lang = getLanguageFromPath(pathname);
const switchUrl = createLangSwitchUrl("zh", "#section");
```

---

## Technical Configuration

### Astro Config (`astro.config.mjs`)

| Setting             | Value                        | Purpose                                                      |
| ------------------- | ---------------------------- | ------------------------------------------------------------ |
| **Output Mode**     | `server`                     | SSR mode for Cloudflare Pages                                |
| **Adapter**         | `@astrojs/cloudflare`        | Cloudflare Workers integration                               |
| **TypeScript**      | `astro/tsconfigs/strict`     | Strict mode + path aliases configuration                     |
| **URL Structure**   | `trailingSlash: "never"`     | Clean URLs without trailing slashes                          |
| **Fonts**           | Fontsource local hosting     | Inter (variable) + EB Garamond (variable) + Maple Mono       |
| **Tailwind**        | v4 via Vite plugin           | Custom `@theme` block, Typography plugin + Language variants |
| **Image Service**   | Sharp (compile)              | Optimized image processing                                   |
| **Markdown Theme**  | github-light                 | Syntax highlighting with word wrap                           |

### Dependencies

| Package                     | Version | Purpose               |
| --------------------------- | ------- | --------------------- |
| **Astro**                   | ^5.16.0 | Static site generator |
| **Tailwind CSS**            | ^4.1.11 | Utility-first CSS     |
| **@astrojs/react**          | ^4.4.2  | React integration     |
| **@astrojs/cloudflare**     | ^12.6.11| Cloudflare adapter    |
| **@astrojs/rss**            | ^4.0.14 | RSS feed generation   |
| **@astrojs/sitemap**        | ^3.6.0  | XML sitemap           |
| **@tailwindcss/typography** | ^0.5.16 | Markdown styling      |
| **astro-icon**              | ^1.1.5  | Iconify integration   |
| **exifr**                   | ^7.1.3  | EXIF data extraction  |
| **Prettier**                | 3.6.2   | Code formatting       |

---

## Deployment

### Cloudflare Pages

| Setting              | Value                          |
| -------------------- | ------------------------------ |
| **Build command**    | `pnpm build`                   |
| **Output directory** | `dist`                         |
| **Node.js version**  | 18                             |
| **Framework**        | Astro                          |
| **Deploy command**   | `pnpm deploy`                  |

### SEO Features

- XML sitemap via `@astrojs/sitemap` with priority/changefreq customization
- Open Graph + Twitter Cards for social sharing
- Structured data (Person + BlogPosting schemas)
- RSS feed for blog posts at `/rss.xml`
- Clean URLs with no trailing slashes

---

## 🎯 Key Takeaways

### Development Workflow

1. **Always use path aliases** (`@components/`, `@layouts/`, `@utils/`) - never relative paths
2. **Always use existing components** (Link, Button, IconLink, Tag)
3. **Run `pnpm typecheck` before committing** - must pass
4. **Follow Tailwind-first architecture** - no inline styles except animations
5. **Use `formatTag()` for all tag displays** - never manual formatting
6. **Wrap footnote content in `<span>` with `{/* prettier-ignore */}`**
7. **Never add H1 tags in blog posts** - handled by layout
8. **Use InlineNote + InlineNoteRef for terminology** - hover tooltips
9. **Path aliases make refactoring safer** - consistent imports across codebase
10. **Use Iconify for all icons** - local icon sets with semantic naming

### Content Management

1. **Blog posts** use Content Collections with frontmatter validation
2. **Photos** added via `pnpm new:photo` with automatic EXIF extraction
3. **Tags** stored in kebab-case, formatted with `formatTag()` at display time
4. **Now page** shows latest entry from Content Collections
5. **Moments** photo journal with EXIF metadata and lightbox

### Code Quality

1. **TypeScript strict mode** - all props must have interfaces
2. **Component composition** - reuse Link/IconLink base components
3. **150ms transitions** for hover effects only
4. **CSS custom properties** for design system colors
5. **Prettier + ESLint** configured with Astro plugins
