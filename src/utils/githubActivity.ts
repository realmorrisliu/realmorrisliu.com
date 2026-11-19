import type { Runtime } from "@astrojs/cloudflare";

export const DEFAULT_GITHUB_USERNAME = "realmorrisliu";
export const CACHE_TTL_SECONDS = 300;
export const STALE_WHILE_REVALIDATE_SECONDS = 3600;
const CACHE_KEY_URL = "https://realmorrisliu.com/__cache/github-activity/v1";
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export interface GitHubWindowStats {
  commits: number;
  mergedPrs: number;
}

export interface GitHubDailyBucket {
  date: string;
  contributions: number;
}

export interface GitHubActivityPayload {
  username: string;
  updatedAt: string;
  windows: {
    day: GitHubWindowStats;
    week: GitHubWindowStats;
    month: GitHubWindowStats;
  };
  daily: GitHubDailyBucket[];
  includesPrivate: boolean;
}

export interface LocalRuntimeLike {
  env?: {
    GITHUB_TOKEN?: string;
    GITHUB_USERNAME?: string;
    [key: string]: unknown;
  };
  caches?: {
    default?: {
      match(req: string): Promise<Response | undefined>;
      put(req: string, res: Response): Promise<void>;
    };
  };
  ctx?: {
    waitUntil(promise: Promise<unknown>): void;
  };
}

export type CloudflareRuntimeLike = Runtime["runtime"] | LocalRuntimeLike;

export interface FetchGitHubActivityOptions {
  token: string;
  username?: string;
  now?: Date;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export interface CachedGitHubActivityOptions {
  runtime?: CloudflareRuntimeLike;
  username?: string;
  timeoutMs?: number;
  now?: Date;
  fetchImpl?: typeof fetch;
}

type FetchSignal = NonNullable<Parameters<typeof fetch>[1]>["signal"];

interface GraphQLRepoRef {
  id?: unknown;
  pushedAt?: unknown;
}

interface GraphQLContributionDay {
  date?: unknown;
  contributionCount?: unknown;
}

interface GraphQLContributionWeek {
  contributionDays?: GraphQLContributionDay[];
}

interface DiscoveryAndPrsData {
  viewer?: {
    id?: unknown;
    repositories?: { nodes?: Array<GraphQLRepoRef | null> };
    repositoriesContributedTo?: { nodes?: Array<GraphQLRepoRef | null> };
  };
  pr24h?: { issueCount?: unknown };
  pr7d?: { issueCount?: unknown };
  pr30d?: {
    issueCount?: unknown;
    nodes?: Array<{ repository?: GraphQLRepoRef | null } | null>;
  };
  user?: {
    contributionsCollection?: {
      contributionCalendar?: {
        weeks?: GraphQLContributionWeek[];
      };
    };
  };
}

interface CommitHistoryNode {
  defaultBranchRef?: {
    target?: {
      c24h?: { totalCount?: unknown };
      c7d?: { totalCount?: unknown };
      c30d?: { totalCount?: unknown };
    } | null;
  } | null;
}

interface CommitHistoryData {
  nodes?: Array<CommitHistoryNode | null>;
}

interface GitHubGraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message?: string }>;
}

