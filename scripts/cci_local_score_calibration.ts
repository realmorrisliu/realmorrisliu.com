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
  "copenhagen",
  "saifai",
  "grimsby",
  "tampere",
  "cima",
  "oulu",
  "leicester",
  "dublin",
  "turku",
  "edinburgh",
  "jyvaskyla",
  "coventry",
  "loughborough",
  "fazeley",
  "malmo",
  "santa-cruz-de-tenerife",
  "sheffield",
  "aalborg",
  "geneva",
  "seattle",
  "salt-lake-city",
  "sydney",
  "melbourne",
  "toronto",
  "vancouver",
  "vienna",
  "brisbane",
  "groningen",
  "taipei",
  "frankfurt",
  "stockholm",
  "hong-kong",
  "amsterdam",
  "madrid",
  "berlin",
  "montreal",
  "fukuoka",
  "milan",
  "barcelona",
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
  copenhagen,
  saifai,
  grimsby,
  tampere,
  cima,
  oulu,
  leicester,
  dublin,
  turku,
  edinburgh,
  jyvaskyla,
  coventry,
  loughborough,
  fazeley,
  malmo,
  santaCruz,
  sheffield,
  aalborg,
  geneva,
  seattle,
  saltLakeCity,
  sydney,
  melbourne,
  toronto,
  vancouver,
  vienna,
  brisbane,
  groningen,
  taipei,
  frankfurt,
  stockholm,
  hongKong,
  amsterdam,
  madrid,
  berlin,
  montreal,
  fukuoka,
  milan,
  barcelona,
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
for (const scores of [singapore]) {
  const base = total(scores).center;
  assert(base !== null);
  assert.equal(total({ ...scores, MED: 40 }).center, base - 3);
  assert.equal(total({ ...scores, LON: 40 }).center, base - 2);
  assert.equal(total({ ...scores, TEC: 80 }).center, 62);
  assert.equal(total({ ...scores, LON: 60, TEC: 80 }).center, 62);
  const unresolvedLon: Partial<Record<DimensionId, number>> = { ...scores };
  delete unresolvedLon.LON;
  assert.deepEqual(total(unresolvedLon), { center: null, lower: base - 6, upper: base + 4 });
  assert.equal(total(scores, { ...weights, MED: 10, LON: 15 }).center, base);
}
assert.equal(singapore.TEC, 80);
assert.equal(total(singapore).center, 62);
assert.deepEqual({ ...singapore, TEC: 60, LON: 60 }, london);
assert.equal(realCases[0].technologyReview.sha256, digest(realCases[0].technologyReview.path));
const singaporeWithoutTec = { ...singapore };
delete singaporeWithoutTec.TEC;
assert.deepEqual(total(singaporeWithoutTec), { center: null, lower: 54, upper: 64 });
const singaporeWithoutMedAndTec = { ...singaporeWithoutTec };
delete singaporeWithoutMedAndTec.MED;
assert.deepEqual(total(singaporeWithoutMedAndTec), { center: null, lower: 45, upper: 70 });
assert.equal(helsinki.TEC, 80);
assert.deepEqual(total(helsinki), { center: 62, lower: 62, upper: 62 });
assert.equal(helsinki.GSS, 60);
assert.equal(realCases[2].securityReview.sha256, digest(realCases[2].securityReview.path));
assert.deepEqual(total({ ...helsinki, MED: 40 }), { center: 59, lower: 59, upper: 59 });
assert.deepEqual(total({ ...helsinki, LON: 40 }), { center: 60, lower: 60, upper: 60 });
assert.deepEqual(total({ ...helsinki, TEC: 60 }), { center: 60, lower: 60, upper: 60 });
for (const caseInput of [realCases[1], realCases[2], realCases[5]]) {
  assert.equal(caseInput.technologyReview.sha256, digest(caseInput.technologyReview.path));
}
const helsinkiWithoutLon: Partial<Record<DimensionId, number>> = { ...helsinki };
delete helsinkiWithoutLon.LON;
assert.deepEqual(total(helsinkiWithoutLon), { center: null, lower: 56, upper: 66 });
const helsinkiWithoutTec = { ...helsinki };
delete helsinkiWithoutTec.TEC;
assert.deepEqual(total(helsinkiWithoutTec), { center: null, lower: 54, upper: 64 });
assert.equal(total(zurich).center, 60);
assert.equal(total({ ...zurich, GSS: 40 }).center, 57);
assert.equal(total({ ...zurich, GSS: 80 }).center, 63);
const zurichWithoutGss: Partial<Record<DimensionId, number>> = { ...zurich };
delete zurichWithoutGss.GSS;
assert.deepEqual(total(zurichWithoutGss), { center: null, lower: 51, upper: 66 });
const zurichWithoutGssAndLon = { ...zurichWithoutGss };
delete zurichWithoutGssAndLon.LON;
assert.deepEqual(total(zurichWithoutGssAndLon), { center: null, lower: 45, upper: 70 });
assert.equal(total({ ...zurich, MED: 40 }).center, 57);
assert.equal(total({ ...zurich, OPT: 80 }).center, 62);
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
assert.equal(tokyoPosition.worstPosition, rankAudit.candidateCount - 14);
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
assert.equal(washingtonPosition.bestPosition, 13);
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
assert.equal(newYorkPosition.bestPosition, 13);
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
assert.deepEqual(total(paris), { center: 60, lower: 60, upper: 60 });
for (const dimension of DIMENSIONS) {
  assert.equal(paris[dimension.id], 60);
  const withdrawn = { ...paris };
  delete withdrawn[dimension.id];
  const lower = 60 - (60 * weights[dimension.id]) / 100;
  assert.deepEqual(total(withdrawn), { center: null, lower, upper: lower + weights[dimension.id] });
}
assert.deepEqual(total({ ...paris, LON: 40 }), { center: 58, lower: 58, upper: 58 });
assert.deepEqual(total({ ...paris, MED: 40 }), { center: 57, lower: 57, upper: 57 });
const parisReview = realCases[8].priorityCompletionReview;
assert.equal(parisReview.sha256, digest(parisReview.path));
assert.equal(parisReview.previousLonScore, 40);
assert(
  realCases[8].webReadSources.some((source: { sha256?: string | null }) => source.sha256 == null)
);
const parisPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "2702"
);
assert(parisPosition);
assert.equal(parisPosition.center, 60);
assert.equal(parisPosition.bestPosition, 6);
assert.equal(parisPosition.worstPosition, rankAudit.candidateCount - 7);
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
assert.equal(total({ ...london, OPT: 80 }).center, 62);
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
assert.equal(osakaKyotoPosition.bestPosition, 6);
assert.equal(osakaKyotoPosition.worstPosition, rankAudit.candidateCount - 7);
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
assert.deepEqual(total(prague), { center: 62, lower: 62, upper: 62 });
assert.equal(prague.TEC, 80);
assert.equal(
  realCases[16].priorityCompletionReview.sha256,
  digest(realCases[16].priorityCompletionReview.path)
);
for (const dimension of ["PCS", "GSS", "ISR", "MED"] as const) {
  const withdrawn = { ...prague };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower: 53, upper: 68 });
}
assert.equal(prague.MED, 60);
assert.equal(prague.LON, 60);
const pragueWithoutTec = { ...prague };
delete pragueWithoutTec.TEC;
assert.deepEqual(total(pragueWithoutTec), { center: null, lower: 54, upper: 64 });
assert.deepEqual(total({ ...prague, TEC: 60 }), { center: 60, lower: 60, upper: 60 });
assert.deepEqual(total({ ...prague, MED: 40 }), { center: 59, lower: 59, upper: 59 });
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
assert.equal(beijingPosition.bestPosition, 6);
assert.equal(beijingPosition.worstPosition, rankAudit.candidateCount - 7);

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
assert.equal(shanghaiPosition.bestPosition, 13);
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
// Helsinki's restored centre adds one fixed lower bound above Jakarta's upper53.
assert.equal(jakartaPosition.bestPosition, 19);
assert.equal(jakartaPosition.worstPosition, rankAudit.candidateCount);

