# CLAUDE.md

**Version:** v2.4 | **Last Updated:** 2025-08-27
Personal website built with Astro + Tailwind CSS, implementing letter-like aesthetic for correspondence experience.

## ⚡ Quick Reference

### Essential Commands

| Command          | Action                         | Critical Notes               |
| ---------------- | ------------------------------ | ---------------------------- |
| `pnpm dev`       | Dev server at `localhost:4321` | Hot reload enabled           |
| `pnpm build`     | Build to `./dist/`             | **ALWAYS run before deploy** |
| `pnpm typecheck` | TypeScript validation          | **MUST pass before commit**  |
| `pnpm prettier`  | Format (2-space indent)        | Auto-sorts Tailwind classes  |

### Key Paths

```
src/content/blog/     → Blog posts (.md)
src/content/now/      → Now page updates
src/components/       → Reusable components
src/i18n/translations/ → Multi-language content
src/layouts/          → Page layouts
```

### **🏷️ Tag Display System**

**Intelligent Tag Formatting** - All tags use smart formatting for professional display:

| Original Tag        | Display Format      | Usage                                  |
| ------------------- | ------------------- | -------------------------------------- |
| `devops`            | `DevOps`            | Correct technical terminology          |
| `api-design`        | `API Design`        | Kebab-case to Title Case              |
| `machine-learning`  | `Machine Learning`  | Multi-word technical terms            |
| `zero-trust`        | `Zero Trust`        | Security concepts                     |
| `user-acquisition`  | `User Acquisition`  | Business terminology                  |

**Implementation:**
- Core function: `formatTag()` in `src/utils/tagUtils.ts`
- 120+ technical terms mapped correctly
- Automatic kebab-case splitting and formatting  
- Used in: Tag components, page titles, structured data
- Import: `import { formatTag } from "@utils/tagUtils";`

**Key Rules:**
- **NEVER** manually format tag displays - always use `formatTag()`
- Tag data stored in original kebab-case format for URL consistency
- Formatting applied at display time only
- All new technical terms should be added to the mapping tables

### **🚨 CRITICAL RULES**

**ALWAYS DO:**

- Use existing components (Link, Button, IconLink)
- Use path aliases (`@components/`, `@layouts/`, etc.) for all imports
- Follow Tailwind-first architecture (no inline `<style>`)
- Run `pnpm typecheck` before committing
- Wrap footnote content in `<span>` with `{/* prettier-ignore */}`

**NEVER DO:**

- Use relative paths (`../`, `./`) for imports - always use path aliases
- Create new files unless absolutely necessary
- Add H1 tags in blog posts (handled by layout)
- Use `set:html` without sanitization
- Commit without passing typecheck

## Project Architecture

**Core Concept:** Letter-like aesthetic for correspondence experience, not traditional website navigation.

### Directory Structure

