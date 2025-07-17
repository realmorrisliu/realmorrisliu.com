# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command         | Action                                      |
|----------------|--------------------------------------------|
| `pnpm dev`     | Starts local dev server at `localhost:4321` |
| `pnpm build`   | Build production site to `./dist/`         |
| `pnpm preview` | Preview build locally before deploying     |

## Project Structure

- `public/`: Static assets
- `src/`: Source code
  - `assets/`: Images and SVGs
  - `components/`: Reusable components
  - `layouts/`: Layout templates
  - `pages/`: Page components

## Design Guidelines

- **Minimalism**: Remove all non-essential visual elements ("Less, but better").
- **Content-First**: Prioritize content visibility with nearly invisible UI.
- **Paper-Like**: Emulate a well-typeset paper letter with rhythm, whitespace, and breathing room.
  - Use human-readable date formats (e.g., "June 15, 2025")
  - Subtle hover effects for links (underline + color darkening)
- **Layout**: Single-page editorial style, fixed width (640px - 800px).
- **Typography**: 
  - Neutral serif/sans-serif fonts (Inter, IBM Plex, EB Garamond)
  - Subtle hierarchy: Medium weight for headings, Normal for body text
  - Relaxed line spacing for readability
- **Color**: Monochrome (black/white/gray) with minimal accent colors.
- **Experience**: Static, immersive, reading-friendly (no animations or distractions).

## Content Structure

1. **Homepage**:
   - Concise opening line (e.g., "Hi, I'm Morris. I write code, design systems, and play bass.")
   - Current status (e.g., "Currently building Sealbox.")
   - Text-only navigation links ("Thoughts", "So Far")

2. **Thoughts**:
   - Time-based/thematic article list (minimal decoration)
   - Pure content pages with rich typography (prose)
   - Example titles: "Why I Built Sealbox", "Rust Type-Driven APIs"

3. **So Far**:
   - Modular sections: Work, Skills, Projects, Side, Contact
   - Text-only presentation (no buttons/icons)
   - Example: "/so-far#projects" anchor links

## Technical Stack

- **Framework**: Astro with Tailwind CSS integration
- **Config**:
  - `astro.config.mjs` enables Tailwind plugin
  - No animations/scroll effects (static experience)
- **Implementation Details**:
  - Typography: Uses `leading-relaxed` for better readability
  - Links: Hover states with `hover:underline` and subtle color change
  - Dates: Human-readable format (e.g., "June 15, 2025")