assert.deepEqual(total(nanjing), { center: null, lower: 49, upper: 64 });
assert.deepEqual(total({ ...nanjing, GSS: 60 }), { center: 58, lower: 58, upper: 58 });
assert.deepEqual(total({ ...nanjing, GSS: 40 }), { center: 55, lower: 55, upper: 55 });
assert.deepEqual(total({ ...nanjing, MED: 40 }), { center: null, lower: 46, upper: 61 });
assert.deepEqual(total({ ...nanjing, MED: 80 }), { center: null, lower: 52, upper: 67 });
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
assert.equal(nanjingPosition.bestPosition, 1);
assert.equal(nanjingPosition.worstPosition, rankAudit.candidateCount);

const praguePosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "535"
);
assert(praguePosition);
assert.equal(praguePosition.bestPosition, 1);
assert.equal(praguePosition.worstPosition, rankAudit.candidateCount - 14);
const tokyoWithoutTec = { ...tokyo };
delete tokyoWithoutTec.TEC;
assert.deepEqual(total(tokyoWithoutTec), { center: null, lower: 54, upper: 64 });
const exitSensitivity = { ...weights, MED: 10, OPT: 15 };
assert.equal(total(londonCounterfactual).center, 59);
assert.equal(total(londonCounterfactual, exitSensitivity).center, 61);
assert.equal(total(singapore, exitSensitivity).center, 62);
assert.equal(total({ ...singapore, TEC: 60 }, exitSensitivity).center, 60);
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
    conditionalMED40OPT80: { singapore: total(singapore).center, london: 59 },
    sameScenarioMED10OPT15: { singapore: 62, london: 61 },
    sameScenarioWithSingaporeTEC60: { singapore: 60, london: 61 },
    helsinki: {
      current: total(helsinki),
      conditionalMED40: total({ ...helsinki, MED: 40 }),
      conditionalTEC60: total({ ...helsinki, TEC: 60 }),
      unresolvedLON: total(helsinkiWithoutLon),
      unresolvedTEC: total(helsinkiWithoutTec),
    },
    zurich: {
      current: 60,
      conditionalOPT80: 62,
      conditionalGSS80: 63,
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

assert.deepEqual(total(guangzhou), { center: null, lower: 54, upper: 64 });
assert.equal(guangzhou.MED, 60);
assert(!Object.hasOwn(guangzhou, "LON"));
for (const [dimension, lower, upper] of [
  ["PCS", 45, 70],
  ["GSS", 45, 70],
  ["ISR", 45, 70],
  ["RES", 48, 68],
  ["MED", 45, 70],
  ["TEC", 46, 66],
  ["OPT", 50, 70],
] as const) {
  const withdrawn = { ...guangzhou };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
const guangzhouCase = realCases[21];
assert.equal(
  guangzhouCase.priorityCompletionReview.sha256,
  digest(guangzhouCase.priorityCompletionReview.path)
);
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
assert.equal(guangzhouCase.sourceSnapshots.length, 84);
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
assert.equal(guangzhouPosition.worstPosition, rankAudit.candidateCount - 1);

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

assert.deepEqual(total(xian), { center: null, lower: 45, upper: 70 });
assert(!Object.hasOwn(xian, "LON"));
for (const [dimension, lower, upper] of [
  ["PCS", 36, 76],
  ["GSS", 45, 70],
  ["ISR", 36, 76],
  ["RES", 39, 74],
  ["MED", 36, 76],
  ["TEC", 37, 72],
  ["OPT", 41, 76],
] as const) {
  const withdrawn = { ...xian };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...xian, ISR: 40 }), { center: null, lower: 42, upper: 67 });
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
assert.equal(xianPosition.worstPosition, rankAudit.candidateCount);

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
assert.equal(surabayaPosition.bestPosition, 13);
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

// Whole-dimension alternatives must retain their original weights and remove an unknown centre.
assert.deepEqual(total(copenhagen), { center: 62, lower: 62, upper: 62 });
assert.equal(copenhagen.TEC, 80);
for (const dimension of DIMENSIONS) {
  const withdrawn = { ...copenhagen };
  delete withdrawn[dimension.id];
  const lower = 62 - (copenhagen[dimension.id]! * weights[dimension.id]) / 100;
  assert.deepEqual(total(withdrawn), { center: null, lower, upper: lower + weights[dimension.id] });
}
assert.deepEqual(total({ ...copenhagen, MED: 40 }), { center: 59, lower: 59, upper: 59 });
assert.deepEqual(total({ ...copenhagen, MED: 40, PCS: 40 }), { center: 56, lower: 56, upper: 56 });
assert.deepEqual(total({ ...copenhagen, LON: 40 }), { center: 60, lower: 60, upper: 60 });
const copenhagenCase = realCases.find(c => c.candidateId === 537);
assert(copenhagenCase);
assert.equal(
  copenhagenCase.priorityCompletionReview.sha256,
  digest(copenhagenCase.priorityCompletionReview.path)
);
assert.equal(copenhagenCase.referenceBoundaryCheck.allGeometryCount, rankAudit.candidateCount);
assert.equal(copenhagenCase.referenceBoundaryCheck.referencePoints.length, 13);
assert.equal(copenhagenCase.sourceSnapshots.length, 41);
assert.equal(copenhagenCase.webReadSources.length, 6);

