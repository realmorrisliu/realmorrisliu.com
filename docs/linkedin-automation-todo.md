# LinkedIn Auto-Publish TODO

Last updated: 2026-03-08

## Context

- Current content matrix default channels are `X + LinkedIn + Xiaohongshu + Juejin`.
- `Hacker News` is optional for now.
- This repository currently has no LinkedIn publishing script and no `.github/workflows`.

## Goal

Build a reliable LinkedIn auto-publishing pipeline so posts can be published without manual web UI operations per post.

## Non-Goals (Phase 1)

- No browser automation (Playwright/Selenium login-click posting).
- No image/video upload pipeline in the first release.
- No multi-channel publishing in the same job (LinkedIn first, others later).

## Decisions To Lock First

- [ ] Endpoint strategy: try `rest/posts` first, keep `v2/ugcPosts` fallback.
- [ ] Scheduling runtime: GitHub Actions cron vs local scheduler.
- [ ] Visibility default: `PUBLIC` or `CONNECTIONS` for initial rollout.

## Implementation TODO

### 1) LinkedIn App Setup

- [ ] Create LinkedIn app in Developer Portal.
- [ ] Enable products: `Share on LinkedIn`, `Sign in with LinkedIn using OpenID Connect`.
- [ ] Configure OAuth `redirect_uri` (HTTPS).
- [ ] Record credentials securely: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`.

### 2) OAuth + Identity Bootstrap

- [ ] Implement one-time OAuth authorization URL generator.
- [ ] Implement callback handler to exchange `code` for `access_token`.
- [ ] Persist token metadata: `access_token`, `expires_in`, `obtained_at`.
- [ ] If returned, persist `refresh_token`; otherwise use re-auth runbook.
- [ ] Call `GET /v2/userinfo` and derive `author` as `urn:li:person:{sub}`.
- [ ] Validate a test post in dev mode with `CONNECTIONS` visibility.

### 3) Content Queue Design

- [ ] Add queue directory: `scripts/linkedin/queue/`.
- [ ] Define queue schema (JSON): `id`, `text`, `link`, `visibility`, `publishAtUTC`, `status`, `retries`.
- [ ] Add status lifecycle: `ready -> posting -> posted | failed`.
- [ ] Add idempotency key rule: same `id` cannot post twice.

### 4) Publisher Script

- [ ] Create `scripts/linkedin/post.ts` (single publish action).
- [ ] Create `scripts/linkedin/worker.ts` (scan due queue items and publish).
- [ ] Add endpoint adapter layer with `rest/posts` primary path and `v2/ugcPosts` fallback path.
- [ ] Capture and store response identifiers (`x-restli-id` / post URN).
- [ ] Add retry logic for `429` and `5xx` with exponential backoff.

### 5) Scheduling

- [ ] Add `.github/workflows/linkedin-autopost.yml`.
- [ ] Use `schedule` cron in UTC; avoid top-of-hour spikes.
- [ ] Add `workflow_dispatch` for manual trigger.
- [ ] Inject secrets via GitHub repository secrets.
- [ ] Ensure workflow runs only on default branch.

### 6) Token Lifecycle

- [ ] Add expiry precheck before publish job.
- [ ] If programmatic refresh is available for app, implement refresh path.
- [ ] If not available, implement manual re-auth SOP.
- [ ] Add alert threshold (for example: token expires in < 7 days).

### 7) Observability and Runbook

- [ ] Add structured logs: request id, queue id, response code, endpoint mode.
- [ ] Persist failed payload for replay.
- [ ] Create runbook doc: re-auth, replay failed jobs, emergency stop.
- [ ] Add daily summary output: posted count, failed count, next scheduled posts.

### 8) Rollout Plan

- [ ] Stage 1: dry-run mode (no API write).
- [ ] Stage 2: one `CONNECTIONS` test post.
- [ ] Stage 3: one `PUBLIC` production post.
- [ ] Stage 4: enable recurring schedule.

## Acceptance Criteria

- [ ] A queued item with `publishAtUTC <= now` is auto-posted successfully.
- [ ] Re-running worker does not duplicate already posted items.
- [ ] Token-expiry failure path is handled with clear operator message.
- [ ] One-command local run is available (`pnpm linkedin:worker`).

## References

- https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access
- https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
- https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2
- https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
- https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-02
- https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens
- https://www.linkedin.com/legal/user-agreement
- https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows
