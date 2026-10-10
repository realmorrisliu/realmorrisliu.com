import {
  computeJudgmentResults,
  validateJudgments,
  type DimensionJudgment,
  type ResearchModel,
} from "./judgment";
export const TARGET_YEARS = [2026, 2035, 2050, 2075, 2100] as const;

export type TargetYear = (typeof TARGET_YEARS)[number];
export type DimensionId = "PCS" | "GSS" | "ISR" | "RES" | "MED" | "LON" | "TEC" | "OPT";
export type ConfidenceGrade = "A" | "B" | "C" | "D";
export type EvidenceLevel = "city_observation" | "national_prior" | "scenario_assumption";
export type TailStatus = "pass" | "watch" | "fail";
export type ResultMode = "robust" | "median" | "upside" | "lifetime";

export const TAIL_TEST_IDS = [
  "fatal_heat_humidity",
  "permanent_inundation",
  "geophysical_catastrophe",
  "conflict_strategic_exposure",
  "essential_system_interruption",
] as const;

export type TailTestId = (typeof TAIL_TEST_IDS)[number];

export const DIMENSIONS = [
  {
    id: "PCS",
    weight: 15,
    subpillars: ["heat_humidity", "flood_sea_level", "geophysical", "severe_weather_wildfire"],
  },
  {
    id: "GSS",
    weight: 15,
    subpillars: ["organized_violence", "regional_conflict", "strategic_exposure"],
  },
  {
    id: "ISR",
    weight: 15,
    subpillars: ["governance", "adaptive_capacity", "social_cohesion", "emergency_recovery"],
  },
  {
    id: "RES",
    weight: 10,
    subpillars: ["water", "food", "energy", "supply_chain"],
  },
  {
    id: "MED",
    weight: 15,
    subpillars: ["access", "routine_quality", "specialist_capacity", "system_continuity"],
  },
  {
    id: "LON",
    weight: 10,
    subpillars: ["translation", "trial_maturity", "regulatory_adoption", "resident_access"],
  },
  {
    id: "TEC",
    weight: 10,
    subpillars: ["knowledge_output", "industry_density", "digital_infrastructure", "diffusion"],
  },
  {
    id: "OPT",
    weight: 10,
    subpillars: [
      "transport_redundancy",
      "legal_mobility",
      "asset_portability",
      "network_continuity",
    ],
  },
] as const;

export const SCENARIO_AXES = {
  climate: ["stabilization", "middle", "high_stress"],
  geopolitics: ["cooperation", "fragmentation", "escalation"],
  medicine: ["incremental", "geroscience_breakthrough", "regenerative_platform"],
} as const;

type ScenarioAxis = keyof typeof SCENARIO_AXES;

export interface Scenario {
  id: string;
  climate: (typeof SCENARIO_AXES.climate)[number];
  geopolitics: (typeof SCENARIO_AXES.geopolitics)[number];
  medicine: (typeof SCENARIO_AXES.medicine)[number];
}

export const SCENARIOS: Scenario[] = SCENARIO_AXES.climate.flatMap(climate =>
  SCENARIO_AXES.geopolitics.flatMap(geopolitics =>
    SCENARIO_AXES.medicine.map(medicine => ({
      id: `${climate}.${geopolitics}.${medicine}`,
      climate,
      geopolitics,
      medicine,
    }))
  )
);

export interface NormalizationAnchors {
  bad: number;
  reference: number;
  good: number;
}

export interface ConfidenceProfile {
  geographicFit: ConfidenceGrade;
  sourceIndependence: ConfidenceGrade;
  freshness: ConfidenceGrade;
  methodProvenance: ConfidenceGrade;
  horizonSupport: ConfidenceGrade;
}