// Pathway corrections preserve all seven other scores; missing exploration remains unscored.
for (const scores of [london, zurich]) {
  assert.deepEqual(total(scores), { center: 60, lower: 60, upper: 60 });
  for (const dimension of DIMENSIONS) {
    const withdrawn = { ...scores };
    delete withdrawn[dimension.id];
    const lower = 60 - (60 * weights[dimension.id]) / 100;
    assert.deepEqual(total(withdrawn), {
      center: null,
      lower,
      upper: lower + weights[dimension.id],
    });
  }
  assert.deepEqual(total({ ...scores, LON: 40 }), { center: 58, lower: 58, upper: 58 });
}
for (const caseInput of [realCases[0], realCases[1], realCases[3]]) {
  assert.equal(
    caseInput.lonComparabilityReview.sha256,
    digest(caseInput.lonComparabilityReview.path)
  );
  assert.equal(caseInput.lonComparabilityReview.otherSevenDimensionsUnchanged, true);
}
assert.deepEqual(total(saifai), { center: null, lower: 0, upper: 100 });
assert.deepEqual(total({ ...saifai, MED: 60 }), { center: null, lower: 9, upper: 94 });
const saifaiCase = realCases.find(c => c.candidateId === 8299);
assert(saifaiCase);
assert.equal(saifaiCase.boundedReview.sha256, digest(saifaiCase.boundedReview.path));
assert.equal(saifaiCase.referenceBoundaryCheck.allGeometryCount, rankAudit.candidateCount);
assert.deepEqual(saifaiCase.referenceBoundaryCheck.referencePoints[0].covers, [8299]);
assert.equal(saifaiCase.sourceSnapshots.length, 24);
assert.equal(saifaiCase.additionalHypotheses.MED.notMainScore, true);
const saifaiPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (row: { efua_id: string }) => row.efua_id === "8299"
);
assert(saifaiPosition);
assert.equal(saifaiPosition.bestPosition, 1);
assert.equal(saifaiPosition.worstPosition, rankAudit.candidateCount);

// New priority reviews preserve unresolved dimensions and original weights.
assert.deepEqual(total(grimsby), { center: null, lower: 42, upper: 67 });
assert.deepEqual(total(tampere), { center: null, lower: 51, upper: 66 });
assert.equal(grimsby.GSS, undefined);
assert.equal(tampere.GSS, undefined);
assert.equal(grimsby.LON, undefined);
assert.equal(tampere.LON, 60);
assert.deepEqual(total({ ...grimsby, MED: 60 }), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total({ ...tampere, TEC: 80 }), { center: null, lower: 53, upper: 68 });
for (const id of [5518, 397]) {
  const caseInput = realCases.find(c => c.candidateId === id);
  assert(caseInput);
  assert.equal(
    caseInput.priorityCompletionReview.sha256,
    digest(caseInput.priorityCompletionReview.path)
  );
}

// Priority proxies never fill unresolved scores; actual residuals retain full weights.
assert.deepEqual(total(cima), { center: null, lower: 0, upper: 100 });
assert.deepEqual(total(oulu), { center: null, lower: 42, upper: 67 });
assert.deepEqual(total({ ...oulu, MED: 60 }), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total(leicester), { center: 60, lower: 60, upper: 60 });
assert.deepEqual(total({ ...leicester, MED: 40 }), { center: 57, lower: 57, upper: 57 });
assert.deepEqual(total({ ...leicester, RES: 60 }), { center: 60, lower: 60, upper: 60 });
for (const id of [3399, 239, 4925]) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert(reviewedCase);
  assert.equal(
    reviewedCase.priorityCompletionReview.sha256,
    digest(reviewedCase.priorityCompletionReview.path)
  );
}
assert.equal(Object.keys(cima).length, 0);
assert.equal(oulu.GSS, undefined);
assert.equal(oulu.LON, undefined);
assert.equal(leicester.RES, 60);

// Unknown dimensions retain original weights after bounded priority reviews.
assert.deepEqual(total(dublin), { center: null, lower: 48, upper: 63 });
assert.deepEqual(total({ ...dublin, MED: 60 }), { center: null, lower: 51, upper: 66 });
assert.deepEqual(total({ ...dublin, TEC: 80 }), { center: null, lower: 50, upper: 65 });
assert.deepEqual(total(turku), { center: null, lower: 30, upper: 75 });
assert.deepEqual(total({ ...turku, MED: 60 }), { center: null, lower: 33, upper: 78 });
assert.deepEqual(total({ ...turku, TEC: 80 }), { center: null, lower: 32, upper: 77 });
for (const id of [415, 56]) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert(reviewedCase);
  assert.equal(
    reviewedCase.priorityCompletionReview.sha256,
    digest(reviewedCase.priorityCompletionReview.path)
  );
}
assert.equal(dublin.GSS, undefined);
for (const id of ["GSS", "RES", "LON", "OPT"] as const) assert.equal(turku[id], undefined);

// Local disorder alone does not close regional/strategic GSS; unknown weights remain.
assert.deepEqual(total(edinburgh), { center: null, lower: 40, upper: 65 });
assert.deepEqual(total({ ...edinburgh, MED: 40 }), { center: null, lower: 37, upper: 62 });
assert.deepEqual(total({ ...edinburgh, ISR: 60, RES: 60 }), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total(jyvaskyla), { center: null, lower: 36, upper: 76 });
assert.deepEqual(total({ ...jyvaskyla, TEC: 80 }), { center: null, lower: 38, upper: 78 });
for (const id of [2305, 545]) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert(reviewedCase);
  assert.equal(
    reviewedCase.priorityCompletionReview.sha256,
    digest(reviewedCase.priorityCompletionReview.path)
  );
}
assert.equal(edinburgh.GSS, undefined);
assert.equal(edinburgh.LON, undefined);
const edinburghGss = realCases
  .find(c => c.candidateId === 2305)
  .dimensions.find((d: { id: string }) => d.id === "GSS");
