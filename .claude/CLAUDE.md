# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Version:** v3.0 | **Last Updated:** 2025-11-25
Personal website + Kira AI calendar assistant. Built with Astro + Tailwind CSS (frontend) and LangGraph + FastAPI (backend agent).

## ⚡ Quick Reference

### Essential Commands

| Command                             | Action                                 | Critical Notes                       |
| ----------------------------------- | -------------------------------------- | ------------------------------------ |
| `make dev`                          | Start both frontend + backend          | **Recommended for Kira development** |
| `pnpm dev`                          | Frontend dev server (`localhost:4321`) | Hot reload enabled                   |
| `cd agent && uv run python main.py` | Backend server (`localhost:8000`)      | FastAPI + LangGraph agent            |
| `make install`                      | Install all dependencies               | Frontend (pnpm) + backend (uv)       |
| `pnpm build`                        | Build frontend to `./dist/`            | **ALWAYS run before deploy**         |
| `pnpm typecheck`                    | TypeScript validation                  | **MUST pass before commit**          |
| `pnpm prettier`                     | Format (2-space indent)                | Auto-sorts Tailwind classes          |
| `make check`                        | Run all quality checks                 | typecheck + format + lint            |

### Key Paths

```
src/content/blog/       → Blog posts (.md)
src/content/now/        → Now page updates
src/components/         → Reusable Astro components
src/components/kira/    → Kira app React components
src/context/            → React Context (ScheduleContext)
src/i18n/translations/  → Multi-language content
src/layouts/            → Page layouts
agent/                  → Python backend (LangGraph + FastAPI)
  ├── agent.py          → LangGraph workflow definition
  ├── main.py           → FastAPI server + CopilotKit integration
  └── turso_checkpointer.py → Persistent state (SQLite/Turso)
```

### **🏷️ Tag Display System**

**Intelligent Tag Formatting** - All tags use smart formatting for professional display:

| Original Tag       | Display Format     | Usage                         |
| ------------------ | ------------------ | ----------------------------- |
| `devops`           | `DevOps`           | Correct technical terminology |
| `api-design`       | `API Design`       | Kebab-case to Title Case      |
| `machine-learning` | `Machine Learning` | Multi-word technical terms    |
| `zero-trust`       | `Zero Trust`       | Security concepts             |
| `user-acquisition` | `User Acquisition` | Business terminology          |

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

This repository contains two major components:

1. **Personal Website** - Astro-based static site with blog, portfolio, and resume
2. **Kira Calendar Agent** - AI-powered calendar assistant (LangGraph + CopilotKit)

### Personal Website

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
│   ├── InlineNoteRef.astro  # Inline note triggers with tooltip content
│   └── Resume/              # Resume-specific components for PDF layout
│       ├── ProjectsList.astro    # Resume project entries with period/GitHub display
│       ├── ResumeSection.astro   # Resume section headers with language-aware spacing
│       ├── SkillsGrid.astro      # Skills display with category/stack formatting
│       └── WorkExperienceList.astro # Work positions with company/period metadata
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
| **Resume**  | PDF-optimized sizing: 14pt-8pt scale                | Custom properties for print     |

### Component Registry

#### **Core Components**

