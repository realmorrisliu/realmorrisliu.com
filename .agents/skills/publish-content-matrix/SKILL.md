---
name: publish-content-matrix
description: Create and operate a cross-channel publishing matrix from this repository's content source. Use when the user wants to publish, republish, or maintain discussion momentum for blog or build-in-public updates (especially Alan and openrouter-rs) on X, Hacker News, and Xiaohongshu, including draft generation, channel-specific framing, follow-up replies, and post-publication iteration.
---

# Publish Content Matrix

## Overview

Treat this repository as the content storage layer and the agent as the publishing brain.
Use `src/content/blog/*.mdx` as canonical source, then generate channel-specific distribution packs.

Read [references/channel-playbooks.md](references/channel-playbooks.md) for format, tone, and constraints per channel.

## Workflow

1. Identify source content.
- Ask for the target URL or slug if missing.
- Load the corresponding file from `src/content/blog/`.
- Capture title, thesis, strongest contrarian point, and any recent update markers (`updatedDate`).

2. Select campaign mode.
- `launch`: first publication push.
- `refresh`: updated article, new angle, or new supporting reference.
- `follow-up`: discussion continuation based on existing replies/comments.

3. Generate a publish pack.
- Build outputs for X, Hacker News, and Xiaohongshu.
- Keep message consistent, but adapt per channel.
- Include concrete posting sequence, not only copy text.

4. Run risk and quality checks.
- Avoid fabricated claims, fake metrics, or fake citations.
- Avoid direct vote-begging on Hacker News.
- Keep sharp opinions technical and evidence-backed.
- If the user says "today/yesterday/tomorrow", use exact dates.

5. Prepare follow-up replies.
- Draft 3-5 likely replies for each channel:
  - one clarifying reply,
  - one rebuttal reply,
  - one bridge reply that lowers conflict and keeps discussion moving.

6. Iterate post-publication.
- When the user returns with comments/screenshots, draft contextual responses.
- Suggest the next piece of build-in-public content for Alan or openrouter-rs that compounds current discussion.

## Standard Output Format

Always return sections in this order:

1. `Campaign Goal`
2. `Primary Angle`
3. `X Pack`
4. `Hacker News Pack`
5. `Xiaohongshu Pack`
6. `Reply Playbook`
7. `Next Iteration`

## Channel Rules

- X:
  - Give one primary post, two alternates, and one first-reply link text.
  - Use at most 2 hashtags in the primary post.
- Hacker News:
  - Provide title options only if user asks; otherwise recommend one clean title.
  - Always provide one concise "Author here" comment.
  - Never suggest brigading or coordinated voting.
- Xiaohongshu:
  - Provide 1 cover hook + 5-7 card outline + caption + topic tags.
  - Prefer practical framing, concrete examples, and one discussion question.
