import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { DIMENSIONS, type DimensionId } from "../src/cci/model";

const input = JSON.parse(
  readFileSync(new URL("../docs/data/cci-local-2026-calibration.json", import.meta.url), "utf8")
);
assert.equal(input.status, "synthetic_full_capability_calibration_not_city_scores");
const weights = Object.fromEntries(DIMENSIONS.map(d => [d.id, d.weight])) as Record<
  DimensionId,
  number
>;
assert.equal(
  Object.values(weights).reduce((a, b) => a + b, 0),
  100
);

function total(scores: Partial<Record<DimensionId, number>>, selected = weights) {
  assert(Object.keys(scores).every(id => Object.hasOwn(weights, id)));
  let lower = 0;
  let missingWeight = 0;
  for (const { id } of DIMENSIONS) {
    const value = scores[id];
    if (value === undefined) missingWeight += selected[id];
    else {
      assert(Number.isFinite(value) && value >= 0 && value <= 100);
      lower += (value * selected[id]) / 100;
    }
  }
  return { center: missingWeight ? null : lower, lower, upper: lower + missingWeight };
}

assert.equal(new Set(input.cases.map((c: { id: string }) => c.id)).size, input.cases.length);
for (const c of input.cases) {
  assert(c.description && Object.keys(c.scores).length === DIMENSIONS.length);
  assert(Object.values(c.scores).every(value => [20, 40, 60, 80].includes(value as number)));
  assert.equal(total(c.scores).center, c.expectedTotal);
}
const [a, b] = input.cases;
assert.equal(total({ ...a.scores, MED: 60 }).center, 60);
const missing = { ...a.scores };
delete missing.MED;
assert.deepEqual(total(missing), { center: null, lower: 51, upper: 66 });
assert.throws(() => total({ PCS: 101 }));
assert.throws(() => total({ PCS: Number.NaN }));
const sensitivity = { ...weights, MED: 20, TEC: 5 };
assert.equal(
  Object.values(sensitivity).reduce((x, y) => x + y, 0),
  100
);
assert.equal(total(a.scores, sensitivity).center, 55);
assert.equal(total(b.scores, sensitivity).center, 57);
const realCases = [
  "singapore",
  "london",
  "helsinki",
  "zurich",
  "gaza",
  "tokyo",
  "washington",
  "new-york",
  "paris",
  "san-jose",
  "los-angeles",
  "osaka-kyoto",
  "boston",
  "seoul",
  "lisbon",
  "chicago",
  "prague",
  "beijing",
  "shanghai",
  "jakarta",
  "nanjing",
  "guangzhou",
  "wuhan",
  "xian",
  "surabaya",
  "hangzhou",
].map(city =>
  JSON.parse(
    readFileSync(new URL(`../docs/data/cci-local-2026-${city}-case.json`, import.meta.url), "utf8")
  )
);
assert.equal(new Set(realCases.map(c => c.candidateId)).size, realCases.length);
const realScores = realCases.map(realCase => {
  assert.equal(realCase.status, "real_conditional_calibration_case_not_ranking");
  assert.equal(realCase.evidenceCutoff, "2026-10-10");
  assert.equal(realCase.targetYear, 2026);
  assert.equal(
    realCase.residentPerspective,
    "local_citizen_ordinary_resident_median_income_usual_coverage"
  );
  assert.equal(realCase.dimensions.length, DIMENSIONS.length);
  assert.equal(
    new Set(realCase.dimensions.map((d: { id: string }) => d.id)).size,
    DIMENSIONS.length
  );
  for (const dimension of DIMENSIONS) {
    const review = realCase.dimensions.find((d: { id: string }) => d.id === dimension.id);
    assert(review && review.rationale && review.assumption);
    assert(review.score === null || [20, 40, 60, 80].includes(review.score));
    assert.equal(review.conditionalAlternatives.length === 0, review.score === null);
    assert(
      review.conditionalAlternatives.every((score: number) => [20, 40, 60, 80].includes(score))
    );
    assert.deepEqual(Object.keys(review.subpillars).sort(), [...dimension.subpillars].sort());
    assert(
      Object.values(review.subpillars).every(state =>
        ["partial", "context", "unresolved"].includes(state as string)
      )
    );
  }
  const scores = Object.fromEntries(
    realCase.dimensions
      .filter((d: { score: number | null }) => d.score !== null)
      .map((d: { id: DimensionId; score: number }) => [d.id, d.score])
  ) as Partial<Record<DimensionId, number>>;
  assert.equal(total(scores).center, realCase.expectedConditionalTotal);
  return scores;
});
const [
  singapore,
  london,
  helsinki,
  zurich,
  gaza,
  tokyo,
  washington,
  newYork,
  paris,
  sanJose,
  losAngeles,
  osakaKyoto,
  boston,
  seoul,
  lisbon,
  chicago,
  prague,
  beijing,
  shanghai,
  jakarta,
  nanjing,
  guangzhou,
  wuhan,
  xian,
  surabaya,
  hangzhou,
] = realScores;
const rankAudit = JSON.parse(
  readFileSync(new URL("../docs/data/cci-local-2026-rank-audit.json", import.meta.url), "utf8")
);
assert.equal(rankAudit.status, "arithmetic_identifiability_audit_not_ranking");
const outsideFrameReview = JSON.parse(
  readFileSync(new URL("../docs/data/cci-unmatched-centre-review.json", import.meta.url), "utf8")
);
assert.equal(outsideFrameReview.globalRankingEligible, false);
assert.equal(rankAudit.outsideFrameReview.recordCount, outsideFrameReview.recordCount);
assert.equal(rankAudit.outsideFrameReview.reviewGroupCount, outsideFrameReview.reviewGroupCount);
assert.equal(rankAudit.outsideFrameReview.globalRankingEligible, false);
assert.deepEqual(rankAudit.weights, weights);
assert.equal(rankAudit.conditionalCaseCount, realCases.length);
assert.equal(
  rankAudit.completeConditionalCaseCount,
  realScores.filter(s => total(s).center !== null).length
);
assert.equal(rankAudit.partialCaseCount, realScores.filter(s => total(s).center === null).length);
const digest = (path: string) =>
  createHash("sha256")
    .update(readFileSync(new URL(`../${path}`, import.meta.url)))
    .digest("hex");
