# Now Page Style Guide

## Source Pattern

Canonical examples live in `src/content/now/*.md`. Recent entries use:

- `summary`: one compact paragraph, usually 35-90 words, naming the core month arc and major concrete updates.
- `lastUpdated`: quoted ISO date, usually the actual publication/update day.
- `title`: always `"Now"`.
- `description`: one sentence beginning with `What I'm focused on right now:` when possible.
- Body: 3-6 `##` sections, each 2-5 paragraphs.

Filename format is `YYYY-MM.md`, matching the month represented by the page.

## Voice

Write in first-person English. The voice is direct, reflective, and concrete. It is comfortable naming ambition, anxiety, grief, uncertainty, and pride without over-explaining them.

Good moves:

- Start sections with a concrete fact, date, or change.
- Use bold for important names, products, dates, and emotional anchors.
- Let unresolved situations remain unresolved.
- Say when a project died, paused, crossed a line, or changed meaning.
- Connect technical work to personal conviction: why this layer matters, why the work feels right or wrong.
- Use short concluding sentences when the emotion is simple: `I'm just sad.` / `The work continues.`

Avoid:

- Corporate phrasing: leverage, empower, alignment, ecosystem, transformation, execution excellence.
- Generic self-help language unless the user actually said it.
- Overly neat lessons, fake closure, or inspirational endings.
- Long architecture explanations that crowd out the human meaning.
- Making every section follow the same template.

## Common Section Shapes

Use these as patterns, not mandatory headings:

- A life transition: job change, move, birthday, health, family, routine.
- A work milestone: what changed in the company or project, what the user's role became, why it matters.
- A hard personal section: grief, anxiety, frustration, uncertainty, comparison, burnout.
- A side project section: Alan, openrouter-rs, Kira, Sealbox, Founders Fight Club, music, games, cycling.
- A decision section: killing, pausing, restarting, narrowing, or going all-in.
- A closing section: `What's Next`, or a more specific heading if the next month has a clear theme.

## Rhythm

Most sections follow this rhythm:

1. What happened.
2. What changed because of it.
3. Why it matters personally.
4. What remains unresolved or comes next.

Keep paragraphs medium length. A single blunt sentence is useful when it carries emotional weight.

## Frontmatter Guidance

`summary` should read like an archive card: specific enough to distinguish this month from nearby months.

`description` should be SEO-friendly but still personal. Prefer:

```yaml
description: "What I'm focused on right now: building spreadsheets for agents at DreamNum, pushing Alan toward SWE-bench and Terminal-Bench, and continuing openrouter-rs 0.8.x."
```

Avoid vague descriptions such as:

```yaml
description: "Monthly update about my current projects and life."
```