assert.deepEqual(edinburghGss.conditionalAlternatives, []);
assert.equal(edinburghGss.subpillars.regional_conflict, "context");
assert.equal(edinburghGss.subpillars.strategic_exposure, "unresolved");

// Similar domains can contain different capability judgments; unknown weights are retained.
assert.deepEqual(total(coventry), { center: null, lower: 42, upper: 67 });
assert.deepEqual(total({ ...coventry, MED: 60 }), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total(loughborough), { center: null, lower: 42, upper: 67 });
const loughboroughWithoutLon = { ...loughborough };
delete loughboroughWithoutLon.LON;
assert.deepEqual(total(loughboroughWithoutLon), { center: null, lower: 36, upper: 71 });
assert.deepEqual(total(fazeley), { center: null, lower: 27, upper: 77 });
assert.deepEqual(total({ ...fazeley, LON: 40 }), { center: null, lower: 25, upper: 75 });
for (const id of [4328, 4892, 4193]) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert(reviewedCase);
  assert.equal(
    reviewedCase.priorityCompletionReview.sha256,
    digest(reviewedCase.priorityCompletionReview.path)
  );
  assert.equal(reviewedCase.dimensions.find((d: { id: string }) => d.id === "GSS").score, null);
}

assert.deepEqual(total(malmo), { center: 60, lower: 60, upper: 60 });
const malmoWithoutGss = { ...malmo };
delete malmoWithoutGss.GSS;
assert.deepEqual(total(malmoWithoutGss), { center: null, lower: 51, upper: 66 });
assert.deepEqual(total({ ...malmo, MED: 40 }), { center: 57, lower: 57, upper: 57 });
assert.deepEqual(total(santaCruz), { center: null, lower: 21, upper: 86 });
for (const id of [481, 395]) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert(reviewedCase);
  assert.equal(
    reviewedCase.priorityCompletionReview.sha256,
    digest(reviewedCase.priorityCompletionReview.path)
  );
}
for (const id of [5288, 481, 4328, 4892, 4193, 2305]) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert.equal(
    reviewedCase.gssComparabilityReview.sha256,
    digest(reviewedCase.gssComparabilityReview.path)
  );
}
assert.equal(realCases[1].gssImpactReview.warOrSuccessfulStrategicAttackRequired, false);
assert.equal(realCases[1].gssImpactReview.nationalThreatIsCityRate, false);
assert.equal(realCases[1].gssImpactReview.rootSupplementOriginals.length, 2);
assert.equal(realCases[1].gssImpactReview.referenceBoundaryCheck.allGeometryCount, 9031);

const gssAudit = JSON.parse(
  readFileSync(new URL("../docs/data/cci-gss-comparability-audit.json", import.meta.url), "utf8")
);
assert.equal(gssAudit.frozenInputCount, 40);
assert.equal(gssAudit.inputBaseCommit, "a039525afa894085059c5d7574e7cee63e1c3a9f");
assert.equal(gssAudit.originalSourcesAllAdjudicated, false);
assert.equal(gssAudit.globalRankingEligible, false);
assert.equal(gssAudit.findings.length, 40);
assert.equal(
  new Set(gssAudit.findings.map((c: { candidateId: number }) => c.candidateId)).size,
  40
);
assert.equal(gssAudit.frozenInputFiles.length, 40);
for (const c of gssAudit.findings) {
  const frozen = gssAudit.frozenInputFiles.find(
    (f: { candidateId: number }) => f.candidateId === c.candidateId
  );
  assert(frozen && c.minimumRemainingEvidenceOrAssumption && c.reviewDepth);
  assert.equal(frozen.fileSha256, c.inputFileSha256);
  assert.equal(frozen.gss.score, c.scoreAtFreeze);
}
assert.deepEqual(gssAudit.scoreCountsAtFreeze, { "60": 19, null: 19, "20": 1, "40": 1 });
for (const id of [5288, 481, 4328, 4892, 4193, 2305]) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert.equal(
    reviewedCase.gssComparabilityReview.auditSha256,
    digest(reviewedCase.gssComparabilityReview.auditPath)
  );
}

for (const id of [5288, 481, 4328, 4892, 4193, 2305]) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert.equal(reviewedCase.gssComparabilityReview.warOrSuccessfulStrategicAttackRequired, false);
}

assert.deepEqual(total(sheffield), { center: null, lower: 33, upper: 73 });
assert.deepEqual(total({ ...sheffield, ISR: 60 }), { center: null, lower: 36, upper: 76 });
const sheffieldCase = realCases.find(c => c.candidateId === 4460);
assert.equal(
  sheffieldCase.priorityCompletionReview.sha256,
  digest(sheffieldCase.priorityCompletionReview.path)
);
for (const id of [9701, 8989]) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert.equal(
    reviewedCase.gssComparabilityReview.sha256,
    digest(reviewedCase.gssComparabilityReview.path)
  );
  assert.equal(reviewedCase.gssSupplement.warOrSuccessfulStrategicAttackRequired, false);
}

for (const [id, field] of [
  [481, "technologyPriorityReview"],
  [4925, "resourcesPriorityReview"],
] as const) {
  const reviewedCase = realCases.find(c => c.candidateId === id);
  assert.equal(reviewedCase[field].sha256, digest(reviewedCase[field].path));
}
const malmoWithoutTec = { ...malmo };
delete malmoWithoutTec.TEC;
assert.deepEqual(total(malmoWithoutTec), { center: null, lower: 54, upper: 64 });
const leicesterWithoutRes = { ...leicester };
delete leicesterWithoutRes.RES;
assert.deepEqual(total(leicesterWithoutRes), { center: null, lower: 54, upper: 64 });

const challengerAudit = JSON.parse(
  readFileSync(new URL("../docs/data/cci-priority-challengers-audit.json", import.meta.url), "utf8")
);
assert.equal(challengerAudit.globalRankingEligible, false);
assert.equal(challengerAudit.surveyCities, 83);
assert.equal(challengerAudit.derived.sha256, digest(`docs/data/${challengerAudit.derived.path}`));

assert.equal(xianCase.gssComparabilityReview.sha256, digest(xianCase.gssComparabilityReview.path));
assert.equal(xianCase.gssSupplement.warOrSuccessfulStrategicAttackRequired, false);
assert.deepEqual(total({ ...xian, GSS: 60 }), { center: null, lower: 54, upper: 64 });