const coverage = JSON.parse(
  readFileSync(new URL("../docs/data/cci-global-evidence-matrix.json", import.meta.url), "utf8")
);
const recordPresence = JSON.parse(
  readFileSync(
    new URL("../docs/data/cci-openalex-efua-record-presence.json", import.meta.url),
    "utf8"
  )
);
const populationCoverage = JSON.parse(
  readFileSync(
    new URL("../docs/data/cci-wup-2025-population-coverage.json", import.meta.url),
    "utf8"
  )
);
assert.equal(populationCoverage.centreCount, 12140);
assert.equal(populationCoverage.frozenFuaCount, coverage.candidateCount);
assert.equal(populationCoverage.centresWithKnownOutsidePopulation, 4936);
assert.equal(
  populationCoverage.centresWithoutOldFuaOverlap +
    populationCoverage.centresWithPartialKnownPopulationCoverage,
  4936
);
assert.equal(populationCoverage.centresWithOutsideAreaButNoSampledOutsidePopulation, 59);
assert.equal(populationCoverage.statusCounts.partial_projected_population_coverage, 12140);
assert.equal(
  digest("docs/data/cci-wup-2025-population-coverage.csv"),
  populationCoverage.csvSha256
);
assert.equal(digest("scripts/cci_wup_population_coverage.py"), populationCoverage.scriptSha256);
for (const [key, value] of Object.entries(coverage.boundaryPopulationCoverage)) {
  if (key !== "manifest") assert.deepEqual(value, populationCoverage[key]);
}
assert.equal(
  recordPresence.status,
  "complete_2025_directory_record_associations_not_output_or_scores"
);
assert.equal(recordPresence.candidateCount, coverage.candidateCount);
assert.equal(recordPresence.publicationYear, 2025);
assert.equal(recordPresence.snapshotDate, "2026-09-23");
assert.equal(recordPresence.evidenceCutoff, "2026-10-10");
assert.equal(recordPresence.distinctRecordsWithAssociation, 26684579);
assert.equal(recordPresence.counts.works_with_unassessed_incomplete_authorships, 0);
assert(recordPresence.recordCandidateAssociations >= recordPresence.distinctRecordsWithAssociation);
assert.deepEqual(
  coverage.researchDirectorySignals,
  Object.fromEntries(
    Object.keys(coverage.researchDirectorySignals).map(key => [key, recordPresence[key]])
  )
);
for (const [path, hash] of [
  ["docs/data/cci-openalex-efua-record-presence.csv", recordPresence.csvSha256],
  ["docs/data/cci-global-candidates-r2019a.csv", recordPresence.candidateCsvSha256],
  ["docs/data/cci-openalex-global-affiliation-audit.json", recordPresence.diagnosticSha256],
  ["scripts/cci_openalex_global_affiliation_audit.py", recordPresence.scriptSha256],
  ["scripts/cci_openalex_affiliation_audit.py", recordPresence.affiliationRuleSha256],
]) {
  assert.equal(digest(path), hash);
}
const currentViolence = JSON.parse(
  readFileSync(new URL("../docs/data/cci-ucdp-candidate-2026.json", import.meta.url), "utf8")
);
assert.equal(currentViolence.status, "preliminary_violence_review_not_gss_scores");
assert.equal(currentViolence.candidateCount, coverage.candidateCount);
assert.equal(currentViolence.publicationBeforeCutoffVerified, false);
assert.equal(
  currentViolence.uniqueEventCount,
  currentViolence.sourceRecordCount - currentViolence.overlapCount
);
assert.equal(currentViolence.revisedOverlapCount, 6);
assert.equal(
  currentViolence.verifiedTemporalConflict.eventId,
  realCases[7].currentViolenceReview.eventId
);
assert.equal(
  realCases[7].currentViolenceReview.status,
  "quarantined_source_event_date_conflict_not_2026_impact"
);
assert.equal(digest("scripts/cci_ucdp_candidate_exposure.py"), currentViolence.scriptSha256);
assert.equal(digest("scripts/cci_ucdp_exposure.py"), currentViolence.locationHelperSha256);
assert.equal(digest("scripts/cci_global_crosswalk.py"), currentViolence.geometryHelperSha256);
assert.equal(
  digest("docs/data/cci-ucdp-candidate-2026.json"),
  coverage.preliminary2026Violence.manifestSha256
);
for (const [name, hash] of Object.entries(currentViolence.files)) {
  assert(/^cci-ucdp-candidate-2026-[a-z]+\.csv$/.test(name));
  assert.equal(digest(`docs/data/${name}`), hash);
}
const legal = coverage.legalMobility;
assert.equal(legal.targetYear, 2026);
assert.equal(legal.evidenceCutoff, "2026-10-10");
assert.equal(legal.residentPerspective, realCases[0].residentPerspective);
assert.equal(
  Object.values(legal.statusCounts).reduce((a: number, b) => a + (b as number), 0),
  coverage.candidateCount
);
assert.equal(digest("scripts/cci_global_evidence_matrix.py"), coverage.scriptSha256);
assert.equal(digest("docs/data/cci-global-evidence-matrix.csv"), coverage.csvSha256);
for (const [path, hash] of Object.entries(rankAudit.inputs)) {
  assert(
    /^(cci-[a-z0-9.-]+\.(json|csv|md)|src\/cci\/data\/releases\/cci-2026\.10\.3\.json)$/.test(path)
  );
  const target = path.includes("/")
    ? path
    : `${path.endsWith(".md") ? "docs" : "docs/data"}/${path}`;
  assert.equal(digest(target), hash, `Stale rank audit input: ${path}`);
}
assert.equal(digest("scripts/cci_local_rank_audit.py"), rankAudit.scriptSha256);
assert.equal(digest("docs/data/cci-local-2026-rank-audit.csv"), rankAudit.csvSha256);
assert.equal(digest("scripts/cci_unmatched_centre_review.py"), outsideFrameReview.scriptSha256);
assert.equal(digest("docs/data/cci-unmatched-centre-review.csv"), outsideFrameReview.csvSha256);
for (const [name, reference] of Object.entries(outsideFrameReview.inputs) as [
  string,
  { sha256: string; provenance: string; provenanceSha256: string },
][]) {
  assert(/^cci-[a-z0-9.-]+\.csv$/.test(name));
  assert(/^cci-[a-z0-9.-]+\.json$/.test(reference.provenance));
  assert.equal(digest(`docs/data/${name}`), reference.sha256);
  assert.equal(digest(`docs/data/${reference.provenance}`), reference.provenanceSha256);
}
for (const scores of [singapore, london]) {
  const base = total(scores).center;
  assert(base !== null);
  assert.equal(total({ ...scores, MED: 40 }).center, base - 3);
  assert.equal(total({ ...scores, LON: 60 }).center, base + 2);
  assert.equal(total({ ...scores, TEC: 80 }).center, 60);
  assert.equal(total({ ...scores, LON: 60, TEC: 80 }).center, 62);
  const unresolvedLon: Partial<Record<DimensionId, number>> = { ...scores };
  delete unresolvedLon.LON;
  assert.deepEqual(total(unresolvedLon), { center: null, lower: base - 4, upper: base + 6 });
  assert.equal(total(scores, { ...weights, MED: 10, LON: 15 }).center, base - 1);
}
assert.equal(singapore.TEC, 80);
assert.equal(total(singapore).center, 60);
assert.deepEqual({ ...singapore, TEC: 60 }, london);
assert.equal(realCases[0].technologyReview.sha256, digest(realCases[0].technologyReview.path));
const singaporeWithoutTec = { ...singapore };
delete singaporeWithoutTec.TEC;
assert.deepEqual(total(singaporeWithoutTec), { center: null, lower: 52, upper: 62 });
const singaporeWithoutMedAndTec = { ...singaporeWithoutTec };
delete singaporeWithoutMedAndTec.MED;
assert.deepEqual(total(singaporeWithoutMedAndTec), { center: null, lower: 43, upper: 68 });
assert.equal(helsinki.TEC, 80);
assert.equal(total(helsinki).center, 62);
assert.equal(total({ ...helsinki, MED: 40 }).center, 59);
assert.equal(total({ ...helsinki, LON: 40 }).center, 60);
assert.equal(total({ ...helsinki, TEC: 60 }).center, 60);
for (const caseInput of [realCases[1], realCases[2], realCases[5]]) {
  assert.equal(caseInput.technologyReview.sha256, digest(caseInput.technologyReview.path));
}
const helsinkiWithoutLon: Partial<Record<DimensionId, number>> = { ...helsinki };
delete helsinkiWithoutLon.LON;
assert.deepEqual(total(helsinkiWithoutLon), { center: null, lower: 56, upper: 66 });
const helsinkiWithoutTec = { ...helsinki };
delete helsinkiWithoutTec.TEC;
assert.deepEqual(total(helsinkiWithoutTec), { center: null, lower: 54, upper: 64 });
assert.equal(total(zurich).center, 58);
assert.equal(total({ ...zurich, GSS: 40 }).center, 55);
assert.equal(total({ ...zurich, GSS: 80 }).center, 61);
const zurichWithoutGss: Partial<Record<DimensionId, number>> = { ...zurich };
delete zurichWithoutGss.GSS;
assert.deepEqual(total(zurichWithoutGss), { center: null, lower: 49, upper: 64 });
const zurichWithoutGssAndLon = { ...zurichWithoutGss };
delete zurichWithoutGssAndLon.LON;
assert.deepEqual(total(zurichWithoutGssAndLon), { center: null, lower: 45, upper: 70 });
assert.equal(total({ ...zurich, MED: 40 }).center, 55);
assert.equal(total({ ...zurich, OPT: 80 }).center, 60);
assert.equal(total({ ...zurich, LON: 60 }).center, 60);
assert.equal(total({ ...zurich, LON: 60, OPT: 80 }).center, 62);
const zurichWithoutLon: Partial<Record<DimensionId, number>> = { ...zurich };
delete zurichWithoutLon.LON;
assert.deepEqual(total(zurichWithoutLon), { center: null, lower: 54, upper: 64 });
assert.deepEqual(total(gaza), { center: null, lower: 14, upper: 59 });
assert.deepEqual(total({ ...gaza, PCS: 20 }), { center: null, lower: 11, upper: 56 });
assert.deepEqual(total({ ...gaza, PCS: 60 }), { center: null, lower: 17, upper: 62 });
assert.deepEqual(total({ ...gaza, MED: 40 }), { center: null, lower: 17, upper: 62 });
const gazaWithoutMed = { ...gaza };
delete gazaWithoutMed.MED;
assert.deepEqual(total(gazaWithoutMed), { center: null, lower: 11, upper: 71 });
assert.deepEqual(total(tokyo), { center: 62, lower: 62, upper: 62 });
assert.equal(tokyo.GSS, 60);
const tokyoWithoutGss = { ...tokyo };
delete tokyoWithoutGss.GSS;
assert.deepEqual(total(tokyoWithoutGss), { center: null, lower: 53, upper: 68 });
assert.equal(total({ ...tokyo, GSS: 40 }).center, 59);
assert.equal(tokyo.OPT, 60);
const tokyoWithoutOpt = { ...tokyo };
delete tokyoWithoutOpt.OPT;
assert.deepEqual(total(tokyoWithoutOpt), { center: null, lower: 56, upper: 66 });
assert.equal(tokyo.RES, 60);
const tokyoWithoutRes = { ...tokyo };
delete tokyoWithoutRes.RES;
assert.deepEqual(total(tokyoWithoutRes), { center: null, lower: 56, upper: 66 });
assert.deepEqual(total({ ...tokyo, TEC: 60 }), { center: 60, lower: 60, upper: 60 });
const tokyoWithoutLon = { ...tokyo };
delete tokyoWithoutLon.LON;
assert.deepEqual(total(tokyoWithoutLon), { center: null, lower: 56, upper: 66 });
const tokyoWithoutMed = { ...tokyo };
delete tokyoWithoutMed.MED;
assert.deepEqual(total(tokyoWithoutMed), { center: null, lower: 53, upper: 68 });
const tokyoPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "5129"
);
assert(tokyoPosition);
assert.equal(tokyoPosition.center, 62);
assert.equal(tokyoPosition.bestPosition, 1);
assert.equal(tokyoPosition.worstPosition, rankAudit.candidateCount - 13);
assert.deepEqual(total(washington), { center: 58, lower: 58, upper: 58 });
assert.equal(washington.RES, 40);
assert.equal(washington.OPT, 60);
assert.equal(washington.LON, 60);
assert.equal(washington.GSS, 60);
const washingtonWithoutGss = { ...washington };
delete washingtonWithoutGss.GSS;
assert.deepEqual(total(washingtonWithoutGss), { center: null, lower: 49, upper: 64 });
const washingtonWithoutLon = { ...washington };
delete washingtonWithoutLon.LON;
assert.deepEqual(total(washingtonWithoutLon), { center: null, lower: 52, upper: 62 });
const washingtonWithoutOpt = { ...washington };
delete washingtonWithoutOpt.OPT;
assert.deepEqual(total(washingtonWithoutOpt), { center: null, lower: 52, upper: 62 });
const washingtonWithoutRes = { ...washington };
delete washingtonWithoutRes.RES;
assert.deepEqual(total(washingtonWithoutRes), { center: null, lower: 54, upper: 64 });
const washingtonWithoutMed = { ...washington };
delete washingtonWithoutMed.MED;
assert.deepEqual(total(washingtonWithoutMed), { center: null, lower: 49, upper: 64 });
assert.equal(total({ ...washington, RES: 60 }).center, 60);
assert.equal(total({ ...washington, ISR: 40 }).center, 55);
assert.equal(total({ ...washington, OPT: 40 }).center, 56);
assert.equal(total({ ...washington, LON: 40 }).center, 56);
assert.equal(total({ ...washington, GSS: 60 }).center, 58);
const claimsReview = realCases[6].localLonClaimsReview;
const claimsSource = JSON.parse(
  readFileSync(new URL("../docs/data/cci-cms-2024-lecanemab-source.json", import.meta.url), "utf8")
);
assert.equal(claimsSource.status, "published_claims_adoption_signal_not_city_scores");
assert.equal(claimsSource.publishedRecordCount, 254);
assert.equal(claimsReview.csvSha256, claimsSource.csvSha256);
assert.equal(
  createHash("sha256")
    .update(readFileSync(new URL(`../docs/data/${claimsSource.csv}`, import.meta.url)))
    .digest("hex"),
  claimsSource.csvSha256
);
assert.equal(claimsReview.distinctBeneficiariesWithinRecord, 13);
assert.equal(claimsReview.beneficiaryDaysWithinRecord, 67);
assert.equal(claimsReview.drugBillingUnits1mg, 49100);
assert.deepEqual(claimsReview.fuaPointMatches, [7068]);
const washingtonPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "7068"
);
assert(washingtonPosition);
assert.equal(washingtonPosition.center, 58);
assert.equal(washingtonPosition.bestPosition, 6);
assert.equal(washingtonPosition.worstPosition, rankAudit.candidateCount - 1);
assert.equal(total({ ...washington, GSS: 40 }).center, 55);
assert.equal(total({ ...washington, GSS: 80 }).center, 61);
assert.equal(realCases[6].securityReview.sha256, digest(realCases[6].securityReview.path));
assert.equal(realCases[6].securityReview.fullFuaImpactMeasurement, false);
assert.equal(realCases[6].securityReview.mallMotorcadeAssassinationIntentEstablished, false);
assert.equal(realCases[6].securityReview.ufcPlotIsExecutedAttack, false);
assert.equal(realCases[6].securityReview.gao83EventsAreWashingtonViolentAttacks, false);
assert.equal(realCases[6].securityReview.uscpCasesAreFuaAttacks, false);
assert.equal(realCases[6].securityReview.resumptionProvesAllResidentsSafe, false);
assert.equal(realCases[6].securityReview.may23OriginalStatementRead, false);
assert.equal(realCases[6].referenceBoundaryCheck.referencePoints.length, 10);
for (const point of realCases[6].referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [7068]);
}

