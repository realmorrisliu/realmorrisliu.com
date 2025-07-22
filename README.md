# realmorrisliu.com

My personal website built with Astro and designed around the philosophy of "less, but better." A minimalist, letter-like experience that feels more like reading beautifully written correspondence than browsing a traditional website.

🌐 **Live Site**: [realmorrisliu.com](https://realmorrisliu.com)

## ✨ Design Philosophy

- **"Less, but better"**: Remove all non-essential visual elements
- **Letter-like Experience**: Feels like reading beautifully written correspondence
- **Content-First**: UI should be nearly invisible, highlighting content
- **Natural Navigation**: No traditional website navigation; embedded within content flow
- **Static Elegance**: No animations, scroll effects, or dynamic elements

## 🏗️ Architecture

Built with modern web technologies for optimal performance and maintainability:

```text
src/
├── content/
│   └── blog/                # Markdown blog posts with Content Collections
├── components/
│   ├── Link.astro           # Unified link component with responsive hover
│   ├── GitHubIcon.astro     # Accessible GitHub icon with opacity effects
│   ├── ProjectItem.astro    # Reusable project display component
│   └── TimelineItem.astro   # Career timeline component
├── layouts/
│   ├── Layout.astro         # Base HTML layout
│   └── BlogPost.astro       # Blog post layout with Typography
├── pages/
│   ├── index.astro          # Homepage with letter-style greeting
│   ├── so-far.astro         # Professional experience and projects
│   └── thoughts/
│       ├── index.astro      # Blog listing page
│       └── [...slug].astro  # Dynamic blog post routes
└── styles/
    └── global.css           # Design system + Typography config
```

## 🎨 Tech Stack

- **Framework**: [Astro](https://astro.build) for static site generation
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with custom design tokens
- **Typography**: [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin) for markdown content
- **Fonts**: [Fontsource](https://fontsource.org) (Inter + EB Garamond)
- **Content**: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) for type-safe blog posts
- **Code Quality**: [Prettier](https://prettier.io) with Astro and Tailwind plugins

## 🧞 Commands

All commands are run from the root of the project:

| Command         | Action                                     |
| --------------- | ------------------------------------------ |
| `pnpm install`  | Install dependencies                       |
| `pnpm dev`      | Start local dev server at `localhost:4321` |
| `pnpm build`    | Build production site to `./dist/`         |
| `pnpm preview`  | Preview build locally before deploying     |
| `pnpm prettier` | Format all files with Prettier             |

## 📝 Key Features

- **Letter-style Navigation**: No traditional header bars; navigation naturally embedded in content
- **Three-layer Content Architecture**: Homepage intro → Thoughts (blog) → So Far (about/resume)
- **Component-based Timeline**: Reusable TimelineItem and ProjectItem components
- **Unified Link System**: Responsive Link component with mobile underlines and desktop hover effects
- **Accessible Interactions**: GitHubIcon with proper ARIA labels and responsive opacity transitions
- **Enhanced Link Visibility**: Font-weight 500 links for better usability while maintaining elegance
- **Responsive Typography**: Carefully tuned type scales and line heights for optimal readability

## 📄 Content Structure

- **Homepage**: Natural greeting with conversational navigation
- **Thoughts**: Blog with featured posts and clean chronological listing
- **So Far**: Professional timeline, projects, skills, and personal interests
- **Individual Posts**: Focused reading experience with return navigation

See `CLAUDE.md` for detailed development guidelines and design system documentation.

## 🚀 Development

This site prioritizes simplicity and maintainability:

- **No complex build processes**: Standard Astro with minimal configuration
- **Component-driven**: Reusable components for consistent design patterns
- **Type-safe content**: Content Collections ensure blog post schema validation
- **Design system**: CSS custom properties for consistent theming
- **Performance-first**: Static generation for optimal loading speeds

For detailed architectural decisions and content guidelines, refer to the comprehensive documentation in `CLAUDE.md`.
