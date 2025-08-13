# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command         | Action                                               |
| --------------- | ---------------------------------------------------- |
| `pnpm dev`      | Start local dev server at `localhost:4321`           |
| `pnpm build`    | Build production site to `./dist/`                   |
| `pnpm preview`  | Preview build locally before deploying               |
| `pnpm prettier` | Format all files with Prettier (2-space indentation) |

## Project Architecture

This is a minimalist personal website built with Astro and Tailwind CSS, implementing a letter-like aesthetic that feels like reading beautifully written correspondence rather than browsing a traditional website.

### Core Structure

```
src/
├── content/
│   └── blog/                # Markdown blog posts with Content Collections
├── components/
│   ├── Link.astro           # Unified link component with responsive styling
│   ├── Button.astro         # Unified button component with variant styles
│   ├── GitHubIcon.astro     # GitHub icon with accessibility and hover effects
│   ├── RssIcon.astro        # RSS icon with text and responsive styling
│   ├── FooterSignature.astro # Reusable footer signature with navigation
│   ├── ProjectItem.astro    # Reusable project display with GitHub links
│   ├── TimelineItem.astro   # Career timeline with continuous line design
│   ├── FormattedText.astro  # Dynamic text with link replacements for i18n
│   ├── ResumeLayout.astro   # PDF-optimized resume layout with high info density
│   ├── PDFIndicator.astro   # PDF page indicator with print button and instructions
│   └── LangToggle.astro     # Language toggle component (deprecated)
├── i18n/
│   ├── translations/
│   │   ├── en.json          # English translations
│   │   └── zh.json          # Chinese translations
│   └── utils.ts             # i18n utility functions
├── layouts/
│   ├── Layout.astro         # Base HTML layout with language support
│   └── BlogPost.astro       # Blog post layout with Typography
├── pages/
│   ├── index.astro          # Homepage with letter-style greeting
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
└── styles/
    └── global.css           # Design system + Typography config
```

### Design System Architecture

The design system is built around CSS custom properties and follows extreme minimalism principles:

**CSS Variables (`global.css`):**

- Color palette: 5 carefully chosen grays (`--color-text-primary` to `--color-border`)
- Typography: Inter (sans-serif) + EB Garamond (serif) + Maple Mono (monospace) with 4 line-height scales
- No animations, shadows, or decorative elements

**Layout Patterns:**

- Fixed content width: `max-w-2xl` (672px)
- Consistent vertical rhythm: 16-unit spacing (`mb-16`, `py-16`)
- Semantic HTML structure with `<header>`, `<section>`, `<nav>`

### Component Architecture

**Reusable Components:**

- **Link.astro**: Unified link component with responsive hover behavior. Mobile devices show permanent underlines for better touch accessibility, desktop shows underlines only on hover. Automatically detects external links for proper `target="_blank"` handling.
- **Button.astro**: Unified button component with TypeScript interfaces supporting primary/secondary variants and sm/md sizes. Maintains consistent hover states and responsive design without over-complex styling.
- **GitHubIcon.astro**: Accessible GitHub icon component with responsive opacity effects. Desktop shows 60% opacity by default, 100% on hover; mobile shows 100% opacity always. Includes proper ARIA labels and SVG titles for screen readers.
- **TimelineItem.astro**: Career timeline component with props for year, title, company, period, and description. Features enhanced visual hierarchy with timeline dots, emphasized year labels, and improved spacing. Year labels float to the left, company names are prominently displayed, and job descriptions have clear visual separation.
- **ProjectItem.astro**: Project display component leveraging Link and GitHubIcon components. Includes title, description, and optional GitHub repository access with consistent styling.
- **FormattedText.astro**: Handles dynamic text with link replacements, used for i18n content that contains inline links. Splits text by placeholders and renders appropriate Link components.
- **ResumeLayout.astro**: PDF-optimized resume layout component with high information density. Uses condensed typography (8.5pt base font, 1.15 line-height), tight margins (0.3in), and single-column layout to fit all content on one A4 page. Features inline GitHub links positioned after project titles for better visibility and optimized spacing for professional presentation.
- **PDFIndicator.astro**: PDF page indicator component with print functionality fallback. Features minimalist gray banner design with PDF icon, status message, manual print button, and internationalization support. Automatically attempts print on page load with manual button as fallback for production environments where auto-print is blocked by browser security policies.

**Component Design Principles:**