assert.deepEqual(total(newYork), { center: 58, lower: 58, upper: 58 });
assert.equal(newYork.RES, 40);
for (const [dimension, lower, upper] of [
  ["PCS", 49, 64],
  ["GSS", 49, 64],
  ["ISR", 49, 64],
  ["MED", 49, 64],
  ["RES", 54, 64],
  ["LON", 52, 62],
  ["TEC", 52, 62],
  ["OPT", 52, 62],
] as const) {
  const withdrawn = { ...newYork };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
const newYorkWithoutMed = { ...newYork };
delete newYorkWithoutMed.MED;
assert.deepEqual(total(newYorkWithoutMed), { center: null, lower: 49, upper: 64 });
const newYorkWithoutLon = { ...newYork };
delete newYorkWithoutLon.LON;
assert.deepEqual(total(newYorkWithoutLon), { center: null, lower: 52, upper: 62 });
const newYorkWithoutOpt = { ...newYork };
delete newYorkWithoutOpt.OPT;
assert.deepEqual(total(newYorkWithoutOpt), { center: null, lower: 52, upper: 62 });
assert.equal(total({ ...newYork, MED: 40 }).center, 55);
assert.equal(total({ ...newYork, LON: 40 }).center, 56);
for (const dimension of ["PCS", "GSS"] as const) {
  assert.equal(newYork[dimension], 60);
  assert.equal(total({ ...newYork, [dimension]: 40 }).center, 55);
  assert.equal(total({ ...newYork, [dimension]: 80 }).center, 61);
}
assert.equal(total({ ...newYork, RES: 60 }).center, 60);
assert.equal(total({ ...newYork, RES: 80 }).center, 62);
const newYorkPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "7244"
);
assert(newYorkPosition);
assert.equal(newYorkPosition.center, 58);
assert.equal(newYorkPosition.bestPosition, 6);
assert.equal(newYorkPosition.worstPosition, rankAudit.candidateCount - 1);
assert.deepEqual(realCases[7].clinicBoundaryCheck.fuaMatches, [7244]);
assert.equal(realCases[7].referenceBoundaryCheck.referencePoints.length, 6);
for (const point of realCases[7].referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [7244]);
}
for (const review of [
  realCases[7].physicalRiskReview,
  realCases[7].securityReview,
  realCases[7].resourceReview,
]) {
  assert.equal(review.sha256, digest(review.path));
}
assert.deepEqual(total(paris), { center: null, lower: 34, upper: 74 });
for (const dimension of ["PCS", "GSS", "RES"] as const) {
  assert.equal(paris[dimension], undefined);
}
for (const [dimension, lower, upper] of [
  ["ISR", 25, 80],
  ["MED", 25, 80],
  ["LON", 30, 80],
  ["TEC", 28, 78],
  ["OPT", 28, 78],
] as const) {
  const withdrawn = { ...paris };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...paris, LON: 60 }), { center: null, lower: 36, upper: 76 });
assert.deepEqual(total({ ...paris, MED: 40 }), { center: null, lower: 31, upper: 71 });
const parisPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "2702"
);
assert(parisPosition);
assert.equal(parisPosition.center, null);
assert.equal(parisPosition.bestPosition, 1);
assert.equal(parisPosition.worstPosition, rankAudit.candidateCount);
assert.equal(
  realCases[8].sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.deepEqual(total(sanJose), { center: null, lower: 30, upper: 80 });
for (const dimension of ["PCS", "GSS", "RES", "LON"] as const) {
  assert.equal(sanJose[dimension], undefined);
}
for (const [dimension, lower, upper] of [
  ["ISR", 21, 86],
  ["MED", 21, 86],
  ["TEC", 24, 84],
  ["OPT", 24, 84],
] as const) {
  const withdrawn = { ...sanJose };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...sanJose, LON: 60 }), { center: null, lower: 36, upper: 76 });
assert.deepEqual(total({ ...sanJose, TEC: 40 }), { center: null, lower: 28, upper: 78 });
const sanJosePosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "1255"
);
assert(sanJosePosition);
assert.equal(sanJosePosition.center, null);
assert.equal(sanJosePosition.bestPosition, 1);
assert.equal(sanJosePosition.worstPosition, rankAudit.candidateCount);
assert.equal(
  realCases[9].referenceBoundaryCheck.fuaSha256,
  realCases[7].clinicBoundaryCheck.fuaSha256
);
assert.equal(realCases[9].referenceBoundaryCheck.referencePoints.length, 2);
for (const point of realCases[9].referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [1255]);
}
assert.equal(realCases[9].claimSignals.exactRegisteredNpiRecords, 0);
assert.equal(realCases[9].claimSignals.nonExactPossibleNpiRecords, 0);
assert.equal(
  realCases[9].claimSignals.coverageManifestSha256,
  digest("docs/data/cci-cms-lecanemab-fua-audit.json")
);
assert.equal(
  realCases[9].sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.equal(total({ ...london, OPT: 80 }).center, 60);
assert.deepEqual(total(losAngeles), { center: null, lower: 42, upper: 67 });
for (const dimension of ["GSS", "RES"] as const) {
  assert.equal(losAngeles[dimension], undefined);
}
for (const [dimension, lower, upper] of [
  ["PCS", 36, 76],
  ["ISR", 33, 73],
  ["MED", 33, 73],
  ["LON", 36, 71],
  ["TEC", 36, 71],
  ["OPT", 36, 71],
] as const) {
  const withdrawn = { ...losAngeles };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...losAngeles, PCS: 60 }), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total({ ...losAngeles, LON: 40 }), { center: null, lower: 40, upper: 65 });
