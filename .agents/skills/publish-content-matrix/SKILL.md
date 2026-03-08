---
name: publish-content-matrix
description: Create and operate a cross-channel publishing matrix from this repository's content source. Use when the user wants to publish, republish, or maintain discussion momentum for blog or build-in-public updates (especially Alan and openrouter-rs) on X, LinkedIn, Xiaohongshu, Juejin, Hacker News, and WeChat Official Account, including draft generation, channel-specific framing, follow-up replies, and post-publication iteration.
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

3. Select channels.
- Default channels: X + LinkedIn + Xiaohongshu + Juejin.
- Optional channels: Hacker News (`hn`) and WeChat Official Account (`wechat-oa`).
- If the user only wants some channels, output only those channels.

4. Generate a publish pack.
- Build outputs for selected channels.
- Keep message consistent, but adapt per channel.
- Include concrete posting sequence, not only copy text.

5. Run risk and quality checks.
- Avoid fabricated claims, fake metrics, or fake citations.
- If Hacker News is selected, avoid direct vote-begging.
- Keep sharp opinions technical and evidence-backed.
- If the user says "today/yesterday/tomorrow", use exact dates.

6. Prepare follow-up replies.
- Draft 3-5 likely replies for each channel:
  - one clarifying reply,
  - one rebuttal reply,
  - one bridge reply that lowers conflict and keeps discussion moving.

7. Iterate post-publication.
- When the user returns with comments/screenshots, draft contextual responses.
- Suggest the next piece of build-in-public content for Alan or openrouter-rs that compounds current discussion.

## Standard Output Format

Always return sections in this order:

1. `Campaign Goal`
2. `Primary Angle`
3. `Channel Plan`
4. `X Pack`
5. `LinkedIn Pack`
6. `Xiaohongshu Pack`
7. `Juejin Pack`
8. `Hacker News Pack` (only when selected)
9. `WeChat OA Pack` (only when selected)
10. `Reply Playbook`
11. `Next Iteration`

## Channel Rules

- X:
  - Give one primary post, two alternates, and one first-reply link text.
  - Use at most 2 hashtags in the primary post.
- LinkedIn:
  - Give one primary post, one alternate hook, and one first-comment link text.
  - Prefer 3-5 concise bullets for scannability.
  - End with one practitioner question, not engagement bait.
- Hacker News:
  - Provide title options only if user asks; otherwise recommend one clean title.
  - Always provide one concise "Author here" comment.
  - Never suggest brigading or coordinated voting.
- Xiaohongshu:
  - Provide 1 cover hook + 5-7 card outline + caption + topic tags.
  - Prefer practical framing, concrete examples, and one discussion question.
- Juejin:
  - Provide one title, one alternate title, and a post outline optimized for technical readers.
  - Include explicit sections: background, problem, approach, tradeoffs, and actionable takeaway.
- WeChat OA:
  - Provide headline + subheadline + opening paragraph + sectioned body outline.
  - Treat this as lower frequency and high-retention channel (summary, synthesis, and narrative continuity).
