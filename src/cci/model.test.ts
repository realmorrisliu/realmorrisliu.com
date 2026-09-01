import assert from "node:assert/strict";
import test from "node:test";
import {
  DIMENSIONS,
  SCENARIO_AXES,
  SCENARIOS,
  TARGET_YEARS,
  buildRelease,
  lifetimeMean,
  normalizeIndicator,
  projectScore,
  quantile,
  weakestConfidence,
  type CandidateReleaseInput,
  type CityCandidate,
  type IndicatorInput,
  type IndicatorProvenance,
} from "./model";

const fixtureProvenance: IndicatorProvenance = {
  evidenceRole: "canonical",
  sourceId: "fixture-source",
  sourceClass: "official_statistic",
  producer: "Fixture producer",
  producerType: "national_statistics",
  title: "Fixture dataset",
  url: "https://example.com/data",
  sourceVersion: "1",
  retrievedAt: "2026-08-23",
  licenseOrAccess: "Test fixture",
  originalField: "value",
  upstreamSourceIds: [],
  independenceGroup: "fixture",
  unit: "index points",
  observationPeriod: { start: "2026-01-01", end: "2026-08-23" },
  geographyId: "fixture-fua-1",
  boundaryVersion: "1",
  universeAndInclusionRule: "Fixture universe",
  collectionMethod: "Deterministic fixture",
  uncertainty: { low: null, high: null, method: null },
  transformation: { formula: "identity", codeVersion: "1" },
  bias: {
    selectionMechanism: "mandatory",
    reportingControl: "Fixture validation",
    reportingIncentives: ["none known"],
    knownCoverageGaps: ["none known"],
    missingnessRisk: "low",
    verification: "Test assertion",
    sourceLanguage: "en",
    translationStatus: "original",
  },
};

const neutralScenarioDeltas = {
  climate: Object.fromEntries(SCENARIO_AXES.climate.map(state => [state, 0])),
  geopolitics: Object.fromEntries(SCENARIO_AXES.geopolitics.map(state => [state, 0])),
  medicine: Object.fromEntries(SCENARIO_AXES.medicine.map(state => [state, 0])),
} satisfies NonNullable<IndicatorInput["scenarioDeltas"]>;

const completeCity = (): CityCandidate => ({
  slug: "test-city",
  name: "Test City",
  nameZh: "测试城市",
  country: "Test Country",
  countryZh: "测试国家",
  localEvidenceLanguages: ["test"],
  boundary: {
    eFuaIds: [1],
    sourceNames: ["Test City"],
    urbanCentreIds: [1],
    verificationStatus: "verified",
    note: "Verified fixture",
    noteZh: "已验证测试数据",
  },
  evidencePacks: Object.fromEntries(
    DIMENSIONS.map(dimension => [dimension.id, true])
  ) as CityCandidate["evidencePacks"],
  confidence: {
    geographicFit: "A",
    sourceIndependence: "A",
    freshness: "A",
    methodProvenance: "A",
    horizonSupport: "A",
  },
  alternativeChecksComplete: true,
  sourceSensitive: false,
  weightSensitive: false,
  unresolvedEligibilityConflict: false,
  indicators: DIMENSIONS.flatMap(dimension =>
    dimension.subpillars.map(subpillar => ({
      id: `${dimension.id.toLowerCase()}.${subpillar}`,
      owner: dimension.id,
      subpillar,
      baselineValue: 50,
      anchors: { bad: 0, reference: 50, good: 100 },
      evidenceLevel: "city_observation" as const,
      provenance: fixtureProvenance,
      observedSensitivity: 1,
      scenarioDeltas: neutralScenarioDeltas,
    }))
  ),
  tailTests: {
    fatal_heat_humidity: "pass",
    permanent_inundation: "pass",
    geophysical_catastrophe: "pass",
    conflict_strategic_exposure: "pass",
    essential_system_interruption: "pass",
  },
});