assert.equal(total({ ...losAngeles, GSS: 60, RES: 60 }).center, 57);
const losAngelesPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "1642"
);
assert(losAngelesPosition);
assert.equal(losAngelesPosition.center, null);
assert.equal(losAngelesPosition.bestPosition, 1);
assert.equal(losAngelesPosition.worstPosition, rankAudit.candidateCount);
assert.equal(
  realCases[10].referenceBoundaryCheck.fuaSha256,
  realCases[7].clinicBoundaryCheck.fuaSha256
);
assert.equal(realCases[10].referenceBoundaryCheck.referencePoints.length, 4);
for (const point of realCases[10].referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [1642]);
}
assert.equal(realCases[10].claimSignals.exactRegisteredNpiRecords, 6);
assert.equal(realCases[10].claimSignals.nonExactPossibleNpiRecords, 0);
assert.equal(
  realCases[10].claimSignals.coverageManifestSha256,
  digest("docs/data/cci-cms-lecanemab-fua-audit.json")
);
assert.equal(
  realCases[10].sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
const londonCounterfactual = { ...london, MED: 40, OPT: 80 };
assert.deepEqual(total(osakaKyoto), { center: 60, lower: 60, upper: 60 });
for (const dimension of DIMENSIONS) {
  const withdrawn = { ...osakaKyoto };
  delete withdrawn[dimension.id];
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: 60 - 0.6 * weights[dimension.id],
    upper: 60 + 0.4 * weights[dimension.id],
  });
}
assert.equal(total({ ...osakaKyoto, MED: 40 }).center, 57);
assert.equal(total({ ...osakaKyoto, MED: 80 }).center, 63);
assert.equal(total({ ...osakaKyoto, GSS: 40 }).center, 57);
assert.equal(total({ ...osakaKyoto, GSS: 80 }).center, 63);
assert.equal(
  realCases[11].priorityCompletionReview.sha256,
  digest(realCases[11].priorityCompletionReview.path)
);
const osakaKyotoPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "3956"
);
assert(osakaKyotoPosition);
assert.equal(osakaKyotoPosition.center, 60);
assert.equal(osakaKyotoPosition.bestPosition, 3);
assert.equal(osakaKyotoPosition.worstPosition, rankAudit.candidateCount - 10);
assert.equal(
  realCases[11].referenceBoundaryCheck.fuaSha256,
  realCases[10].referenceBoundaryCheck.fuaSha256
);
assert.equal(realCases[11].referenceBoundaryCheck.referencePoints.length, 7);
for (const point of realCases[11].referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [3956]);
}
assert.equal(realCases[11].clinicalReview.sha256, digest(realCases[11].clinicalReview.path));
for (const review of [realCases[11].securityReview, realCases[11].medicalReassessment]) {
  assert.equal(review.sha256, digest(review.path));
}
assert.equal(realCases[11].qualityReview.status, "interpretation_unresolved_not_all_care_failure");
assert.equal(realCases[11].qualityReview.firstPublicationVerified, false);
const qualityReview = realCases[11].qualityReview;
assert.equal(qualityReview.postingAnnouncement.publisherClaimedPublishedOn, "2026-09-25");
assert(
  qualityReview.postingAnnouncement.publisherClaimedPublishedOn <= realCases[11].evidenceCutoff
);
assert.equal(
  qualityReview.postingAnnouncement.sha256,
  realCases[11].sourceSnapshots.find(
    (s: { url: string }) => s.url === qualityReview.postingAnnouncement.source
  )?.sha256
);
assert.equal(qualityReview.observationPeriod, null);
assert.equal(qualityReview.hospitalExtractionBranch, null);
assert.equal(qualityReview.hospitalImplementationVerified, false);
assert(qualityReview.ruleAdmissionOnOrAfter <= qualityReview.ruleDischargeWindow.startOn);
assert(qualityReview.ruleDischargeWindow.startOn < qualityReview.ruleDischargeWindow.endOn);
assert(qualityReview.ruleDischargeWindow.endOn <= realCases[11].evidenceCutoff);
assert.equal(qualityReview.reportedPeriodLabel, "令和7年度");
assert.notEqual(qualityReview.ruleDischargeWindow.startOn, "2025-04-01");
assert.equal(qualityReview.codeMeaning["0"], "no_prophylactic_administration");
assert.equal(qualityReview.codeMeaning["3"], "over_two_hours_before_surgery");
const qualityRuleSource = realCases[11].sourceSnapshots.find(
  (s: { url: string }) => s.url === qualityReview.collectionRule.url
);
assert(qualityRuleSource);
assert.equal(qualityRuleSource.sha256, qualityReview.collectionRule.sha256);
assert.equal(
  Math.round(
    (10000 * realCases[11].qualityReview.numerator) / realCases[11].qualityReview.denominator
  ) / 100,
  realCases[11].qualityReview.reportedPercent
);
assert.equal(
  realCases[11].sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.deepEqual(total(boston), { center: null, lower: 51, upper: 66 });
assert.equal(boston.GSS, undefined);
for (const dimension of DIMENSIONS.filter(d => d.id !== "GSS")) {
  const withdrawn = { ...boston };
  delete withdrawn[dimension.id];
  const contribution = 0.6 * weights[dimension.id];
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: 51 - contribution,
    upper: 66 - contribution + weights[dimension.id],
  });
}
assert.deepEqual(total({ ...boston, RES: 40 }), { center: null, lower: 49, upper: 64 });
assert.deepEqual(total({ ...boston, MED: 40 }), { center: null, lower: 48, upper: 63 });
assert.equal(
  realCases[12].priorityCompletionReview.sha256,
  digest(realCases[12].priorityCompletionReview.path)
);
assert.equal(realCases[12].excludedEvidence[0].usedForScoring, false);
assert(realCases[12].excludedEvidence[0].declaredPublishedOn > realCases[12].evidenceCutoff);
assert.equal(realCases[12].clinicalSafetyReview.includedPatients, 318);
assert.equal(realCases[12].referenceBoundaryCheck.referencePoints.length, 5);
for (const point of realCases[12].referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [7347]);
}
assert.equal(
  realCases[12].sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.deepEqual(total(seoul), { center: null, lower: 34, upper: 74 });
assert.equal(seoul.LON, 40);
for (const dimension of ["GSS", "RES", "MED"] as const) {
  assert.equal(seoul[dimension], undefined);
}
const seoulWithoutLon = { ...seoul };
delete seoulWithoutLon.LON;
assert.deepEqual(total(seoulWithoutLon), { center: null, lower: 30, upper: 80 });
assert.deepEqual(total({ ...seoul, LON: 60 }), { center: null, lower: 36, upper: 76 });
assert.equal(realCases[13].clinicalReview.sha256, digest(realCases[13].clinicalReview.path));
const seoulAccess = realCases[13].clinicalAccessReview;
assert.equal(
  seoulAccess.startedPatients - seoulAccess.priorAducanumabExcluded,
  seoulAccess.includedPatients
);
assert(seoulAccess.pmcReleasedOn <= realCases[13].evidenceCutoff);
assert(seoulAccess.observationBefore < seoulAccess.publishedOn);
assert.equal(seoulAccess.transferAttemptDenominator, null);
assert.equal(seoulAccess.measured2026CutoffWaiting, false);
assert.equal(seoulAccess.measuredMedianResidentCostIncomeRatio, false);
assert.equal(realCases[13].excludedEvidence[0].usedForScoring, false);
assert.equal(realCases[13].excludedEvidence[0].preCutoffPublicationVerified, false);
for (const point of realCases[13].referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [94]);
}
assert.equal(
  realCases[13].sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.deepEqual(total(lisbon), { center: null, lower: 27, upper: 77 });
assert.equal(lisbon.MED, 40);
for (const dimension of ["PCS", "GSS", "RES", "LON"] as const) {
  assert.equal(lisbon[dimension], undefined);
}
const lisbonWithoutMed = { ...lisbon };
delete lisbonWithoutMed.MED;
assert.deepEqual(total(lisbonWithoutMed), { center: null, lower: 21, upper: 86 });
assert.deepEqual(total({ ...lisbon, MED: 60 }), { center: null, lower: 30, upper: 80 });
assert.equal(realCases[14].clinicalReview.sha256, digest(realCases[14].clinicalReview.path));
assert.equal(realCases[14].medicalWaitReview.samePopulationDenominator, false);
assert.equal(realCases[14].medicalWaitReview.meanWaitingIs2026CutoffMeasurement, false);
assert.equal(realCases[14].medicalWaitReview.medianConflictResolved, false);
assert.equal(realCases[14].medicalWaitReview.qualityFlag.stableRiskAdjustedOutcomeVerified, false);
assert.equal(realCases[14].excludedEvidence[0].usedForCutoffScoring, false);
assert(realCases[14].excludedEvidence[0].displayedUpdatedOn > realCases[14].evidenceCutoff);
for (const point of realCases[14].referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [310]);
}
assert.equal(
  realCases[14].sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.deepEqual(total(chicago), { center: null, lower: 37, upper: 67 });
assert.equal(chicago.PCS, 40);
assert.equal(chicago.RES, 40);
assert.equal(chicago.LON, 60);
assert.equal(chicago.MED, undefined);
assert.equal(chicago.GSS, undefined);
const chicagoWithoutRes = { ...chicago };
delete chicagoWithoutRes.RES;
assert.deepEqual(total(chicagoWithoutRes), { center: null, lower: 33, upper: 73 });
assert.deepEqual(total({ ...chicago, MED: 60 }), { center: null, lower: 46, upper: 61 });
assert.equal(realCases[15].clinicalReview.sha256, digest(realCases[15].clinicalReview.path));
assert.equal(realCases[15].stormReview.iurcFinalLiabilityFinding, false);
assert.equal(realCases[15].stormReview.sameDenominatorVerified, false);
assert.equal(realCases[15].waterReview.monitoringFailureIsContaminationFinding, false);
assert.equal(realCases[15].waterReview.hiddenLoremIpsumUsed, false);
assert.equal(realCases[15].digitalReview.is2025Measurement, false);
assert.equal(realCases[15].transitReview.restatementIsNewObservedGrowth, false);
assert.equal(realCases[15].lonReview.uniqueFuaBeneficiaryTotal, null);
assert.equal(realCases[15].lonReview.localCurrentEarlierMriImplementationVerified, false);
assert.equal(
  realCases[15].lonReview.illinoisAssistanceAutomaticallyAppliesToIndianaResidents,
  false
);
for (const point of realCases[15].referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [6654]);
}
assert.equal(
  realCases[15].sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.deepEqual(total(prague), { center: null, lower: 29, upper: 84 });
assert.equal(prague.TEC, 80);
assert.equal(prague.MED, undefined);
assert.equal(prague.LON, 60);
const pragueWithoutTec = { ...prague };
delete pragueWithoutTec.TEC;
assert.deepEqual(total(pragueWithoutTec), { center: null, lower: 21, upper: 86 });
assert.deepEqual(total({ ...prague, TEC: 60 }), { center: null, lower: 27, upper: 82 });
assert.deepEqual(total({ ...prague, MED: 60 }), { center: null, lower: 38, upper: 78 });
assert.equal(realCases[16].clinicalReview.sha256, digest(realCases[16].clinicalReview.path));
assert.equal(realCases[16].technologyReview.appUsersAreUniqueFuaResidents, false);
assert.equal(realCases[16].technologyReview.allUniversityOutputsAssignedToPrague, false);
assert.equal(realCases[16].lonReview.sameDeduplicatedCohortVerified, false);
assert.equal(realCases[16].lonReview.productsAreTreatedResidents, false);
assert.equal(realCases[16].recoveryReview.forecastWeekendRepairIsVerifiedCompletion, false);
const praguePoints = realCases[16].referenceBoundaryCheck.referencePoints;
assert.equal(praguePoints.length, 8);
for (const point of praguePoints) {
  assert.deepEqual(point.fuaMatches, point.label.startsWith("Kladno") ? [387] : [535]);
}
assert.equal(realCases[16].sharedLegalPath.rule, "other_eu_citizen_to_germany");
assert.equal(
  realCases[16].sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.deepEqual(total(beijing), { center: 60, lower: 60, upper: 60 });
assert.equal(beijing.TEC, 80);
assert.equal(beijing.OPT, 40);
for (const [dimension, lower, upper] of [
  ["PCS", 51, 66],
  ["GSS", 51, 66],
  ["ISR", 51, 66],
  ["MED", 51, 66],
  ["RES", 54, 64],
  ["LON", 54, 64],
  ["TEC", 52, 62],
  ["OPT", 56, 66],
] as const) {
  const withdrawn = { ...beijing };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(total({ ...beijing, LON: 40 }).center, 58);
assert.equal(total({ ...beijing, TEC: 60 }).center, 58);
assert.equal(total({ ...beijing, OPT: 60 }).center, 62);
assert.equal(total({ ...beijing, MED: 40 }).center, 57);
const beijingCase = realCases[17];
for (const review of beijingCase.focusedReviews) {
  assert.equal(review.sha256, digest(review.path));
}
assert.equal(
  beijingCase.researchPriority.sourceSha256,
  digest(`docs/data/${beijingCase.researchPriority.source}`)
);
assert.equal(beijingCase.researchPriority.recordAssociations, 178522);
assert.equal(beijingCase.referenceBoundaryCheck.referencePoints.length, 9);
for (const [label, matches] of [
  ["Miyun urban approximate reference", [7774]],
  ["Huairou urban approximate reference", [7746]],
  ["Taishitun approximate reference", []],
  ["Daxing airport approximate reference", []],
] as const) {
  assert.deepEqual(
    beijingCase.referenceBoundaryCheck.referencePoints.find(
      (p: { label: string }) => p.label === label
    ).fuaMatches,
    matches
  );
}
assert.equal(beijingCase.clinicalChecks.treatedCohort, 42);
assert.equal(beijingCase.clinicalChecks.sixMonthCohort, 29);
assert.equal(beijingCase.clinicalChecks.ariaCases, 3);
assert.equal(beijingCase.clinicalChecks.adjustedBetweenGroupCognitionSignificant, false);
assert.equal(beijingCase.clinicalChecks.supplementaryInsuranceIsUsualBasicCoverage, false);
assert.equal(beijingCase.clinicalChecks.fullReimbursementVideoViewed, false);
const beijingPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "7704"
);
assert(beijingPosition);
assert.equal(beijingPosition.bestPosition, 3);
assert.equal(beijingPosition.worstPosition, rankAudit.candidateCount - 10);

assert.deepEqual(total(shanghai), { center: 58, lower: 58, upper: 58 });
assert.equal(shanghai.LON, 40);
assert.equal(shanghai.TEC, 80);
assert.equal(shanghai.OPT, 40);
for (const [dimension, lower, upper] of [
  ["PCS", 49, 64],
  ["GSS", 49, 64],
  ["ISR", 49, 64],
  ["MED", 49, 64],
  ["RES", 52, 62],
  ["LON", 54, 64],
  ["TEC", 50, 60],
  ["OPT", 54, 64],
] as const) {
  const withdrawn = { ...shanghai };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(total({ ...shanghai, LON: 60 }).center, 60);
assert.equal(total({ ...shanghai, OPT: 60 }).center, 60);
assert.equal(total({ ...shanghai, TEC: 60 }).center, 56);
assert.equal(total({ ...shanghai, MED: 40 }).center, 55);
const shanghaiCase = realCases[18];
for (const review of shanghaiCase.focusedReviews) {
  assert.equal(review.sha256, digest(review.path));
}
assert.equal(
  shanghaiCase.researchPriority.sourceSha256,
  digest(`docs/data/${shanghaiCase.researchPriority.source}`)
);
assert.equal(shanghaiCase.researchPriority.recordAssociations, 94276);
assert.equal(
  shanghaiCase.sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.equal(shanghaiCase.referenceBoundaryCheck.referencePoints.length, 13);
for (const [label, matches] of [
  ["Chongming urban approximate reference", [10126]],
  ["Kunshan urban approximate reference", [9963]],
  ["Tongren Xianxia campus approximate reference", [10097]],
] as const) {
  assert.deepEqual(
    shanghaiCase.referenceBoundaryCheck.referencePoints.find(
      (p: { label: string }) => p.label === label
    ).fuaMatches,
    matches
  );
}
assert.equal(shanghaiCase.clinicalChecks.lonAriaObservedDenominator, 321);
assert.equal(shanghaiCase.clinicalChecks.lonAriaCases, 39);
assert.equal(shanghaiCase.clinicalChecks.lonSymptomaticAriaCases, 4);
assert.equal(shanghaiCase.clinicalChecks.nursingCountsArePatientHarmRates, false);
assert.equal(shanghaiCase.clinicalChecks.multicentreCohortIsAllShanghai, false);
assert.equal(shanghaiCase.clinicalChecks.allMixedWithdrawalsAreEconomic, false);
assert.equal(
  shanghaiCase.clinicalChecks.supplementaryInpatientCoverProvesDayInfusionReimbursement,
  false
);
assert.equal(coverage.legalMobility.countryCandidateCounts.CHN, 1539);
const shanghaiPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "10097"
);
assert(shanghaiPosition);
assert.equal(shanghaiPosition.bestPosition, 6);
assert.equal(shanghaiPosition.worstPosition, rankAudit.candidateCount - 1);

assert.deepEqual(total(jakarta), { center: null, lower: 43, upper: 53 });
assert(!Object.hasOwn(jakarta, "LON"));
for (const [id, lower, upper] of [
  ["PCS", 37, 62],
  ["GSS", 37, 62],
  ["ISR", 37, 62],
  ["RES", 39, 59],
  ["MED", 34, 59],
  ["TEC", 37, 57],
  ["OPT", 37, 57],
] as const) {
  const withdrawn = { ...jakarta };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...jakarta, MED: 40 }), { center: null, lower: 40, upper: 50 });
assert.deepEqual(total({ ...jakarta, TEC: 80 }), { center: null, lower: 45, upper: 55 });
assert.deepEqual(total({ ...jakarta, OPT: 40 }), { center: null, lower: 41, upper: 51 });
const jakartaCase = realCases[19];
for (const review of jakartaCase.focusedReviews) {
  assert.equal(review.sha256, digest(`docs/${review.path}`));
}
assert.equal(
  jakartaCase.researchPriority.sourceSha256,
  digest(`docs/data/${jakartaCase.researchPriority.source}`)
);
assert.equal(jakartaCase.researchPriority.recordAssociations, 73654);
assert.equal(
  jakartaCase.sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.equal(
  jakartaCase.sharedLegalPath.rule,
  "indonesian_citizen_skilled_work_national_visa_germany"
);
assert.equal(coverage.legalMobility.countryCandidateCounts.IDN, 249);
assert.equal(jakartaCase.referenceBoundaryCheck.referencePoints.length, 13);
assert.deepEqual(
  jakartaCase.referenceBoundaryCheck.referencePoints.find(
    (p: { label: string }) => p.label === "Bandung urban approximate reference"
  ).fuaMatches,
  [5107]
);
assert.equal(
  jakartaCase.clinicalChecks.oaArmKnees.reduce((sum: number, value: number) => sum + value, 0),
  jakartaCase.clinicalChecks.oaReportedKnees
);
assert.notEqual(
  jakartaCase.clinicalChecks.oaReportedBilateralPersons +
    jakartaCase.clinicalChecks.oaReportedUnilateralPersons,
  jakartaCase.clinicalChecks.oaReportedPersons
);
assert.equal(jakartaCase.clinicalChecks.oaStudyProvesRegenerationOrHealthspanBenefit, false);
assert.equal(jakartaCase.clinicalChecks.registryAndPaperVersionsReconciled, false);
assert.equal(jakartaCase.clinicalChecks.oaRegistryCurrentStatus, "UNKNOWN");
assert.equal(jakartaCase.clinicalChecks.cpobIsProductMarketingAuthorization, false);
assert.equal(jakartaCase.clinicalChecks.currentRegimenOrdinaryResidentAccessEstablished, false);
assert.equal(jakartaCase.clinicalChecks.displayedActiveRateDenominatorVerified, false);
assert.notEqual(
  jakartaCase.clinicalChecks.displayedActivePercent,
  jakartaCase.clinicalChecks.activePerRegisteredRecalculatedPercent
);
assert(
  jakartaCase.resourceChecks.northJakartaSample <
    jakartaCase.resourceChecks.printedMinimumPerCitySample
);
assert.equal(jakartaCase.resourceChecks.waterCountsAreWholeFuaResidentRates, false);
assert.equal(jakartaCase.securityChecks.nationalDeathsAreAllJakarta, false);
assert.equal(jakartaCase.securityChecks.pendingEventUsedAsVerifiedScoreInput, false);
assert.equal(jakartaCase.mobilityChecks.fxNoUnderlyingThresholdUsdPerPersonMonth, 10000);
assert.equal(jakartaCase.mobilityChecks.thresholdIsAbsoluteTransferCeiling, false);
assert.equal(jakartaCase.mobilityChecks.immigrationRecoveryIsCommunicationsRecovery, false);
assert.equal(jakartaCase.mobilityChecks.cloudflareIncidentIsWholeFuaShutdown, false);
assert.equal(jakartaCase.mobilityChecks.nationalPriorityPointRateIsFuaRate, false);
assert.equal(jakartaCase.sourceSnapshots.length, 66);
const jakartaPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "4897"
);
assert(jakartaPosition);
assert.equal(jakartaPosition.bestPosition, 15);
assert.equal(jakartaPosition.worstPosition, rankAudit.candidateCount);

assert.deepEqual(total(nanjing), { center: 58, lower: 58, upper: 58 });
for (const dimension of DIMENSIONS) {
  const withdrawn = { ...nanjing };
  delete withdrawn[dimension.id];
  const contribution = (nanjing[dimension.id]! * weights[dimension.id]) / 100;
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: 58 - contribution,
    upper: 58 - contribution + weights[dimension.id],
  });
}
assert.equal(total({ ...nanjing, MED: 40 }).center, 55);
assert.equal(total({ ...nanjing, MED: 80 }).center, 61);
const nanjingCase = realCases[20];
for (const review of nanjingCase.focusedReviews)
  assert.equal(review.sha256, digest(`docs/${review.path}`));