const DISCOVERY_AND_PRS_GRAPHQL = `
query($login: String!, $from30d: DateTime!, $to: DateTime!, $q24h: String!, $q7d: String!, $q30d: String!) {
  viewer {
    id
    repositories(first: 20, affiliations: [OWNER, COLLABORATOR], orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        id
        pushedAt
      }
    }
    repositoriesContributedTo(first: 20, contributionTypes: [COMMIT, PULL_REQUEST], includeUserRepositories: true, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        id
        pushedAt
      }
    }
  }
  pr24h: search(query: $q24h, type: ISSUE, first: 1) {
    issueCount
  }
  pr7d: search(query: $q7d, type: ISSUE, first: 1) {
    issueCount
  }
  pr30d: search(query: $q30d, type: ISSUE, first: 15) {
    issueCount
    nodes {
      ... on PullRequest {
        repository {
          id
          pushedAt
        }
      }
    }
  }
  user(login: $login) {
    contributionsCollection(from: $from30d, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

const COMMIT_HISTORY_GRAPHQL = `
query($ids: [ID!]!, $authorId: ID!, $from24h: GitTimestamp!, $from7d: GitTimestamp!, $from30d: GitTimestamp!, $to: GitTimestamp!) {
  nodes(ids: $ids) {
    ... on Repository {
      defaultBranchRef {
        target {
          ... on Commit {
            c24h: history(since: $from24h, until: $to, author: { id: $authorId }) {
              totalCount
            }
            c7d: history(since: $from7d, until: $to, author: { id: $authorId }) {
              totalCount
            }
            c30d: history(since: $from30d, until: $to, author: { id: $authorId }) {
              totalCount
            }
          }
        }
      }
    }
  }
}
`;

/** Format a Date to second-precision UTC ISO-8601 required by GitHub search and timestamp filters. */
export function toGitHubTimestamp(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** Build rolling 24h, 7d, and 30d UTC ISO bounds ending at `now`. */
export function buildRollingWindowBounds(now: Date): {
  to: string;
  from24h: string;
  from7d: string;
  from30d: string;
} {
  const endMs = now.getTime();
  return {
    to: toGitHubTimestamp(now),
    from24h: toGitHubTimestamp(new Date(endMs - 24 * 3_600_000)),
    from7d: toGitHubTimestamp(new Date(endMs - 7 * 24 * 3_600_000)),
    from30d: toGitHubTimestamp(new Date(endMs - 30 * 24 * 3_600_000)),
  };
}

/** Format a `YYYY-MM-DD` date string as a concise UTC month+day label (e.g. "Nov 18"). */
export function formatShortDay(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

/** Format an ISO timestamp as a compact relative update string (e.g. "just now", "4m ago"). */
export function formatRelativeUpdated(isoTimestamp: string, now: Date = new Date()): string {
  const target = new Date(isoTimestamp);
  if (Number.isNaN(target.getTime())) return "recently";

  const diffSeconds = Math.max(0, Math.floor((now.getTime() - target.getTime()) / 1000));
  if (diffSeconds < 60) return "just now";

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "narrow" });
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return rtf.format(-diffMinutes, "minute");
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return rtf.format(-diffHours, "hour");
  }

  const diffDays = Math.floor(diffHours / 24);
  return rtf.format(-diffDays, "day");
}

function asNonNegativeInt(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

function createHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "realmorrisliu.com-github-activity",
  };
}

async function postGraphQL<T>(
  fetchImpl: typeof fetch,
  headers: Record<string, string>,
  query: string,
  variables: Record<string, unknown>,
  signal?: FetchSignal
): Promise<T> {
  const res = await fetchImpl(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    signal,
  });
  if (!res.ok) {
    throw new Error(`GitHub GraphQL failed with ${res.status}`);
  }
  const json = (await res.json()) as GitHubGraphQLResponse<T>;
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0]?.message ?? "GitHub GraphQL returned errors");
  }
  if (!json.data) {
    throw new Error("GitHub GraphQL returned no data");
  }
  return json.data;
}

function collectActiveRepoIds(data: DiscoveryAndPrsData, from30d: string): string[] {
  const refs: Array<GraphQLRepoRef | null | undefined> = [
    ...(data.viewer?.repositories?.nodes ?? []),
    ...(data.viewer?.repositoriesContributedTo?.nodes ?? []),
    ...(data.pr30d?.nodes?.map(node => node?.repository) ?? []),
  ];

  const activeIds = new Set<string>();
  for (const repo of refs) {
    if (
      repo &&
      typeof repo.id === "string" &&
      repo.id &&
      typeof repo.pushedAt === "string" &&
      repo.pushedAt >= from30d
    ) {
      activeIds.add(repo.id);
    }
  }
  return Array.from(activeIds);
}

/**
 * Fetch aggregate rolling 24h / 7d / 30d commit & merged-PR counts plus the 30-day
 * daily contribution calendar for `username` via pure 2-step GraphQL (zero REST commit
 * search calls). Only aggregate counts are returned; repository names, organization names,
 * and commit/PR titles are never queried or exposed.
 */
export async function fetchGitHubActivity({
  token,
  username = DEFAULT_GITHUB_USERNAME,
  now = new Date(),
  timeoutMs = 8000,
  fetchImpl = fetch,
}: FetchGitHubActivityOptions): Promise<GitHubActivityPayload> {
  const bounds = buildRollingWindowBounds(now);
  const headers = createHeaders(token);

  const AbortCtor = globalThis.AbortController;
  const controller = AbortCtor ? new AbortCtor() : undefined;
  const timeoutId =
    controller && timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
  const signal = controller?.signal;

  try {
    const discoveryData = await postGraphQL<DiscoveryAndPrsData>(
      fetchImpl,
      headers,
      DISCOVERY_AND_PRS_GRAPHQL,
      {
        login: username,
        from30d: bounds.from30d,
        to: bounds.to,
        q24h: `author:${username} is:pr is:merged merged:>=${bounds.from24h}`,
        q7d: `author:${username} is:pr is:merged merged:>=${bounds.from7d}`,
        q30d: `author:${username} is:pr is:merged merged:>=${bounds.from30d}`,
      },
      signal
    );

    const authorId = discoveryData.viewer?.id;
    const activeIds = collectActiveRepoIds(discoveryData, bounds.from30d);

    let commits24h = 0;
    let commits7d = 0;
    let commits30d = 0;

    if (activeIds.length > 0 && typeof authorId === "string" && authorId) {
      const historyData = await postGraphQL<CommitHistoryData>(
        fetchImpl,
        headers,
        COMMIT_HISTORY_GRAPHQL,
        {
          ids: activeIds,
          authorId,
          from24h: bounds.from24h,
          from7d: bounds.from7d,
          from30d: bounds.from30d,
          to: bounds.to,
        },
        signal
      );

      for (const node of historyData.nodes ?? []) {
        const target = node?.defaultBranchRef?.target;
        if (!target) continue;
        commits24h += asNonNegativeInt(target.c24h?.totalCount);
        commits7d += asNonNegativeInt(target.c7d?.totalCount);
        commits30d += asNonNegativeInt(target.c30d?.totalCount);
      }
    }

    const weeks = discoveryData.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
    const flattenedDays: GitHubDailyBucket[] = [];
    for (const week of weeks) {
      for (const day of week.contributionDays ?? []) {
        if (typeof day.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
          flattenedDays.push({
            date: day.date,
            contributions: asNonNegativeInt(day.contributionCount),
          });
        }
      }
    }

    return {
      username,
      updatedAt: bounds.to,
      windows: {
        day: {
          commits: commits24h,
          mergedPrs: asNonNegativeInt(discoveryData.pr24h?.issueCount),
        },
        week: {
          commits: commits7d,
          mergedPrs: asNonNegativeInt(discoveryData.pr7d?.issueCount),
        },
        month: {
          commits: commits30d,
          mergedPrs: asNonNegativeInt(discoveryData.pr30d?.issueCount),
        },
      },
      daily: flattenedDays.slice(-30),
      includesPrivate: true,
    };
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

function readEnvString(
  runtime: CloudflareRuntimeLike | undefined,
  key: "GITHUB_TOKEN" | "GITHUB_USERNAME"
) {
  const fromRuntime = runtime?.env?.[key];
  if (typeof fromRuntime === "string" && fromRuntime.trim()) {
    return fromRuntime.trim();
  }

  const metaEnv = (import.meta as { env?: Record<string, unknown> }).env;
  const fromImportMeta = metaEnv?.[key];
  if (typeof fromImportMeta === "string" && fromImportMeta.trim()) {
    return fromImportMeta.trim();
  }

  if (typeof process !== "undefined") {
    const fromProcess = process.env?.[key];
    if (typeof fromProcess === "string" && fromProcess.trim()) {
      return fromProcess.trim();
    }
  }

  return undefined;
}

function isValidPayload(value: unknown): value is GitHubActivityPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GitHubActivityPayload>;
  return (
    typeof candidate.username === "string" &&
    typeof candidate.updatedAt === "string" &&
    typeof candidate.windows?.day?.commits === "number" &&
    typeof candidate.windows?.week?.commits === "number" &&
    typeof candidate.windows?.month?.commits === "number" &&
    Array.isArray(candidate.daily)
  );
}

/**
 * Retrieve cached rolling GitHub activity from Cloudflare's edge cache, or fetch fresh
 * data on cache miss and store it quietly via `runtime.ctx.waitUntil(...)`. Returns `null`
 * if `GITHUB_TOKEN` is unconfigured or if GitHub cannot be reached within `timeoutMs`.
 */
export async function getCachedGitHubActivity({
  runtime,
  username,
  timeoutMs = 8000,
  now,
  fetchImpl,
}: CachedGitHubActivityOptions = {}): Promise<GitHubActivityPayload | null> {
  const token = readEnvString(runtime, "GITHUB_TOKEN");
  if (!token) {
    return null;
  }

  const resolvedUsername =
    username ?? readEnvString(runtime, "GITHUB_USERNAME") ?? DEFAULT_GITHUB_USERNAME;
  const edgeCache = runtime?.caches?.default;
  const cacheKey = `${CACHE_KEY_URL}?user=${encodeURIComponent(resolvedUsername)}`;

  if (edgeCache) {
    try {
      const cached = await edgeCache.match(cacheKey);
      if (cached?.ok) {
        const parsed = (await cached.json()) as unknown;
        if (isValidPayload(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Ignore cache read failures and fall through to origin fetch.
    }
  }

  try {
    const payload = await fetchGitHubActivity({
      token,
      username: resolvedUsername,
      now,
      timeoutMs,
      fetchImpl,
    });

    if (edgeCache && runtime?.ctx) {
      const cacheResponse = new Response(JSON.stringify(payload), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
        },
      });
      runtime.ctx.waitUntil(
        (
          edgeCache as {
            put(req: string, res: Response): Promise<void>;
          }
        ).put(cacheKey, cacheResponse)
      );
    }

    return payload;
  } catch {
    return null;
  }
}
