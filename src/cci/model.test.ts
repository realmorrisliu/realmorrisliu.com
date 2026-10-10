import judgmentCandidate from "./data/candidate-2026-10-2";
import expandedCandidate from "./data/candidate-2026-10-3";
import assert from "node:assert/strict";
import test from "node:test";
import octoberCandidate from "./data/candidate-2026-10";
import augustCandidate from "./data/candidate-2026-08";
import reviewedCandidate from "./data/candidate-2026-10-1";
import boundaryAudit from "./data/boundary-audit-2026-10.json";
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

test("context research survives release generation without becoming scored evidence", () => {
  const release = buildRelease(octoberCandidate);
  assert.deepEqual(release.research, octoberCandidate.research);
  assert.deepEqual(release.cities, buildRelease(augustCandidate).cities);
  assert.ok(release.cities.every(city => !city.rankingEligible && city.observedCoverage === 0));
  assert.equal(buildRelease(augustCandidate).research, undefined);
});

test("published evidence reviews cover all cities without granting ranking eligibility", () => {
  const release = buildRelease(reviewedCandidate);
  assert.equal(release.status, "published");
  assert.equal(release.cities.length, 16);
  assert.equal(
    release.cities.reduce((count, city) => count + (city.audit?.dimensions.length ?? 0), 0),
    128
  );
  for (const city of release.cities) {
    assert.equal(city.rankingEligible, false);
    assert.equal(city.observedCoverage, 0);
    assert.equal(city.results[2100].point.median, null);
    assert.ok(!city.notRankedReasons.includes("local_evidence_packs_incomplete"));
    assert.ok(city.notRankedReasons.includes("subpillar_evidence_incomplete"));
  }
  assert.equal(boundaryAudit.sourceSha256, reviewedCandidate.boundary.sourceSha256);
  assert.deepEqual(
    boundaryAudit.cities.map(city => city.slug).sort(),
    release.cities.map(city => city.slug).sort()
  );
});

