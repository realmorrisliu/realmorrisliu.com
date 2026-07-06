---
name: realmorrisliu.com
description: A precise, letter-like personal site for systems work, writing, resume context, and current focus.
colors:
  ink: "#1a1a1a"
  link-ink: "#000000"
  body-muted: "#4a4a4a"
  quiet-muted: "#6b6b6b"
  background: "#ffffff"
  border-hairline: "#e5e5e5"
  code-surface: "#f8f9fa"
  code-border: "#e9ecef"
  tag-surface: "#f9fafb"
  tag-hover: "#f3f4f6"
  rule-strong: "#d1d5db"
  photo-night: "#09090b"
typography:
  display:
    fontFamily: "EB Garamond Variable, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "EB Garamond Variable, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "EB Garamond Variable, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Inter Variable, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body-large:
    fontFamily: "Inter Variable, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Inter Variable, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  mono-label:
    fontFamily: "Maple Mono, SF Mono, Monaco, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  sm: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "64px"
  signature: "96px"
components:
  button-primary:
    backgroundColor: "{colors.link-ink}"
    textColor: "{colors.background}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.body-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  link-inline:
    textColor: "{colors.link-ink}"
    typography: "{typography.body}"
  tag-chip:
    backgroundColor: "{colors.tag-surface}"
    textColor: "{colors.quiet-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 4px"
  tooltip-inline-note:
    backgroundColor: "{colors.background}"
    textColor: "{colors.body-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
---

# Design System: realmorrisliu.com

## 1. Overview

**Creative North Star: "The Systems Letter"**

The visual system should feel like a carefully written technical letter: quiet enough for long
reading, exact enough for credibility, and personal enough that the author remains visible. The
default page is a narrow column, not a marketing shell. Typography and spacing do most of the work;
links, dates, rules, and tags provide orientation without creating chrome.

The site is intentionally monochrome and restrained, but the restraint must not become unfinished.
Hierarchy comes from serif headings, measured spacing, clear text contrast, and real artifacts:
posts, current status, resume entries, projects, and photography. The `moments` surface is the main
exception: photography may use deeper backgrounds, overlays, shadows, and slower motion because the
image is the artifact.

The system rejects SaaS landing-page cliches, repeated feature-card grids, gradient text,
all-purpose AI/productivity aesthetics, conversion-heavy calls to action, maximalist portfolio
effects, decorative glassmorphism, generic editorial affectation, and template-generated section
grammar.

**Key Characteristics:**

- Narrow reading column with generous vertical rhythm.
- Serif headings paired with sans body text and sparse mono metadata.
- Black and neutral gray palette with no decorative accent color.
- Flat content surfaces; borders and rules carry structure.
- Photography is allowed a distinct, immersive treatment.

## 2. Colors

The palette is a restrained monochrome system: black is the voice, grays are editorial pacing, and
white is the working surface.

### Primary

- **Letter Ink**: The deepest action and link color. Use for inline links, primary buttons, and
  moments when the interface needs a decisive black.
- **Reading Ink**: The primary text color. Use for headings, important metadata, author signatures,
  and body text that needs maximum authority without pure-black harshness.

### Neutral

- **Body Muted**: The default long-form support color. Use for paragraphs, summaries, descriptions,
  and explanatory text.
- **Quiet Muted**: The tertiary text color. Use for dates, metadata, hints, archive descriptions,
  and low-emphasis labels.
- **White Page**: The default background. It should stay true white, not cream, sand, or warm paper.
- **Hairline Rule**: The standard divider and border color. Use for section rules, prose borders,
  tooltips, and structural separators.
- **Code Surface**: The light code-block background for prose. It exists only inside technical
  writing and should not become a general card background.
- **Code Border**: The prose code-block and inline-code border.
- **Tag Wash**: The quiet chip surface for tags.
- **Tag Hover**: The slightly stronger chip hover surface.
- **Strong Rule**: A stronger divider for article lists and timelines when `Hairline Rule` is too
  light.
- **Photo Night**: The near-black immersive background for the photography lightbox.

### Named Rules

**The True White Rule.** The body background stays white. Do not tint it into cream, sand, ivory, or
warm paper to manufacture personality.

**The No Accent Rule.** Do not add a brand accent color casually. If a future section needs color,
it must be tied to a real artifact such as photography, code output, or a specific project object.

## 3. Typography

**Display Font:** EB Garamond Variable (with Georgia fallback)  
**Body Font:** Inter Variable (with system sans fallback)  
**Label/Mono Font:** Maple Mono (with SF Mono, Monaco, Consolas fallback)

**Character:** The pairing is literary but not precious: serif headings make pages feel like
letters, Inter keeps technical reading steady, and Maple Mono appears only where metadata or tooling
needs a mechanical signal.

### Hierarchy

- **Display** (400, 3rem to 4.5rem on large photography pages, tight line-height): For the
  `moments` heading and rare high-emphasis page titles only.
- **Headline** (400, 2.25rem, 1.25 line-height): The main page title scale for homepage, thoughts,
  now, archive, and resume surfaces.