const bostonCase = realCases.find(c => c.candidateId === 7347);
assert.equal(bostonCase.gssPriorityReview.sha256, digest(bostonCase.gssPriorityReview.path));
assert.equal(bostonCase.gssPriorityReview.qualifyingNewEntryFound, false);
assert.equal(bostonCase.gssPriorityReview.deepDiscoveryReopened, false);
assert.equal(bostonCase.gssPriorityReview.dimensionObjectsChanged, false);
assert.deepEqual(total(boston), { center: null, lower: 51, upper: 66 });

const serviceInventory = JSON.parse(
  readFileSync(new URL("../docs/data/cci-u4ssc-source-inventory.json", import.meta.url), "utf8")
);
assert.equal(serviceInventory.candidateCount, 9031);
assert.equal(
  serviceInventory.mappedEntries.length + serviceInventory.unresolvedEntries.length,
  serviceInventory.indexEntries
);
assert.equal(serviceInventory.readReportCount, 3);
assert.equal(serviceInventory.indicatorTransfer, false);
assert.equal(serviceInventory.scoreTransfer, false);
assert.equal(serviceInventory.globalRankingEligible, false);
assert.equal(serviceInventory.csvSha256, digest("docs/data/cci-u4ssc-candidate-source-refs.csv"));
assert.equal(
  serviceInventory.indexSnapshotSha256,
  digest("docs/data/cci-u4ssc-verification-index.json")
);
assert.equal(serviceInventory.scriptSha256, digest("scripts/cci_u4ssc_source_inventory.py"));
assert.equal(
  serviceInventory.reportedKpiSnapshotSha256,
  digest("docs/data/cci-u4ssc-reported-kpis.json")
);
const reportedKpis = JSON.parse(
  readFileSync(new URL("../docs/data/cci-u4ssc-reported-kpis.json", import.meta.url), "utf8")
);
const daeguKpis = reportedKpis.rows.find(
  (row: { candidateId: number }) => row.candidateId === 2453
);
assert.equal(daeguKpis.observationYear, null);
assert.deepEqual(daeguKpis.analysisPeriodForMajorityKpis, [2020, 2021]);
assert.equal(daeguKpis.analysisPeriodPerKpiVerified, false);
assert.equal(daeguKpis.supplementalReview.currentWaterObservationsTransferredToCci, false);
assert.equal(daeguKpis.supplementalReview.sha256, digest(daeguKpis.supplementalReview.path));

assert.deepEqual(total(aalborg), { center: null, lower: 42, upper: 67 });
assert.deepEqual(total({ ...aalborg, MED: 60 }), { center: null, lower: 45, upper: 70 });
const aalborgWithoutLon = { ...aalborg };
delete aalborgWithoutLon.LON;
assert.deepEqual(total(aalborgWithoutLon), { center: null, lower: 36, upper: 71 });
const aalborgCase = realCases.find(c => c.candidateId === 46);
assert.equal(
  aalborgCase.priorityCompletionReview.sha256,
  digest(aalborgCase.priorityCompletionReview.path)
);
assert.equal(
  aalborgCase.dimensions.find((d: { id: string }) => d.id === "GSS").subpillars.regional_conflict,
  "context"
);

assert.deepEqual(total(geneva), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total({ ...geneva, MED: 40 }), { center: null, lower: 42, upper: 67 });
const genevaWithoutLon = { ...geneva };
delete genevaWithoutLon.LON;
assert.deepEqual(total(genevaWithoutLon), { center: null, lower: 39, upper: 74 });
const genevaCase = realCases.find(c => c.candidateId === 29);
assert.equal(
  genevaCase.priorityCompletionReview.sha256,
  digest(genevaCase.priorityCompletionReview.path)
);

const helsinkiWithoutGss = { ...helsinki };
delete helsinkiWithoutGss.GSS;
assert.deepEqual(total(helsinkiWithoutGss), { center: null, lower: 53, upper: 68 });
assert.equal(realCases[2].gssPriorityReview.sha256, digest(realCases[2].gssPriorityReview.path));
assert.equal(realCases[2].gssPriorityReview.otherSevenDimensionsUnchanged, true);
assert.equal(realCases[2].gssPriorityReview.warOrSuccessfulStrategicAttackRequired, false);
assert.equal(total({ ...helsinki, GSS: 40 }).center, 59);

const knowledgeIndex = JSON.parse(
  readFileSync(new URL("../docs/data/cci-wipo2025-identity-index.json", import.meta.url), "utf8")
);
assert.equal(knowledgeIndex.entries.length, 100);
assert.equal(knowledgeIndex.exactUniqueIdentityEntries + knowledgeIndex.unresolvedEntries, 100);
assert.equal(knowledgeIndex.metricTransfer, false);
assert.equal(knowledgeIndex.globalRankingEligible, false);
assert(
  knowledgeIndex.entries.every(
    (entry: { metricsTransferred: boolean }) => !entry.metricsTransferred
  )
);
assert.equal(knowledgeIndex.review.sha256, digest(knowledgeIndex.review.path));
assert.equal(realCases[21].lonPriorityReview.sha256, digest(realCases[21].lonPriorityReview.path));
assert.equal(realCases[21].lonPriorityReview.dimensionObjectsChanged, false);

assert.deepEqual(total(seattle), { center: null, lower: 37, upper: 67 });
assert.deepEqual(total({ ...seattle, RES: 60 }), { center: null, lower: 39, upper: 69 });
assert.deepEqual(total({ ...seattle, PCS: 60 }), { center: null, lower: 40, upper: 70 });
const seattleWithoutLon = { ...seattle };
delete seattleWithoutLon.LON;
assert.deepEqual(total(seattleWithoutLon), { center: null, lower: 31, upper: 71 });
const seattleCase = realCases.find(c => c.candidateId === 4510);
assert.equal(
  seattleCase.priorityCompletionReview.sha256,
  digest(seattleCase.priorityCompletionReview.path)
);

assert.deepEqual(total({ ...seattle, MED: 60 }), { center: null, lower: 46, upper: 61 });
assert.equal(
  seattleCase.medComparabilityReview.sha256,
  digest(seattleCase.medComparabilityReview.path)
);
assert.equal(seattleCase.medComparabilityReview.ageRestrictionRemoved, true);
assert.equal(seattleCase.medComparabilityReview.scoreChanged, false);

