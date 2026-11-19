import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildRollingWindowBounds,
  fetchGitHubActivity,
  formatRelativeUpdated,
  formatShortDay,
  getCachedGitHubActivity,
  toGitHubTimestamp,
  type GitHubActivityPayload,
} from "./githubActivity.ts";

describe("githubActivity", () => {
  it("formats timestamps to second-precision UTC ISO strings and builds rolling bounds", () => {
    const now = new Date("2026-11-19T07:12:45.789Z");
    assert.equal(toGitHubTimestamp(now), "2026-11-19T07:12:45Z");

    const bounds = buildRollingWindowBounds(now);
    assert.deepEqual(bounds, {
      to: "2026-11-19T07:12:45Z",
      from24h: "2026-11-18T07:12:45Z",
      from7d: "2026-11-12T07:12:45Z",
      from30d: "2026-10-20T07:12:45Z",
    });
  });

  it("fetches rolling commit/PR totals and 30-day daily buckets without exposing repo names", async () => {
    const now = new Date("2026-11-19T07:12:00.000Z");
    const seenUrls: string[] = [];

    const mockDays = Array.from({ length: 32 }, (_, idx) => {
      const day = new Date(Date.UTC(2026, 9, 19 + idx));
      return {
        date: day.toISOString().slice(0, 10),
        contributionCount: idx + 1,
      };
    });

    const mockFetch: typeof fetch = async input => {
      const url =
        typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      seenUrls.push(url);

      if (url === "https://api.github.com/graphql") {
        return new Response(
          JSON.stringify({
            data: {
              pr24h: { issueCount: 12 },
              pr7d: { issueCount: 64 },
              pr30d: { issueCount: 210 },
              user: {
                contributionsCollection: {
                  contributionCalendar: {
                    weeks: [
                      { contributionDays: mockDays.slice(0, 16) },
                      { contributionDays: mockDays.slice(16) },
                    ],
                  },
                },
              },
            },
          }),
          { status: 200 }
        );
      }

      if (url.includes("2026-11-18T07%3A12%3A00Z")) {
        return new Response(JSON.stringify({ total_count: 19 }), { status: 200 });
      }
      if (url.includes("2026-11-12T07%3A12%3A00Z")) {
        return new Response(JSON.stringify({ total_count: 105 }), { status: 200 });
      }
      if (url.includes("2026-10-20T07%3A12%3A00Z")) {
        return new Response(JSON.stringify({ total_count: 420 }), { status: 200 });
      }

      return new Response("unexpected url", { status: 500 });
    };

    const payload = await fetchGitHubActivity({
      token: "ghp_secret_test_token",
      username: "realmorrisliu",
      now,
      fetchImpl: mockFetch,
    });

    assert.equal(seenUrls.length, 4);
    assert.deepEqual(payload.windows, {
      day: { commits: 19, mergedPrs: 12 },
      week: { commits: 105, mergedPrs: 64 },
      month: { commits: 420, mergedPrs: 210 },
    });
    assert.equal(payload.daily.length, 30);
    assert.equal(payload.daily[0]?.date, "2026-10-21");
    assert.equal(payload.daily[29]?.date, "2026-11-19");
    assert.equal(payload.includesPrivate, true);

    const serialized = JSON.stringify(payload);
    assert.equal(serialized.includes("ghp_secret_test_token"), false);
    assert.equal(serialized.includes("repository"), false);
  });

  it("uses edge cache hits, populates edge cache on misses with bound ctx, and degrades quietly", async () => {
    const samplePayload: GitHubActivityPayload = {
      username: "realmorrisliu",
      updatedAt: "2026-11-19T07:12:00Z",
      windows: {
        day: { commits: 5, mergedPrs: 2 },
        week: { commits: 40, mergedPrs: 15 },
        month: { commits: 150, mergedPrs: 60 },
      },
      daily: [{ date: "2026-11-19", contributions: 5 }],
      includesPrivate: true,
    };

    const withoutToken = await getCachedGitHubActivity({
      runtime: { env: {} },
    });
    assert.equal(withoutToken, null);

    let fetchCalled = false;
    const hitResult = await getCachedGitHubActivity({
      runtime: {
        env: { GITHUB_TOKEN: "ghp_test" },
        caches: {
          default: {
            async match() {
              return new Response(JSON.stringify(samplePayload), { status: 200 });
            },
            async put() {},
          },
        },
      },
      fetchImpl: async () => {
        fetchCalled = true;
        return new Response("{}", { status: 500 });
      },
    });
    assert.equal(fetchCalled, false);
    assert.deepEqual(hitResult, samplePayload);

    const waitUntilCalls: Promise<unknown>[] = [];
    const ctxObj = {
      waitUntil(promise: Promise<unknown>) {
        assert.equal(this, ctxObj);
        waitUntilCalls.push(promise);
      },
    };
    let putCalls = 0;

    const missFail = await getCachedGitHubActivity({
      runtime: {
        env: { GITHUB_TOKEN: "ghp_test" },
        caches: {
          default: {
            async match() {
              return undefined;
            },
            async put() {
              putCalls += 1;
            },
          },
        },
        ctx: ctxObj,
      },
      fetchImpl: async () => new Response("rate limited", { status: 403 }),
    });
    assert.equal(missFail, null);
    assert.equal(putCalls, 0);

    const missSuccess = await getCachedGitHubActivity({
      runtime: {
        env: { GITHUB_TOKEN: "ghp_test" },
        caches: {
          default: {
            async match() {
              return undefined;
            },
            async put() {
              putCalls += 1;
            },
          },
        },
        ctx: ctxObj,
      },
      now: new Date("2026-11-19T07:12:00Z"),
      fetchImpl: async input => {
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        if (url === "https://api.github.com/graphql") {
          return new Response(
            JSON.stringify({
              data: {
                pr24h: { issueCount: 1 },
                pr7d: { issueCount: 2 },
                pr30d: { issueCount: 3 },
                user: {
                  contributionsCollection: {
                    contributionCalendar: {
                      weeks: [{ contributionDays: [{ date: "2026-11-19", contributionCount: 4 }] }],
                    },
                  },
                },
              },
            }),
            { status: 200 }
          );
        }
        return new Response(JSON.stringify({ total_count: 9 }), { status: 200 });
      },
    });
    await Promise.all(waitUntilCalls);
    assert.equal(missSuccess?.windows.day.commits, 9);
    assert.equal(missSuccess?.windows.day.mergedPrs, 1);
    assert.equal(putCalls, 1);
  });

  it("formats short calendar days and relative updated labels deterministically", () => {
    assert.equal(formatShortDay("2026-11-18"), "Nov 18");
    const now = new Date("2026-11-19T07:12:00Z");
    assert.equal(formatRelativeUpdated("2026-11-19T07:11:30Z", now), "just now");
    assert.equal(formatRelativeUpdated("2026-11-19T07:08:00Z", now), "4m ago");
    assert.equal(formatRelativeUpdated("2026-11-19T05:12:00Z", now), "2h ago");
  });
});
