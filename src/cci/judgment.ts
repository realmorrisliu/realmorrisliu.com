import {
  DIMENSIONS,
  lifetimeMean,
  type CityCandidate,
  type CandidateReleaseInput,
  type CityReleaseResult,
  type DimensionId,
  type TargetYear,
} from "./model";

type Localized = { en: string; zh: string };
export interface DimensionJudgment {
  id: DimensionId;
  baseline: number;
  uncertainty: number;
  trendPerDecade: number;
  rationale: Localized;
  sourceUrls: string[];
}
export interface ResearchEvent {
  id: string;
  date: string;
  title: Localized;
  sourceUrls: string[];
  impacts: Array<{ city: string; dimension: DimensionId; delta: number; reason: Localized }>;
}
export interface ResearchModel {
  kind: "research_judgment";
  baselineAsOf: string;
  methodologyUrl: string;
  events: ResearchEvent[];
}

export function validateJudgments(input: CandidateReleaseInput) {
  const model = input.researchModel;
  if (!model) return;
  const validDate = (date: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(Date.parse(date)) &&
    new Date(date).toISOString().slice(0, 10) === date;
  const validUrls = (urls: string[]) =>
    urls.length > 0 &&
    urls.every(url => {
      try {
        return ["https:", "http:"].includes(new URL(url).protocol);
      } catch {
        return false;
      }
    });
  const text = (value: Localized) => value.en.trim() && value.zh.trim();
  if (
    model.kind !== "research_judgment" ||
    input.modelVersion !== "2.0.0" ||
    !validDate(model.baselineAsOf) ||
    model.baselineAsOf > input.asOf ||
    !validUrls([model.methodologyUrl])
  )
    throw new Error("Invalid research model metadata");
  const ids = DIMENSIONS.map(d => d.id)
    .sort()
    .join(",");
  for (const city of input.cities) {
    if (
      city.judgments
        ?.map(d => d.id)
        .sort()
        .join(",") !== ids
    )
      throw new Error(`${city.slug}: eight judgments required`);
    for (const d of city.judgments) {
      if (
        ![d.baseline, d.uncertainty, d.trendPerDecade].every(Number.isFinite) ||
        d.baseline < 0 ||
        d.baseline > 100 ||
        d.baseline % 5 !== 0 ||
        d.uncertainty < 8 ||
        d.uncertainty > 20 ||
        Math.abs(d.trendPerDecade) > 4 ||
        !text(d.rationale) ||
        !validUrls(d.sourceUrls)
      )
        throw new Error(`${city.slug}.${d.id}: invalid research judgment`);
    }
  }
  const eventIds = new Set<string>();
  for (const event of model.events) {
    if (
      !event.id ||
      eventIds.has(event.id) ||
      !validDate(event.date) ||
      event.date > input.asOf ||
      !text(event.title) ||
      !validUrls(event.sourceUrls) ||
      !event.impacts.length
    )
      throw new Error("Invalid or duplicate research event");
    eventIds.add(event.id);
    const impacts = new Set<string>();
    for (const impact of event.impacts) {
      const key = `${impact.city}.${impact.dimension}`;
      if (
        impacts.has(key) ||
        !input.cities.some(c => c.slug === impact.city) ||
        !DIMENSIONS.some(d => d.id === impact.dimension) ||
        !Number.isFinite(impact.delta) ||
        Math.abs(impact.delta) > 10 ||
        !text(impact.reason)
      )
        throw new Error("Invalid or duplicate event impact");
      impacts.add(key);
    }
  }
}

export function judgmentSupport(judgments: DimensionJudgment[], lang: "en" | "zh") {
  const width = judgments.reduce((sum, d) => sum + d.uncertainty, 0) / judgments.length;
  return width <= 10
    ? lang === "zh"
      ? "较强"
      : "Stronger"
    : width <= 15
      ? lang === "zh"
        ? "中等"
        : "Moderate"
      : lang === "zh"
        ? "探索性"
        : "Exploratory";
}

export function eventAdjustment(city: string, dimension: DimensionId, model: ResearchModel) {
  return model.events
    .flatMap(event => event.impacts)
    .filter(impact => impact.city === city && impact.dimension === dimension)
    .reduce((sum, impact) => sum + impact.delta, 0);
}

export function computeJudgmentResults(
  city: CityCandidate,
  input: CandidateReleaseInput
): CityReleaseResult["results"] {
  const model = input.researchModel;
  const judgments = city.judgments;
  if (!model || !judgments) throw new Error("Research model and judgments required");
  type Estimate = Record<"robust" | "median" | "upside", number>;
  const baselineYear = Number(model.baselineAsOf.slice(0, 4));
  const clamp = (value: number) => Math.min(100, Math.max(0, value));
  const round = (value: number) => Math.round(value * 10) / 10;
  const modes = ["robust", "median", "upside"] as const;
  const atYear = (year: TargetYear, d: DimensionJudgment): Estimate => {
    const decades = Math.max(0, year - baselineYear) / 10;
    const center = clamp(
      d.baseline + eventAdjustment(city.slug, d.id, model) + decades * d.trendPerDecade
    );
    // Judgment envelopes are sensitivity assumptions, not probability quantiles.
    const width = Math.min(40, d.uncertainty + decades * 2);
    return {
      robust: round(clamp(center - width)),
      median: round(center),
      upside: round(clamp(center + width)),
    };
  };
  return Object.fromEntries(
    input.targetYears.map(year => {
      const dimensions = Object.fromEntries(
        judgments.map(d => {
          const point = atYear(year, d);
          const lifetime = Object.fromEntries(
            modes.map(mode => [
              mode,
              round(
                lifetimeMean(
                  input.targetYears
                    .filter(y => y >= baselineYear && y <= year)
                    .map(y => ({ year: y, value: atYear(y, d)[mode] }))
                ) ?? point[mode]
              ),
            ])
          ) as Estimate;
          return [d.id, { point, lifetime }];
        })
      ) as Record<DimensionId, { point: Estimate; lifetime: Estimate }>;
      const aggregate = (kind: "point" | "lifetime") =>
        Object.fromEntries(
          modes.map(mode => [
            mode,
            round(
              DIMENSIONS.reduce(
                (sum, d) => sum + (dimensions[d.id][kind][mode] * d.weight) / 100,
                0
              )
            ),
          ])
        ) as Estimate;
      return [year, { point: aggregate("point"), lifetime: aggregate("lifetime"), dimensions }];
    })
  ) as CityReleaseResult["results"];
}