- All components use TypeScript interfaces for prop validation
- Responsive design with mobile-first accessibility considerations
- Consistent spacing and typography following the design system
- Smooth transitions (150ms duration) for hover effects without complex animations
- Proper accessibility attributes for screen readers and keyboard navigation
- Unified styling through component abstraction rather than global CSS

## Design Guidelines

### Core Philosophy

- **"Less, but better"**: Remove all non-essential visual elements
- **Letter-Like Experience**: Feels like reading beautifully written correspondence
- **Content-First**: UI should be nearly invisible, highlighting content
- **Natural Navigation**: No traditional website navigation; embedded within content flow
- **Static Elegance**: No animations, scroll effects, or dynamic elements

### Typography Hierarchy

- **Headlines**: EB Garamond serif, 4xl size, tight line-height (1.25)
- **Subheadings**: EB Garamond serif, 2xl size, tight line-height
- **Body Text**: Inter sans-serif, base size, relaxed line-height (1.65)
- **Meta Text**: Inter sans-serif, sm size, tertiary color

### Color Strategy

- **Primary Text**: `#1a1a1a` (near-black for headers)
- **Secondary Text**: `#4a4a4a` (body text)
- **Tertiary Text**: `#6b6b6b` (meta information)
- **Links**: `#000000` with font-weight 500 for visibility, subtle hover underline
- **Background**: Pure white `#ffffff`

### Spacing System

- **Page Padding**: `px-6 py-16` (24px horizontal, 64px vertical)
- **Section Spacing**: `mb-16` (64px between major sections)
- **Element Spacing**: `mb-4` to `mb-6` (16px-24px between related elements)

## Content Structure & Conventions

### Navigation Philosophy

The website uses a "letter-like" navigation approach that avoids traditional website elements:

**Letter-Style Navigation:**

- No header navigation bars (breaks the paper aesthetic)
- Navigation embedded naturally within content flow
- Footer signatures that provide return links
- Content feels like reading correspondence rather than browsing

### Page Templates

1. **Homepage (`index.astro`)**:
   - Natural greeting: "Hi, I'm Morris."
   - Conversational navigation embedded in prose
   - Letter-style signature at bottom

2. **Thoughts (`thoughts/index.astro`)**:
   - Clean article listing with dates and descriptions
   - Simple "Morris Liu" signature link back to home
   - No traditional breadcrumbs or back buttons

3. **Blog Posts (`layouts/BlogPost.astro`)**:
   - Author signature navigation at article end
   - "Thank you for reading" + natural return links
   - Feels like correspondence conclusion

4. **So Far (`so-far.astro` & `so-far/[lang].astro`)**:
   - Multi-language support via URL paths: `/so-far` (English) and `/so-far/zh` (Chinese)
   - Internal anchor navigation for sections (Work, Projects, Skills, Side, Contact)
   - Timeline-based Work section with continuous visual line
   - Enhanced Work Projects section with detailed technical achievements and interview-ready content
   - Component-based architecture using TimelineItem and ProjectItem
   - Rich professional content written in conversational tone with quantifiable results
   - Optimized visual hierarchy with consistent border styling (1px) and clear information structure
   - Letter-style signature return to home
   - Language toggle in top-right corner for easy switching
   - PDF download link integrated into content flow for traditional resume format

5. **PDF Resume (`so-far/pdf.astro` & `so-far/pdf/[lang].astro`)**:
   - Dedicated PDF-optimized layout using ResumeLayout component
   - PDFIndicator component with dual print strategy: automatic attempt + manual fallback button
   - High information density design fits all content on single A4 page
   - Condensed typography: 8.5pt base font, 1.15 line-height for readability
   - Tight margins (0.3in) and optimized spacing for professional presentation
   - Inline GitHub links for Personal Projects positioned after titles for better visibility
   - Multi-language support with internationalized print button text
   - Minimalist gray banner indicator hidden during print for clean output

6. **OG Image Generator (`og-generator.astro` & `og-preview.astro`)**:
   - Terminal aesthetic editor with `$ whoami` and `$ echo $PASSION` pattern
   - Real-time inline preview with contenteditable spans for name and tagline customization
   - Full-size (1200×630px) generation page with Canvas API-based image export
   - Hidden "easter egg" feature, not shown in navigation but accessible via direct URL
   - Preset tagline suggestions and reset functionality for user convenience
   - PNG format export optimized for social media platforms

### Code Style Conventions