const candidate = (city = completeCity()): CandidateReleaseInput => ({
  releaseId: "CCI-test",
  status: "candidate",
  asOf: "2026-08-23",
  modelVersion: "1.0.0",
  dataVersion: "test",
  boundary: {
    product: "test-boundary",
    version: "1",
    epoch: 2015,
    sourceUrl: "https://example.com",
    sourceSha256: "test",
  },
  sourceManifestVersion: "test",
  indicatorRegistryVersion: "test",
  indicatorRegistryComplete: true,
  futureTransformsVersion: "test",
  futureTransformsComplete: true,
  targetYears: [...TARGET_YEARS],
  stressTestYear: 2125,
  cities: [city],
});

test("normalization supports higher- and lower-is-better anchors", () => {
  assert.equal(normalizeIndicator(25, { bad: 0, reference: 50, good: 100 }), 25);
  assert.equal(normalizeIndicator(75, { bad: 100, reference: 50, good: 0 }), 25);
  assert.throws(() => normalizeIndicator(50, { bad: 0, reference: 100, good: 50 }));
  assert.throws(() => normalizeIndicator(Number.NaN, { bad: 0, reference: 50, good: 100 }));
});

test("projection, quantiles, lifetime, and confidence are deterministic", () => {
  assert.equal(projectScore(50, 2100, 2026, -20, 0.5), 40);
  assert.ok(Math.abs((quantile([0, 10, 20, 30], 0.2) ?? 0) - 6) < Number.EPSILON * 10);
  assert.equal(
    lifetimeMean([
      { year: 2026, value: 40 },
      { year: 2100, value: 60 },
    ]),
    50
  );
  assert.equal(
    weakestConfidence({
      geographicFit: "A",
      sourceIndependence: "C",
      freshness: "B",
      methodProvenance: "A",
      horizonSupport: "B",
    }),
    "C"
  );
});

test("a complete neutral fixture produces an eligible 50-point release", () => {
  const release = buildRelease(candidate());
  const city = release.cities[0];

  assert.equal(release.scenarioCount, 27);
  assert.equal(city.rankingEligible, true);
  assert.equal(city.observedCoverage, 100);
  assert.deepEqual(city.results[2100].point, { robust: 50, median: 50, upside: 50 });
  assert.deepEqual(city.results[2100].lifetime, { robust: 50, median: 50, upside: 50 });
});

test("one missing subpillar is visible and blocks ranking", () => {
  const city = completeCity();
  city.indicators = city.indicators.filter(indicator => indicator.subpillar !== "heat_humidity");
  const result = buildRelease(candidate(city)).cities[0];

  assert.equal(result.rankingEligible, false);
  assert.equal(result.results[2050].point.median, null);
  assert.ok(result.notRankedReasons.includes("subpillar_evidence_incomplete"));
});

test("specific projections take precedence and incomplete provenance blocks ranking", () => {
  const city = completeCity();
  city.indicators[0].provenance = null;
  city.indicators[0].directProjections = [
    { targetYear: 2100, value: 0 },
    ...SCENARIOS.map(scenario => ({
      targetYear: 2100 as const,
      scenarioId: scenario.id,
      value: 100,
    })),
  ];
  const result = buildRelease(candidate(city)).cities[0];

  assert.equal(result.results[2100].point.median, 51.9);
  assert.equal(result.rankingEligible, false);
  assert.ok(result.notRankedReasons.includes("indicator_provenance_incomplete"));
});

test("missing future transformations fail closed", () => {
  const city = completeCity();
  delete city.indicators[0].scenarioDeltas;

  assert.throws(() => buildRelease(candidate(city)), /scenario delta/);
});

test("an unassessed tail test blocks ranking", () => {
  const city = completeCity();
  city.tailTests.fatal_heat_humidity = null;
  const result = buildRelease(candidate(city)).cities[0];

  assert.equal(result.rankingEligible, false);
  assert.ok(result.notRankedReasons.includes("tail_tests_incomplete"));
});

test("evidence published after the release as-of date is rejected", () => {
  const city = completeCity();
  city.indicators[0].provenance = { ...fixtureProvenance, retrievedAt: "2026-08-24" };

  assert.throws(() => buildRelease(candidate(city)), /exceeds the release as-of date/);
});