assert.deepEqual(total(saltLakeCity), { center: null, lower: 21, upper: 81 });
assert.deepEqual(total({ ...saltLakeCity, RES: 40 }), { center: null, lower: 25, upper: 75 });
assert.deepEqual(total({ ...saltLakeCity, RES: 60 }), { center: null, lower: 27, upper: 77 });
const saltLakeCityWithoutRes = { ...saltLakeCity };
delete saltLakeCityWithoutRes.RES;
assert.deepEqual(total(saltLakeCityWithoutRes), { center: null, lower: 21, upper: 81 });
assert.deepEqual(total(sydney), { center: null, lower: 48, upper: 63 });
assert.equal(total({ ...sydney, GSS: 60 }).center, 57);
const sydneyWithoutLon = { ...sydney };
delete sydneyWithoutLon.LON;
assert.deepEqual(total(sydneyWithoutLon), { center: null, lower: 42, upper: 67 });
for (const id of [4881, 1830]) {
  const c = realCases.find(c => c.candidateId === id);
  assert.equal(c.priorityCompletionReview.sha256, digest(c.priorityCompletionReview.path));
}

const tampereWithoutLon = { ...tampere };
delete tampereWithoutLon.LON;
assert.deepEqual(total(tampereWithoutLon), { center: null, lower: 45, upper: 70 });
const tampereCase = realCases.find(c => c.candidateId === 397);
assert.equal(tampereCase.lonPriorityReview.sha256, digest(tampereCase.lonPriorityReview.path));
assert.equal(tampereCase.lonPriorityReview.otherSevenDimensionsUnchanged, true);
assert.equal(tampereCase.lonPriorityReview.gssNotReopened, true);

assert.deepEqual(total(melbourne), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total({ ...melbourne, RES: 40 }), { center: null, lower: 49, upper: 64 });
assert.deepEqual(total({ ...melbourne, RES: 60 }), { center: null, lower: 51, upper: 66 });
assert.deepEqual(total({ ...melbourne, MED: 40 }), { center: null, lower: 42, upper: 67 });
const melbourneWithoutRes = { ...melbourne };
delete melbourneWithoutRes.RES;
assert.deepEqual(total(melbourneWithoutRes), { center: null, lower: 45, upper: 70 });
const melbourneWithoutLon = { ...melbourne };
delete melbourneWithoutLon.LON;
assert.deepEqual(total(melbourneWithoutLon), { center: null, lower: 39, upper: 74 });
const melbourneCase = realCases.find(c => c.candidateId === 1266);
assert.equal(
  melbourneCase.priorityCompletionReview.sha256,
  digest(melbourneCase.priorityCompletionReview.path)
);

assert.deepEqual(total(toronto), { center: null, lower: 42, upper: 72 });
assert.deepEqual(total({ ...toronto, MED: 40 }), { center: null, lower: 48, upper: 63 });
assert.deepEqual(total({ ...toronto, MED: 60 }), { center: null, lower: 51, upper: 66 });
const torontoWithoutLon = { ...toronto };
delete torontoWithoutLon.LON;
assert.deepEqual(total(torontoWithoutLon), { center: null, lower: 36, upper: 76 });
const torontoCase = realCases.find(c => c.candidateId === 2626);
assert.equal(
  torontoCase.priorityCompletionReview.sha256,
  digest(torontoCase.priorityCompletionReview.path)
);

const torontoWithoutOpt = { ...toronto };
delete torontoWithoutOpt.OPT;
assert.deepEqual(total(torontoWithoutOpt), { center: null, lower: 36, upper: 76 });
assert.equal(torontoCase.optPriorityReview.sha256, digest(torontoCase.optPriorityReview.path));
assert.equal(torontoCase.optPriorityReview.otherSevenWholeObjectsUnchanged, true);

assert.deepEqual(total(vancouver), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total({ ...vancouver, RES: 40 }), { center: null, lower: 49, upper: 64 });
assert.deepEqual(total({ ...vancouver, RES: 60 }), { center: null, lower: 51, upper: 66 });
assert.deepEqual(total(vienna), { center: null, lower: 45, upper: 70 });
const viennaWithoutMed = { ...vienna };
delete viennaWithoutMed.MED;
assert.deepEqual(total(viennaWithoutMed), { center: null, lower: 36, upper: 76 });
const viennaWithoutLon = { ...vienna };
delete viennaWithoutLon.LON;
assert.deepEqual(total(viennaWithoutLon), { center: null, lower: 39, upper: 74 });
for (const id of [375, 790]) {
  const c = realCases.find(c => c.candidateId === id);
  assert.equal(c.priorityCompletionReview.sha256, digest(c.priorityCompletionReview.path));
  assert.equal(c.priorityCompletionReview.rootVerifiedFull9031AndOriginals, true);
  assert.equal(c.globalRankingEligible, false);
}

for (const id of [375, 1266, 2626, 397, 4881, 537]) {
  const c = realCases.find(c => c.candidateId === id);
  assert.equal(c.resComparabilityReview.sha256, digest(c.resComparabilityReview.path));
  assert.equal(c.resComparabilityReview.rootOtherSevenUnchanged, true);
  if ([375, 1266, 4881].includes(id)) {
    assert.equal(c.dimensions.find((d: { id: string }) => d.id === "RES").score, null);
    assert.equal(c.resDiscussionScenarios.notAdopted, true);
  }
}