test("evidence review rejects duplicate dimensions, future sources and unsafe links", () => {
  const duplicate = globalThis.structuredClone(reviewedCandidate);
  duplicate.cities[0].audit.dimensions[1].id = duplicate.cities[0].audit.dimensions[0].id;
  assert.throws(() => buildRelease(duplicate), /exactly once/);
  const future = globalThis.structuredClone(reviewedCandidate);
  future.cities[0].audit.dimensions[0].sources[0].accessedAt = "2026-10-10";
  assert.throws(() => buildRelease(future), /invalid audit source/);
  const unsafe = globalThis.structuredClone(reviewedCandidate);
  unsafe.cities[0].audit.dimensions[0].sources[0].url = "javascript:alert(1)";
  assert.throws(() => buildRelease(unsafe), /invalid audit source/);
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

test("research judgments publish bounded estimates without changing statistical audit facts", () => {
  const release = buildRelease(judgmentCandidate);
  assert.equal(release.scenarioCount, 0);
  assert.equal(release.cities.length, 16);
  for (const city of release.cities) {
    assert.equal(city.rankingEligible, true);
    assert.equal(city.observedCoverage, 0);
    assert.equal(city.judgments?.length, 8);
    for (const year of TARGET_YEARS) {
      for (const result of [city.results[year], ...Object.values(city.results[year].dimensions)]) {
        for (const d of [result.point, result.lifetime]) {
          assert.ok(d.robust !== null && d.median !== null && d.upside !== null);
          assert.ok(
            d.robust >= 0 && d.robust <= d.median && d.median <= d.upside && d.upside <= 100
          );
        }
      }
    }
    assert.deepEqual(city.results[2026].point, city.results[2026].lifetime);
  }
});

test("32-city expansion adds traceable assessments without rescoring the original sample", () => {
  const before = JSON.stringify(judgmentCandidate);
  const previous = buildRelease(judgmentCandidate);
  const expanded = buildRelease(expandedCandidate);
  assert.equal(expanded.cities.length, 32);
  assert.equal(new Set(expanded.cities.map(city => city.slug)).size, 32);
  assert.deepEqual(expanded.officialWeights, previous.officialWeights);
  assert.deepEqual(expanded.cities.slice(0, 16), previous.cities);
  assert.equal(JSON.stringify(judgmentCandidate), before);
  assert.ok(expanded.research?.sampleSelectionUrl);
  assert.equal(
    expanded.cities.reduce((count, city) => count + (city.judgments?.length ?? 0), 0),
    256
  );

  const existingBoundaries = new Set(previous.cities.flatMap(city => city.boundary.eFuaIds));
  for (const city of expanded.cities.slice(16)) {
    assert.ok(city.rankingEligible);
    assert.equal(city.observedCoverage, 0);
    assert.ok(city.audit);
    assert.equal(city.audit.boundaryReview.outcome, "unresolved");
    assert.equal(city.audit.dimensions.length, 8);
    for (const id of city.boundary.eFuaIds) {
      assert.ok(!existingBoundaries.has(id), `${city.slug}: reused functional area`);
      existingBoundaries.add(id);
    }
    assert.ok(city.judgments);
    for (const judgment of city.judgments) {
      const audit = city.audit.dimensions.find(d => d.id === judgment.id);
      assert.ok(audit);
      assert.ok(judgment.sourceUrls.every(url => audit.sources.some(source => source.url === url)));
    }
    for (const year of TARGET_YEARS) {
      const { robust, median, upside } = city.results[year].point;
      assert.ok(robust !== null && median !== null && upside !== null);
      assert.ok(robust >= 0 && robust <= median && median <= upside && upside <= 100);
    }
  }
});

test("expansion applies the existing heat event once to Paris without spreading it to every new city", () => {
  const input = globalThis.structuredClone(expandedCandidate);
  const expanded = buildRelease(input);
  input.researchModel.events = [];
  const withoutEvents = buildRelease(input);
  for (const city of expanded.cities.slice(16)) {
    const baseline = withoutEvents.cities.find(item => item.slug === city.slug);
    assert.ok(baseline);
    const expected = city.slug === "paris" ? -2 : 0;
    const adjustedScore = city.results[2026].dimensions.PCS.point.median;
    const baselineScore = baseline.results[2026].dimensions.PCS.point.median;
    assert.ok(adjustedScore !== null && baselineScore !== null);
    assert.equal(adjustedScore - baselineScore, expected);
    for (const dimension of DIMENSIONS.filter(d => d.id !== "PCS")) {
      assert.deepEqual(
        city.results[2026].dimensions[dimension.id],
        baseline.results[2026].dimensions[dimension.id]
      );
    }
  }
});

test("event effects apply exactly once, stay dimension-local, and preserve the input", () => {
  const input = globalThis.structuredClone(judgmentCandidate);
  const before = JSON.stringify(input);
  const result = buildRelease(input);
  const base = globalThis.structuredClone(input);
  base.researchModel.events = [];
  const baseline = buildRelease(base);
  const boston = result.cities.find(c => c.slug === "boston");
  const bostonBase = baseline.cities.find(c => c.slug === "boston");
  assert.ok(boston && bostonBase);
  assert.equal(
    Number(boston.results[2026].dimensions.LON.point.median) -
      Number(bostonBase.results[2026].dimensions.LON.point.median),
    1
  );
  assert.deepEqual(boston.results[2026].dimensions.MED, bostonBase.results[2026].dimensions.MED);
  assert.equal(
    Math.round(
      (Number(boston.results[2026].point.median) - Number(bostonBase.results[2026].point.median)) *
        10
    ),
    1
  );
  assert.deepEqual(buildRelease(input), result);
  assert.equal(JSON.stringify(input), before);
});

test("research judgment validation rejects missing dimensions, unsafe sources and duplicate or future events", () => {
  const missing = globalThis.structuredClone(judgmentCandidate);
  missing.cities[0].judgments.pop();
  assert.throws(() => buildRelease(missing), /eight judgments/);
  const unsafe = globalThis.structuredClone(judgmentCandidate);
  unsafe.cities[0].judgments[0].sourceUrls = ["javascript:alert(1)"];
  assert.throws(() => buildRelease(unsafe), /invalid research judgment/);
  const duplicate = globalThis.structuredClone(judgmentCandidate);
  duplicate.researchModel.events.push(duplicate.researchModel.events[0]);
  assert.throws(() => buildRelease(duplicate), /duplicate research event/);
  const future = globalThis.structuredClone(judgmentCandidate);
  future.researchModel.events[0].date = "2026-10-10";
  assert.throws(() => buildRelease(future), /research event/);
});

test("neutral research references have transparent time and uncertainty behavior", () => {
  const input = globalThis.structuredClone(judgmentCandidate);
  input.researchModel.events = [];
  input.cities.forEach(city =>
    city.judgments.forEach(d => {
      d.baseline = 50;
      d.uncertainty = 10;
      d.trendPerDecade = 1;
    })
  );
  const city = buildRelease(input).cities[0];
  assert.deepEqual(city.results[2026].point, { robust: 40, median: 50, upside: 60 });
  assert.deepEqual(city.results[2035].point, { robust: 39.1, median: 50.9, upside: 62.7 });
  assert.equal(city.results[2035].lifetime.median, 50.5);
});