```
src/
├── content/
│   ├── blog/                # Markdown blog posts with Content Collections
│   └── now/                 # Monthly now page updates with Content Collections
├── components/
│   ├── Link.astro           # Unified link component with responsive styling
│   ├── Button.astro         # Unified button component with variant styles
│   ├── IconLink.astro       # Universal icon link component with consistent hover effects
│   ├── GitHubIcon.astro     # GitHub icon using Iconify (logos:github-icon)
│   ├── RssIcon.astro        # RSS icon using Iconify (lucide:rss)
│   ├── XIcon.astro          # X/Twitter icon using Iconify (logos:x)
│   ├── HackerNewsIcon.astro # Hacker News icon using Iconify (logos:ycombinator)
│   ├── SocialShare.astro    # Social sharing component with conversational CTA for blog posts
│   ├── FooterSignature.astro # Reusable footer signature with navigation (uses Link)
│   ├── ProjectItem.astro    # Reusable project display with GitHub links
│   ├── TimelineItem.astro   # Career timeline with continuous line design
│   ├── FormattedText.astro  # Dynamic text with link replacements for i18n
│   ├── PDFIndicator.astro   # PDF page indicator with print button (uses Link)
│   ├── UpdateCard.astro     # Reusable component for displaying now page entries
│   ├── SoFarPage.astro      # Comprehensive page-level component for professional profile
│   ├── CurrentStatus.astro  # Current activity status with visual differentiation (uses Link)
│   ├── Footnote.astro       # Academic-style footnotes with return links
│   ├── FootnoteRef.astro    # Footnote references with anchor links
│   ├── InlineNote.astro     # Global tooltip system with smart positioning (180 lines)
│   └── InlineNoteRef.astro  # Inline note triggers with tooltip content
├── i18n/
│   ├── translations/
│   │   ├── en.json          # English translations
│   │   └── zh.json          # Chinese translations
│   └── utils.ts             # i18n utility functions
├── layouts/
│   ├── Layout.astro         # Base HTML layout with language support
│   ├── BlogPost.astro       # Blog post layout with Typography
│   └── ResumeLayout.astro   # PDF-optimized resume layout with language support
├── pages/
│   ├── index.astro          # Homepage with letter-style greeting
│   ├── now.astro            # Current status page with Content Collections
│   ├── now/
│   │   ├── archive.astro    # Historical now page entries timeline
│   │   └── [date].astro     # Dynamic route for specific monthly updates
│   ├── so-far.astro         # Professional timeline (English)
│   ├── so-far/
│   │   ├── [lang].astro     # Professional timeline (other languages)
│   │   ├── pdf.astro        # PDF resume (English)
│   │   └── pdf/
│   │       └── [lang].astro # PDF resume (other languages)
│   ├── og-generator.astro   # OG image generation editor with terminal aesthetic
│   ├── og-preview.astro     # Full-size OG image preview and download
│   ├── rss.xml.ts           # RSS feed generation
│   └── thoughts/
│       ├── index.astro      # Blog listing page with RSS icon
│       └── [...slug].astro  # Dynamic blog post routes
├── scripts/
│   └── og-utils.ts          # Shared utilities for OG image generation
├── utils/
│   ├── dateUtils.ts         # Unified date formatting utilities
│   ├── tagUtils.ts          # Intelligent tag formatting system (120+ mappings)
│   └── index.ts             # Common utility functions (cn + tag utilities)
└── styles/
    ├── global.css           # Design system + Typography config
    └── prose.css            # Prose typography + Chinese text optimization
```

### Design System

| Element     | Values                                              | Usage                           |
| ----------- | --------------------------------------------------- | ------------------------------- |
| **Colors**  | 5 grays: `--color-text-primary` to `--color-border` | Use CSS custom properties       |
| **Fonts**   | Inter (sans) + EB Garamond (serif) + Maple Mono     | Variable weights, local hosting |
| **Width**   | `max-w-2xl` (672px)                                 | Fixed content width             |
| **Spacing** | `mb-16`, `py-16` (64px)                             | Consistent vertical rhythm      |
| **Style**   | No animations, shadows, decorative elements         | Extreme minimalism              |

### Component Registry

| Component                  | Purpose                            | Key Props                            | Dependencies        |
| -------------------------- | ---------------------------------- | ------------------------------------ | ------------------- |
| **Link.astro**             | Unified links, responsive hover    | `href`, `target`, `class`            | Base component      |
| **Button.astro**           | Buttons with variants              | `variant`, `size`, `type`            | -                   |
| **IconLink.astro**         | Icon links with consistent opacity | `href`, `title`, `icon`              | Base for GitHub/RSS |
| **GitHubIcon.astro**       | GitHub links (Iconify)             | `href`, `class`                      | IconLink, Icon      |
| **RssIcon.astro**          | RSS feed links (Iconify)           | `class`, `showText`                  | IconLink, Icon      |
| **XIcon.astro**            | X/Twitter share links (Iconify)    | `href`, `class`                      | IconLink, Icon      |
| **HackerNewsIcon.astro**   | Hacker News share links (Iconify)  | `href`, `class`                      | IconLink, Icon      |
| **SocialShare.astro**      | Blog post social sharing with conversational CTA | `title`, `url`              | XIcon, HackerNews   |
| **TimelineItem.astro**     | Career timeline                    | `year`, `title`, `company`, `period` | -                   |
| **ProjectItem.astro**      | Project display                    | `title`, `description`, `github`     | Link, GitHubIcon    |
| **FormattedText.astro**    | i18n text with links               | `text`, `replacements`               | Link                |
| **PDFIndicator.astro**     | PDF page banner                    | `lang`, `switchUrl`                  | Link                |
| **SoFarPage.astro**        | Professional profile page          | `lang`, `translations`               | All components      |
| **CurrentStatus.astro**    | Homepage status                    | -                                    | Content Collections |
| **UpdateCard.astro**       | Now page entries                   | `entry`, `showFull`                  | -                   |
| **FooterSignature.astro**  | Footer navigation                  | `links`, `signature`                 | Link                |
| **LanguageSwitcher.astro** | Language toggle                    | `languageOption`                     | Button              |
| **Footnote.astro**         | Academic footnotes                 | `id`, `slot`                         | Link                |
| **FootnoteRef.astro**      | Footnote references                | `id`                                 | Link                |
| **InlineNote.astro**       | Global tooltip system              | -                                    | Global singleton    |
| **InlineNoteRef.astro**    | Inline note triggers               | `text`, `note`                       | InlineNote          |
| **Tag.astro**              | Smart tag display with formatting | `tag`, `interactive`, `href`, `size` | formatTag utility   |