assert.deepEqual(total(brisbane), { center: null, lower: 36, upper: 71 });
assert.deepEqual(total({ ...brisbane, MED: 60 }), { center: null, lower: 39, upper: 74 });
const brisbaneWithoutMed = { ...brisbane };
delete brisbaneWithoutMed.MED;
assert.deepEqual(total(brisbaneWithoutMed), { center: null, lower: 30, upper: 80 });
assert.deepEqual(total(groningen), { center: null, lower: 36, upper: 76 });
const groningenWithoutMed = { ...groningen };
delete groningenWithoutMed.MED;
assert.deepEqual(total(groningenWithoutMed), { center: null, lower: 27, upper: 82 });
const groningenWithoutMedLon = { ...groningenWithoutMed };
delete groningenWithoutMedLon.LON;
assert.deepEqual(total(groningenWithoutMedLon), { center: null, lower: 21, upper: 86 });
for (const id of [2355, 3116]) {
  const c = realCases.find(c => c.candidateId === id);
  assert.equal(c.priorityCompletionReview.sha256, digest(c.priorityCompletionReview.path));
  assert.equal(c.priorityCompletionReview.validOriginalCount, c.sourceSnapshots.length);
  assert(c.sourceSnapshots.every((r: { validOriginal: boolean }) => r.validOriginal));
  assert(
    c.webReadSources.every(
      (r: { originalBytes: number | null; originalSha256: string | null }) =>
        r.originalBytes === null && r.originalSha256 === null
    )
  );
  assert.equal(c.globalRankingEligible, false);
}
const gpciClues = JSON.parse(
  readFileSync(new URL("../docs/data/cci-gpci2025-priority-clues.json", import.meta.url), "utf8")
);
assert.equal(gpciClues.status, "global_cross_city_priority_clues_not_cci_scores");
assert.equal(gpciClues.records.length, 48);
assert.equal(
  gpciClues.records.filter(
    (r: { identityStatus: string }) => r.identityStatus === "unique_country_name"
  ).length,
  43
);
assert.equal(gpciClues.review.sha256, digest(gpciClues.review.path));
for (const key of [
  "economy",
  "researchDevelopment",
  "culturalInteraction",
  "livability",
  "environment",
  "accessibility",
]) {
  assert.deepEqual(
    gpciClues.records
      .map(
        (r: { functionClues: Record<string, { sourceRank: number }> }) =>
          r.functionClues[key].sourceRank
      )
      .sort((a: number, b: number) => a - b),
    Array.from({ length: 48 }, (_, i) => i + 1)
  );
}
assert(
  gpciClues.records.every(
    (r: {
      metricTransfer: boolean;
      retained: boolean;
      cityBoundaryTransferred: boolean;
      residentPerformanceTransferred: boolean;
    }) =>
      !r.metricTransfer &&
      r.retained &&
      !r.cityBoundaryTransferred &&
      !r.residentPerformanceTransferred
  )
);
assert.equal(gpciClues.scoresCreated, 0);
assert.equal(gpciClues.exclusionsCreated, 0);

assert.deepEqual(total(taipei), { center: null, lower: 39, upper: 74 });
assert.deepEqual(total(frankfurt), { center: null, lower: 36, upper: 76 });
for (const [scores, dimension, lower, upper] of [
  [taipei, "MED", 30, 80],
  [taipei, "LON", 33, 78],
  [frankfurt, "MED", 27, 82],
  [frankfurt, "OPT", 30, 80],
] as const) {
  const withdrawn = { ...scores };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const id of [1141, 3093]) {
  const c = realCases.find(c => c.candidateId === id);
  assert.equal(c.priorityCompletionReview.sha256, digest(c.priorityCompletionReview.path));
  assert.equal(c.scopeCompletionReview.allDimensionSemanticsActuallyConsidered, true);
  assert.equal(c.scopeCompletionReview.allSubpillarsHaveOutcomeMeasurements, false);
  assert.equal(c.scopeCompletionReview.subpillarCount, 31);
  assert.equal(c.priorityCompletionReview.validOriginalCount, c.sourceSnapshots.length);
  assert(c.sourceSnapshots.every((r: { validOriginal: boolean }) => r.validOriginal));
  for (const r of [...c.webReadSources, ...c.failedSourceSnapshots]) {
    assert.equal(r.originalBytes, null);
    assert.equal(r.originalSha256, null);
  }
  assert.equal(c.globalRankingEligible, false);
}
const taipeiCase = realCases.find(c => c.candidateId === 1141);
assert.equal(taipeiCase.medicalScopeReview.nationwideRatesTransferredToTaipei, false);
assert.equal(taipeiCase.medicalScopeReview.riskAdjustmentCompleted, false);
assert.equal(taipeiCase.medicalScopeReview.taipei14DayReadmissionPercent, 4.85);
assert.equal(taipeiCase.medicalScopeReview.taipeiAmiMortalityPercent, 2.33);
const frankfurtCase = realCases.find(c => c.candidateId === 3093);
assert.equal(frankfurtCase.medicalScopeReview.riskAdjustedQualityValuesAreMortalityPercent, false);
assert.deepEqual(frankfurtCase.medicalScopeReview.selectedQualityValues, [1.47, 2.21]);
assert.equal(frankfurtCase.resourceScopeReview.visibleTextLayerConflictRetained, true);
assert.equal(frankfurtCase.resourceScopeReview.voltageLevelsAdded, false);
assert.equal(frankfurtCase.resourceScopeReview.lowVoltageUpstreamKwh, 1299209723);

for (const [id, expectedRange, count] of [
  [1445, [36, 76], 26],
  [73, [15, 85], 35],
  [1427, [27, 82], 25],
] as const) {
  const c = realCases.find(c => c.candidateId === id);
  assert.equal(c.priorityCompletionReview.sha256, digest(c.priorityCompletionReview.path));
  assert.equal(c.scopeCompletionReview.allSubpillarsFullyReviewed, false);
  assert.equal(c.scopeCompletionReview.allSubpillarsHaveOutcomeMeasurements, false);
  assert.equal(c.scopeCompletionReview.eightDimensionScoresComplete, false);
  assert.equal(c.priorityCompletionReview.validOriginalCount, count);
  assert.equal(c.sourceSnapshots.length, count);
  assert(
    c.sourceSnapshots.every(
      (r: { validOriginal: boolean; bytes: number; sha256: string }) =>
        r.validOriginal && r.bytes > 0 && r.sha256.length === 64
    )
  );
  assert.deepEqual(c.unresolvedScoreRange, expectedRange);
  assert.equal(c.expectedConditionalTotal, null);
  assert.equal(c.globalRankingEligible, false);
  for (const r of [...c.webReadSources, ...c.failedSourceSnapshots]) {
    assert.equal(r.originalBytes, null);
    assert.equal(r.originalSha256, null);
  }
}
for (const [scores, dimension, lower, upper] of [
  [stockholm, "MED", 27, 82],
  [stockholm, "LON", 30, 80],
  [hongKong, "MED", 9, 94],
  [hongKong, "ISR", 6, 91],
  [amsterdam, "ISR", 18, 88],
  [amsterdam, "LON", 21, 86],
] as const) {
  const withdrawn = { ...scores };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...hongKong, MED: 60 }), { center: null, lower: 18, upper: 88 });