assert.equal(
  nanjingCase.researchPriority.sourceSha256,
  digest(`docs/data/${nanjingCase.researchPriority.source}`)
);
assert.equal(nanjingCase.researchPriority.recordAssociations, 71454);
assert.equal(
  nanjingCase.sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.equal(
  nanjingCase.sharedLegalPath.rule,
  "chinese_citizen_skilled_work_national_visa_germany"
);
assert.equal(nanjingCase.referenceBoundaryCheck.referencePoints.length, 14);
assert.deepEqual(nanjingCase.geohazardBoundaryCheck.fuaMatches, [9701]);
assert.deepEqual(
  nanjingCase.referenceBoundaryCheck.referencePoints.find(
    (p: { label: string }) => p.label === "Pukou urban approximate reference"
  ).fuaMatches,
  [9679]
);
assert.equal(
  Object.values(nanjingCase.resourceChecks.waterSampleTypeCounts).reduce(
    (a: number, b) => a + (b as number),
    0
  ),
  nanjingCase.resourceChecks.waterSamples
);
assert.equal(
  nanjingCase.clinicalChecks.thrombusTreatmentGroupPatients.reduce(
    (a: number, b: number) => a + b,
    0
  ),
  nanjingCase.clinicalChecks.thrombusPatients
);
assert.notEqual(
  nanjingCase.clinicalChecks.aorticAkiTableDeaths,
  nanjingCase.clinicalChecks.aorticAkiTextDeaths
);
assert.equal(nanjingCase.clinicalChecks.currentWholeMedAnchorEstablished, true);
assert.equal(
  nanjingCase.priorityCompletionReview.sha256,
  digest(nanjingCase.priorityCompletionReview.path)
);
assert.equal(nanjingCase.clinicalChecks.lecanemabNinghuibaoCoverageVerified, false);
assert.equal(
  nanjingCase.securityChecks.disclosureRequests + nanjingCase.securityChecks.priorCarriedRequests,
  nanjingCase.securityChecks.processedRequests + nanjingCase.securityChecks.carriedRequests
);
assert.equal(nanjingCase.sourceSnapshots.length, 55);
assert.equal(nanjingCase.webOnlySourceReviews.length, 9);
assert(
  nanjingCase.webOnlySourceReviews.every(
    (s: { bytes: null; sha256: null }) => s.bytes === null && s.sha256 === null
  )
);
const nanjingPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "9701"
);
assert(nanjingPosition);
assert.equal(nanjingPosition.bestPosition, 6);
assert.equal(nanjingPosition.worstPosition, rankAudit.candidateCount - 1);

const praguePosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "535"
);
assert(praguePosition);
assert.equal(praguePosition.bestPosition, 1);
assert.equal(praguePosition.worstPosition, rankAudit.candidateCount);
const tokyoWithoutTec = { ...tokyo };
delete tokyoWithoutTec.TEC;
assert.deepEqual(total(tokyoWithoutTec), { center: null, lower: 54, upper: 64 });
const exitSensitivity = { ...weights, MED: 10, OPT: 15 };
assert.equal(total(londonCounterfactual).center, 57);
assert.equal(total(londonCounterfactual, exitSensitivity).center, 59);
assert.equal(total(singapore, exitSensitivity).center, 60);
assert.equal(total({ ...singapore, TEC: 60 }, exitSensitivity).center, 58);
console.log({
  status: input.status,
  totals: input.cases.map((c: { id: string; scores: Record<DimensionId, number> }) => ({
    id: c.id,
    ...total(c.scores),
  })),
  missingMED: total(missing),
  sensitivity: { A: 55, B: 57 },
  realCases: realCases.map(c => ({
    id: c.candidateId,
    conditionalTotal: c.expectedConditionalTotal,
  })),
  comparison: {
    current: { singapore: total(singapore).center, london: total(london).center },
    singaporeUnresolved: {
      TEC: total(singaporeWithoutTec),
      MEDAndTEC: total(singaporeWithoutMedAndTec),
    },
    conditionalMED40OPT80: { singapore: total(singapore).center, london: 57 },
    sameScenarioMED10OPT15: { singapore: 60, london: 59 },
    sameScenarioWithSingaporeTEC60: { singapore: 58, london: 59 },
    helsinki: {
      current: 62,
      conditionalMED40: 59,
      conditionalTEC60: 60,
      unresolvedLON: total(helsinkiWithoutLon),
      unresolvedTEC: total(helsinkiWithoutTec),
    },
    zurich: {
      current: 58,
      conditionalOPT80: 60,
      conditionalGSS80: 61,
      unresolvedGSS: total(zurichWithoutGss),
      unresolvedGSSAndLON: total(zurichWithoutGssAndLon),
      unresolvedLON: total(zurichWithoutLon),
    },
    gaza: { partial: total(gaza), unresolvedMED: total(gazaWithoutMed) },
    tokyo: {
      current: total(tokyo),
      unresolvedGSS: total(tokyoWithoutGss),
      unresolvedOPT: total(tokyoWithoutOpt),
      unresolvedRES: total(tokyoWithoutRes),
      unresolvedLON: total(tokyoWithoutLon),
      unresolvedMED: total(tokyoWithoutMed),
    },
    washington: {
      current: total(washington),
      unresolvedGSS: total(washingtonWithoutGss),
      unresolvedLON: total(washingtonWithoutLon),
      unresolvedOPT: total(washingtonWithoutOpt),
      unresolvedRES: total(washingtonWithoutRes),
      unresolvedMED: total(washingtonWithoutMed),
    },
    newYork: {
      partial: total(newYork),
      unresolvedMED: total(newYorkWithoutMed),
      unresolvedLON: total(newYorkWithoutLon),
      unresolvedOPT: total(newYorkWithoutOpt),
    },
    paris: { partial: total(paris) },
    sanJose: { partial: total(sanJose) },
    losAngeles: { partial: total(losAngeles) },
    osakaKyoto: { partial: total(osakaKyoto) },
    boston: { partial: total(boston) },
    seoul: { partial: total(seoul), withoutLon: total(seoulWithoutLon) },
    lisbon: { partial: total(lisbon), withoutMed: total(lisbonWithoutMed) },
    chicago: { partial: total(chicago), withoutRes: total(chicagoWithoutRes) },
    prague: { partial: total(prague), withoutTec: total(pragueWithoutTec) },
    jakarta: { partial: total(jakarta) },
  },
});