### **⚡ Component Rules**

- **TypeScript interfaces** for all props
- **Path aliases required** - use `@components/` instead of relative paths
- **Tailwind-first** - no inline `<style>` tags
- **Component composition** - reuse Link/IconLink base components
- **150ms transitions** for hover effects only
- **CSS custom properties** for design system colors: `text-text-tertiary`

### **🏗️ Code Organization Best Practices**

**Import Ordering (Top to Bottom):**

```typescript
// 1. Astro/framework imports
import { getCollection } from "astro:content";

// 2. Layout imports
import Layout from "@layouts/Layout.astro";
import BlogPost from "@layouts/BlogPost.astro";

// 3. Component imports (alphabetical)
import Button from "@components/Button.astro";
import FooterSignature from "@components/FooterSignature.astro";
import Link from "@components/Link.astro";

// 4. Utility imports
import { getTranslations } from "@i18n/utils";
import { formatDate } from "@utils/dateUtils";
import { cn } from "@utils/index";

// 5. Style imports (at end)
import "@styles/global.css";
import "@styles/prose.css";
```

**File Creation Guidelines:**

- **Prefer editing** existing files over creating new ones
- **Component naming**: PascalCase for components, camelCase for utilities
- **File structure**: Match directory structure with logical groupings
- **Single responsibility**: Each component/utility serves one clear purpose

### Footnote & Inline Note Systems

**🚨 Critical Requirements:**

- **Academic Footnotes**: Wrap content in `<span>` tags with `{/* prettier-ignore */}`
- Use same numeric ID for both FootnoteRef and Footnote
- Import both components at top of .mdx files

**Academic Footnotes Usage:**

```astro
import FootnoteRef from "@components/FootnoteRef.astro"; import Footnote from
"@components/Footnote.astro"; Text with citation.<FootnoteRef id={1} />

<Footnote id={1}>
  {/* prettier-ignore */}
  <span>Source citation here</span>
</Footnote>
```

**Inline Notes Usage:**

```astro
import InlineNote from "@components/InlineNote.astro"; import InlineNoteRef from
"@components/InlineNoteRef.astro"; // Add global tooltip system (once per page)
<InlineNote />

// Use inline notes for immediate explanations
<InlineNoteRef text="专业术语" note="这里是即时解释，支持中英文混排" />
```

**⚡ Key Differences:**

- **Footnotes**: Academic citations, numbered references at page bottom
- **Inline Notes**: Immediate explanations, hover/click tooltips for terminology
- **Global System**: InlineNote provides shared tooltip, InlineNoteRef triggers it

## Icon System (Iconify Integration)

### **🎯 Iconify Setup**

Uses `astro-icon` v1.x with local icon sets to avoid network dependencies and ensure reliability.

**Required Dependencies:**

```bash
pnpm add -D astro-icon @iconify-json/logos @iconify-json/lucide
```

**Configuration in `astro.config.mjs`:**

```javascript
import icon from "astro-icon";

export default defineConfig({
  integrations: [icon()],
});
```

### **📋 Icon Usage Patterns**

**Basic Icon Component:**

```astro
import {Icon} from "astro-icon/components";

<Icon name="logos:github-icon" size={16} />
<Icon name="lucide:rss" size={12} />
```

**Icon Component Wrapper Pattern:**

```astro
import {Icon} from "astro-icon/components"; import IconLink from "@components/IconLink.astro";

<IconLink href={url} title="Share on X">
  <Icon name="logos:x" size={16} />
</IconLink>
```

### **🚨 Icon System Rules**

- **Install icon sets locally** - No remote API calls (v1.x requirement)
- **Use semantic naming** - `logos:` for brands, `lucide:` for functional icons
- **Consistent sizing** - 16px for social icons, 12px for RSS
- **Wrap with IconLink** - Maintain design system consistency
- **TypeScript imports** - Always import Icon from "astro-icon/components"

### **📦 Available Icon Sets**

| Icon Set             | Package                | Usage         | Examples                          |
| -------------------- | ---------------------- | ------------- | --------------------------------- |
| **Brand Logos**      | `@iconify-json/logos`  | `logos:name`  | `x`, `github-icon`, `ycombinator` |
| **Functional Icons** | `@iconify-json/lucide` | `lucide:name` | `rss`, `mail`, `calendar`         |