- **Title** (400, 1.5rem, 1.25 line-height): Article list titles, section headings, and major resume
  subsections.
- **Body** (400, 1rem, 1.65 line-height): Default prose and supporting descriptions. Keep line
  length near the existing `max-w-2xl` column, roughly 65 to 75 characters.
- **Body Large** (400, 1.125rem, 1.65 line-height): Homepage introduction, thoughts lead copy, and
  current now-page prose.
- **Label** (500, 0.875rem, normal letter-spacing): Links, dates, language switchers, buttons, and
  concise metadata.
- **Mono Label** (400, 0.75rem to 0.875rem, wider tracking only in photography metadata): Camera
  settings, generated OG tooling, and rare technical readouts.

### Named Rules

**The Letter First Rule.** Serif headings are calm and direct. Do not use italic display flourishes,
drop caps, or magazine-like theatrics unless the content is explicitly a designed editorial piece.

**The Mono Is Evidence Rule.** Monospace is for code, camera metadata, PDF tooling, and terminal-like
interfaces. Never use mono as a generic shortcut for "technical."

## 4. Elevation

The default site is flat. Depth is created by white space, typography, and one-pixel rules. Shadows
are reserved for photography, generated-image previews, and temporary tool surfaces where an object
needs to separate from the page.

### Shadow Vocabulary

- **Photo Rest** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.05)`): The resting image tile shadow in the
  moments masonry grid.
- **Photo Hover** (`box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)`):
  The hover elevation for photography tiles.
- **Lightbox Image** (`box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)`): The immersive photo viewer
  image shadow.

### Named Rules

**The Flat Manuscript Rule.** Content pages do not use decorative cards or ambient shadows. If a
surface is not an image, preview, tooltip, or modal-like object, it should be flat.

## 5. Components

### Buttons

Buttons are utilitarian controls, mainly used by the resume PDF surface and tooling pages.

- **Shape:** Square-edged by default (0px radius).
- **Primary:** Black background with white text, medium-weight sans label, and compact padding
  (8px 16px).
- **Hover / Focus:** Hover reduces opacity; focus should keep the native outline or an equivalent
  visible focus ring.
- **Secondary:** White background, gray text, one-pixel gray border, compact padding (8px 16px).

### Chips

Tags are quiet metadata, not colorful badges.

- **Style:** Light gray surface, tertiary text, small sans label, and 4px corner radius.
- **State:** Interactive tags move only one step darker on hover and shift text from tertiary to
  secondary.

### Cards / Containers

The main content system avoids cards. Repeated content is separated by spacing and thin rules rather
than framed boxes.

- **Corner Style:** Square by default; small 4px radius is allowed only for chips and inline code.
- **Background:** White for content, `Code Surface` only for code, `Tag Wash` only for chips.
- **Shadow Strategy:** Flat by default; photography is the only recurring lifted surface.
- **Border:** One-pixel neutral rules are allowed. Colored side-stripes are prohibited for new work.
- **Internal Padding:** Use page padding (24px horizontal) and content spacing rather than nested
  card padding.

### Inputs / Fields

The public site has no general form field system. Editable text exists only in the OG generator and
should stay tool-like: inline, compact, and focused by subtle gray background plus a one-pixel ring.

### Navigation

Navigation is embedded in the content flow. Homepage links appear in prose, resume navigation is a
small inline row, and footers return readers to the previous surface. Avoid persistent marketing
headers unless a future surface has a real navigation problem.

### Signature Component: Inline Note Tooltip

Inline notes are small, precise annotations. The trigger uses a dashed underline in tertiary text;
the tooltip is white with a one-pixel hairline border, compact 8px by 4px padding, and a 150ms
opacity transition.

### Signature Component: Moments Photo Tile

Photo tiles are the one place where the site becomes immersive. Tiles use a masonry column layout,
real images, a slow 700ms image scale, a black gradient metadata overlay, and a dark lightbox with
blurred backdrop.

## 6. Do's and Don'ts

### Do:

- **Do** keep the page column narrow (`max-w-2xl`) for writing and resume surfaces.
- **Do** use serif headings and sans body text to preserve the letter-like rhythm.
- **Do** use real artifacts: posts, projects, resume entries, current work, and moments.
- **Do** use one-pixel rules and generous spacing for structure.
- **Do** preserve strong contrast for primary, secondary, and tertiary text.
- **Do** let photography use shadows, overlays, and slower motion when the image is the focus.

### Don't:

- **Don't** turn the site into a SaaS landing page with hero metrics, repeated feature-card grids,
  gradient text, all-purpose AI/productivity aesthetics, or conversion-heavy calls to action.
- **Don't** make it a maximalist portfolio that competes with the writing.
- **Don't** use generic editorial affectation for its own sake: italic display drama, drop caps,
  repeated tiny uppercase section labels, or broadsheet grid gestures.
- **Don't** add decorative glassmorphism.
- **Don't** use colored side-stripe borders or `border-left` greater than 1px as a new callout
  pattern.
- **Don't** create template-generated card grids when spacing, headings, and rules can carry the
  structure.