| Component                  | Purpose                                          | Key Props                            | Dependencies        |
| -------------------------- | ------------------------------------------------ | ------------------------------------ | ------------------- |
| **Link.astro**             | Unified links, responsive hover                  | `href`, `target`, `class`            | Base component      |
| **Button.astro**           | Buttons with variants                            | `variant`, `size`, `type`            | -                   |
| **IconLink.astro**         | Icon links with consistent opacity               | `href`, `title`, `icon`              | Base for GitHub/RSS |
| **GitHubIcon.astro**       | GitHub links (Iconify)                           | `href`, `class`                      | IconLink, Icon      |
| **RssIcon.astro**          | RSS feed links (Iconify)                         | `class`, `showText`                  | IconLink, Icon      |
| **XIcon.astro**            | X/Twitter share links (Iconify)                  | `href`, `class`                      | IconLink, Icon      |
| **HackerNewsIcon.astro**   | Hacker News share links (Iconify)                | `href`, `class`                      | IconLink, Icon      |
| **SocialShare.astro**      | Blog post social sharing with conversational CTA | `title`, `url`                       | XIcon, HackerNews   |
| **TimelineItem.astro**     | Career timeline                                  | `year`, `title`, `company`, `period` | -                   |
| **ProjectItem.astro**      | Project display                                  | `title`, `description`, `github`     | Link, GitHubIcon    |
| **FormattedText.astro**    | i18n text with links                             | `text`, `replacements`               | Link                |
| **PDFIndicator.astro**     | PDF page banner                                  | `lang`, `switchUrl`                  | Link                |
| **SoFarPage.astro**        | Professional profile page                        | `lang`, `translations`               | All components      |
| **CurrentStatus.astro**    | Homepage status                                  | -                                    | Content Collections |
| **UpdateCard.astro**       | Now page entries                                 | `entry`, `showFull`                  | -                   |
| **FooterSignature.astro**  | Footer navigation                                | `links`, `signature`                 | Link                |
| **LanguageSwitcher.astro** | Language toggle                                  | `languageOption`                     | Button              |
| **Footnote.astro**         | Academic footnotes                               | `id`, `slot`                         | Link                |
| **FootnoteRef.astro**      | Footnote references                              | `id`                                 | Link                |
| **InlineNote.astro**       | Global tooltip system                            | -                                    | Global singleton    |
| **InlineNoteRef.astro**    | Inline note triggers                             | `text`, `note`                       | InlineNote          |
| **Tag.astro**              | Smart tag display with formatting                | `tag`, `interactive`, `href`, `size` | formatTag utility   |

#### **Resume Components (`src/components/Resume/`)**

| Component                    | Purpose                                         | Key Props                       | Language Support     |
| ---------------------------- | ----------------------------------------------- | ------------------------------- | -------------------- |
| **ResumeSection.astro**      | Section headers with language-aware spacing     | `title`, `className`            | `en:`/`zh:` variants |
| **SkillsGrid.astro**         | Skills display with category/stack formatting   | `categories[]`, `className`     | `en:`/`zh:` variants |
| **WorkExperienceList.astro** | Work positions with company/period metadata     | `positions[]`, `className`      | `en:`/`zh:` variants |
| **ProjectsList.astro**       | Project entries with period/GitHub link display | `projects[]`, `showGithubLinks` | `en:`/`zh:` variants |

**🎯 Resume Component Features:**

- **Language-aware spacing** - Different `en:`/`zh:` spacing for optimal PDF layout density
- **TypeScript interfaces** - Strict typing for all data structures (ProjectItem, SkillCategory, etc.)
- **PDF optimization** - Font sizes using CSS custom properties (`--text-resume-*`)
- **Consistent styling** - Uses `cn()` utility for conditional classes
- **Smart line heights** - `en:leading-tight zh:leading-relaxed` for text density optimization

### **⚡ Component Rules**

- **TypeScript interfaces** for all props
- **Path aliases required** - use `@components/` instead of relative paths
- **Tailwind-first** - no inline `<style>` tags
- **Component composition** - reuse Link/IconLink base components
- **150ms transitions** for hover effects only
- **CSS custom properties** for design system colors: `text-text-tertiary`

### **📄 Resume Components Architecture**

**Language-Aware Styling System:**

- **Custom Tailwind variants**: `@variant en (:lang(en) &);` and `@variant zh (:lang(zh) &);` in `global.css`
- **Conditional spacing**: Different margins/line heights for English vs Chinese content density
- **PDF font sizing**: Uses CSS custom properties (`--text-resume-name: 14pt`, etc.)
- **Smart imports**: Resume components import `cn` utility for conditional class handling

**Component Responsibilities:**

- **ResumeSection**: Standardized section headers with border-bottom styling
- **SkillsGrid**: Category-based skills display with bold labels
- **WorkExperienceList**: Position entries with company/period metadata alignment
- **ProjectsList**: Project listings with optional GitHub links and period display

**Key Implementation Details:**

- **Break-inside-avoid**: Prevents awkward page breaks in PDF output
- **Responsive typography**: Different line heights for optimal readability by language
- **Consistent interfaces**: TypeScript interfaces ensure data structure consistency
- **Modular design**: Each component handles one specific resume section type

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