- **Astro Components**: Use semantic HTML5 elements
- **CSS**: Prefer CSS custom properties over Tailwind for colors/fonts
- **Typography**: Mix Tailwind utilities with CSS variables for fine control
- **Spacing**: Use Tailwind's spacing scale consistently (mb-4, mb-6, mb-16)

### Link Design

**Enhanced Visibility:**

- Font-weight: 500 (medium bold) for all links
- Pure black color (#000000) for maximum contrast
- Subtle hover effects with underlines
- No backgrounds or decorative elements (maintains letter aesthetic)

**Philosophy:**

- Links should be immediately recognizable
- Maintain elegance while ensuring usability
- Avoid over-designed interactive elements

## Technical Implementation

### Build Configuration

**URL Structure:**
- `trailingSlash: "never"` - All URLs are clean without trailing slashes (e.g., `/thoughts`, `/so-far`)
- `build: { format: "file" }` - Generates `.html` files for better compatibility
- All internal links and redirects are consistent with this configuration

### Font Loading Strategy

- Fontsource for local font hosting (no external CDN)
- Variable fonts for Inter (100-900) and EB Garamond (400-800) provide full weight ranges
- Fixed weight for Maple Mono 400 (monospace terminal aesthetic)
- Fonts imported in `global.css` for better control
- Fallback fonts specified in CSS variables
- Font smoothing enabled for better rendering

### CSS Architecture

- Global styles in `src/styles/global.css`
- Design tokens as CSS custom properties
- Tailwind v4 with @theme syntax for custom design tokens
- Tailwind Typography plugin for Markdown content
- Custom overrides for minimalist aesthetic

### Blog System (Content Collections)

- **Content Storage**: Markdown files in `src/content/blog/`
- **Collections Config**: `src/content/config.ts` with TypeScript schema validation
- **Blog Layout**: `src/layouts/BlogPost.astro` with custom prose styling
- **Dynamic Routing**: `src/pages/thoughts/[...slug].astro` for individual posts
- **Index Page**: `src/pages/thoughts/index.astro` lists all published posts

### Writing Blog Posts

1. Create `.md` files in `src/content/blog/`
2. Required frontmatter:
   ```yaml
   ---
   title: "Post Title"
   description: "Brief description"
   pubDate: 2025-01-15
   tags: ["tag1", "tag2"]
   draft: false
   ---
   ```
3. Posts automatically appear in `/thoughts` when `draft: false`
4. Support for updated dates, tags, and featured posts

### Current Blog Content

**Featured Posts:**

- **"Why I Built Sealbox"**: Technical deep-dive into building a Rust-based secret management service, covering enterprise tool complexity and the "90% solution" philosophy
- **"Building Kira: An AI-Native Second Brain"**: Product vision for an AI assistant focused on context capture and thought amplification, contrasting with traditional note-taking tools

**Content Strategy:**

- Technical posts focus on real projects and actual implementation challenges
- Personal posts explore product philosophy and design decisions
- All posts avoid redundant H1 titles (handled by layout)
- Conversational tone with technical depth

### Prose Styling System

The blog uses Tailwind Typography plugin with custom overrides for minimalist design:

**Typography Plugin Configuration:**

- Base: `prose prose-lg prose-gray max-w-none` classes
- Custom CSS variables in `@theme` block for consistent theming
- Typography color tokens map to our design system colors

**Custom Overrides (in `global.css`):**

- **Headings**: EB Garamond serif, weight 500 (not default 600-800)
- **Body text**: Inter sans-serif for better readability
- **Strong/Bold**: Weight 500 instead of 600 for subtlety
- **Blockquotes**: Removed smart quotes for cleaner look
- **Code blocks**: Light gray theme (#f8f9fa) with subtle borders

**Code Styling:**

- **Inline code**: Light background, subtle border, no backticks
- **Code blocks**: Astro's Shiki with 'github-light' theme
- **Consistent borders**: 1px solid #e9ecef across all code elements

**Design Principles:**

- Leverages Tailwind Typography for robust defaults
- Minimal custom CSS for maintainability
- Typography plugin handles responsive scaling
- Custom overrides ensure minimalist aesthetic

## Content Guidelines

### Writing Style

- **Conversational tone**: Write as if talking to a friend over coffee
- **Technical without jargon**: Explain complex concepts simply
- **Personal touch**: Include personality and humor where appropriate
- **Honesty**: Authentic experiences and genuine perspectives
- **Brevity**: Respect the reader's time

### About Page Content Structure

The "So Far" page follows this content philosophy:

- **Work**: Professional experience with human context and real impact, timeline-based presentation
- **Projects**: Split into Work Projects and Personal Projects with technical depth and quantifiable achievements
- **Skills**: Technical abilities explained with personality and philosophy
- **Side**: Personal interests that show the human behind the code
- **Contact**: Approachable and genuine ways to connect

### Work Projects Content Strategy

The Work Projects section is optimized for technical interviews and showcases:

**Technical Depth Examples:**

- **X-Elephant**: RAG system optimization (100GB+ → 10GB memory reduction), Qdrant cluster architecture, custom Rust tooling, automated Shopify data pipeline
- **EverCraft**: SaaS version control system for CAD workflows, Git-inspired architecture, fractal3D integration
- **EverCraft Lite**: Desktop application built with Tauri and Rust, incubated from enterprise solution
- **fractal3D**: 3D visualization engine with team leadership experience

**Interview-Ready Format:**

- Quantifiable achievements and technical metrics
- Specific technology stacks and architectural decisions
- Problem-solving narratives with concrete solutions
- Leadership and team management examples
- Clear project evolution and business impact

### OG Image Generation System

The website includes a custom OG (Open Graph) image generation tool that creates social media preview images with a terminal aesthetic:

**Core Features:**

- **Terminal Design**: Uses `$ whoami` / `Morris Liu` / `$ echo $PASSION` / `[custom tagline]` pattern
- **Real-time Editor**: Inline preview (600×315px) with contenteditable text spans
- **Full-size Export**: 1200×630px PNG generation using native Canvas API
- **Typography**: Maple Mono monospace font for authentic terminal look
- **Easter Egg Integration**: Hidden feature accessible via `/og-generator` (not in main navigation)
- **Terminal Boot Animation**: First-time visitors see a cinematic terminal startup sequence with ASCII art logo, congratulations message, and typewriter effects

**Technical Implementation:**

**`src/pages/og-generator.astro`:**

- Editor page with inline preview at 50% scale (600×315px)
- Contenteditable spans with `data-original` attributes for reset functionality
- Preset tagline suggestions with click-to-apply functionality
- Button component integration for consistent UI
- URL parameter generation for seamless transition to full-size preview
- Terminal boot animation overlay with localStorage-based first-visit detection
- ASCII art logo with non-breaking spaces for precise alignment
- Typewriter effect with character-by-character rendering (50ms intervals)
- 4-second countdown with skip functionality via keyboard/mouse input

**`src/pages/og-preview.astro`:**

- Full-size (1200×630px) preview and download page
- Canvas API-based image generation reading actual DOM computed styles
- Font loading synchronization with `document.fonts.ready`
- PNG export with proper filename and download trigger
- Fixed positioning with return navigation

**`src/scripts/og-utils.ts`:**

- Shared utilities for font loading (`waitForFonts()`)
- Canvas generation (`generateOGImage()`) with pixel-perfect DOM to canvas conversion
- Download handling (`downloadCanvas()`) with proper filename generation
- Text extraction (`getElementText()`) with fallback support
- `initTerminalBootAnimation()`: Functional approach to terminal boot animation with state management
- `initOGGeneratorEditor()`: Functional approach to editor controls (generate, reset, tagline suggestions, editable text)

**Key Technical Decisions:**

- **Canvas over html2canvas**: Native Canvas API avoids `oklch()` color function compatibility issues
- **Style Reading**: Uses `getComputedStyle()` and `getBoundingClientRect()` for accurate positioning
- **Font Synchronization**: `document.fonts.ready` ensures Maple Mono loads before image generation
- **TypeScript Safety**: Full error handling with proper type guards and null checks
- **Responsive Design**: Separate scaling for editor (50%) and full-size (100%) views
- **Animation Architecture**: Inline scripts with `is:inline` for immediate execution, preventing flash-of-unstyled-content
- **First-Visit Detection**: localStorage-based approach avoids server-side storage while maintaining privacy
- **Performance Optimization**: CSS pseudo-elements for cursor animation, preventing text flicker during typewriter effect
- **Code Organization**: Functional programming approach in `og-utils.ts` with pure functions and state management for better maintainability

**Usage Workflow:**

1. Navigate to `/og-generator` (easter egg URL)
2. **First-time visitors**: Experience cinematic terminal boot sequence with ASCII logo and congratulations message (press any key to skip)
3. Click on text in preview to edit name and tagline
4. Select from preset tagline suggestions or create custom
5. Click "Generate full size" to open 1200×630px version
6. Click "Save as PNG" to download high-quality image
7. Use downloaded image as social media preview

### Development Notes

- TypeScript configured with Astro's strict preset
- Content Collections provide type safety for blog posts
- VS Code extension recommendations include `astro-build.astro-vscode`
- No build tools beyond Astro's defaults
- Static site generation (SSG) for optimal performance

## Code Quality & Formatting

### Prettier Configuration

The project uses Prettier for consistent code formatting with the following configuration:

- **Indentation**: 2 spaces (no tabs)
- **Line width**: 100 characters
- **Quotes**: Double quotes
- **Semicolons**: Always required
- **Trailing commas**: ES5 compatible
- **Plugins**: `prettier-plugin-astro` and `prettier-plugin-tailwindcss`

**Key Files:**

- `.prettierrc` - Main configuration
- `.prettierignore` - Excludes build outputs, dependencies, and binary files

**Usage:**

- `pnpm prettier --write .` - Format all files
- Supports Astro components and Tailwind class sorting

### Code Style Conventions

- **Astro Components**: Use semantic HTML5 elements with TypeScript interfaces for props
- **CSS**: Prefer CSS custom properties over Tailwind for colors/fonts
- **Typography**: Mix Tailwind utilities with CSS variables for fine control
- **Spacing**: Use Tailwind's spacing scale consistently (mb-4, mb-6, mb-16)
- **Components**: Always define TypeScript interfaces for component props

## SEO & Performance Optimization

### Search Engine Optimization (Comprehensive Implementation)

The website features professional-grade SEO optimization for maximum discoverability and search rankings:

**Meta Tags & Social Media:**

- Complete Open Graph and Twitter Card implementation
- Dynamic meta descriptions for each page
- Canonical URLs for proper indexing
- Article-specific metadata for blog posts (publish dates, tags, author)

**Structured Data (JSON-LD):**

- Person schema for homepage and profile pages
- BlogPosting schema for individual articles
- Rich snippets with author, publication dates, and content descriptions
- Schema.org markup for enhanced search results

**Technical SEO:**

- XML sitemap automatically generated via `@astrojs/sitemap`
- SEO-optimized robots.txt with crawl guidelines
- Proper HTML semantic structure with heading hierarchy
- Clean URL structure (`/thoughts/post-name/`)

**Keywords & Content:**

- Strategic keyword placement for software engineering, Rust, TypeScript, AI infrastructure
- Content-first approach with technical depth and personal insights
- Regular content updates with publication dates

### Performance & Caching

**Static Optimization:**

- All pages pre-generated at build time (SSG)
- Minimal JavaScript footprint
- Optimized font loading with Fontsource local hosting (only necessary weights)
- CSS custom properties for faster style application
- Image optimization with Sharp service configured

**Asset Optimization:**

- Long-term caching for static assets (1 year)
- Short-term caching for HTML content (1 hour)
- Proper MIME type configuration
- Font files optimized with woff2 format

**Security Best Practices:**

- Never use `set:html` without proper sanitization
- All user-generated content should be escaped
- TypeScript interfaces for component prop validation
- Constant strings for frequently used styles to avoid runtime recreation

## Deployment & Hosting

### Cloudflare Pages Configuration

The website is optimized for deployment on Cloudflare Pages with the following configuration:

**Build Settings:**

- Framework: Astro
- Build command: `pnpm build`
- Build output directory: `dist`
- Node.js version: 18 (specified in `.nvmrc`)

**Optimization Files:**

**`public/_headers`:**

- Security headers (XSS protection, content type sniffing prevention)
- Long-term caching for static assets (CSS, JS, fonts, images)
- Short-term caching for HTML and XML files
- Proper MIME type configuration

**`public/_redirects`:**

- SEO-friendly URL redirects (`/blog/*` → `/thoughts/*`)
- Social media shortlinks (`/github`, `/twitter`)
- Project quick access (`/sealbox` → GitHub repository)
- Legacy URL support for better user experience

**Cloudflare Pages Benefits:**

- Global CDN with 200+ data centers
- Automatic HTTPS with free SSL certificates
- Git integration for automatic deployments
- Preview deployments for every pull request
- Custom domain support with DNS management

### Performance Features

**Caching Strategy:**

- Static assets: 1 year cache with immutable headers
- HTML files: 1 hour cache for fresh content
- Sitemap/robots: 24 hour cache for SEO tools
- Font files: Long-term caching with cross-origin headers

**Security Headers:**

- X-Frame-Options: DENY (prevent clickjacking)
- X-Content-Type-Options: nosniff (prevent MIME sniffing)
- X-XSS-Protection: 1; mode=block (XSS protection)
- Referrer-Policy: strict-origin-when-cross-origin (privacy)
- Permissions-Policy: camera=(), microphone=(), geolocation=() (API restrictions)

### Monitoring & Analytics

**Built-in Monitoring:**

- Cloudflare Pages analytics for traffic and performance
- Core Web Vitals tracking through Cloudflare
- Build and deployment status monitoring
- Error tracking and alerting

**SEO Monitoring:**

- XML sitemap submission to Google Search Console
- Structured data validation
- Page speed insights monitoring
- Search ranking and keyword tracking

## Internationalization (i18n)

### Architecture

The website implements server-side i18n using Astro's static site generation:

**Translation Files:**

- `src/i18n/translations/en.json` - English translations
- `src/i18n/translations/zh.json` - Chinese translations
- Structured JSON with nested keys for easy maintenance
- Work project details use simple string arrays for better maintainability (e.g., `["RAG Optimization: Built...", "Data Pipeline: Automated..."]`)
- Skills section uses `stack` and `philosophy` structure for better visual hierarchy
- Personal project links use `readMoreLink` object with text, href, linkText, and optional suffix
- Contact section uses structured objects for clean link rendering without FormattedText overhead
- PDF section includes `printButton` and `printButtonHint` for internationalized print functionality

**Utility Functions (`src/i18n/utils.ts`):**

- `getTranslations(lang)` - Returns translations for specified language
- `getLanguageFromPath(pathname)` - Extracts language from URL pathname
- `createLangSwitchUrl(targetLang, hash)` - Generates language switch URLs with hash support
- `getHtmlLangAttribute(lang)` - Returns proper HTML lang attribute

**URL Structure:**

- English (default): `/so-far`
- Chinese: `/so-far/zh`
- Other pages remain English-only for now

**Implementation Details:**

- Server-side rendering for better performance and SEO
- No client-side JavaScript for language switching
- Proper `lang` attribute on HTML element
- Language switching preserves current page anchor/hash for better UX
- FormattedText component for complex inline links (Side section)
- Direct link rendering for simple contact links (optimized approach)

### Adding New Languages

1. Create new translation file: `src/i18n/translations/[lang].json`
2. Copy structure from `en.json` and translate content
3. Update `getStaticPaths()` in `[lang].astro` to include new language
4. Add language option to language toggle component

### Best Practices

- Keep translation keys consistent across all language files
- Use placeholders (`{name}`) for dynamic content within translations
- Maintain same JSON structure in all translation files
- Test all language versions during development
- Use structured objects for complex content (skills with stack/philosophy, readMoreLink objects)
- Standardize time period formats: English uses "Month YYYY - Month YYYY", Chinese uses "YYYY年 X月 - YYYY年 X月"
- Maintain consistent company naming across languages for professional consistency

## Project Dependencies

### Core Dependencies

- **Astro** (^5.11.2): Static site generator and framework
- **@astrojs/rss** (^4.0.12): RSS feed generation for blog
- **@astrojs/sitemap** (^3.4.1): Automatic XML sitemap generation
- **Tailwind CSS** (^4.1.11): Utility-first CSS framework
- **@tailwindcss/vite** (^4.1.11): Vite integration for Tailwind
- **@fontsource-variable/inter** (^5.2.6): Inter Variable font family local hosting
- **@fontsource-variable/eb-garamond** (^5.2.6): EB Garamond Variable font family local hosting
- **@fontsource/maple-mono** (^5.2.6): Maple Mono monospace font for terminal aesthetic

### Development Dependencies

- **@tailwindcss/typography** (^0.5.16): Typography plugin for markdown content
- **Prettier** (3.6.2): Code formatting with 2-space indentation
- **prettier-plugin-astro** (0.14.1): Astro component formatting
- **prettier-plugin-tailwindcss** (0.6.14): Tailwind class sorting

### Dependency Strategy

- Minimal dependency footprint for better security and performance
- Local font hosting to reduce external requests and improve loading speed
- Development-only dependencies for code quality without runtime overhead
- Version pinning for reproducible builds across environments