const stockholmCase = realCases.find(c => c.candidateId === 1445);
assert.equal(stockholmCase.clinicalScopeReview.localTwoMyelomaPatientsProductIdentified, false);
assert.equal(stockholmCase.clinicalScopeReview.futureThirdPatientCountedAsTreated, false);
assert.equal(stockholmCase.clinicalScopeReview.unknownTransferValueFilledWithZero, false);
const hongKongCase = realCases.find(c => c.candidateId === 73);
assert.equal(hongKongCase.clinicalScopeReview.medJudgmentAfterActualPriorityAndFeeRelief, true);
assert.equal(hongKongCase.clinicalScopeReview.prioritized133CountedAsInfused, false);
assert.equal(
  hongKongCase.clinicalScopeReview.approved103DrugApplicationsCountedAsTisaInfusions,
  false
);
assert.equal(hongKongCase.sourceStopReview.deviationRetained, true);
assert.equal(hongKongCase.sourceStopReview.failedSourcesPenalizedCity, false);
const amsterdamCase = realCases.find(c => c.candidateId === 1427);
assert.equal(amsterdamCase.clinicalScopeReview.hsmrIsMortalityPercent, false);
assert.deepEqual(amsterdamCase.clinicalScopeReview.hsmr95ConfidenceInterval, [100, 113]);
assert.equal(amsterdamCase.resourceScopeReview.waterVolumeUnitAndArithmeticConflictRetained, true);
assert.equal(amsterdamCase.resourceScopeReview.volumeChangePercentAdopted, false);
assert.equal(amsterdamCase.resourceScopeReview.demoLoremTemplateAdopted, false);

for (const [id, expectedRange, count] of [
  [3147, [21, 86], 33],
  [4946, [45, 70], 37],
] as const) {
  const c = realCases.find(c => c.candidateId === id);
  assert.equal(c.priorityCompletionReview.sha256, digest(c.priorityCompletionReview.path));
  assert.equal(c.scopeCompletionReview.allSubpillarsHaveOutcomeMeasurements, false);
  assert.equal(c.scopeCompletionReview.allSubpillarsFullyReviewed, false);
  assert.equal(c.priorityCompletionReview.validOriginalCount, count);
  assert.equal(c.sourceSnapshots.length, count);
  assert.deepEqual(c.unresolvedScoreRange, expectedRange);
  assert.equal(c.expectedConditionalTotal, null);
  assert.equal(c.globalRankingEligible, false);
  for (const r of [
    ...c.webReadSources,
    ...c.failedSourceSnapshots,
    ...c.inheritedFailedSourceSnapshotsNotRetried,
  ]) {
    assert.equal(r.originalBytes, null);
    assert.equal(r.originalSha256, null);
  }
}
const madridWithoutOpt = { ...madrid };
delete madridWithoutOpt.OPT;
assert.deepEqual(total(madridWithoutOpt), { center: null, lower: 15, upper: 90 });
const berlinWithoutLon = { ...berlin };
delete berlinWithoutLon.LON;
assert.deepEqual(total(berlinWithoutLon), { center: null, lower: 39, upper: 74 });
assert.equal(
  realCases.find(c => c.candidateId === 3147).rootScopeReview.mortalityTablePhysical120Year,
  2023
);

for (const [id, range, originals] of [
  [3485, [21, 81], 24],
  [708, [30, 80], 41],
] as const) {
  const c = realCases.find(c => c.candidateId === id);
  assert.equal(c.priorityCompletionReview.sha256, digest(c.priorityCompletionReview.path));
  assert.equal(c.sourceSnapshots.length, originals);
  assert.equal(c.scopeCompletionReview.allSubpillarsFullyReviewed, false);
  assert.equal(c.scopeCompletionReview.allSubpillarsHaveOutcomeMeasurements, false);
  assert.deepEqual(c.unresolvedScoreRange, range);
  assert.equal(c.expectedConditionalTotal, null);
  assert.equal(c.globalRankingEligible, false);
  for (const r of [
    ...c.webReadSources,
    ...c.failedSourceSnapshots,
    ...c.inheritedFailedSourceSnapshotsNotRetried,
    ...c.webFailureDiagnostics,
  ]) {
    assert.equal(r.originalBytes, null);
    assert.equal(r.originalSha256, null);
  }
}
for (const [scores, dimension, lower, upper] of [
  [montreal, "LON", 15, 85],
  [montreal, "MED", 15, 90],
  [fukuoka, "LON", 24, 84],
  [fukuoka, "MED", 21, 86],
] as const) {
  const withdrawn = { ...scores };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(
  realCases.find(c => c.candidateId === 3485).rootScopeReview.committeePrintedTotal,
  189
);
assert.equal(realCases.find(c => c.candidateId === 3485).rootScopeReview.committeeCategorySum, 206);
assert.equal(
  realCases.find(c => c.candidateId === 708).rootScopeReview.localCollection248CountedAsInfusions,
  false
);

const milanCase = realCases.find(c => c.candidateId === 1600);
assert.equal(
  milanCase.priorityCompletionReview.sha256,
  digest(milanCase.priorityCompletionReview.path)
);
assert.equal(milanCase.rootScopeReview.ctmoCurrentUpdatedAfterCutoff, true);
assert.equal(milanCase.rootScopeReview.newCurrentIndicationsBackfilled, false);
assert.deepEqual(total(milan), { center: null, lower: 12, upper: 92 });
for (const dimension of ["LON", "TEC"] as const) {
  const withdrawn = { ...milan };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower: 6, upper: 96 });
}

const barcelonaCase = realCases.find(c => c.candidateId === 4523);
assert.equal(
  barcelonaCase.priorityCompletionReview.sha256,
  digest(barcelonaCase.priorityCompletionReview.path)
);
assert.equal(barcelonaCase.rootScopeReview.sparseMergedWaitXmlIndependentlyParsed, true);
assert.equal(barcelonaCase.rootScopeReview.exactClinicRows, 12);
assert.equal(barcelonaCase.rootScopeReview.questionnairesNotUniquePatients, true);
assert.equal(barcelonaCase.rootScopeReview.printedGrowth64_59ConflictRetained, true);
assert.equal(barcelonaCase.rootScopeReview.sadCemeteryResponseCountedAsResolved, false);
assert.deepEqual(total(barcelona), { center: null, lower: 30, upper: 80 });
assert.deepEqual(total({ ...barcelona, MED: 40 }), { center: null, lower: 27, upper: 77 });
for (const [dimension, lower, upper] of [
  ["ISR", 21, 86],
  ["MED", 21, 86],
  ["LON", 24, 84],
  ["TEC", 24, 84],
] as const) {
  const withdrawn = { ...barcelona };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
