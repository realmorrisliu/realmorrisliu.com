---
name: write-now-page
description: Use when drafting, creating, updating, or polishing a monthly Now page for realmorrisliu.com, especially files under src/content/now/*.md. Trigger when the user asks to write a new now page, summarize the past month, turn scattered personal/work updates into a Now entry, or keep the page consistent with existing Now page voice.
---

# Write Now Page

## Overview

Create monthly `Now` entries by interviewing the user first. The main job is to help the user remember what happened, find the month-level throughline, then draft an English page that matches the existing `src/content/now/*.md` voice.

Always read [references/style-guide.md](references/style-guide.md) before drafting. Use [references/interview-guide.md](references/interview-guide.md) for question prompts and follow-ups.

## Workflow

1. Inspect current context.

- Read the latest 2-3 files in `src/content/now/`.
- Read `src/content/config.ts` if frontmatter shape is uncertain.
- Identify the target month from the user request. If missing, ask for it.

2. Interview before drafting.

- Do not draft from a sparse prompt unless the user explicitly says to skip the interview.
- Ask one focused batch of 6-9 questions that helps the user recall concrete events.
- Ask interview questions in the user's current language; draft the final page in English.
- Accept rough bullets, fragments, Chinese notes, or mixed language answers.
- Include questions about work, life, side projects, emotional undercurrent, starts/stops, dates, links, and what is next.

3. Synthesize the material.

- Extract 3-6 section themes.
- Name the month-level arc in plain language.
- Ask follow-up questions only for gaps that would cause factual invention, weak emotional logic, or a missing conclusion.

4. Draft the page.

- Write in English first person.
- Generate complete frontmatter: `summary`, `lastUpdated`, `title`, and `description`.
- Use filename `src/content/now/YYYY-MM.md`.
- Keep headings natural and specific, not template labels unless they fit.
- Preserve uncertainty and unresolved feelings when the source material is unresolved.

5. Update the repo when requested.

- If the user asked to create or update the file, edit `src/content/now/YYYY-MM.md`.
- If the user asked only for a draft, return the full Markdown without writing.
- After file edits, run `pnpm typecheck` or `pnpm check` when practical.

## Quality Bar

- Do not invent facts, dates, metrics, links, diagnoses, releases, jobs, or project status.
- Prefer concrete nouns and dates over abstract claims.
- Keep the writing candid, reflective, and plain-spoken.
- Include both external events and internal interpretation: what happened, why it mattered, and what it changed.
- Avoid polished corporate phrasing, motivational filler, or generic productivity language.
- Make the page feel like a monthly personal log, not a press release.

## Useful Commands

```bash
ls src/content/now
sed -n '1,220p' src/content/now/YYYY-MM.md
pnpm typecheck
pnpm check
```