assert.deepEqual(total(guangzhou), { center: null, lower: 45, upper: 70 });
assert(!Object.hasOwn(guangzhou, "MED") && !Object.hasOwn(guangzhou, "LON"));
for (const [dimension, lower, upper] of [
  ["PCS", 36, 76],
  ["GSS", 36, 76],
  ["ISR", 36, 76],
  ["RES", 39, 74],
  ["TEC", 37, 72],
  ["OPT", 41, 76],
] as const) {
  const withdrawn = { ...guangzhou };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
const guangzhouCase = realCases[21];
for (const review of guangzhouCase.focusedReviews)
  assert.equal(review.sha256, digest(`docs/${review.path}`));
assert.equal(
  guangzhouCase.researchPriority.sourceSha256,
  digest(`docs/data/${guangzhouCase.researchPriority.source}`)
);
assert.equal(guangzhouCase.researchPriority.recordAssociations, 64270);
assert.equal(
  guangzhouCase.sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.equal(guangzhouCase.referenceBoundaryCheck.referencePoints.length, 16);
for (const [label, expected] of [
  ["Foshan urban approximate reference", [9711]],
  ["Baiyun airport approximate reference", [9741]],
  ["Panyu urban approximate reference", [9716]],
] as const)
  assert.deepEqual(
    guangzhouCase.referenceBoundaryCheck.referencePoints.find(
      (point: { label: string }) => point.label === label
    )?.fuaMatches,
    expected
  );
assert.equal(guangzhouCase.resourceChecks.waterSampleEnumeratedSerials, 225);
assert.equal(guangzhouCase.resourceChecks.waterTableRowsAreAllFuaHouseholds, false);
assert.equal(
  guangzhouCase.clinicalChecks.promisePrePostPatients.reduce(
    (sum: number, value: number) => sum + value,
    0
  ),
  guangzhouCase.clinicalChecks.promiseEligiblePatients
);
assert.equal(
  guangzhouCase.clinicalChecks.promiseThrombolysedPatients.reduce(
    (sum: number, value: number) => sum + value,
    0
  ),
  1304
);
assert.equal(guangzhouCase.clinicalChecks.promiseCentres, 35);
assert.equal(guangzhouCase.clinicalChecks.promiseTableTextConflictRetained, true);
assert.equal(guangzhouCase.clinicalChecks.dipMeansAre2026MedianBills, false);
assert.equal(guangzhouCase.clinicalChecks.sailNationalPatientsAreGuangzhouCounts, false);
assert.equal(guangzhouCase.clinicalChecks.sailFigureCdrExternalComparison, "ns");
assert.equal(guangzhouCase.clinicalChecks.localPrescriptionEstablishesInfusion, false);
assert.equal(guangzhouCase.clinicalChecks.sskFormal2026Images, 11);
assert.equal(guangzhouCase.clinicalChecks.sskSpecifiedInnovationListCurrentlyEmpty, true);
assert.equal(guangzhouCase.clinicalChecks.sskTwoAntibodiesLowDeductibleVerified, false);
assert.equal(
  guangzhouCase.clinicalChecks.usualBasicInsurancePresumesSupplementaryEnrollment,
  false
);
assert.equal(guangzhouCase.mobilityChecks.airportInside9711, false);
assert.equal(guangzhouCase.mobilityChecks.cloudSamplesAreHouseholdRate, false);
assert.equal(guangzhouCase.sourceSnapshots.length, 82);
assert.equal(guangzhouCase.webOnlySourceReviews.length, 2);
assert(
  guangzhouCase.webOnlySourceReviews.every(
    (source: { bytes: null; sha256: null }) => source.bytes === null && source.sha256 === null
  )
);
const guangzhouPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (row: { efua_id: string }) => row.efua_id === "9711"
);
assert(guangzhouPosition);
assert.equal(guangzhouPosition.bestPosition, 1);
assert.equal(guangzhouPosition.worstPosition, rankAudit.candidateCount);

assert.deepEqual(total(wuhan), { center: null, lower: 54, upper: 64 });
assert(!Object.hasOwn(wuhan, "LON"));
for (const [dimension, lower, upper] of [
  ["PCS", 45, 70],
  ["GSS", 45, 70],
  ["ISR", 45, 70],
  ["RES", 48, 68],
  ["MED", 45, 70],
  ["TEC", 46, 66],
  ["OPT", 50, 70],
] as const) {
  const withdrawn = { ...wuhan };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...wuhan, ISR: 40 }), { center: null, lower: 51, upper: 61 });
const wuhanCase = realCases[22];
assert.equal(
  wuhanCase.priorityCompletionReview.sha256,
  digest(wuhanCase.priorityCompletionReview.path)
);
for (const [lon, center] of [
  [40, 58],
  [60, 60],
  [80, 62],
] as const)
  assert.equal(total({ ...wuhan, LON: lon }).center, center);
for (const review of wuhanCase.focusedReviews)
  assert.equal(review.sha256, digest(`docs/${review.path}`));
assert.equal(
  wuhanCase.researchPriority.sourceSha256,
  digest(`docs/data/${wuhanCase.researchPriority.source}`)
);
assert.equal(wuhanCase.researchPriority.recordAssociations, 54367);
assert.equal(
  wuhanCase.sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.equal(wuhanCase.referenceBoundaryCheck.referencePoints.length, 16);
for (const [label, expected] of [
  ["Tianhe airport approximate reference", []],
  ["Huangpi urban approximate reference", [9020]],
  ["Xinzhou urban approximate reference", [9118]],
] as const)
  assert.deepEqual(
    wuhanCase.referenceBoundaryCheck.referencePoints.find(
      (point: { label: string }) => point.label === label
    )?.fuaMatches,
    expected
  );
assert.equal(
  Object.values(wuhanCase.resourceChecks.waterSampleTypeCounts).reduce(
    (sum: number, value) => sum + (value as number),
    0
  ),
  wuhanCase.resourceChecks.septemberWaterRecords
);
assert.equal(wuhanCase.resourceChecks.septemberWaterRecords, 7);
assert.equal(wuhanCase.resourceChecks.permanganateIndexUnreportedRows, 6);
assert.equal(wuhanCase.resourceChecks.waterTableRowsAreAllFuaHouseholds, false);
assert.equal(wuhanCase.resourceChecks.powerIndicatorsSameDenominatorVerified, false);
assert.equal(
  wuhanCase.securityChecks.disclosureNewRequests +
    wuhanCase.securityChecks.disclosurePriorCarriedRequests,
  wuhanCase.securityChecks.disclosureProcessedRequests +
    wuhanCase.securityChecks.disclosureCarriedRequests
);
assert.equal(wuhanCase.securityChecks.accidentCompensationFullyPaidOn, "2025-08-04");
assert.equal(wuhanCase.securityChecks.accidentInspectionRepairAcceptanceVerified, false);
assert.equal(wuhanCase.securityChecks.satisfactionIsUnadjustedResidentRating, false);
assert.equal(
  wuhanCase.clinicalChecks.dialysisAavDeaths + wuhanCase.clinicalChecks.dialysisAavCensored,
  wuhanCase.clinicalChecks.dialysisAavPatients
);
assert.equal(
  wuhanCase.clinicalChecks.dialysisAavCensoringAdministrative +
    wuhanCase.clinicalChecks.dialysisAavCensoringLost,
  wuhanCase.clinicalChecks.dialysisAavCensored
);
assert.equal(wuhanCase.clinicalChecks.dialysisFiveYearSurvivalIsRawPatientProportion, false);
assert.equal(wuhanCase.clinicalChecks.residentFixedWaitingMonths, 3);
assert.equal(wuhanCase.clinicalChecks.nominalPercentageIsFullBillCoverage, false);
assert.equal(wuhanCase.clinicalChecks.fuhankangFormal2026Images, 15);
assert.equal(wuhanCase.clinicalChecks.unlistedAntibodiesProveNoInpatientPayment, false);
assert.equal(wuhanCase.clinicalChecks.localActualInfusionOriginalVerified, false);
assert.equal(wuhanCase.mobilityChecks.gfwPaperHasWuhanMeasurementPoint, false);
assert.equal(
  wuhanCase.mobilityChecks.satelliteEmergencyVoiceProvesInternationalDataContinuity,
  false
);
assert.equal(wuhanCase.sourceSnapshots.length, 99);
assert.equal(wuhanCase.webOnlySourceReviews.length, 3);
assert(
  wuhanCase.webOnlySourceReviews.every(
    (source: { bytes: null; sha256: null }) => source.bytes === null && source.sha256 === null
  )
);
const wuhanPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (row: { efua_id: string }) => row.efua_id === "8989"
);
assert(wuhanPosition);
assert.equal(wuhanPosition.bestPosition, 1);
assert.equal(wuhanPosition.worstPosition, rankAudit.candidateCount - 1);

