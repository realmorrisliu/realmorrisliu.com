# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command         | Action                                      |
|----------------|--------------------------------------------|
| `pnpm dev`     | Starts local dev server at `localhost:4321` |
| `pnpm build`   | Build production site to `./dist/`         |
| `pnpm preview` | Preview build locally before deploying     |

## Project Architecture

This is a minimalist personal website built with Astro and Tailwind CSS, implementing a letter-like aesthetic that feels like reading beautifully written correspondence rather than browsing a traditional website.

### Core Structure
```
src/
├── content/
│   └── blog/                # Markdown blog posts
├── layouts/
│   ├── Layout.astro         # Base HTML layout
│   └── BlogPost.astro       # Blog post layout with Typography
├── pages/
│   ├── index.astro          # Homepage with intro + navigation
│   ├── thoughts/
│   │   ├── index.astro      # Blog listing page
│   │   └── [...slug].astro  # Dynamic blog post routes
│   └── so-far.astro         # Resume/about sections
└── styles/
    └── global.css           # Design system + Typography config
```

### Design System Architecture

The design system is built around CSS custom properties and follows extreme minimalism principles:

**CSS Variables (`global.css`):**
- Color palette: 5 carefully chosen grays (`--color-text-primary` to `--color-border`)
- Typography: Inter (sans-serif) + EB Garamond (serif) with 4 line-height scales
- No animations, shadows, or decorative elements

**Layout Patterns:**
- Fixed content width: `max-w-2xl` (672px)
- Consistent vertical rhythm: 16-unit spacing (`mb-16`, `py-16`)
- Semantic HTML structure with `<header>`, `<section>`, `<nav>`

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

4. **So Far (`so-far.astro`)**:
   - Internal anchor navigation for sections (Work, Skills, Projects, Side, Contact)
   - Rich professional content written in conversational tone
   - Real work experience, technical skills, and personal projects
   - Personal touch with music interests and philosophy
   - Letter-style signature return to home

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

### Font Loading Strategy
- Fontsource for local font hosting (no external CDN)
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
- **Work**: Professional experience with human context and real impact
- **Skills**: Technical abilities explained with personality and philosophy
- **Projects**: Real projects with honest descriptions and purpose
- **Side**: Personal interests that show the human behind the code
- **Contact**: Approachable and genuine ways to connect

### Development Notes
- TypeScript configured with Astro's strict preset
- Content Collections provide type safety for blog posts
- VS Code extension recommendations include `astro-build.astro-vscode`
- No build tools beyond Astro's defaults
- Static site generation (SSG) for optimal performance