### **🔧 Social Sharing Implementation**

**Components:**

- **SocialShare.astro** - Main sharing container with X and Hacker News, uses conversational CTA ("Found this worth reading or have thoughts to share?")
- **XIcon.astro** - X/Twitter sharing (`logos:x`)
- **HackerNewsIcon.astro** - Hacker News sharing (`logos:ycombinator`)
- **GitHubIcon.astro** - GitHub links (`logos:github-icon`)
- **RssIcon.astro** - RSS feed (`lucide:rss`)

**Integration:**

- Automatically included in `BlogPost.astro` layout
- Positioned between article content and footer
- Uses proper URL encoding for share parameters

## Design System Reference

### Philosophy

**"Less, but better"** - Letter-like experience with natural navigation embedded in content flow.

### Typography

| Element     | Font        | Size | Line Height | Color                  |
| ----------- | ----------- | ---- | ----------- | ---------------------- |
| Headlines   | EB Garamond | 4xl  | 1.25        | `#1a1a1a`              |
| Subheadings | EB Garamond | 2xl  | tight       | `#1a1a1a`              |
| Body        | Inter       | base | 1.65        | `#4a4a4a`              |
| Meta        | Inter       | sm   | normal      | `#6b6b6b`              |
| Links       | Inter       | base | normal      | `#000000` (weight 500) |

### Layout

| Property        | Value            | Usage                          |
| --------------- | ---------------- | ------------------------------ |
| Page padding    | `px-6 py-16`     | 24px horizontal, 64px vertical |
| Section spacing | `mb-16`          | 64px between major sections    |
| Element spacing | `mb-4` to `mb-6` | 16px-24px between elements     |

## Content & Routing

### Page Structure

| Route              | Purpose                   | Layout             | Components                     |
| ------------------ | ------------------------- | ------------------ | ------------------------------ |
| `/`                | Homepage                  | Layout.astro       | CurrentStatus, FooterSignature |
| `/thoughts`        | Blog listing              | Layout.astro       | RSS icon, article list         |
| `/thoughts/[slug]` | Blog posts                | BlogPost.astro     | SocialShare, LanguageSwitcher  |
| `/thoughts/tags/[tag]` | Tag-filtered posts    | Layout.astro       | Tag display, breadcrumb nav    |
| `/now`             | Current status            | Layout.astro       | UpdateCard, FooterSignature    |
| `/now/archive`     | Status history            | Layout.astro       | Timeline view                  |
| `/so-far`          | Professional profile (EN) | Layout.astro       | SoFarPage                      |
| `/so-far/zh`       | Professional profile (ZH) | Layout.astro       | SoFarPage                      |
| `/so-far/pdf`      | Resume PDF                | ResumeLayout.astro | PDFIndicator                   |

### Content Collections

| Collection | Location            | Schema                                             | Usage                            |
| ---------- | ------------------- | -------------------------------------------------- | -------------------------------- |
| Blog       | `src/content/blog/` | `title`, `description`, `pubDate`, `tags`, `draft` | Auto-indexed when `draft: false` |
| Now        | `src/content/now/`  | `summary`, `lastUpdated`, `title`, `description`   | Latest entry on `/now`           |

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

### Featured Posts

- **"Why I Built Sealbox"** - Rust secret management service
- **"Building Kira: An AI-Native Second Brain"** - AI assistant product vision
- **"Fixing Astro SEO on Cloudflare Pages"** - 308 redirects and trailing slash issues
- **"Rust Builder Pattern Guide"** - derive_builder vs hand-written constructors
- **"做那些无法规模化的事"** - Chinese translation with 12 academic footnotes

## Path Aliases & Import System

### **🎯 Path Aliases Configuration**

All imports use path aliases defined in `tsconfig.json` for cleaner, maintainable code:

| Alias           | Maps to            | Usage                                 |
| --------------- | ------------------ | ------------------------------------- |
| `@/*`           | `src/*`            | General-purpose root directory access |
| `@components/*` | `src/components/*` | All component imports                 |
| `@layouts/*`    | `src/layouts/*`    | Layout component imports              |
| `@styles/*`     | `src/styles/*`     | CSS and style imports                 |
| `@i18n/*`       | `src/i18n/*`       | Internationalization utilities        |
| `@utils/*`      | `src/utils/*`      | Utility functions and helpers         |
| `@content/*`    | `src/content/*`    | Content collection access             |

### **⚡ Import Examples**

**Components & Layouts:**