assert.deepEqual(total(xian), { center: null, lower: 54, upper: 64 });
assert(!Object.hasOwn(xian, "LON"));
for (const [dimension, lower, upper] of [
  ["PCS", 45, 70],
  ["GSS", 45, 70],
  ["ISR", 45, 70],
  ["RES", 48, 68],
  ["MED", 45, 70],
  ["TEC", 46, 66],
  ["OPT", 50, 70],
] as const) {
  const withdrawn = { ...xian };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...xian, ISR: 40 }), { center: null, lower: 51, upper: 61 });
const xianCase = realCases[23];
for (const review of xianCase.focusedReviews)
  assert.equal(review.sha256, digest(`docs/${review.path}`));
assert.equal(
  xianCase.researchPriority.sourceSha256,
  digest(`docs/data/${xianCase.researchPriority.source}`)
);
assert.equal(xianCase.researchPriority.recordAssociations, 54031);
assert.equal(
  xianCase.sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.equal(xianCase.referenceBoundaryCheck.referencePoints.length, 12);
assert.equal(
  xianCase.resourceChecks.centralizedPlants * 2 + xianCase.resourceChecks.secondaryTerminalRecords,
  xianCase.resourceChecks.januaryWaterRecords
);
assert.equal(
  xianCase.securityChecks.roadDefectsRepaired + xianCase.securityChecks.roadDefectsUnrepaired,
  xianCase.securityChecks.roadDefects
);
assert.equal(xianCase.securityChecks.compensationAgreementIsPaidCompensation, false);
const xianClinical = xianCase.clinicalChecks;
assert.equal(
  xianClinical.nurseExcludedCategoryCounts.reduce((sum: number, value: number) => sum + value, 0),
  xianClinical.nurseExcluded
);
assert.equal(
  xianClinical.nursePrePatients + xianClinical.nursePostPatients + xianClinical.nurseExcluded,
  xianClinical.nurseScreened
);
assert.equal(
  xianClinical.strokeExcludedCategoryCounts.reduce((sum: number, value: number) => sum + value, 0),
  xianClinical.strokeExcluded
);
assert.equal(
  xianClinical.strokeAnalysed + xianClinical.strokeExcluded,
  xianClinical.strokeScreened
);
assert.equal(xianClinical.strokeMatchedIsExactOneToTwo, false);
assert.equal(xianClinical.nominalPercentIsFullBillCoverage, false);
assert.equal(xianClinical.strokeSelectedZeroDeathsProvesAllInterventionsSafe, false);
assert.equal(xianClinical.drillIsActualDisasterRecovery, false);
assert.equal(xianClinical.localHistoricalInfusionOriginalVerified, true);
assert.equal(xianClinical.historicalInfusionCampusExplicitInBody, false);
assert.equal(xianClinical.huiqinbao2026FormalDrugAndMonitoringResponsibilityVerified, false);
assert.equal(xianCase.mobilityChecks.gfwPaperHasXianMeasurementPoint, false);
assert.equal(xianCase.mobilityChecks.capitalGuideExplicitlyRequiresHukouCancellation, false);
assert.equal(xianCase.sourceSnapshots.length, 86);
const xianPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (row: { efua_id: string }) => row.efua_id === "7094"
);
assert(xianPosition);
assert.equal(xianPosition.bestPosition, 1);
assert.equal(xianPosition.worstPosition, rankAudit.candidateCount - 1);

assert.deepEqual(total(surabaya), { center: null, lower: 49, upper: 59 });
assert(!Object.hasOwn(surabaya, "LON"));
for (const [dimension, lower, upper] of [
  ["PCS", 43, 68],
  ["GSS", 40, 65],
  ["ISR", 40, 65],
  ["RES", 45, 65],
  ["MED", 40, 65],
  ["TEC", 43, 63],
  ["OPT", 43, 63],
] as const) {
  const withdrawn = { ...surabaya };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...surabaya, PCS: 60 }), { center: null, lower: 52, upper: 62 });
assert.deepEqual(total({ ...surabaya, ISR: 40 }), { center: null, lower: 46, upper: 56 });
assert.deepEqual(total({ ...surabaya, RES: 60 }), { center: null, lower: 51, upper: 61 });
const surabayaCase = realCases[24];
for (const review of surabayaCase.focusedReviews)
  assert.equal(review.sha256, digest(`docs/${review.path}`));
assert.equal(
  surabayaCase.researchPriority.sourceSha256,
  digest(`docs/data/${surabayaCase.researchPriority.source}`)
);
assert.equal(
  surabayaCase.sharedLegalPath.sourceSha256,
  digest("docs/data/cci-legal-mobility-rules.json")
);
assert.equal(surabayaCase.referenceBoundaryCheck.referencePoints.length, 2);
for (const point of surabayaCase.referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(point.fuaMatches, [6401]);
  assert.equal(
    point.sourceSha256,
    JSON.parse(readFileSync("docs/data/cci-ourairports-source.json", "utf8")).sha256
  );
}
const surabayaWater = surabayaCase.resourceChecks;
assert.equal(
  surabayaWater.householdSkamrtEcoliCompliant + surabayaWater.householdSkamrtEcoliNoncompliant,
  surabayaWater.householdSkamrtSamples2024
);
const surabayaMobility = surabayaCase.mobilityChecks;
assert.equal(
  [
    ...surabayaMobility.passportApplicationsOfficeDays,
    ...surabayaMobility.passportApplicationsMallDays,
  ].reduce((sum: number, value: number) => sum + value, 0),
  surabayaMobility.passportApplicationsTotal
);
assert.equal(
  surabayaMobility.juandaDomesticRoutes + surabayaMobility.juandaInternationalRoutes,
  surabayaMobility.juandaRoutes2025
);
assert.equal(surabayaCase.sourceSnapshots.length, 70);
const surabayaPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (row: { efua_id: string }) => row.efua_id === "6401"
);
assert(surabayaPosition);
assert.equal(surabayaPosition.bestPosition, 6);
assert.equal(surabayaPosition.worstPosition, rankAudit.candidateCount);

assert.deepEqual(total(hangzhou), { center: 58, lower: 58, upper: 58 });
for (const dimension of DIMENSIONS) {
  const withdrawn = { ...hangzhou };
  delete withdrawn[dimension.id];
  const contribution = (hangzhou[dimension.id]! * weights[dimension.id]) / 100;
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: 58 - contribution,
    upper: 58 - contribution + weights[dimension.id],
  });
}
const hangzhouCase = realCases.find(c => c.candidateId === 10078);
assert(hangzhouCase);
for (const review of hangzhouCase.focusedReviews)
  assert.equal(review.sha256, digest(`docs/${review.path}`));
assert.equal(
  hangzhouCase.resourceChecks.tapWaterSamples2025 *
    hangzhouCase.resourceChecks.tapWaterItemsPerSample,
  hangzhouCase.resourceChecks.tapWaterTestItemResults
);
assert.equal(hangzhouCase.clinicalChecks.actualInfusionCampusVerified, false);
assert.equal(hangzhouCase.clinicalChecks.commercialCarrierContractVerified, false);
assert.deepEqual(total({ ...hangzhou, TEC: 60 }), { center: 56, lower: 56, upper: 56 });