| Route                  | Purpose                   | Layout             | Components                     |
| ---------------------- | ------------------------- | ------------------ | ------------------------------ |
| `/`                    | Homepage                  | Layout.astro       | CurrentStatus, FooterSignature |
| `/thoughts`            | Blog listing              | Layout.astro       | RSS icon, article list         |
| `/thoughts/[slug]`     | Blog posts                | BlogPost.astro     | SocialShare, LanguageSwitcher  |
| `/thoughts/tags/[tag]` | Tag-filtered posts        | Layout.astro       | Tag display, breadcrumb nav    |
| `/now`                 | Current status            | Layout.astro       | UpdateCard, FooterSignature    |
| `/now/archive`         | Status history            | Layout.astro       | Timeline view                  |
| `/so-far`              | Professional profile (EN) | Layout.astro       | SoFarPage                      |
| `/so-far/zh`           | Professional profile (ZH) | Layout.astro       | SoFarPage                      |
| `/so-far/pdf`          | Resume PDF                | ResumeLayout.astro | PDFIndicator                   |

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

| Setting             | Value                        | Purpose                                                      |
| ------------------- | ---------------------------- | ------------------------------------------------------------ |
| **TypeScript**      | `astro/tsconfigs/strict`     | Strict mode + path aliases configuration                     |
| **Path Aliases**    | 7 aliases in `tsconfig.json` | Clean imports with `@` prefixes                              |
| **URL Structure**   | `trailingSlash: "never"`     | Clean URLs without trailing slashes                          |
| **Build Format**    | `{ format: "file" }`         | Generates `.html` files                                      |
| **Fonts**           | Fontsource local hosting     | Inter (variable) + EB Garamond (variable) + Maple Mono       |
| **CSS Files**       | `global.css` + `prose.css`   | Design system + Typography overrides                         |
| **Tailwind**        | v4 via Vite plugin           | Custom `@theme` block, Typography plugin + Language variants |
| **Chinese Support** | Optimized font stacks        | Mixed-language content handling + `en:`/`zh:` variants       |

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

## Kira Calendar Agent Architecture

### Overview

Kira is an AI-powered calendar and task management assistant that demonstrates integration between:

- **LangGraph**: State machine workflow engine for multi-turn conversations
- **CopilotKit**: Seamless frontend-backend integration with tool calling
- **OpenRouter**: Unified API for multiple LLM models (GPT-4, Claude, Gemini)
- **Turso Embedded Replica**: Local SQLite + optional cloud sync for conversation persistence

### System Architecture

```
┌────────────────────────────────────────────────────────────┐
│  Frontend (Astro + React)                                  │
│  src/components/kira/KiraApp.tsx                           │
│  - CopilotKit provider with thread_id                      │
│  - useCopilotAction registers frontend tools               │
│  - ScheduleContext manages calendar/task state             │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ POST /api/copilotkit (GraphQL stream)
                      │
┌─────────────────────▼──────────────────────────────────────┐
│  FastAPI Backend (agent/main.py)                           │
│  - CopilotKit Runtime integration                          │
│  - CORS middleware                                         │
│  - Lifespan handler (startup/shutdown)                     │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ Calls graph.stream()
                      │
┌─────────────────────▼──────────────────────────────────────┐
│  LangGraph Agent (agent/agent.py)                          │
│                                                             │
│  KiraAgentState (inherits CopilotKitState):               │
│    - messages: conversation history                        │
│    - copilotkit: frontend actions (addEvent, addTask, etc.)│
│                                                             │
│  chat_node workflow:                                        │
│    1. Extract frontend actions from state                  │
│    2. Initialize LLM via OpenRouter                        │
│    3. Bind tools (frontend actions) to model               │
│    4. Call LLM with system prompt + conversation           │
│    5. Stream response back to frontend                     │
└─────────────────────┬──────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   ┌────────┐   ┌──────────┐   ┌─────────┐
   │OpenRouter│   │Checkpointer│   │Frontend │
   │Multi-model│   │SQLite/Turso│   │Actions  │
   └────────┘   └──────────┘   └─────────┘
```

### Key Components

#### 1. Frontend Integration (React + CopilotKit)

**Location**: `src/components/kira/KiraApp.tsx`

- **CopilotKit Provider**: Wraps app with `<CopilotKit>` component
- **Thread Management**: Generates unique `thread_id` stored in localStorage for conversation persistence
- **Frontend Actions**: Registered via `useCopilotAction` (addEvent, updateEvent, deleteEvent, addTask, etc.)
- **State Management**: `ScheduleContext` provides calendar events and task state to all components

**Critical Pattern**:

```typescript
// Thread ID generation for conversation persistence
function getThreadId(): string {
  let threadId = localStorage.getItem("kira_thread_id");
  if (!threadId) {
    threadId = `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("kira_thread_id", threadId);
  }
  return threadId;
}
```

#### 2. Backend Workflow (LangGraph)

**Location**: `agent/agent.py`

**State Definition**:

```python
class KiraAgentState(CopilotKitState):
    """Inherits from CopilotKitState to access frontend actions"""
    messages: Annotated[List[BaseMessage], add_messages]
```

**chat_node Execution Flow**:

1. Extract `frontend_actions` from `state.get("copilotkit", {}).get("actions", [])`
2. Initialize ChatOpenAI with OpenRouter endpoint
3. Bind frontend tools: `model.bind_tools(frontend_actions)`
4. Call LLM with system prompt + conversation history
5. Return response with tool calls (executed on frontend)

**Key Insight**: Tools are **executed on frontend**, not backend. LangGraph agent only generates tool calls; CopilotKit runtime handles execution.

#### 3. Persistent State (Turso Checkpointer)

**Location**: `agent/turso_checkpointer.py`

**Architecture**:

- **Local-first**: Always uses local SQLite file (`agent/data/checkpoints.db`)
- **Optional Cloud Sync**: If Turso credentials provided, syncs in background via libsql
- **Zero Code Intrusion**: LangGraph uses standard AsyncSqliteSaver, libsql handles sync transparently

**Configuration**:

```bash
# Development (local only)
ENVIRONMENT=dev

# Production (with cloud sync)
ENVIRONMENT=prod
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
TURSO_SYNC_INTERVAL=60  # seconds
```

**Critical Methods**:

- `get_checkpointer()`: Returns AsyncSqliteSaver for LangGraph
- `sync_now()`: Manual sync trigger for critical moments
- `close()`: Cleanup with final sync (called on shutdown)

#### 4. Server Lifecycle (FastAPI)

**Location**: `agent/main.py`

**Lifespan Handler**:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize checkpointer and compile graph
    checkpointer, turso_checkpointer = await get_checkpointer()
    graph = workflow.compile(checkpointer=checkpointer)

    yield

    # Shutdown: Close checkpointer (triggers final sync)
    await turso_checkpointer.close()
```

**Endpoints**:

- `POST /copilotkit`: CopilotKit GraphQL endpoint (streaming)
- `GET /`: Root health check
- `GET /health`: Health check for monitoring
- `GET /docs`: Auto-generated FastAPI docs

### Environment Variables

#### Frontend (.env)

```bash
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
PUBLIC_COPILOTKIT_LICENSE_KEY=...
```

#### Backend (agent/.env)

```bash
# Required
OPENROUTER_API_KEY=sk-or-v1-...

# Optional
OPENROUTER_MODEL=google/gemini-2.0-flash-exp  # Default model
ENVIRONMENT=dev  # 'dev' (local) or 'prod' (Turso sync)
TURSO_DATABASE_URL=libsql://...  # Required if ENVIRONMENT=prod
TURSO_AUTH_TOKEN=...  # Required if ENVIRONMENT=prod
TURSO_SYNC_INTERVAL=60  # Sync interval in seconds
ALLOWED_ORIGINS=http://localhost:4321  # CORS origins
PORT=8000  # Server port
```

### Development Workflow

#### Starting Development

```bash
# Start both frontend and backend
make dev

# Or separately:
pnpm dev  # Frontend: http://localhost:4321
cd agent && uv run python main.py  # Backend: http://localhost:8000
```

#### Testing Agent

1. Visit `http://localhost:4321` (Kira app loads)
2. Chat with agent: "Add a meeting tomorrow at 2pm"
3. Agent calls `addEvent` tool → frontend executes → UI updates
4. Conversation persists via thread_id in localStorage

#### Debugging Checkpointer

```bash
# View local conversation history
sqlite3 agent/data/checkpoints.db
> SELECT * FROM checkpoints;

# Check Turso sync (if enabled)
turso db shell your-db-name
> SELECT COUNT(*) FROM checkpoints;
```

### Critical Integration Points

#### 1. Frontend → Backend: Action Registration

Frontend actions are serialized and sent to backend via CopilotKit's GraphQL protocol. Backend sees them as tool schemas in LangGraph state.

#### 2. Backend → Frontend: Tool Execution

