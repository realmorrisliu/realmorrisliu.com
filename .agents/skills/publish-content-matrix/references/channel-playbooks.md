# Channel Playbooks

## Inputs to Collect First

- Canonical URL or repo slug (`src/content/blog/*.mdx`)
- Campaign mode: `launch` | `refresh` | `follow-up`
- Core claim: one sentence
- Counterpoint: one sentence
- Desired action: discussion | subscribers | reposts | product signups

## Default Channel Mix

- Global: `X + Hacker News`
- Chinese: `Xiaohongshu + Juejin`
- Optional long-form layer: `WeChat OA` (weekly or biweekly synthesis)

## X Playbook

## Objective
- Trigger high-signal technical debate and pull traffic to the canonical post.

## Sequence
1. Publish a no-link primary post with thesis and challenge question.
2. Reply to self with link and one key excerpt.
3. Add one follow-up reply after 1-3 hours with a concrete scenario.

## Constraints
- Max 3 short paragraphs.
- Max 2 hashtags (for example `#AIAgents #BuildInPublic`).
- End with one pointed question, not a slogan.

## Hacker News Playbook

## Objective
- Attract practitioner critique and edge-case feedback.

## Sequence
1. Submit with clean, neutral title (close to article title).
2. Post one "Author here" comment: thesis + what feedback you want.
3. Reply with examples, benchmarks, or architecture details.

## Constraints
- One claim per comment.
- No vote requests, no off-platform brigading.
- If disagreement escalates, ask for counterexample data.

## Xiaohongshu Playbook

## Objective
- Translate deep technical argument into practical decision framework.

## Card Structure (7 cards)
1. Cover: strong contrarian hook.
2. Problem: why default pattern breaks.
3. Misconception: common but wrong strategy.
4. Framework: your model (for example Human-in-the-End).
5. Case: one real workflow and boundary.
6. Checklist: 3-5 actionable rules.
7. Question: invite opposing view with one scenario.

## Caption Formula
- Hook sentence.
- "Why now" in one line.
- Link to long-form article in profile/bio guidance.
- End with one debate question.

## Juejin Playbook

## Objective
- Reach technical readers who prefer structured reasoning and implementation detail.

## Post Structure
1. Background: context and why this matters now.
2. Problem: where current practice fails.
3. Approach: your framework and decision boundary.
4. Tradeoffs: what gets better, what gets harder.
5. Implementation notes: process, tooling, guardrails.
6. Actionable takeaway: what readers can apply this week.

## Title Pattern
- Primary: `一个反直觉结论 + 适用边界`  
  Example: `Human-in-the-End 不是口号：长时代理系统的提交边界怎么定`
- Alternate: `问题场景 + 方法选择`  
  Example: `当 Agent 连续运行数小时，为什么我放弃 Human-in-the-Loop`

## WeChat OA Playbook

## Objective
- Build durable narrative continuity across your projects (blog, Alan, openrouter-rs).

## Cadence
- Weekly or biweekly digest.
- One issue = one main thesis + two supporting field notes.

## Article Structure
1. Opening: this period's core question.
2. Main essay: updated thesis with examples.
3. Build-in-public log: progress on Alan/openrouter-rs.
4. Cross-link block: X/HN/Xiaohongshu/Juejin discussion highlights.
5. Next question: what you will test before next issue.

## Cross-Channel Repurpose Map

- Blog -> X: thesis + challenge question.
- Blog -> HN: neutral title + author comment.
- Blog -> Xiaohongshu: visual cards + practical checklist.
- Blog -> Juejin: full technical breakdown.
- Weekly OA -> recap links + evolving stance.

## Reply Playbook (All Channels)

- Clarify: restate claim with one concrete example.
- Rebut: acknowledge valid concern, then show boundary conditions.
- Bridge: convert conflict into testable question.

## Tone Guardrails

- Keep claims falsifiable and specific.
- Avoid absolute language unless evidence is explicit.
- Prefer "default choice vs edge adapter" framing.
- State assumptions, failure modes, and where the model does not apply.