```typescript
import Layout from "@layouts/Layout.astro";
import Link from "@components/Link.astro";
import FooterSignature from "@components/FooterSignature.astro";
import InlineNote from "@components/InlineNote.astro";
import { Icon } from "astro-icon/components";
```

**Utilities & Styles:**

```typescript
import { getTranslations } from "@i18n/utils";
import { formatDate } from "@utils/dateUtils";
import { cn } from "@utils/index";
import "@styles/global.css";
import "@styles/prose.css";
```

**Scripts & Content:**

```typescript
import { generateOGImage } from "@/scripts/og-utils";
import { getCollection } from "astro:content";
```

### **🚨 Path Alias Rules**

- **ALWAYS** use path aliases instead of relative paths (`../`, `./`)
- **TypeScript + VS Code** automatically recognize and autocomplete aliases
- **Consistent imports** regardless of file location in directory tree
- **Easier refactoring** - moving files doesn't break import paths

## Technical Implementation

### Configuration

| Setting             | Value                        | Purpose                                                |
| ------------------- | ---------------------------- | ------------------------------------------------------ |
| **TypeScript**      | `astro/tsconfigs/strict`     | Strict mode + path aliases configuration               |
| **Path Aliases**    | 7 aliases in `tsconfig.json` | Clean imports with `@` prefixes                        |
| **URL Structure**   | `trailingSlash: "never"`     | Clean URLs without trailing slashes                    |
| **Build Format**    | `{ format: "file" }`         | Generates `.html` files                                |
| **Fonts**           | Fontsource local hosting     | Inter (variable) + EB Garamond (variable) + Maple Mono |
| **CSS Files**       | `global.css` + `prose.css`   | Design system + Typography overrides                   |
| **Tailwind**        | v4 via Vite plugin           | Custom `@theme` block, Typography plugin               |
| **Chinese Support** | Optimized font stacks        | Mixed-language content handling                        |

### Dependencies

| Package                     | Version | Purpose               |
| --------------------------- | ------- | --------------------- |
| **Astro**                   | ^5.13.2 | Static site generator |
| **Tailwind CSS**            | ^4.1.11 | Utility-first CSS     |
| **@astrojs/rss**            | ^4.0.12 | RSS feed generation   |
| **@astrojs/sitemap**        | ^3.5.0  | XML sitemap           |
| **@tailwindcss/typography** | ^0.5.16 | Markdown styling      |
| **astro-icon**              | ^1.1.5  | Iconify integration   |
| **@iconify-json/logos**     | ^1.2.9  | Brand logo icons      |
| **@iconify-json/lucide**    | ^1.2.64 | Functional icons      |
| **Prettier**                | 3.6.2   | Code formatting       |

## Internationalization (i18n)

| Language          | Route        | Translation File                |
| ----------------- | ------------ | ------------------------------- |
| English (default) | `/so-far`    | `src/i18n/translations/en.json` |
| Chinese           | `/so-far/zh` | `src/i18n/translations/zh.json` |

### i18n Utils (`src/i18n/utils.ts`)

- `getTranslations(lang)` - Get translations for language
- `getLanguageFromPath(pathname)` - Extract language from URL
- `createLangSwitchUrl(targetLang, hash)` - Generate switch URLs with hash support

## Deployment & SEO

### Cloudflare Pages

| Setting              | Value                          |
| -------------------- | ------------------------------ |
| **Build command**    | `pnpm build`                   |
| **Output directory** | `dist`                         |
| **Node.js version**  | 18                             |
| **Caching**          | 1 year (assets), 1 hour (HTML) |
| **Redirects**        | `/blog/*` → `/thoughts/*`      |

### SEO Features

- XML sitemap via `@astrojs/sitemap`
- Open Graph + Twitter Cards
- Structured data (Person + BlogPosting schemas)
- Clean URLs with no trailing slashes

---

**🎯 Key Takeaways for Claude:**

1. **Always use path aliases** (`@components/`, `@layouts/`, `@styles/`, etc.) - never relative paths
2. **Always use existing components** (Link, Button, IconLink)
3. **Run `pnpm typecheck` before committing**
4. **Follow Tailwind-first architecture**
5. **Wrap footnote content in `<span>` with `{/* prettier-ignore */}`**
6. **Never add H1 tags in blog posts** (handled by layout)
7. **Use InlineNote + InlineNoteRef for terminology explanations**
8. **Path aliases make refactoring safer and imports cleaner**
9. **Use Iconify for all icons** - install icon sets as dependencies with `@iconify-json/[name]`
10. **Social sharing integrated** - SocialShare component automatically added to all blog posts