LangGraph generates tool calls (AIMessage with tool_calls). CopilotKit runtime intercepts and executes corresponding `useCopilotAction` callbacks on frontend.

#### 3. State Persistence: Thread ID

Both frontend and backend use same `thread_id` from localStorage. LangGraph checkpointer keys state by thread_id, enabling conversation history across sessions.

### Common Patterns

#### Adding New Frontend Actions

```typescript
// In React component
useCopilotAction({
  name: "myNewAction",
  parameters: [{ name: "param1", type: "string", description: "..." }],
  handler: async ({ param1 }) => {
    // Execute action on frontend
    return { success: true };
  },
});
```

Agent automatically sees this as a callable tool.

#### Modifying System Prompt

Edit `agent/agent.py` → `chat_node` → `system_message` content. This controls agent behavior and personality.

#### Changing LLM Model

Set `OPENROUTER_MODEL` in `agent/.env`. See https://openrouter.ai/models for available models.

### Architecture Benefits

1. **Frontend Tool Execution**: No backend permission issues, direct UI updates
2. **Model Flexibility**: Switch LLMs via environment variable (OpenRouter abstraction)
3. **Conversation Persistence**: Thread-based state enables multi-session context
4. **Local-First Database**: Low latency, offline support, optional cloud sync
5. **Zero Frontend Changes**: Agent upgrades don't require frontend redeployment

### Build Configuration for SSR

**🚨 Critical for Production Builds**

When using CopilotKit in Astro SSR API routes, you must configure Vite to externalize Node.js-only dependencies. This prevents build errors caused by AWS SDK and LangChain modules that cannot run in browser environments.

**Problem**: `@copilotkit/runtime` depends on `@langchain/aws`, which transitively depends on `@aws-sdk/*` and `@smithy/*` packages. These packages use Node.js file system modules (`fs`, `crypto`, etc.) that Vite cannot bundle for the browser.

**Solution**: Add comprehensive `vite.ssr.external` configuration in `astro.config.mjs`:

```javascript
vite: {
  plugins: [tailwindcss()],
  ssr: {
    external: [
      "async_hooks",

      // AWS SDK and dependencies (used by @copilotkit/runtime -> @langchain/aws)
      "@aws-sdk/*",
      "@smithy/*",

      // LangChain ecosystem
      "@langchain/aws",
      "@langchain/community",
      "@langchain/core",
      "langchain",

      // CopilotKit runtime dependencies
      "@copilotkit/runtime",
      "@copilotkit/shared",

      // Node.js-only dependencies
      "pino",
      "pino-pretty",
      "pino-abstract-transport",
      "type-graphql",
      "graphql-yoga",
      "express",
    ],
  },
},
```

**Why This Works**:

- SSR API routes run only on the server, not in the browser
- Externalizing these packages tells Vite to keep them as Node.js modules
- At runtime, Cloudflare Workers (or other SSR platforms) load them as server-side dependencies

**When to Update**:

- After upgrading CopilotKit, LangChain, or related dependencies
- If you see `"X is not exported by __vite-browser-external"` errors during build
- When adding new Node.js-only integrations to API routes

---

**🎯 Key Takeaways for Claude:**

### Website Development

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
11. **Resume components available** - Use dedicated Resume/ folder components for PDF layouts
12. **Language variants enabled** - Use `en:`/`zh:` Tailwind variants for responsive typography

### Kira Agent Development

1. **Use `make dev` for full-stack development** - starts both frontend and backend
2. **Thread ID is critical** - stored in localStorage, enables conversation persistence
3. **Tools execute on frontend** - LangGraph generates calls, CopilotKit executes via useCopilotAction
4. **Checkpointer is local-first** - SQLite file with optional Turso cloud sync
5. **Environment variables matter** - Different behavior for dev vs prod (ENVIRONMENT=dev/prod)
6. **System prompt in agent.py** - Edit to change agent behavior and personality
7. **OpenRouter abstraction** - Switch models via OPENROUTER_MODEL env var
8. **Lifespan handler for cleanup** - Always close checkpointer on shutdown for final sync
9. **CORS configuration** - Update ALLOWED_ORIGINS when deploying to new domains
10. **Health check endpoint** - Use `/health` for monitoring in production
11. **Build configuration required** - Must configure `vite.ssr.external` for production builds (see "Build Configuration for SSR")
