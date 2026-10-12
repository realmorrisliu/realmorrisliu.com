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
  assert.equal(total({ ...scores, MED: 40 }).center, 55);
  assert.equal(total({ ...scores, LON: 60 }).center, 60);
  assert.equal(total({ ...scores, TEC: 80 }).center, 60);
  assert.equal(total({ ...scores, LON: 60, TEC: 80 }).center, 62);
  const unresolvedLon: Partial<Record<DimensionId, number>> = { ...scores };
  delete unresolvedLon.LON;
  assert.deepEqual(total(unresolvedLon), { center: null, lower: 54, upper: 64 });
  assert.equal(total(scores, { ...weights, MED: 10, LON: 15 }).center, 57);
}
assert.deepEqual(singapore, london);
const singaporeWithoutTec = { ...singapore };
delete singaporeWithoutTec.TEC;
assert.deepEqual(total(singaporeWithoutTec), { center: null, lower: 52, upper: 62 });
const singaporeWithoutMedAndTec = { ...singaporeWithoutTec };
delete singaporeWithoutMedAndTec.MED;
assert.deepEqual(total(singaporeWithoutMedAndTec), { center: null, lower: 43, upper: 68 });
assert.equal(total(helsinki).center, 60);
assert.equal(total({ ...helsinki, MED: 40 }).center, 57);
assert.equal(total({ ...helsinki, LON: 40 }).center, 58);
assert.equal(total({ ...helsinki, TEC: 80 }).center, 62);
const helsinkiWithoutLon: Partial<Record<DimensionId, number>> = { ...helsinki };
delete helsinkiWithoutLon.LON;
assert.deepEqual(total(helsinkiWithoutLon), { center: null, lower: 54, upper: 64 });
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
assert.deepEqual(total(tokyo), { center: 60, lower: 60, upper: 60 });
assert.equal(tokyo.GSS, 60);
const tokyoWithoutGss = { ...tokyo };
delete tokyoWithoutGss.GSS;
assert.deepEqual(total(tokyoWithoutGss), { center: null, lower: 51, upper: 66 });
assert.equal(total({ ...tokyo, GSS: 40 }).center, 57);
assert.equal(tokyo.OPT, 60);
const tokyoWithoutOpt = { ...tokyo };
delete tokyoWithoutOpt.OPT;
assert.deepEqual(total(tokyoWithoutOpt), { center: null, lower: 54, upper: 64 });
assert.equal(tokyo.RES, 60);
const tokyoWithoutRes = { ...tokyo };
delete tokyoWithoutRes.RES;
assert.deepEqual(total(tokyoWithoutRes), { center: null, lower: 54, upper: 64 });
assert.deepEqual(total({ ...tokyo, TEC: 80 }), { center: 62, lower: 62, upper: 62 });
const tokyoWithoutLon = { ...tokyo };
delete tokyoWithoutLon.LON;
assert.deepEqual(total(tokyoWithoutLon), { center: null, lower: 54, upper: 64 });
const tokyoWithoutMed = { ...tokyo };
delete tokyoWithoutMed.MED;
assert.deepEqual(total(tokyoWithoutMed), { center: null, lower: 51, upper: 66 });
const tokyoPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "5129"
);
assert(tokyoPosition);
assert.equal(tokyoPosition.center, 60);
assert.equal(tokyoPosition.bestPosition, 1);
assert.equal(tokyoPosition.worstPosition, rankAudit.candidateCount - 4);
assert.deepEqual(total(washington), { center: null, lower: 49, upper: 64 });
assert.equal(washington.RES, 40);
assert.equal(washington.OPT, 60);
assert.equal(washington.LON, 60);
assert.equal(washington.GSS, undefined);
const washingtonWithoutLon = { ...washington };
delete washingtonWithoutLon.LON;
assert.deepEqual(total(washingtonWithoutLon), { center: null, lower: 43, upper: 68 });
const washingtonWithoutOpt = { ...washington };
delete washingtonWithoutOpt.OPT;
assert.deepEqual(total(washingtonWithoutOpt), { center: null, lower: 43, upper: 68 });
const washingtonWithoutRes = { ...washington };
delete washingtonWithoutRes.RES;
assert.deepEqual(total(washingtonWithoutRes), { center: null, lower: 45, upper: 70 });
const washingtonWithoutMed = { ...washington };
delete washingtonWithoutMed.MED;
assert.deepEqual(total(washingtonWithoutMed), { center: null, lower: 40, upper: 70 });
assert.deepEqual(total({ ...washington, RES: 60 }), { center: null, lower: 51, upper: 66 });
assert.deepEqual(total({ ...washington, ISR: 40 }), { center: null, lower: 46, upper: 61 });
assert.deepEqual(total({ ...washington, OPT: 40 }), { center: null, lower: 47, upper: 62 });
assert.deepEqual(total({ ...washington, LON: 40 }), { center: null, lower: 47, upper: 62 });
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
assert.equal(washingtonPosition.center, null);
assert.equal(washingtonPosition.bestPosition, 1);
assert.equal(washingtonPosition.worstPosition, rankAudit.candidateCount);
assert.deepEqual(total(newYork), { center: null, lower: 36, upper: 76 });
for (const dimension of ["PCS", "GSS", "RES"] as const) {
  assert.equal(newYork[dimension], undefined);
}
const newYorkWithoutMed = { ...newYork };
delete newYorkWithoutMed.MED;
assert.deepEqual(total(newYorkWithoutMed), { center: null, lower: 27, upper: 82 });
const newYorkWithoutLon = { ...newYork };
delete newYorkWithoutLon.LON;
assert.deepEqual(total(newYorkWithoutLon), { center: null, lower: 30, upper: 80 });
const newYorkWithoutOpt = { ...newYork };
delete newYorkWithoutOpt.OPT;
assert.deepEqual(total(newYorkWithoutOpt), { center: null, lower: 30, upper: 80 });
assert.deepEqual(total({ ...newYork, MED: 40 }), { center: null, lower: 33, upper: 73 });
assert.deepEqual(total({ ...newYork, LON: 40 }), { center: null, lower: 34, upper: 74 });
assert.deepEqual(total({ ...newYork, PCS: 40 }), { center: null, lower: 42, upper: 67 });
assert.deepEqual(total({ ...newYork, RES: 40 }), { center: null, lower: 40, upper: 70 });
assert.deepEqual(total({ ...newYork, GSS: 60 }), { center: null, lower: 45, upper: 70 });
const newYorkPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "7244"
);
assert(newYorkPosition);
assert.equal(newYorkPosition.center, null);
assert.equal(newYorkPosition.bestPosition, 1);
assert.equal(newYorkPosition.worstPosition, rankAudit.candidateCount);
assert.deepEqual(realCases[7].clinicBoundaryCheck.fuaMatches, [7244]);
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
const exitSensitivity = { ...weights, MED: 10, OPT: 15 };
assert.equal(total(londonCounterfactual).center, 57);
assert.equal(total(londonCounterfactual, exitSensitivity).center, 59);
assert.equal(total(singapore, exitSensitivity).center, 58);
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
    current: { singapore: 58, london: 58 },
    singaporeUnresolved: {
      TEC: total(singaporeWithoutTec),
      MEDAndTEC: total(singaporeWithoutMedAndTec),
    },
    conditionalMED40OPT80: { singapore: 58, london: 57 },
    sameScenarioMED10OPT15: { singapore: 58, london: 59 },
    helsinki: { current: 60, conditionalMED40: 57, unresolvedLON: total(helsinkiWithoutLon) },
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
      partial: total(washington),
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
  },
});