export interface IndicatorProvenance {
  evidenceRole: "canonical" | "alternative" | "context_only";
  sourceId: string;
  sourceClass:
    | "official_statistic"
    | "administrative_record"
    | "population_survey"
    | "expert_assessment"
    | "event_coding"
    | "direct_measurement"
    | "self_report_registry"
    | "scholarly_index"
    | "modelled_estimate";
  producer: string;
  producerType:
    | "local_authority"
    | "national_statistics"
    | "national_agency"
    | "international_organization"
    | "academic_or_civil_society"
    | "commercial"
    | "community";
  title: string;
  url: string;
  sourceVersion: string;
  retrievedAt: string;
  licenseOrAccess: string;
  originalField: string;
  upstreamSourceIds: string[];
  independenceGroup: string;
  unit: string;
  observationPeriod: { start: string; end: string };
  geographyId: string;
  boundaryVersion: string;
  universeAndInclusionRule: string;
  collectionMethod: string;
  uncertainty: { low: number | null; high: number | null; method: string | null };
  transformation: { formula: string; codeVersion: string };
  bias: {
    selectionMechanism:
      | "mandatory"
      | "voluntary"
      | "probability_sample"
      | "expert_recruitment"
      | "media_discovery"
      | "algorithmic";
    reportingControl: string;
    reportingIncentives: string[];
    knownCoverageGaps: string[];
    missingnessRisk: "low" | "medium" | "high" | "unknown";
    verification: string;
    sourceLanguage: string;
    translationStatus: "original" | "machine" | "human_checked";
  };
}

export interface IndicatorInput {
  id: string;
  owner: DimensionId;
  subpillar: string;
  baselineValue: number;
  anchors: NormalizationAnchors;
  evidenceLevel: EvidenceLevel;
  provenance: IndicatorProvenance | null;
  observedSensitivity?: number;
  scenarioDeltas?: Partial<Record<ScenarioAxis, Record<string, number>>>;
  directProjections?: Array<{
    targetYear: TargetYear;
    scenarioId?: string;
    value: number;
  }>;
}

export interface CityCandidate {
  judgments?: DimensionJudgment[];
  slug: string;
  name: string;
  nameZh: string;
  country: string;
  countryZh: string;
  localEvidenceLanguages: string[];
  boundary: {
    eFuaIds: number[];
    sourceNames: string[];
    urbanCentreIds: number[];
    verificationStatus: "verified" | "needs_review";
    note: string;
    noteZh: string;
  };
  evidencePacks: Record<DimensionId, boolean>;
  confidence: ConfidenceProfile;
  alternativeChecksComplete: boolean;
  sourceSensitive: boolean | null;
  weightSensitive: boolean | null;
  unresolvedEligibilityConflict: boolean;
  indicators: IndicatorInput[];
  tailTests: Record<TailTestId, TailStatus | null>;
  audit?: CityEvidenceAudit;
}

export interface AuditSource {
  title: string;
  url: string;
  period: string;
  accessedAt: string;
}

export interface CityEvidenceAudit {
  asOf: string;
  dimensions: Array<{
    id: DimensionId;
    outcome: "usable_observation" | "context_only" | "insufficient_evidence";
    summary: { en: string; zh: string };
    sources: AuditSource[];
  }>;
  boundaryReview: {
    outcome: "verified" | "unresolved";
    en: string;
    zh: string;
    sources: AuditSource[];
  };
}

export interface CandidateReleaseInput {
  researchModel?: ResearchModel;
  releaseId: string;
  status: "research_preview" | "candidate" | "published";
  asOf: string;
  modelVersion: string;
  dataVersion: string;
  boundary: {
    product: string;
    version: string;
    epoch: number;
    sourceUrl: string;
    sourceSha256: string;
  };
  sourceManifestVersion: string;
  indicatorRegistryVersion: string;
  indicatorRegistryComplete: boolean;
  futureTransformsVersion: string;
  futureTransformsComplete: boolean;
  targetYears: TargetYear[];
  stressTestYear: 2125;
  cities: CityCandidate[];
  research?: {
    reportUrl?: string;
    sampleSelectionUrl?: string;
    summary: { en: string; zh: string };
    findings: Array<{
      dimensions: DimensionId[];
      title: string;
      url: string;
      period: string;
      en: string;
      zh: string;
    }>;
  };
}

export interface DistributionSummary {
  robust: number | null;
  median: number | null;
  upside: number | null;
}

export interface CityReleaseResult {
  judgments?: DimensionJudgment[];
  slug: string;
  audit?: CityEvidenceAudit;
  name: string;
  nameZh: string;
  country: string;
  countryZh: string;
  localEvidenceLanguages: string[];
  boundary: CityCandidate["boundary"];
  indicators: IndicatorInput[];
  confidence: ConfidenceProfile & { overall: ConfidenceGrade };
  observedCoverage: number;
  evidenceCoverage: Record<DimensionId, { observedSubpillars: number; totalSubpillars: number }>;
  rankingEligible: boolean;
  notRankedReasons: string[];
  sourceSensitive: boolean | null;
  weightSensitive: boolean | null;
  tailStatus: TailStatus | null;
  tailTests: CityCandidate["tailTests"];
  results: Record<
    TargetYear,
    {
      point: DistributionSummary;
      lifetime: DistributionSummary;
      dimensions: Record<
        DimensionId,
        { point: DistributionSummary; lifetime: DistributionSummary }
      >;
    }
  >;
}

export interface CciRelease {
  researchModel?: ResearchModel;
  schemaVersion: "cci-release-v1";
  releaseId: string;
  status: CandidateReleaseInput["status"];
  asOf: string;
  modelVersion: string;
  dataVersion: string;
  boundary: CandidateReleaseInput["boundary"];
  sourceManifestVersion: string;
  indicatorRegistryVersion: string;
  futureTransformsVersion: string;
  targetYears: TargetYear[];
  stressTestYear: 2125;
  officialWeights: Record<DimensionId, number>;
  scenarioCount: number;
  cities: CityReleaseResult[];
  research?: CandidateReleaseInput["research"];
}

export interface PublishedCciRelease extends CciRelease {
  sourceManifestSha256: string;
  checksums: {
    inputSha256: string;
    outputPayloadSha256: string;
  };
}

const gradeRank: Record<ConfidenceGrade, number> = { A: 0, B: 1, C: 2, D: 3 };

function isIsoDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(date.valueOf()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function hasCompleteProvenance(provenance: IndicatorProvenance | null): boolean {
  if (!provenance || provenance.evidenceRole === "context_only") return false;
  const requiredStrings = [
    provenance.sourceId,
    provenance.producer,
    provenance.title,
    provenance.url,
    provenance.sourceVersion,
    provenance.licenseOrAccess,
    provenance.originalField,
    provenance.independenceGroup,
    provenance.unit,
    provenance.geographyId,
    provenance.boundaryVersion,
    provenance.universeAndInclusionRule,
    provenance.collectionMethod,
    provenance.transformation.formula,
    provenance.transformation.codeVersion,
    provenance.bias.reportingControl,
    provenance.bias.verification,
    provenance.bias.sourceLanguage,
  ];

  try {
    new URL(provenance.url);
  } catch {
    return false;
  }

  return (
    requiredStrings.every(value => value.trim().length > 0) &&
    isIsoDate(provenance.retrievedAt) &&
    isIsoDate(provenance.observationPeriod.start) &&
    isIsoDate(provenance.observationPeriod.end) &&
    provenance.observationPeriod.start <= provenance.observationPeriod.end &&
    provenance.bias.reportingIncentives.length > 0 &&
    provenance.bias.knownCoverageGaps.length > 0 &&
    [provenance.uncertainty.low, provenance.uncertainty.high].every(
      value => value === null || Number.isFinite(value)
    )
  );
}

export function clamp(value: number, minimum = 0, maximum = 100): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function normalizeIndicator(value: number, anchors: NormalizationAnchors): number {
  const { bad, reference, good } = anchors;
  if (![value, bad, reference, good].every(Number.isFinite)) {
    throw new Error("Normalization values and anchors must be finite");
  }
  const higherIsBetter = bad < reference && reference < good;
  const lowerIsBetter = good < reference && reference < bad;

  if (!higherIsBetter && !lowerIsBetter) {
    throw new Error("Normalization anchors must be strictly monotonic");
  }

  if (higherIsBetter) {
    if (value <= bad) return 0;
    if (value >= good) return 100;
    if (value <= reference) return (50 * (value - bad)) / (reference - bad);
    return 50 + (50 * (value - reference)) / (good - reference);
  }

  if (value >= bad) return 0;
  if (value <= good) return 100;
  if (value >= reference) return (50 * (bad - value)) / (bad - reference);
  return 50 + (50 * (reference - value)) / (reference - good);
}

export function projectScore(
  baseline: number,
  targetYear: TargetYear,
  asOfYear: number,
  scenarioDelta: number,
  observedSensitivity: number
): number {
  const denominator = 2100 - asOfYear;
  const horizon = denominator <= 0 ? 1 : clamp((targetYear - asOfYear) / denominator, 0, 1);
  return clamp(baseline + horizon * scenarioDelta * observedSensitivity);
}

export function quantile(values: number[], probability: number): number | null {
  if (values.length === 0) return null;
  if (probability < 0 || probability > 1) throw new Error("Quantile must be between 0 and 1");

  const sorted = [...values].sort((left, right) => left - right);
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const fraction = index - lower;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * fraction;
}

export function lifetimeMean(points: Array<{ year: number; value: number }>): number | null {
  if (points.length === 0) return null;
  const sorted = [...points].sort((left, right) => left.year - right.year);
  if (sorted.length === 1) return sorted[0].value;

  let area = 0;
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    if (current.year === previous.year) throw new Error("Lifetime years must be unique");
    area += ((previous.value + current.value) / 2) * (current.year - previous.year);
  }

  const last = sorted.at(-1);
  if (!last) return null;
  return area / (last.year - sorted[0].year);
}

export function weakestConfidence(profile: ConfidenceProfile): ConfidenceGrade {
  return (Object.values(profile) as ConfidenceGrade[]).reduce((weakest, grade) =>
    gradeRank[grade] > gradeRank[weakest] ? grade : weakest
  );
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function summarize(values: Array<number | null>): DistributionSummary {
  const complete = values.every((value): value is number => value !== null);
  if (!complete || values.length !== SCENARIOS.length) {
    return { robust: null, median: null, upside: null };
  }

  const publish = (value: number | null) => (value === null ? null : Math.round(value * 10) / 10);
  return {
    robust: publish(quantile(values, 0.2)),
    median: publish(quantile(values, 0.5)),
    upside: publish(quantile(values, 0.8)),
  };
}

function deltaForScenario(indicator: IndicatorInput, scenario: Scenario): number {
  return (Object.keys(SCENARIO_AXES) as ScenarioAxis[]).reduce((total, axis) => {
    const state = scenario[axis];
    const delta = indicator.scenarioDeltas?.[axis]?.[state];
    if (delta === undefined) {
      throw new Error(`${indicator.id}: missing ${axis}.${state} scenario delta`);
    }
    return total + delta;
  }, 0);
}

function directProjectionFor(
  indicator: IndicatorInput,
  scenario: Scenario,
  targetYear: TargetYear
) {
  const projections = indicator.directProjections?.filter(
    projection => projection.targetYear === targetYear
  );
  return (
    projections?.find(projection => projection.scenarioId === scenario.id) ??
    projections?.find(projection => projection.scenarioId === undefined)
  );
}

function indicatorScore(
  indicator: IndicatorInput,
  scenario: Scenario,
  targetYear: TargetYear,
  asOfYear: number
): number {
  const directProjection = directProjectionFor(indicator, scenario, targetYear);
  if (directProjection) return normalizeIndicator(directProjection.value, indicator.anchors);

  const baseline = normalizeIndicator(indicator.baselineValue, indicator.anchors);
  if (targetYear <= asOfYear) return baseline;
  if (indicator.observedSensitivity === undefined) {
    throw new Error(`${indicator.id}: missing observed sensitivity`);
  }
  return projectScore(
    baseline,
    targetYear,
    asOfYear,
    deltaForScenario(indicator, scenario),
    indicator.observedSensitivity
  );
}

function dimensionScores(
  city: CityCandidate,
  scenario: Scenario,
  targetYear: TargetYear,
  asOfYear: number
): Record<DimensionId, number | null> {
  return Object.fromEntries(
    DIMENSIONS.map(dimension => {
      const subpillarScores = dimension.subpillars.map(subpillar => {
        const scores = city.indicators
          .filter(
            indicator => indicator.owner === dimension.id && indicator.subpillar === subpillar
          )
          .map(indicator => indicatorScore(indicator, scenario, targetYear, asOfYear));
        return mean(scores);
      });

      return [
        dimension.id,
        subpillarScores.every((value): value is number => value !== null)
          ? mean(subpillarScores)
          : null,
      ];
    })
  ) as Record<DimensionId, number | null>;
}

function totalScore(scores: Record<DimensionId, number | null>): number | null {
  if (Object.values(scores).some(score => score === null)) return null;
  return DIMENSIONS.reduce(
    (total, dimension) => total + (scores[dimension.id] as number) * (dimension.weight / 100),
    0
  );
}

function evidenceCoverage(city: CityCandidate): CityReleaseResult["evidenceCoverage"] {
  return Object.fromEntries(
    DIMENSIONS.map(dimension => [
      dimension.id,
      {
        observedSubpillars: dimension.subpillars.filter(subpillar =>
          city.indicators.some(
            indicator =>
              indicator.owner === dimension.id &&
              indicator.subpillar === subpillar &&
              indicator.evidenceLevel === "city_observation" &&
              hasCompleteProvenance(indicator.provenance)
          )
        ).length,
        totalSubpillars: dimension.subpillars.length,
      },
    ])
  ) as CityReleaseResult["evidenceCoverage"];
}

function observedCoverage(coverageByDimension: CityReleaseResult["evidenceCoverage"]): number {
  const coverage = DIMENSIONS.reduce((total, dimension) => {
    const detail = coverageByDimension[dimension.id];
    return total + dimension.weight * (detail.observedSubpillars / detail.totalSubpillars);
  }, 0);
  return Math.round(coverage * 10) / 10;
}

function aggregateTailStatus(tests: CityCandidate["tailTests"]): TailStatus | null {
  const statuses = TAIL_TEST_IDS.map(test => tests[test]);
  if (statuses.some(status => status === null)) return null;
  if (statuses.includes("fail")) return "fail";
  if (statuses.includes("watch")) return "watch";
  return "pass";
}

function rankingReasons(
  city: CityCandidate,
  input: CandidateReleaseInput,
  coverage: number,
  overallConfidence: ConfidenceGrade
): string[] {
  const reasons: string[] = [];
  const hasEverySubpillar = DIMENSIONS.every(dimension =>
    dimension.subpillars.every(subpillar =>
      city.indicators.some(
        indicator => indicator.owner === dimension.id && indicator.subpillar === subpillar
      )
    )
  );

  if (city.boundary.verificationStatus !== "verified") reasons.push("boundary_needs_review");
  if (!input.indicatorRegistryComplete) reasons.push("indicator_registry_incomplete");
  if (!hasEverySubpillar) reasons.push("subpillar_evidence_incomplete");
  if (city.indicators.some(indicator => !hasCompleteProvenance(indicator.provenance))) {
    reasons.push("indicator_provenance_incomplete");
  }
  if (coverage < 85) reasons.push("observed_coverage_below_85");
  if (Object.values(city.evidencePacks).some(complete => !complete)) {
    reasons.push("local_evidence_packs_incomplete");
  }
  if (!city.alternativeChecksComplete) reasons.push("alternative_source_checks_incomplete");
  if (city.alternativeChecksComplete && city.sourceSensitive === null) {
    reasons.push("source_sensitivity_missing");
  }
  if (city.unresolvedEligibilityConflict) reasons.push("unresolved_source_conflict");
  if (overallConfidence === "D") reasons.push("confidence_grade_d");
  if (!input.futureTransformsComplete) reasons.push("future_transforms_incomplete");
  if (city.indicators.some(indicator => indicator.evidenceLevel === "scenario_assumption")) {
    reasons.push("baseline_contains_scenario_assumption");
  }
  if (aggregateTailStatus(city.tailTests) === null) reasons.push("tail_tests_incomplete");

  return reasons;
}

function validateInput(input: CandidateReleaseInput): void {
  if (!isIsoDate(input.asOf)) {
    throw new Error("asOf must be a valid YYYY-MM-DD date");
  }
  if (input.targetYears.join(",") !== TARGET_YEARS.join(",")) {
    throw new Error("Candidate target years do not match model v1");
  }
  if (input.stressTestYear !== 2125) throw new Error("Model v1 stress-test year must be 2125");
  if (new Set(input.cities.map(city => city.slug)).size !== input.cities.length) {
    throw new Error("City slugs must be unique");
  }
  if (DIMENSIONS.reduce((sum, dimension) => sum + dimension.weight, 0) !== 100) {
    throw new Error("Official weights must total 100");
  }

  const subpillars = new Map<string, DimensionId>(
    DIMENSIONS.flatMap(dimension =>
      dimension.subpillars.map(subpillar => [subpillar, dimension.id] as const)
    )
  );
  const scenarioIds = new Set(SCENARIOS.map(scenario => scenario.id));
  const asOfYear = Number(input.asOf.slice(0, 4));
  for (const city of input.cities) {
    if (city.audit) {
      const audit = city.audit;
      if (!isIsoDate(audit.asOf) || audit.asOf > input.asOf) {
        throw new Error(`${city.slug}: invalid evidence audit date`);
      }
      if (
        audit.dimensions
          .map(item => item.id)
          .sort()
          .join(",") !==
        DIMENSIONS.map(item => item.id)
          .sort()
          .join(",")
      ) {
        throw new Error(`${city.slug}: evidence audit must cover each dimension exactly once`);
      }
      for (const item of audit.dimensions) {
        if (
          !["usable_observation", "context_only", "insufficient_evidence"].includes(item.outcome) ||
          !item.summary.en.trim() ||
          !item.summary.zh.trim() ||
          (item.outcome !== "insufficient_evidence" && item.sources.length === 0)
        ) {
          throw new Error(`${city.slug}.${item.id}: incomplete evidence audit`);
        }
      }
      if (
        !["verified", "unresolved"].includes(audit.boundaryReview.outcome) ||
        !audit.boundaryReview.en.trim() ||
        !audit.boundaryReview.zh.trim() ||
        audit.boundaryReview.sources.length === 0
      ) {
        throw new Error(`${city.slug}: incomplete boundary review`);
      }
      const sources = [
        ...audit.dimensions.flatMap(item => item.sources),
        ...audit.boundaryReview.sources,
      ];
      for (const source of sources) {
        if (
          !source.title.trim() ||
          !source.period.trim() ||
          !isIsoDate(source.accessedAt) ||
          source.accessedAt > audit.asOf ||
          !["https:", "http:"].includes(new URL(source.url).protocol)
        ) {
          throw new Error(`${city.slug}: invalid audit source`);
        }
      }
    }
    if (city.boundary.verificationStatus === "verified" && city.boundary.eFuaIds.length === 0) {
      throw new Error(`${city.slug}: verified boundary needs at least one eFUA ID`);
    }
    if (new Set(city.indicators.map(indicator => indicator.id)).size !== city.indicators.length) {
      throw new Error(`${city.slug}: indicator IDs must be unique`);
    }
    if (Object.keys(city.tailTests).sort().join(",") !== [...TAIL_TEST_IDS].sort().join(",")) {
      throw new Error(`${city.slug}: tail-test registry does not match model v1`);
    }
    if (
      Object.values(city.tailTests).some(
        status => status !== null && status !== "pass" && status !== "watch" && status !== "fail"
      )
    ) {
      throw new Error(`${city.slug}: invalid tail-test status`);
    }
    for (const indicator of city.indicators) {
      if (subpillars.get(indicator.subpillar) !== indicator.owner) {
        throw new Error(`${city.slug}.${indicator.id}: subpillar does not belong to owner`);
      }
      normalizeIndicator(indicator.baselineValue, indicator.anchors);
      if (indicator.provenance !== null && !hasCompleteProvenance(indicator.provenance)) {
        throw new Error(`${city.slug}.${indicator.id}: malformed provenance record`);
      }
      if (
        indicator.provenance &&
        (indicator.provenance.retrievedAt > input.asOf ||
          indicator.provenance.observationPeriod.end > input.asOf)
      ) {
        throw new Error(`${city.slug}.${indicator.id}: provenance exceeds the release as-of date`);
      }
      if (
        indicator.observedSensitivity !== undefined &&
        (!Number.isFinite(indicator.observedSensitivity) ||
          indicator.observedSensitivity < 0 ||
          indicator.observedSensitivity > 2)
      ) {
        throw new Error(`${city.slug}.${indicator.id}: observed sensitivity must be 0–2`);
      }
      for (const deltas of Object.values(indicator.scenarioDeltas ?? {})) {
        for (const delta of Object.values(deltas)) {
          if (!Number.isFinite(delta) || Math.abs(delta) > 100) {
            throw new Error(`${city.slug}.${indicator.id}: scenario delta must be bounded to ±100`);
          }
        }
      }
      const projectionKeys = new Set<string>();
      for (const projection of indicator.directProjections ?? []) {
        if (
          !input.targetYears.includes(projection.targetYear) ||
          !Number.isFinite(projection.value) ||
          (projection.scenarioId !== undefined && !scenarioIds.has(projection.scenarioId))
        ) {
          throw new Error(`${city.slug}.${indicator.id}: invalid direct projection`);
        }
        const key = `${projection.targetYear}.${projection.scenarioId ?? "all"}`;
        if (projectionKeys.has(key)) {
          throw new Error(`${city.slug}.${indicator.id}: duplicate direct projection ${key}`);
        }
        projectionKeys.add(key);
      }
      for (const targetYear of input.targetYears.filter(year => year > asOfYear)) {
        for (const scenario of SCENARIOS) {
          if (directProjectionFor(indicator, scenario, targetYear)) continue;
          if (indicator.observedSensitivity === undefined) {
            throw new Error(`${city.slug}.${indicator.id}: future sensitivity is missing`);
          }
          deltaForScenario(indicator, scenario);
        }
      }
    }
  }
}

function computeCity(city: CityCandidate, input: CandidateReleaseInput): CityReleaseResult {
  const asOfYear = Number(input.asOf.slice(0, 4));
  const scenarioPoints = new Map<
    TargetYear,
    Array<{ total: number | null; dimensions: Record<DimensionId, number | null> }>
  >();

  for (const targetYear of input.targetYears) {
    scenarioPoints.set(
      targetYear,
      SCENARIOS.map(scenario => {
        const dimensions = dimensionScores(city, scenario, targetYear, asOfYear);
        return { dimensions, total: totalScore(dimensions) };
      })
    );
  }

  const pointsFor = (year: TargetYear) => {
    const points = scenarioPoints.get(year);
    if (!points) throw new Error(`Missing scenario points for ${year}`);
    return points;
  };

  const results = Object.fromEntries(
    input.targetYears.map(targetYear => {
      const points = pointsFor(targetYear);
      const dimensions = Object.fromEntries(
        DIMENSIONS.map(dimension => {
          const lifetimeByScenario = SCENARIOS.map((_, scenarioIndex) =>
            lifetimeMean(
              input.targetYears
                .filter(year => year <= targetYear)
                .map(year => ({
                  year,
                  value: pointsFor(year)[scenarioIndex].dimensions[dimension.id],
                }))
                .filter(
                  (point): point is { year: TargetYear; value: number } => point.value !== null
                )
            )
          );
          const lifetimeComplete = input.targetYears
            .filter(year => year <= targetYear)
            .every(year => pointsFor(year).every(point => point.dimensions[dimension.id] !== null));

          return [
            dimension.id,
            {
              point: summarize(points.map(point => point.dimensions[dimension.id])),
              lifetime: lifetimeComplete
                ? summarize(lifetimeByScenario)
                : { robust: null, median: null, upside: null },
            },
          ];
        })
      ) as CityReleaseResult["results"][TargetYear]["dimensions"];

      const lifetimeByScenario = SCENARIOS.map((_, scenarioIndex) =>
        lifetimeMean(
          input.targetYears
            .filter(year => year <= targetYear)
            .map(year => ({ year, value: pointsFor(year)[scenarioIndex].total }))
            .filter((point): point is { year: TargetYear; value: number } => point.value !== null)
        )
      );
      const lifetimeComplete = input.targetYears
        .filter(year => year <= targetYear)
        .every(year => pointsFor(year).every(point => point.total !== null));

      return [
        targetYear,
        {
          point: summarize(points.map(point => point.total)),
          lifetime: lifetimeComplete
            ? summarize(lifetimeByScenario)
            : { robust: null, median: null, upside: null },
          dimensions,
        },
      ];
    })
  ) as CityReleaseResult["results"];

  const coverageByDimension = evidenceCoverage(city);
  const coverage = observedCoverage(coverageByDimension);
  const overallConfidence = weakestConfidence(city.confidence);
  const notRankedReasons = rankingReasons(city, input, coverage, overallConfidence);

  return {
    slug: city.slug,
    ...(city.audit ? { audit: city.audit } : {}),
    name: city.name,
    nameZh: city.nameZh,
    country: city.country,
    countryZh: city.countryZh,
    localEvidenceLanguages: city.localEvidenceLanguages,
    boundary: city.boundary,
    indicators: city.indicators,
    confidence: { ...city.confidence, overall: overallConfidence },
    observedCoverage: coverage,
    evidenceCoverage: coverageByDimension,
    rankingEligible: notRankedReasons.length === 0,
    notRankedReasons,
    sourceSensitive: city.sourceSensitive,
    weightSensitive: city.weightSensitive,
    tailStatus: aggregateTailStatus(city.tailTests),
    tailTests: city.tailTests,
    results,
  };
}

export function buildRelease(input: CandidateReleaseInput): CciRelease {
  validateInput(input);
  validateJudgments(input);
  return {
    schemaVersion: "cci-release-v1",
    releaseId: input.releaseId,
    status: input.status,
    asOf: input.asOf,
    modelVersion: input.modelVersion,
    dataVersion: input.dataVersion,
    boundary: input.boundary,
    sourceManifestVersion: input.sourceManifestVersion,
    indicatorRegistryVersion: input.indicatorRegistryVersion,
    futureTransformsVersion: input.futureTransformsVersion,
    targetYears: input.targetYears,
    stressTestYear: input.stressTestYear,
    officialWeights: Object.fromEntries(
      DIMENSIONS.map(dimension => [dimension.id, dimension.weight])
    ) as Record<DimensionId, number>,
    scenarioCount: input.researchModel ? 0 : SCENARIOS.length,
    cities: input.cities.map(city => {
      const result = computeCity(city, input);
      return input.researchModel
        ? {
            ...result,
            judgments: city.judgments,
            results: computeJudgmentResults(city, input),
            rankingEligible: true,
            notRankedReasons: [],
          }
        : result;
    }),
    ...(input.researchModel ? { researchModel: input.researchModel } : {}),
    ...(input.research ? { research: input.research } : {}),
  };
}
