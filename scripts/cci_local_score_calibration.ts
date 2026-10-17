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
  "basel",
  "munich",
  "oslo",
  "antwerp",
  "brussels",
  "hamburg",
  "lyon",
  "leuven",
  "nagoya",
  "philadelphia",
  "kuala-lumpur",
  "oxford",
  "cambridge",
  "pittsburgh",
  "eindhoven",
  "luxembourg",
  "stuttgart",
  "daejeon",
  "manchester",
  "houston",
  "san-diego",
  "austin",
  "newcastle",
  "lund",
  "almere",
  "portsmouth",
  "birmingham",
  "rostock",
  "middlesbrough",
  "kuopio",
  "hilversum",
  "odense",
  "corby",
  "livingston",
  "szczecin",
  "bedford",
  "aarhus",
  "nottingham",
  "burton-on-trent",
  "daugavpils",
  "las-palmas",
  "bremen",
  "larbert",
  "panevezys",
  "vilnius",
  "blackpool",
  "milton-keynes",
  "alkmaar",
  "bydgoszcz",
  "bilbao",
  "flensburg",
  "maldonado",
  "lodz",
  "gorzow",
  "kiel",
  "cork",
  "lubeck",
  "shenzhen-reference",
  "hsinchu-reference",
  "dubai-reference",
  "rugby",
  "saskatoon",
  "gronowo-gorne",
  "leon",
  "luton",
  "trondheim",
  "warsaw",
  "gottingen",
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
    if (review.score === null) assert.deepEqual(review.conditionalAlternatives, []);
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
  basel,
  munich,
  oslo,
  antwerp,
  brussels,
  hamburg,
  lyon,
  leuven,
  nagoya,
  philadelphia,
  kualaLumpur,
  oxford,
  cambridge,
  pittsburgh,
  eindhoven,
  luxembourg,
  stuttgart,
  daejeon,
  manchester,
  houston,
  sanDiego,
  austin,
  newcastle,
  lund,
  almere,
  portsmouth,
  birmingham,
  rostock,
  middlesbrough,
  kuopio,
  hilversum,
  odense,
  corby,
  livingston,
  szczecin,
  bedford,
  aarhus,
  nottingham,
  burtonOnTrent,
  daugavpils,
  lasPalmas,
  bremen,
  larbert,
  panevezys,
  vilnius,
  blackpool,
  miltonKeynes,
  alkmaar,
  bydgoszcz,
  bilbao,
  flensburg,
  maldonado,
  lodz,
  gorzow,
  kiel,
  cork,
  lubeck,
  shenzhenReference,
  hsinchuReference,
  dubaiReference,
  rugby,
  saskatoon,
  gronowoGorne,
  leon,
  luton,
  trondheim,
  warsaw,
  gottingen,
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
assert.equal(tokyoPosition.worstPosition, rankAudit.candidateCount - 27);
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
assert.equal(washingtonPosition.bestPosition, 19);
assert.equal(washingtonPosition.worstPosition, rankAudit.candidateCount - 5);
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
assert.equal(newYorkPosition.bestPosition, 19);
assert.equal(newYorkPosition.worstPosition, rankAudit.candidateCount - 5);
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
assert.equal(parisPosition.worstPosition, rankAudit.candidateCount - 14);
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
assert.equal(osakaKyotoPosition.worstPosition, rankAudit.candidateCount - 14);
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
assert.deepEqual(total(boston), { center: 60, lower: 60, upper: 60 });
assert.equal(boston.GSS, 60);
for (const dimension of DIMENSIONS) {
  const withdrawn = { ...boston };
  delete withdrawn[dimension.id];
  const contribution = 0.6 * weights[dimension.id];
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: 60 - contribution,
    upper: 60 - contribution + weights[dimension.id],
  });
}
assert.deepEqual(total({ ...boston, RES: 40 }), { center: 58, lower: 58, upper: 58 });
assert.deepEqual(total({ ...boston, MED: 40 }), { center: 57, lower: 57, upper: 57 });
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
assert.equal(beijingPosition.worstPosition, rankAudit.candidateCount - 14);

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
assert.equal(shanghaiPosition.bestPosition, 19);
assert.equal(shanghaiPosition.worstPosition, rankAudit.candidateCount - 5);

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
// Nanjing's conditional58 also exceeds Jakarta's upper53.
assert.equal(jakartaPosition.bestPosition, 30);
assert.equal(jakartaPosition.worstPosition, rankAudit.candidateCount);

assert.deepEqual(total(nanjing), { center: 58, lower: 58, upper: 58 });
assert.deepEqual(total({ ...nanjing, GSS: 60 }), { center: 58, lower: 58, upper: 58 });
assert.deepEqual(total({ ...nanjing, GSS: 40 }), { center: 55, lower: 55, upper: 55 });
assert.deepEqual(total({ ...nanjing, MED: 40 }), { center: 55, lower: 55, upper: 55 });
assert.deepEqual(total({ ...nanjing, MED: 80 }), { center: 61, lower: 61, upper: 61 });
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
assert.equal(nanjingCase.sourceSnapshots.length, 57);
assert.equal(
  nanjingCase.gssUnifiedThresholdReview.sha256,
  digest(nanjingCase.gssUnifiedThresholdReview.path)
);
assert.equal(nanjingCase.gssUnifiedThresholdReview.otherSevenDimensionObjectsUnchanged, true);
assert.equal(nanjingCase.gssUnifiedThresholdReview.oldCivilDefenceCurrentRawReauthenticated, false);
assert.equal(nanjingCase.failedSourceSnapshots[0].validOriginal, false);
const nanjingWithoutGss = { ...nanjing };
delete nanjingWithoutGss.GSS;
assert.deepEqual(total(nanjingWithoutGss), { center: null, lower: 49, upper: 64 });
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
assert.equal(nanjingPosition.bestPosition, 19);
assert.equal(nanjingPosition.worstPosition, rankAudit.candidateCount - 5);

const praguePosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "535"
);
assert(praguePosition);
assert.equal(praguePosition.bestPosition, 1);
assert.equal(praguePosition.worstPosition, rankAudit.candidateCount - 27);
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

assert.deepEqual(total(guangzhou), { center: 58, lower: 58, upper: 58 });
assert.equal(guangzhou.MED, 60);
assert.equal(guangzhou.LON, 40);
for (const [dimension, lower, upper] of [
  ["PCS", 49, 64],
  ["GSS", 49, 64],
  ["ISR", 49, 64],
  ["RES", 52, 62],
  ["MED", 49, 64],
  ["LON", 54, 64],
  ["TEC", 50, 60],
  ["OPT", 54, 64],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...guangzhou };
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
assert.equal(guangzhouCase.sourceSnapshots.length, 89);
assert.equal(guangzhouCase.lonAccessReview.sha256, digest(guangzhouCase.lonAccessReview.path));
assert.equal(guangzhouCase.lonAccessReview.otherSevenDimensionsUnchanged, true);
assert.equal(guangzhouCase.lonAccessReview.clinicalServiceInsideTarget9711Verified, false);
assert.equal(guangzhouCase.lonAccessReview.unpairedRangesAreFinalPersonalOop, false);
assert.equal(guangzhouCase.lonAccessReview.supplementaryEnrollmentPresumed, false);
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
assert.equal(guangzhouPosition.bestPosition, 19);
assert.equal(guangzhouPosition.worstPosition, rankAudit.candidateCount - 5);

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
assert.equal(wuhanCase.sourceSnapshots.length, 105);
assert.equal(
  wuhanCase.lonOrganSupplementReview.sha256,
  digest(wuhanCase.lonOrganSupplementReview.path)
);
const wuhanLon = wuhanCase.dimensions.find((d: { id: string }) => d.id === "LON");
assert.equal(wuhanLon.score, null);
assert.deepEqual(wuhanLon.conditionalAlternatives, []);
assert.equal(wuhanLon.subpillars.resident_access, "partial");
assert.equal(wuhanCase.lonOrganSupplementReview.otherSevenDimensionObjectsUnchanged, true);
assert.equal(wuhanCase.lonOrganSupplementReview.rootNewRelevantPaymentDiscriminators, 0);
assert.equal(wuhanCase.lonOrganSupplementReview.priorADClinicalChecksReinterpreted, false);
assert.equal(wuhanCase.fullyMeasured, false);
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
assert.equal(surabayaPosition.bestPosition, 19);
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
assert.deepEqual(total(tampere), { center: 60, lower: 60, upper: 60 });
assert.equal(grimsby.GSS, undefined);
assert.equal(tampere.GSS, 60);
assert.equal(grimsby.LON, undefined);
assert.equal(tampere.LON, 60);
assert.deepEqual(total({ ...grimsby, MED: 60 }), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total({ ...tampere, TEC: 80 }), { center: 62, lower: 62, upper: 62 });
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

// Dublin's new safety bridge is revocable; other judgments retain original weights.
assert.deepEqual(total(dublin), { center: 57, lower: 57, upper: 57 });
assert.deepEqual(total({ ...dublin, MED: 60 }), { center: 60, lower: 60, upper: 60 });
assert.deepEqual(total({ ...dublin, TEC: 80 }), { center: 59, lower: 59, upper: 59 });
const dublinWithoutGss = { ...dublin };
delete dublinWithoutGss.GSS;
assert.deepEqual(total(dublinWithoutGss), { center: null, lower: 48, upper: 63 });
const dublinCase = realCases.find(c => c.candidateId === 415);
assert.equal(dublinCase.gssCompletionReview.sha256, digest(dublinCase.gssCompletionReview.path));
assert.equal(dublinCase.gssCompletionReview.annualReportNecessaryToAdoption, false);
assert.equal(dublinCase.gssCompletionReview.annualReportPublicationAuthenticated, false);
assert.deepEqual(dublinCase.gssCompletionReview.necessaryScoringSources, ["G96-R"]);
assert.equal(
  dublinCase.sourceSnapshots.find((s: { id: string }) => s.id === "G96-A").scoreEligible,
  false
);
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
assert.equal(dublin.GSS, 60);
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
assert.equal(bostonCase.gssCompletionReview.sha256, digest(bostonCase.gssCompletionReview.path));
assert.equal(bostonCase.sourceSnapshots.length, 20);
assert.equal(bostonCase.gssCompletionReview.oldSevenLiteralDimensionObjectsUnchanged, true);
assert.equal(bostonCase.gssCompletionReview.rootActualHtmlBodiesRead, 2);
assert.equal(bostonCase.gssCompletionReview.hotelCoordinateInvented, false);
assert.equal(bostonCase.gssCompletionReview.arrestsEqualConvictions, false);
assert.equal(bostonCase.gssCompletionReview.hospitalContactEqualsLongTermRecovery, false);
assert.deepEqual(bostonCase.gssCompletionReview.rejectNecessaryBridge.domain, [51, 66]);
assert.equal(total({ ...boston, GSS: 40 }).center, 57);
assert.equal(total({ ...boston, GSS: 80 }).center, 63);
// The earlier bounded no-entry review remains historical; new operation evidence is separate.

assert.equal(bostonCase.gssPriorityReview.sha256, digest(bostonCase.gssPriorityReview.path));
assert.equal(bostonCase.gssPriorityReview.qualifyingNewEntryFound, false);
assert.equal(bostonCase.gssPriorityReview.deepDiscoveryReopened, false);
assert.equal(bostonCase.gssPriorityReview.dimensionObjectsChanged, false);
assert.deepEqual(total(boston), { center: 60, lower: 60, upper: 60 });

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

assert.deepEqual(total(geneva), { center: 60, lower: 60, upper: 60 });
assert.deepEqual(total({ ...geneva, MED: 40 }), { center: 57, lower: 57, upper: 57 });
const genevaWithoutLon = { ...geneva };
delete genevaWithoutLon.LON;
assert.deepEqual(total(genevaWithoutLon), { center: null, lower: 54, upper: 64 });
const genevaCase = realCases.find(c => c.candidateId === 29);
assert.equal(
  genevaCase.priorityCompletionReview.sha256,
  digest(genevaCase.priorityCompletionReview.path)
);

assert.equal(
  genevaCase.gssResSupplementReview.sha256,
  digest(genevaCase.gssResSupplementReview.path)
);
assert.equal(total({ ...geneva, GSS: 40 }).center, 57);
assert.equal(total({ ...geneva, RES: 40 }).center, 58);
for (const [id, lower, upper] of [
  ["GSS", 51, 66],
  ["RES", 54, 64],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...geneva };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
const genevaWithoutGssRes = { ...geneva };
delete genevaWithoutGssRes.GSS;
delete genevaWithoutGssRes.RES;
assert.deepEqual(total(genevaWithoutGssRes), { center: null, lower: 45, upper: 70 });

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
assert.deepEqual(total(tampereWithoutLon), { center: null, lower: 54, upper: 64 });
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
assert.deepEqual(total(vienna), { center: 60, lower: 60, upper: 60 });
const viennaWithoutRes: Partial<Record<DimensionId, number>> = { ...vienna };
delete viennaWithoutRes.RES;
assert.deepEqual(total(viennaWithoutRes), { center: null, lower: 54, upper: 64 });
const viennaWithoutMed = { ...vienna };
delete viennaWithoutMed.MED;
assert.deepEqual(total(viennaWithoutMed), { center: null, lower: 51, upper: 66 });
const viennaWithoutLon = { ...vienna };
delete viennaWithoutLon.LON;
assert.deepEqual(total(viennaWithoutLon), { center: null, lower: 54, upper: 64 });
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
  [1427, [21, 86], 25],
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
  [amsterdam, "ISR", 12, 92],
  [amsterdam, "TEC", 15, 90],
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
assert.equal(amsterdamCase.payerReassessment.sha256, digest(amsterdamCase.payerReassessment.path));
assert.deepEqual(total(amsterdam), { center: null, lower: 21, upper: 86 });
assert.equal(amsterdam.LON, undefined);
assert.deepEqual(total({ ...amsterdam, LON: 60 }), { center: null, lower: 27, upper: 82 });
assert.deepEqual(total({ ...amsterdam, LON: 40 }), { center: null, lower: 25, upper: 80 });

for (const [id, expectedRange, count, addedSources, expectedCenter] of [
  [3147, [21, 86], 33, 0, null],
  [4946, [60, 60], 37, 12, 60],
] as const) {
  const c = realCases.find(c => c.candidateId === id);
  assert.equal(c.priorityCompletionReview.sha256, digest(c.priorityCompletionReview.path));
  assert.equal(c.scopeCompletionReview.allSubpillarsHaveOutcomeMeasurements, false);
  assert.equal(c.scopeCompletionReview.allSubpillarsFullyReviewed, false);
  assert.equal(c.priorityCompletionReview.validOriginalCount, count);
  assert.equal(c.sourceSnapshots.length, count + addedSources);
  assert.deepEqual(c.unresolvedScoreRange, expectedRange);
  assert.equal(c.expectedConditionalTotal, expectedCenter);
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
assert.deepEqual(total(berlinWithoutLon), { center: null, lower: 54, upper: 64 });
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

const berlinGssCase = realCases.find(c => c.candidateId === 4946);
const berlinGssReview = berlinGssCase.gssCompletionReview;
assert.equal(berlinGssReview.sha256, digest(berlinGssReview.path));
assert.equal(berlinGssReview.researchReportSha256, digest(berlinGssReview.researchReport));
assert.equal(berlinGssReview.original37HistoricalSourcesReverified, false);
assert.equal(berlinGssReview.validOriginalCount, 7);
assert.equal(berlinGssCase.gssSourceSnapshots.length, 7);
assert.equal(
  berlinGssCase.gssSourceSnapshots.filter((r: { usedForScore: boolean }) => r.usedForScore).length,
  6
);
assert.equal(berlinGssReview.validPDFCount, 0);
assert.equal(berlinGssReview.newPdfPixelsViewed, 0);
assert.deepEqual(total(berlin), { center: 60, lower: 60, upper: 60 });
assert.deepEqual(total({ ...berlin, GSS: 40 }), { center: 57, lower: 57, upper: 57 });
const berlinWithoutGss = { ...berlin };
delete berlinWithoutGss.GSS;
assert.deepEqual(total(berlinWithoutGss), { center: null, lower: 51, upper: 66 });
const berlinWithoutMed = { ...berlin };
delete berlinWithoutMed.MED;
assert.deepEqual(total(berlinWithoutMed), { center: null, lower: 51, upper: 66 });

const baselCase = realCases.find(c => c.candidateId === 935);
assert.equal(
  baselCase.priorityCompletionReview.sha256,
  digest(baselCase.priorityCompletionReview.path)
);
assert.equal(baselCase.sourceSnapshots.length, 15);
assert.equal(baselCase.scopeCompletionReview.allSubpillarsFullyReviewed, false);
assert.deepEqual(baselCase.referenceBoundaryCheck.referencePoints[4].fuaMatches, [2227]);
assert.equal(baselCase.rootScopeReview.healthCost1000IsAllAnnualCostsCap, false);
assert.equal(baselCase.rootScopeReview.carTPriorInsurerApprovalRequired, true);
assert.deepEqual(baselCase.rootScopeReview.transport302_4PassengerKmOperators, [
  "BVB",
  "BLT",
  "AAGL",
]);
assert.deepEqual(total(basel), { center: null, lower: 42, upper: 67 });
assert.deepEqual(total({ ...basel, ISR: 60 }), { center: null, lower: 45, upper: 70 });
for (const [dimension, lower, upper] of [
  ["PCS", 33, 73],
  ["ISR", 36, 76],
  ["MED", 33, 73],
  ["LON", 36, 71],
  ["TEC", 36, 71],
  ["OPT", 36, 71],
] as const) {
  const withdrawn = { ...basel };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}

const munichCase = realCases.find(c => c.candidateId === 4736);
assert.equal(
  munichCase.priorityCompletionReview.sha256,
  digest(munichCase.priorityCompletionReview.path)
);
assert.equal(munichCase.sourceSnapshots.length, 34);
assert.equal(munichCase.rootScopeReview.ingPriceUsedForCutoffScore, false);
assert.equal(munichCase.rootScopeReview.ingPriceEffectiveOn, "2026-10-15");
assert.equal(munichCase.rootScopeReview.iqmCopdSmr1_5Means50PercentMortality, false);
assert.equal(munichCase.rootScopeReview.iqmPneumoniaBetterOutcomeRetained, true);
assert.deepEqual(total(munich), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total({ ...munich, MED: 40 }), { center: null, lower: 42, upper: 67 });
for (const [dimension, lower, upper] of [
  ["GSS", 36, 76],
  ["ISR", 36, 76],
  ["MED", 36, 76],
  ["LON", 39, 74],
  ["TEC", 39, 74],
  ["OPT", 39, 74],
] as const) {
  const withdrawn = { ...munich };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}

const osloCase = realCases.find(c => c.candidateId === 596);
assert.equal(
  osloCase.priorityCompletionReview.sha256,
  digest(osloCase.priorityCompletionReview.path)
);
assert.equal(
  osloCase.priorityCompletionReview.researchReportSha256,
  digest(osloCase.priorityCompletionReview.researchReport)
);
assert.equal(osloCase.sourceSnapshots.length, 26);
assert.equal(osloCase.failedSourceSnapshots.length, 3);
assert.equal(osloCase.webReadSources.length, 4);
assert.equal(osloCase.sourceSnapshots.filter((s: { reused: boolean }) => s.reused).length, 7);
assert.equal(osloCase.scopeCompletionReview.allSubpillarsFullyReviewed, false);
assert.deepEqual(osloCase.scopeCompletionReview.statusCounts, {
  reviewed_context: 3,
  reviewed_partial: 25,
  reviewed_not_fully: 3,
});
assert.equal(osloCase.rootScopeReview.futureWaterBackupCountedAsCompleted, false);
assert.equal(osloCase.rootScopeReview.allInspectedNavEconomicAdviceServicesUnlawful, true);
assert.equal(osloCase.rootScopeReview.copayCap3278CoversAllMedicalCosts, false);
assert.equal(osloCase.rootScopeReview.eventSeriousShare2_3IsAdmissionHarmRisk, false);
assert.equal(osloCase.rootScopeReview.dho12Of15IsResidentCoverage, false);
assert.equal(osloCase.rootScopeReview.foreignFrenchPaymentTransferredToNorway, false);
assert.equal(osloCase.rootScopeReview.swedishAndNorwegianBankIdSame, false);
assert.equal(osloCase.rootScopeReview.dnb160IsOrdinaryTransferFee, false);
assert.equal(osloCase.rootScopeReview.heating50OreIsTotalNetUnitPrice, false);
assert.deepEqual(total(oslo), { center: null, lower: 45, upper: 70 });
for (const dimension of ["PCS", "ISR", "MED", "LON", "TEC", "OPT"] as const) {
  const withdrawn = { ...oslo };
  delete withdrawn[dimension];
  const is15 = weights[dimension] === 15;
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: is15 ? 36 : 39,
    upper: is15 ? 76 : 74,
  });
  assert.deepEqual(total({ ...oslo, [dimension]: 40 }), {
    center: null,
    lower: is15 ? 42 : 43,
    upper: is15 ? 67 : 68,
  });
}

const antwerpCase = realCases.find(c => c.candidateId === 1160);
assert.equal(
  antwerpCase.priorityCompletionReview.sha256,
  digest(antwerpCase.priorityCompletionReview.path)
);
assert.equal(
  antwerpCase.priorityCompletionReview.researchReportSha256,
  digest(antwerpCase.priorityCompletionReview.researchReport)
);
assert.equal(antwerpCase.sourceSnapshots.length, 26);
assert.equal(
  antwerpCase.sourceSnapshots.filter((s: { reusedFrom?: string }) => s.reusedFrom).length,
  8
);
assert.equal(antwerpCase.failedSourceSnapshots.length, 4);
assert.equal(antwerpCase.rootScopeReview.oldLostBytesCertified, false);
assert.equal(antwerpCase.rootScopeReview.trauma343CommonDenominatorCertified, false);
assert.notEqual((206 / 343) * 100, antwerpCase.rootScopeReview.issPrintedPercentage);
assert.notEqual((70 / 343) * 100, antwerpCase.rootScopeReview.urgentPrintedPercentage);
assert.equal(antwerpCase.rootScopeReview.mortality9_9MeansAdjustedCityQuality, false);
assert.equal(antwerpCase.rootScopeReview.optipac5To15ReductionMeasured, false);
assert.equal(antwerpCase.rootScopeReview.phase1CartEqualsMatureRoutinePaidCare, false);
assert.equal(antwerpCase.rootScopeReview.egisGlobalListUsedAsAntwerpRoutes, false);
assert.equal(antwerpCase.scopeCompletionReview.allSubpillarsFullyReviewed, false);
assert.deepEqual(total(antwerp), { center: null, lower: 30, upper: 80 });
for (const dimension of ["ISR", "MED", "TEC", "OPT"] as const) {
  const withdrawn = { ...antwerp };
  delete withdrawn[dimension];
  const is15 = weights[dimension] === 15;
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: is15 ? 21 : 24,
    upper: is15 ? 86 : 84,
  });
  assert.deepEqual(total({ ...antwerp, [dimension]: 40 }), {
    center: null,
    lower: is15 ? 27 : 28,
    upper: is15 ? 77 : 78,
  });
}

const brusselsCase = realCases.find(c => c.candidateId === 1269);
assert.equal(
  brusselsCase.priorityCompletionReview.sha256,
  digest(brusselsCase.priorityCompletionReview.path)
);
assert.equal(
  brusselsCase.priorityCompletionReview.researchReportSha256,
  digest(brusselsCase.priorityCompletionReview.researchReport)
);
assert.equal(brusselsCase.sourceSnapshots.length, 23);
assert.equal(brusselsCase.failedSourceSnapshots.length, 2);
assert(
  brusselsCase.failedSourceSnapshots.every(
    (s: { originalBytes: number | null; originalSha256: string | null }) =>
      s.originalBytes === null && s.originalSha256 === null
  )
);
assert.equal(brusselsCase.rootScopeReview.rootSncbPdfPixelsSeen, false);
assert.equal(
  brusselsCase.rootScopeReview.rootSncbExactCancellationTableIndependentlyVerified,
  false
);
assert.equal(brusselsCase.rootScopeReview.rootPdfPixelsViewed.length, 9);
assert.equal(brusselsCase.scopeCompletionReview.allSubpillarsFullyReviewed, false);
assert.deepEqual(total(brussels), { center: null, lower: 36, upper: 76 });
for (const dimension of ["ISR", "MED", "LON", "TEC", "OPT"] as const) {
  const withdrawn = { ...brussels };
  delete withdrawn[dimension];
  const is15 = weights[dimension] === 15;
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: is15 ? 27 : 30,
    upper: is15 ? 82 : 80,
  });
  assert.deepEqual(total({ ...brussels, [dimension]: 40 }), {
    center: null,
    lower: is15 ? 33 : 34,
    upper: is15 ? 73 : 74,
  });
}

const sydneyGssCase = realCases.find(c => c.candidateId === 1830);
const sydneyGssReview = sydneyGssCase.gssCompletionReview;
assert.equal(sydneyGssReview.sha256, digest(sydneyGssReview.path));
assert.equal(sydneyGssReview.researchReportSha256, digest(sydneyGssReview.researchReport));
assert.equal(sydneyGssReview.scoreChanged, false);
assert.equal(sydneyGssReview.newNetworkRequests, 0);
assert.equal(sydneyGssReview.newSourceCount, 3);
assert.equal(sydneyGssReview.arcWholeCommandOperationalByOct8, false);
assert.equal(sydneyGssReview.supportApplicationsAreAwardsOrPayments, false);
assert.equal(sydneyGssReview.staticResourceDisputeResolved, false);
assert.equal(sydneyGssReview.stopSameThreeSourcesLoop, true);
const sydneyGss = sydneyGssCase.dimensions.find((d: { id: string }) => d.id === "GSS");
assert.equal(sydneyGss.score, null);
assert.deepEqual(sydneyGss.conditionalAlternatives, []);
assert.equal(total({ ...sydney, GSS: 40 }).center, 54);
for (const id of sydneyGssReview.newSourceIds) {
  assert.equal(sydneyGssCase.sourceSnapshots.filter((s: { id: string }) => s.id === id).length, 1);
}

const hamburgCase = realCases.find(c => c.candidateId === 3793);
assert.equal(
  hamburgCase.priorityCompletionReview.sha256,
  digest(hamburgCase.priorityCompletionReview.path)
);
assert.equal(
  hamburgCase.priorityCompletionReview.researchReportSha256,
  digest(hamburgCase.priorityCompletionReview.researchReport)
);
assert.equal(hamburgCase.sourceSnapshots.length, 18);
assert.equal(
  hamburgCase.sourceSnapshots.filter((s: { reusedFrom?: string }) => s.reusedFrom).length,
  13
);
assert.equal(hamburgCase.failedSourceSnapshots.length, 5);
assert.equal(hamburgCase.rootScopeReview.rootPdfPageCount, 14);
assert.equal(hamburgCase.rootScopeReview.notes.pressureInjury.riskRatio, 2.17);
assert(
  hamburgCase.rootScopeReview.notes.pressureInjury.riskRatio <=
    hamburgCase.rootScopeReview.notes.pressureInjury.referenceMax
);
assert(
  hamburgCase.rootScopeReview.notes.hipFractureWalking50mAtDischarge.riskRatio >
    hamburgCase.rootScopeReview.notes.hipFractureWalking50mAtDischarge.referenceMax
);
assert.equal(hamburgCase.rootScopeReview.notes.riskAdjustedOutlierIsProofOfPoorQuality, false);
assert.equal(hamburgCase.rootScopeReview.sgb62CapsAllPrivateAndCaregiverCosts, false);
assert.deepEqual(total(hamburg), { center: null, lower: 27, upper: 82 });
for (const dimension of ["ISR", "LON", "TEC", "OPT"] as const) {
  const withdrawn = { ...hamburg };
  delete withdrawn[dimension];
  const is15 = weights[dimension] === 15;
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: is15 ? 18 : 21,
    upper: is15 ? 88 : 86,
  });
  assert.deepEqual(total({ ...hamburg, [dimension]: 40 }), {
    center: null,
    lower: is15 ? 24 : 25,
    upper: is15 ? 79 : 80,
  });
}

const lyonCase = realCases.find(c => c.candidateId === 3718);
assert.equal(
  lyonCase.priorityCompletionReview.sha256,
  digest(lyonCase.priorityCompletionReview.path)
);
assert.equal(
  lyonCase.priorityCompletionReview.researchReportSha256,
  digest(lyonCase.priorityCompletionReview.researchReport)
);
assert.equal(lyonCase.sourceSnapshots.length, 18);
assert.equal(
  lyonCase.sourceSnapshots.filter((s: { reusedFrom?: string }) => s.reusedFrom).length,
  6
);
assert.equal(lyonCase.failedSourceSnapshots.length, 2);
assert.equal(lyonCase.rootScopeReview.rootPdfPageCount, 12);
assert.equal(lyonCase.rootScopeReview.sourceHeadersAndExactFetchTimeRecoveredForS03S07S08, false);
assert.equal(lyonCase.rootScopeReview.all500PeopleSameProductCertified, false);
assert.equal(lyonCase.rootScopeReview.ordinaryFrenchCitizenAutomaticallyHasFullMutuelle, false);
assert.equal(lyonCase.rootScopeReview.ameli100MeansNoDailyOrPrivateCosts, false);
assert.equal(lyonCase.rootScopeReview.rootBNPRead, false);
assert.equal(lyonCase.rootScopeReview.rootBankFurtherRequestsAfterStop, 0);
for (const p of lyonCase.referenceBoundaryCheck.referencePoints) {
  assert.deepEqual(p.fuaMatches, p.label.startsWith("ReneeSabran") ? [4158] : [3718]);
}
assert.deepEqual(total(lyon), { center: null, lower: 36, upper: 76 });
for (const dimension of ["ISR", "MED", "LON", "TEC", "OPT"] as const) {
  const withdrawn = { ...lyon };
  delete withdrawn[dimension];
  const is15 = weights[dimension] === 15;
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: is15 ? 27 : 30,
    upper: is15 ? 82 : 80,
  });
  assert.deepEqual(total({ ...lyon, [dimension]: 40 }), {
    center: null,
    lower: is15 ? 33 : 34,
    upper: is15 ? 73 : 74,
  });
}

const tampereGssReview = tampereCase.gssCompletionReview;
assert.equal(tampereGssReview.sha256, digest(tampereGssReview.path));
assert.equal(tampereGssReview.researchReportSha256, digest(tampereGssReview.researchReport));
assert.equal(tampereGssReview.adoptedScore, 60);
assert.equal(tampereGssReview.frozenResearchRecommendation, null);
assert.equal(tampereGssReview.rootCorrectedMissedReportedOutcome, true);
assert.equal(tampereGssReview.reported88PercentIsCitywideGangEffect, false);
assert.equal(tampereGssReview.rootNewNetworkRequests, 0);
assert.equal(tampereGssReview.otherSevenDimensionObjectsUnchanged, true);
assert.equal(total({ ...tampere, GSS: 40 }).center, 57);
assert.equal(total({ ...tampere, GSS: 80 }).center, 63);
const tampereWithoutGss = { ...tampere };
delete tampereWithoutGss.GSS;
assert.deepEqual(total(tampereWithoutGss), { center: null, lower: 51, upper: 66 });
assert.equal(tampereGssReview.newSourceCount, 7);
for (const id of tampereGssReview.newSourceIds) {
  const sources = tampereCase.sourceSnapshots.filter((s: { id: string }) => s.id === id);
  assert.equal(sources.length, 1);
  assert.equal(sources[0].historicalCutoffBytesVerified, false);
  assert.equal(sources[0].originalSha256, sources[0].sha256);
}

const berlinResReview = berlinGssCase.resCompletionReview;
assert.equal(berlinResReview.sha256, digest(berlinResReview.path));
assert.equal(berlinResReview.researchReportSha256, digest(berlinResReview.researchReport));
assert.equal(berlinResReview.adoptedScore, 60);
assert.equal(berlinResReview.n02NumbersUsedForScore, false);
assert.equal(berlinResReview.n02IncomePurchaseDirectionUsedForScore, false);
assert.equal(berlinResReview.n02PreCutoffAvailabilityAssumed, false);
assert.equal(berlinResReview.rootNewNetworkRequests, 0);
assert.equal(berlinResReview.otherSevenDimensionObjectsUnchanged, true);
assert.equal(total({ ...berlin, RES: 40 }).center, 58);
assert.equal(total({ ...berlin, RES: 80 }).center, 62);
const berlinWithoutRes = { ...berlin };
delete berlinWithoutRes.RES;
assert.deepEqual(total(berlinWithoutRes), { center: null, lower: 54, upper: 64 });
assert.equal(berlinResReview.newSourceIds.length, 12);
for (const id of berlinResReview.newSourceIds) {
  const sources = berlinGssCase.sourceSnapshots.filter((s: { id: string }) => s.id === id);
  assert.equal(sources.length, 1);
}
const berlinExcludedFood = berlinGssCase.sourceSnapshots.find(
  (s: { id: string }) => s.id === "R30-N02"
);
assert.equal(berlinExcludedFood.usedForScore, false);
assert(!berlinResReview.newScoringSourceIds.includes("R30-N02"));

const leuvenCase = realCases.find(c => c.candidateId === 1565);
assert.equal(
  leuvenCase.priorityCompletionReview.sha256,
  digest(leuvenCase.priorityCompletionReview.path)
);
assert.equal(
  leuvenCase.priorityCompletionReview.researchReportSha256,
  digest(leuvenCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(leuven), { center: null, lower: 36, upper: 76 });
for (const dimension of ["ISR", "MED", "LON", "TEC", "OPT"] as const) {
  const withdrawn = { ...leuven };
  delete withdrawn[dimension];
  const is15 = weights[dimension] === 15;
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: is15 ? 27 : 30,
    upper: is15 ? 82 : 80,
  });
}
assert.equal(leuvenCase.rootScopeReview.transmet73And9CertifiedAsWholeRandomizedSet, false);
assert.equal(leuvenCase.rootScopeReview.stemCellCohortProvesHealthyLifeExtension, false);
assert.equal(leuvenCase.rootScopeReview.sourceGvhdWordingAdoptedAsBeneficialMechanism, false);

const nagoyaCase = realCases.find(c => c.candidateId === 4532);
assert.equal(
  nagoyaCase.priorityCompletionReview.sha256,
  digest(nagoyaCase.priorityCompletionReview.path)
);
assert.equal(
  nagoyaCase.priorityCompletionReview.researchReportSha256,
  digest(nagoyaCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(nagoya), { center: null, lower: 30, upper: 80 });
for (const dimension of ["ISR", "MED", "TEC", "OPT"] as const) {
  const withdrawn = { ...nagoya };
  delete withdrawn[dimension];
  const is15 = weights[dimension] === 15;
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: is15 ? 21 : 24,
    upper: is15 ? 86 : 84,
  });
}
assert.equal(nagoyaCase.rootScopeReview.currentPriceUses2015LocalTable, false);
assert.equal(nagoyaCase.rootScopeReview.future2027PaymentTableUsedAsCurrent, false);
assert.equal(nagoyaCase.rootScopeReview.rainOct14Housing690UsedAtCutoff, false);
assert.equal(nagoyaCase.rootScopeReview.tecImplementationClaimIsIndependentLocalUptakeAudit, false);
assert.equal(nagoyaCase.rootScopeReview.domesticRoamingAloneProvesOverseasContinuity, false);
assert.equal(
  nagoyaCase.sourceSnapshots.find((s: { id: string }) => s.id === "S14").usedForScore,
  false
);
assert.equal(
  nagoyaCase.sourceSnapshots.find((s: { id: string }) => s.id === "N03").usedForScore,
  true
);

const philadelphiaCase = realCases.find(c => c.candidateId === 7165);
assert.equal(
  philadelphiaCase.priorityCompletionReview.sha256,
  digest(philadelphiaCase.priorityCompletionReview.path)
);
assert.equal(
  philadelphiaCase.priorityCompletionReview.researchReportSha256,
  digest(philadelphiaCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(philadelphia), { center: 60, lower: 60, upper: 60 });
for (const dimension of ["PCS", "GSS", "ISR", "MED", "LON", "TEC", "OPT"] as const) {
  const withdrawn = { ...philadelphia };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: weights[dimension] === 15 ? 51 : 54,
    upper: weights[dimension] === 15 ? 66 : 64,
  });
}
assert.equal(philadelphiaCase.rootScopeReview.lonChangedFromFrozenUnknown, true);
assert.equal(philadelphiaCase.rootScopeReview.lancasterRoutineInfusionMovedInto7165, false);
assert.equal(
  philadelphiaCase.rootScopeReview.historicalTrialAdultsClaimedCurrentRoutineDenominator,
  false
);
assert.equal(philadelphiaCase.rootScopeReview.thriveUniversalMedianResidentCoverage, false);
assert.equal(philadelphiaCase.rootScopeReview.domesticSmsProvesOverseasRoaming, false);
assert.equal(philadelphiaCase.rootScopeReview.pewCrimeConcernIsOrganizedViolenceRate, false);
assert.equal(philadelphiaCase.rootAdditionalWebReadSources[0].sha256, null);

const kualaLumpurCase = realCases.find(c => c.candidateId === 1322);
assert.equal(
  kualaLumpurCase.priorityCompletionReview.sha256,
  digest(kualaLumpurCase.priorityCompletionReview.path)
);
assert.equal(
  kualaLumpurCase.priorityCompletionReview.researchReportSha256,
  digest(kualaLumpurCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(kualaLumpur), { center: null, lower: 21, upper: 86 });
for (const dimension of ["ISR", "RES", "TEC"] as const) {
  const withdrawn = { ...kualaLumpur };
  delete withdrawn[dimension];
  assert.deepEqual(total(withdrawn), {
    center: null,
    lower: dimension === "ISR" ? 12 : 15,
    upper: dimension === "ISR" ? 92 : 90,
  });
}
assert.equal(
  kualaLumpurCase.sourceSnapshots.find((s: { id: string }) => s.id === "S08").usedForScore,
  false
);
assert.equal(
  kualaLumpurCase.sourceSnapshots.find((s: { id: string }) => s.id === "S08").substantiveOriginal,
  false
);
assert.equal(
  kualaLumpurCase.sourceSnapshots.find((s: { id: string }) => s.id === "S01").usedForScore,
  false
);
assert.equal(
  kualaLumpurCase.sourceSnapshots.find((s: { id: string }) => s.id === "S16").usedForScore,
  true
);
assert.equal(
  kualaLumpurCase.rootScopeReview.rootVersionComparison.page85ActualUnitCorrectionVerified,
  true
);
assert.equal(kualaLumpurCase.rootScopeReview.sadeTransferredToKlMedianResident, false);
assert.equal(kualaLumpurCase.rootScopeReview.meanConsumptionRatioIsMedianHouseholdBudget, false);
assert.equal(kualaLumpurCase.rootScopeReview.loanValueRatiosAreHouseholdPopulationRates, false);
assert.equal(kualaLumpurCase.rootScopeReview.outageDurationIsEachHouseholdDuration, false);
assert.equal(kualaLumpurCase.rootScopeReview.hkl850CardPixelsActuallyViewed, false);
assert.deepEqual(
  kualaLumpurCase.referenceBoundaryCheck.cases["1322"].approximateReferences[2].all9031Matches,
  []
);

const munichMedReview = munichCase.medCompletionReview;
assert.equal(munichMedReview.sha256, digest(munichMedReview.path));
assert.equal(munichMedReview.researchReportSha256, digest(munichMedReview.researchReport));
assert.equal(munichMedReview.adoptedScore, 60);
assert.equal(munichMedReview.rootNewNetworkRequests, 0);
assert.equal(munichMedReview.otherSevenDimensionObjectsUnchanged, true);
assert.equal(munichMedReview.rootReview.differentCohortsAveragedIntoQualityScore, false);
assert.equal(munichMedReview.rootReview.adverseClinicalSignalsDismissed, false);
assert.equal(munichMedReview.rootReview.allMetricsMustBeatModelGate, false);
assert.equal(munichMedReview.rootReview.noBroadSystemFailureUsedAsPositiveEvidence, false);
assert.equal(munichMedReview.rootReview.copayCapIncludesPrivateOrUncoveredExtras, false);
assert.equal(munichMedReview.rootReview.allResidentsFixedAdults, false);

const viennaGssCase = realCases.find(c => c.candidateId === 790);
const viennaGssReview = viennaGssCase.gssCompletionReview;
assert.equal(viennaGssReview.sha256, digest(viennaGssReview.path));
assert.equal(viennaGssReview.researchReportSha256, digest(viennaGssReview.researchReport));
assert.equal(viennaGssCase.reportSha256, digest(viennaGssCase.resourceCompletionReview.path));
assert.equal(viennaGssReview.adoptedScore, 60);
assert.equal(viennaGssReview.otherSevenExactUtf8ObjectsUnchanged, true);
assert.equal(viennaGssReview.exactHistoricalByteMatches, 2);
assert.equal(viennaGssReview.currentDifferentVersionSnapshots, 1);
assert.equal(viennaGssReview.rootNewNetworkRequests, 0);
assert.equal(viennaGssReview.rootReview.targetedGroupsExcludedFromOrdinaryPortrait, false);
assert.equal(viennaGssReview.rootReview.seizureIsConvictionOrAvoidedAttackCount, false);
assert.equal(viennaGssReview.rootReview.airportPassengersAreResidentRiskRate, false);
assert.equal(viennaGssReview.rootReview.airportBackupIsCitywideMilitaryProtection, false);
assert.equal(viennaGssReview.rootReview.currentChangedBodyIsRecoveredOldBody, false);
assert.equal(viennaGssReview.rootReview.companySurvivalProvesResidentSafety, false);
assert.equal(viennaGssReview.rootReview.score40RequiresMajorityVictimsOrCityShutdown, false);
assert.deepEqual(total({ ...vienna, GSS: 40 }), { center: 57, lower: 57, upper: 57 });
const viennaWithoutGss = { ...vienna };
delete viennaWithoutGss.GSS;
assert.deepEqual(total(viennaWithoutGss), { center: null, lower: 51, upper: 66 });

const oxfordCase = realCases.find(c => c.candidateId === 4792);
assert.equal(
  oxfordCase.priorityCompletionReview.sha256,
  digest(oxfordCase.priorityCompletionReview.path)
);
assert.equal(
  oxfordCase.priorityCompletionReview.researchReportSha256,
  digest(oxfordCase.priorityCompletionReview.researchReport)
);
assert.equal(oxfordCase.sourceSnapshots.length, 21);
assert.deepEqual(total(oxford), { center: null, lower: 33, upper: 68 });
for (const [id, lower, upper] of [
  ["PCS", 27, 77],
  ["ISR", 24, 74],
  ["MED", 27, 77],
  ["LON", 27, 72],
  ["TEC", 27, 72],
] as const) {
  const withdrawn = { ...oxford };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...oxford, PCS: 60 }), { center: null, lower: 36, upper: 71 });
assert.deepEqual(total({ ...oxford, MED: 60 }), { center: null, lower: 36, upper: 71 });
assert.deepEqual(total({ ...oxford, ISR: 40 }), { center: null, lower: 30, upper: 65 });
assert.deepEqual(total({ ...oxford, LON: 40 }), { center: null, lower: 31, upper: 66 });
assert.deepEqual(total({ ...oxford, TEC: 80 }), { center: null, lower: 35, upper: 70 });
assert.equal(oxfordCase.rootExcludedWebClaims[0].usedForScore, false);
assert(oxfordCase.dimensions.every((d: { sourceIds: string[] }) => !d.sourceIds.includes("S07")));

const cambridgeCase = realCases.find(c => c.candidateId === 5550);
assert.equal(
  cambridgeCase.priorityCompletionReview.sha256,
  digest(cambridgeCase.priorityCompletionReview.path)
);
assert.equal(
  cambridgeCase.priorityCompletionReview.researchReportSha256,
  digest(cambridgeCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(cambridge), { center: null, lower: 21, upper: 81 });
assert.equal(cambridgeCase.sourceSnapshots.length, 11);
assert.equal(cambridgeCase.failedSourceSnapshots.length, 2);
assert.equal(cambridgeCase.routingSourceSnapshots.length, 2);
assert.equal(
  cambridgeCase.sourceSnapshots.find((s: { id: string }) => s.id === "S14").usedForScore,
  false
);
assert.equal(cambridgeCase.rootScopeReview.htmlTrustTemporalConflictAdopted, false);
assert.equal(cambridgeCase.rootScopeReview.score40RequiresMajorityVictimsOrCityShutdown, false);
assert.equal(cambridgeCase.rootScopeReview.survey5501And1411Pooled, false);
assert.equal(cambridgeCase.rootScopeReview.stanstedIsInside5550, false);
for (const [id, lower, upper] of [
  ["MED", 15, 90],
  ["ISR", 12, 87],
  ["TEC", 15, 85],
] as const) {
  const withdrawn = { ...cambridge };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...cambridge, MED: 60 }), { center: null, lower: 24, upper: 84 });
assert.deepEqual(total({ ...cambridge, ISR: 40 }), { center: null, lower: 18, upper: 78 });
assert.deepEqual(total({ ...cambridge, TEC: 40 }), { center: null, lower: 19, upper: 79 });
assert.deepEqual(total({ ...cambridge, TEC: 80 }), { center: null, lower: 23, upper: 83 });

const pittsburghCase = realCases.find(c => c.candidateId === 7020);
assert.equal(
  pittsburghCase.priorityCompletionReview.sha256,
  digest(pittsburghCase.priorityCompletionReview.path)
);
assert.equal(
  pittsburghCase.priorityCompletionReview.researchReportSha256,
  digest(pittsburghCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(pittsburgh), { center: null, lower: 42, upper: 67 });
assert.equal(pittsburghCase.sourceSnapshots.length, 20);
assert.equal(pittsburghCase.failedSourceSnapshots.length, 1);
assert.equal(pittsburghCase.routingSourceSnapshots.length, 1);
for (const key of [
  "score40RequiresDominanceOrMajorityOrShutdown",
  "bmtOrTdm1OutcomesTransferredToCart",
  "hasTisaOutcomesArePittsburgh100Patients",
  "fapTransplantExclusionMeansAllInsuranceDenied",
  "hardshipThresholdIs15PercentCopayCap",
  "airportFareCertifiedAtCutoff",
  "overseasCommunicationDirectlyMeasured",
  "germanApplicationMeansResidenceGranted",
])
  assert.equal(pittsburghCase.rootScopeReview[key], false);
for (const [id, lower, upper] of [
  ["PCS", 36, 76],
  ["ISR", 33, 73],
  ["MED", 33, 73],
  ["LON", 36, 71],
  ["TEC", 36, 71],
  ["OPT", 36, 71],
] as const) {
  const withdrawn = { ...pittsburgh };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...pittsburgh, PCS: 60 }), { center: null, lower: 45, upper: 70 });
assert.deepEqual(total({ ...pittsburgh, MED: 40 }), { center: null, lower: 39, upper: 64 });
assert.deepEqual(total({ ...pittsburgh, LON: 40 }), { center: null, lower: 40, upper: 65 });
assert.deepEqual(total({ ...pittsburgh, OPT: 40 }), { center: null, lower: 40, upper: 65 });
const pittsburghWithoutLonOpt = { ...pittsburgh };
delete pittsburghWithoutLonOpt.LON;
delete pittsburghWithoutLonOpt.OPT;
assert.deepEqual(total(pittsburghWithoutLonOpt), { center: null, lower: 30, upper: 75 });

const eindhovenCase = realCases.find(c => c.candidateId === 2254);
assert.equal(
  eindhovenCase.priorityCompletionReview.sha256,
  digest(eindhovenCase.priorityCompletionReview.path)
);
assert.equal(
  eindhovenCase.priorityCompletionReview.researchReportSha256,
  digest(eindhovenCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(eindhoven), { center: 57, lower: 57, upper: 57 });
assert.equal(eindhovenCase.sourceSnapshots.length, 21);
assert.equal(eindhovenCase.webReadSources.length, 2);
assert.equal(eindhovenCase.rootScopeReview.policeToolTextMatchedOriginalSessionContentBlock, true);
for (const key of [
  "policeToolTextDigestIsWebsiteOriginalDigest",
  "wijUnretainedBannerUsedForScore",
  "asctHomeConditionsAreAllTreatmentPrerequisites",
  "mumcIsInside2254",
  "asctAftercareTransferredToCart",
  "leuven463OutcomesAreLocalCohort",
  "hsmr96IsSignificantlyLowerMortality",
  "possibleCalamitiesAreConfirmedDeaths",
  "report6WeekBenchmarkIndependentlyCertifiedNationalStandard",
  "score40RequiresDominanceOrMajorityOrShutdown",
])
  assert.equal(eindhovenCase.rootScopeReview[key], false);
for (const [id, lower, upper] of [
  ["PCS", 51, 66],
  ["GSS", 48, 63],
  ["ISR", 48, 63],
  ["MED", 48, 63],
  ["LON", 51, 61],
  ["TEC", 51, 61],
  ["OPT", 51, 61],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...eindhoven };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...eindhoven, PCS: 60 }), { center: 60, lower: 60, upper: 60 });
assert.deepEqual(total({ ...eindhoven, GSS: 40 }), { center: 54, lower: 54, upper: 54 });
assert.deepEqual(total({ ...eindhoven, MED: 40 }), { center: 54, lower: 54, upper: 54 });
assert.deepEqual(total({ ...eindhoven, LON: 40 }), { center: 55, lower: 55, upper: 55 });
assert.deepEqual(total({ ...eindhoven, TEC: 40 }), { center: 55, lower: 55, upper: 55 });
assert.deepEqual(total({ ...eindhoven, TEC: 80 }), { center: 59, lower: 59, upper: 59 });
assert.deepEqual(total({ ...eindhoven, OPT: 40 }), { center: 55, lower: 55, upper: 55 });

const eindhovenPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "2254"
);
assert.equal(eindhovenPosition.bestPosition, 25);
assert.equal(eindhovenPosition.worstPosition, rankAudit.candidateCount - 1);

assert.equal(eindhoven.RES, 60);
assert.equal(
  eindhovenCase.resourceCompletionReview.sha256,
  digest(eindhovenCase.resourceCompletionReview.path)
);
assert.equal(eindhovenCase.resourceCompletionReview.rootPdfPageCount, 8);
assert.equal(eindhovenCase.resourceCompletionReview.rootNewNetworkRequests, 0);
for (const key of [
  "j55Advice1489IsUniqueHouseholds",
  "j55Advice1489DividedBy2225IsSuccessRate",
  "j55CountsAre2024NewUniqueHouseholds",
  "effectControlNvtMeansIndependentEffectAudit",
  "budgetPost51ZeroMeansAllJ55SpendZero",
  "budgetPost51AndJ55ReconciliationVerified",
  "medianIncomeAutomaticallyAidEligible",
  "foodHelp3To4DaysMeansWholeWeekCovered",
  "providerAreaOrCityEqualsWholeFua",
  "enterpriseNewConnectionsAreHouseholdOutages",
  "water13Min9SecIsEveryHouseholdLongestOutage",
  "household30Point78AdvanceIsFinalMedianBill",
  "absenceOfFailureUsedFor60",
  "resourceAllHouseholdNetBundleDirectlyMeasured",
])
  assert.equal(eindhovenCase.resourceScopeReview[key], false);
const eindhovenWithoutRes: Partial<Record<DimensionId, number>> = { ...eindhoven };
delete eindhovenWithoutRes.RES;
assert.deepEqual(total(eindhovenWithoutRes), { center: null, lower: 51, upper: 61 });
assert.deepEqual(total({ ...eindhoven, RES: 40 }), { center: 55, lower: 55, upper: 55 });

const luxembourgCase = realCases.find(c => c.candidateId === 103);
assert.equal(
  luxembourgCase.priorityCompletionReview.sha256,
  digest(luxembourgCase.priorityCompletionReview.path)
);
assert.equal(
  luxembourgCase.priorityCompletionReview.researchReportSha256,
  digest(luxembourgCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(luxembourg), { center: null, lower: 36, upper: 71 });
assert.equal(luxembourgCase.sourceSnapshots.length, 19);
assert.equal(luxembourgCase.rootScopeReview.rootPdfPageCount, 18);
for (const key of [
  "source15ExactHTTPRouteCountAuthenticated",
  "cnsConsolidationIndependentlyAuthenticatedGazette",
  "copaymentCapIncludesAllPrivateExpenses",
  "prnPainAssessmentIsMortalityOutcome",
  "departmentHospitalisationLabelsReencodedAsBedDays",
  "carT8ResponsesAreMatureProductSpecificSurvival",
  "cellTherapyUpgradeCompleted",
  "leuven463OutcomesAreLuxembourgCohort",
  "renewable119PercentIsCitySelfSufficiency",
  "nineWaterIndicatorsAreHouseholdUnsafeRate",
  "tecProofOfConceptIsLocalMassProduction",
  "euRightsAloneProveLongtermExit",
  "score40RequiresDominanceOrMajorityOrShutdown",
])
  assert.equal(luxembourgCase.rootScopeReview[key], false);
for (const [id, lower, upper] of [
  ["PCS", 30, 80],
  ["ISR", 27, 77],
  ["MED", 27, 77],
  ["LON", 30, 75],
  ["TEC", 30, 75],
] as const) {
  const withdrawn = { ...luxembourg };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const [id, value, lower, upper] of [
  ["PCS", 60, 39, 74],
  ["ISR", 40, 33, 68],
  ["MED", 40, 33, 68],
  ["LON", 40, 34, 69],
  ["TEC", 40, 34, 69],
  ["TEC", 80, 38, 73],
] as const)
  assert.deepEqual(total({ ...luxembourg, [id]: value }), { center: null, lower, upper });

const stuttgartCase = realCases.find(c => c.candidateId === 3580);
assert.equal(
  stuttgartCase.priorityCompletionReview.sha256,
  digest(stuttgartCase.priorityCompletionReview.path)
);
assert.equal(
  stuttgartCase.priorityCompletionReview.researchReportSha256,
  digest(stuttgartCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(stuttgart), { center: 57, lower: 57, upper: 57 });
const stuttgartWithoutRes: Partial<Record<DimensionId, number>> = { ...stuttgart };
delete stuttgartWithoutRes.RES;
assert.deepEqual(total(stuttgartWithoutRes), { center: null, lower: 51, upper: 61 });
assert.equal(stuttgartCase.sourceSnapshots.length, 25);
assert.equal(stuttgartCase.failedSourceSnapshots.length, 3);
assert.equal(stuttgartCase.rootScopeReview.rootPdfPageCount, 19);
for (const key of [
  "freeAllogeneicConsultationTransferredToAutologous",
  "missingTrialNumbersAutomaticallyScore40",
  "external463OutcomesAreStuttgartCohort",
  "fiveCartProductsIndividuallyNamedAndOutcomesVerified",
  "allIQMRowsFullyRiskAdjusted",
  "allDepartmentCasesAreDifferentFuaResidents",
  "allClimateMeasuresCompleted",
  "generator72HoursAllNodesTested",
  "sewage49PercentIsResidentEnergySelfSufficiency",
  "emergency26And41AllActivatedInActualDisaster",
  "normal2026SafetyImprovementErasesAllOrganizedViolence",
  "score40RequiresDominanceOrMajorityOrShutdown",
])
  assert.equal(stuttgartCase.rootScopeReview[key], false);
for (const [id, lower, upper] of [
  ["PCS", 42, 67],
  ["GSS", 45, 70],
  ["ISR", 42, 67],
  ["MED", 42, 67],
  ["LON", 45, 65],
  ["TEC", 45, 65],
  ["OPT", 45, 65],
] as const) {
  const withdrawn = { ...stuttgartWithoutRes };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const [id, value, lower, upper] of [
  ["GSS", 60, 54, 64],
  ["PCS", 40, 48, 58],
  ["ISR", 40, 48, 58],
  ["MED", 40, 48, 58],
  ["LON", 40, 49, 59],
  ["TEC", 40, 49, 59],
  ["OPT", 40, 49, 59],
  ["ISR", 80, 54, 64],
  ["TEC", 80, 53, 63],
  ["OPT", 80, 53, 63],
] as const)
  assert.deepEqual(total({ ...stuttgartWithoutRes, [id]: value }), { center: null, lower, upper });
const stuttgartPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "3580"
);
assert.equal(stuttgartPosition.bestPosition, 25);
assert.equal(stuttgartPosition.worstPosition, rankAudit.candidateCount - 1);

assert.equal(stuttgart.RES, 60);
assert.equal(
  stuttgartCase.resourceCompletionReview.sha256,
  digest(stuttgartCase.resourceCompletionReview.path)
);
assert.deepEqual(total({ ...stuttgart, RES: 40 }), { center: 55, lower: 55, upper: 55 });
assert.deepEqual(total({ ...stuttgart, RES: 80 }), { center: 59, lower: 59, upper: 59 });
for (const d of stuttgartCase.dimensions.filter((d: { id: string }) => d.id !== "RES")) {
  assert.equal(
    createHash("sha256").update(JSON.stringify(d)).digest("hex"),
    stuttgartCase.resourceCompletionReview.originalSevenDimensionJSONHashes[d.id]
  );
}
assert.equal(stuttgartCase.resourceCompletionReview.rootPdfPageCount, 8);
assert.equal(stuttgartCase.resourceCompletionReview.newHTTPActualLegs, 3);
assert.equal(stuttgartCase.resourceCompletionReview.cumulativeHTTPActualLegs, 21);
assert.equal(stuttgartCase.resourceScopeReview.fullMedianResourceBasketDirectlyMeasured, false);
assert.equal(stuttgartCase.resourceScopeReview.medianIncomeAutomaticallyTafelEligible, false);
assert.equal(
  stuttgartCase.sourceSnapshots.find((s: { id: string }) => s.id === "N03").scoreEligible,
  false
);

const daejeonCase = realCases.find(c => c.candidateId === 1782);
assert.equal(
  daejeonCase.priorityCompletionReview.sha256,
  digest(daejeonCase.priorityCompletionReview.path)
);
assert.equal(
  daejeonCase.priorityCompletionReview.researchReportSha256,
  digest(daejeonCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(daejeon, { ISR: 60, TEC: 60 });
assert.deepEqual(total(daejeon), { center: null, lower: 15, upper: 90 });
assert.equal(daejeonCase.coverageReview.length, 31);
assert.equal(daejeonCase.sourceSnapshots.length, 18);
assert.equal(daejeonCase.failedSourceSnapshots.length, 3);
assert.equal(daejeonCase.rootScopeReview.rootPdfPageCount, 14);
assert.equal(daejeonCase.rootScopeReview.rootHistoricalToolBlocksVerified, 11);
for (const key of [
  "national2055FirmsAllLocal",
  "nationalRevenueTransferredToDaejeon",
  "local455FirmsAllDiscloseJobs",
  "insuredJobsAreFuaResidentEmployees",
  "sameSurvivalCohortAcrossAges",
  "waterTwoIntakesIndependentBasins",
  "futureAdvancedTreatmentAndTunnelCompleted",
  "waterQualityPointsAreWholeFuaPopulation",
  "allResidentsReceiveMultichildDiscount",
  "nhisCapCoversAllSpending",
  "nationalCapProvesLocalClinicalDelivery",
  "licenseRevenueProvesLonHumanMaturity",
  "planned80InternsCompletedJobs",
  "employment60PercentIsAllAgeSuccessRate",
  "remittance2017FeesCertified2026",
  "germany41MeansAutomaticLongResidence",
  "sourceFailurePenalizesCapability",
  "unknownsFilledWithMidpoint",
])
  assert.equal(daejeonCase.rootScopeReview[key], false);
assert.deepEqual(total({ TEC: 60 }), { center: null, lower: 6, upper: 96 });
assert.deepEqual(total({ ISR: 60 }), { center: null, lower: 9, upper: 94 });
for (const [id, value, lower, upper] of [
  ["ISR", 40, 12, 87],
  ["ISR", 80, 18, 93],
  ["TEC", 40, 13, 88],
  ["TEC", 80, 17, 92],
] as const)
  assert.deepEqual(total({ ...daejeon, [id]: value }), { center: null, lower, upper });

const manchesterCase = realCases.find(c => c.candidateId === 3304);
assert.equal(
  manchesterCase.priorityCompletionReview.sha256,
  digest(manchesterCase.priorityCompletionReview.path)
);
assert.equal(
  manchesterCase.priorityCompletionReview.researchReportSha256,
  digest(manchesterCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(manchester, { PCS: 40, ISR: 60, MED: 40, LON: 60, TEC: 60 });
assert.deepEqual(total(manchester), { center: null, lower: 33, upper: 68 });
assert.equal(manchesterCase.coverageReview.length, 31);
assert.equal(manchesterCase.sourceSnapshots.length, 23);
assert.equal(manchesterCase.failedSourceSnapshots.length, 2);
assert.equal(manchesterCase.rootScopeReview.rootPdfPageCount, 19);
assert.equal(manchesterCase.rootScopeReview.rootExactW01ToolBlockVerified, true);
for (const key of [
  "gmFireServiceAreaEqualsFua3304",
  "wiganCentreFallsInManchester3304",
  "allEvacueesAreLocalLongtermResidents",
  "nationalAverageColumnsAre2025ConcurrentComparator",
  "diagnostic14Point2DirectionUsedForScore",
  "shmi106ProvesSignificantExcessMortality",
  "vte74Point34MeansProphylaxisDrugCoverage",
  "everyArenaRecommendationIndependentlyCertifiedAllAgencies",
  "old2020GuideIsCertified2026NewVersion",
  "hasTisaOutcomesTransferredToLocalOrLiso",
  "has2021And2022DatesSilentlyReconciled",
  "trialAndRegistryAnalysisSetsPooled",
  "allCarerAccommodationAndTaxiCostsPaid",
  "under66MedianResidentAutomaticallyReceivesHeatingAid",
  "university2019PdfUsedAs2025Performance",
  "spinout114And82AreSameDenominator",
  "investmentEqualsSalesOrResidentIncome",
  "o2PermanentRoamingIsUnlimitedFree",
  "airport2027AdvertisementsArePrecutoffRoutes",
  "sourceFailurePenalizesCapability",
  "unknownsFilledWithMidpoint",
])
  assert.equal(manchesterCase.rootScopeReview[key], false);
for (const [id, lower, upper] of [
  ["PCS", 27, 77],
  ["ISR", 24, 74],
  ["MED", 27, 77],
  ["LON", 27, 72],
  ["TEC", 27, 72],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...manchester };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const [id, value, lower, upper] of [
  ["PCS", 60, 36, 71],
  ["MED", 60, 36, 71],
  ["ISR", 40, 30, 65],
  ["LON", 40, 31, 66],
  ["TEC", 40, 31, 66],
  ["TEC", 80, 35, 70],
] as const)
  assert.deepEqual(total({ ...manchester, [id]: value }), { center: null, lower, upper });
const manchesterPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "3304"
);
assert.equal(manchesterPosition.bestPosition, 1);
assert.equal(manchesterPosition.worstPosition, rankAudit.candidateCount);

const houstonCase = realCases.find(c => c.candidateId === 5511);
assert.equal(
  houstonCase.priorityCompletionReview.sha256,
  digest(houstonCase.priorityCompletionReview.path)
);
assert.equal(
  houstonCase.priorityCompletionReview.researchReportSha256,
  digest(houstonCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(houston, { PCS: 40, ISR: 40, RES: 40, MED: 60, TEC: 60 });
assert.deepEqual(total(houston), { center: null, lower: 31, upper: 66 });
assert.equal(houstonCase.coverageReview.length, 31);
assert.equal(houstonCase.sourceSnapshots.length, 16);
assert.equal(houstonCase.failedSourceSnapshots.length, 6);
assert.equal(houstonCase.webReadSources.length, 11);
assert.equal(houstonCase.rootScopeReview.rootPdfPageCount, 14);
assert.equal(houstonCase.rootScopeReview.rootOriginalPngCount, 2);
for (const key of [
  "cityCountyGreaterHoustonAndPortServiceAreaEqualFua",
  "quality2026PathMakes2026Observation",
  "cmsMedicareQualityRepresentsAllAgesDirectly",
  "nullSmallSamplesAreZeroDeaths",
  "hospitalCosts30PercentMeansHouseholdSaving30Percent",
  "usualInsuranceAutomaticallyHarrisInNetwork",
  "medianIncomeAutomatically150PercentFplEligible",
  "expeditedAssistanceMeansFastAppointment",
  "foodFair3000Means3000FoodBeneficiaries",
  "food1600AndTraining700Are2024Only",
  "generator49SitesAlreadyOperational",
  "action61Point39MeansCasesResolved",
  "hpdCover2022SilentlyRepaired",
  "grantMillionAnomalySilentlyRepaired",
  "researchRequirementEqualsDeliveredResearch",
  "plannedMaritimeInnovationCentreAlreadyOperating",
  "twoPortTerminalsAreIndependentInnovationEcosystems",
  "airportNetworkingProvesPersonalInternationalConnectivity",
  "germany41MeansAutomaticLongResidence",
  "qprFinancialTableValuesAdopted",
  "webPdfQprSlOrFapAppendixPixelsViewed",
  "w04W05SavedTextEqualsUntruncatedOriginalReturn",
  "sourceFailurePenalizesCapability",
  "unknownsFilledWithMidpoint",
])
  assert.equal(houstonCase.rootScopeReview[key], false);
for (const [id, lower, upper] of [
  ["PCS", 25, 75],
  ["ISR", 25, 75],
  ["RES", 27, 72],
  ["MED", 22, 72],
  ["TEC", 25, 70],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...houston };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const [id, value, lower, upper] of [
  ["PCS", 60, 34, 69],
  ["ISR", 60, 34, 69],
  ["RES", 60, 33, 68],
  ["MED", 40, 28, 63],
  ["TEC", 40, 29, 64],
] as const)
  assert.deepEqual(total({ ...houston, [id]: value }), { center: null, lower, upper });
const houstonPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "5511"
);
assert.equal(houstonPosition.bestPosition, 1);
assert.equal(houstonPosition.worstPosition, rankAudit.candidateCount);

const sanDiegoCase = realCases.find(c => c.candidateId === 2204);
assert.equal(
  sanDiegoCase.priorityCompletionReview.sha256,
  digest(sanDiegoCase.priorityCompletionReview.path)
);
assert.equal(
  sanDiegoCase.priorityCompletionReview.researchReportSha256,
  digest(sanDiegoCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(sanDiego, { PCS: 40, ISR: 40, MED: 60, LON: 60, TEC: 60 });
assert.deepEqual(total(sanDiego), { center: null, lower: 33, upper: 68 });
assert.equal(sanDiegoCase.unknownWeight, 35);
assert.equal(sanDiegoCase.coverageReview.length, 31);
assert.equal(sanDiegoCase.sourceSnapshots.length, 21);
assert.equal(sanDiegoCase.failedSourceSnapshots.length, 1);
assert.equal(sanDiegoCase.webReadSources.length, 1);
assert.equal(sanDiegoCase.rootScopeReview.rootPdfPageCount, 18);
assert.equal(sanDiegoCase.sourceName, "Tijuana");
assert.equal(sanDiegoCase.countryIso, "USA");
assert.equal(sanDiegoCase.rootScopeReview.lonNetMonitoringBridgeExplicitlyAccepted, true);
assert.equal(sanDiegoCase.rootScopeReview.eindhovenResourceDeltaPreserved, true);
for (const [id, lower, upper] of [
  ["PCS", 27, 77],
  ["ISR", 27, 77],
  ["MED", 24, 74],
  ["LON", 27, 72],
  ["TEC", 27, 72],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...sanDiego };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const [id, value, lower, upper] of [
  ["PCS", 60, 36, 71],
  ["ISR", 60, 36, 71],
  ["MED", 40, 30, 65],
  ["LON", 40, 31, 66],
  ["TEC", 40, 31, 66],
] as const)
  assert.deepEqual(total({ ...sanDiego, [id]: value }), { center: null, lower, upper });
const sanDiegoPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "2204"
);
assert.equal(sanDiegoPosition.bestPosition, 1);
assert.equal(sanDiegoPosition.worstPosition, rankAudit.candidateCount);

const austinCase = realCases.find(c => c.candidateId === 5349);
assert.equal(
  austinCase.priorityCompletionReview.sha256,
  digest(austinCase.priorityCompletionReview.path)
);
assert.equal(
  austinCase.priorityCompletionReview.researchReportSha256,
  digest(austinCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(austin, { PCS: 60, ISR: 60, MED: 60, TEC: 60 });
assert.deepEqual(total(austin), { center: null, lower: 33, upper: 78 });
assert.equal(austinCase.unknownWeight, 45);
assert.equal(austinCase.coverageReview.length, 31);
assert.equal(austinCase.sourceSnapshots.length, 20);
assert.equal(austinCase.priorityCompletionReview.failedConcreteOriginalCount, 3);
assert.equal(austinCase.priorityCompletionReview.budgetIncompleteRouteCount, 1);
assert.equal(austinCase.rootScopeReview.rootPdfPageCount, 19);
assert.equal(austinCase.countryIso, "USA");
for (const [id, lower, upper] of [
  ["PCS", 24, 84],
  ["ISR", 24, 84],
  ["MED", 24, 84],
  ["TEC", 27, 82],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...austin };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const [id, lower, upper] of [
  ["PCS", 30, 75],
  ["ISR", 30, 75],
  ["MED", 30, 75],
  ["TEC", 31, 76],
] as const)
  assert.deepEqual(total({ ...austin, [id]: 40 }), { center: null, lower, upper });
const austinPosition = rankAudit.scenarios.fixed_conditional_centers.caseResults.find(
  (c: { efua_id: string }) => c.efua_id === "5349"
);
assert.equal(austinPosition.bestPosition, 1);
assert.equal(austinPosition.worstPosition, rankAudit.candidateCount);

const newcastleCase = realCases.find(c => c.candidateId === 4227);
assert.equal(
  newcastleCase.priorityCompletionReview.sha256,
  digest(newcastleCase.priorityCompletionReview.path)
);
assert.equal(
  newcastleCase.priorityCompletionReview.researchReportSha256,
  digest(newcastleCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(newcastle, { PCS: 40, ISR: 60, MED: 40, LON: 60, TEC: 60 });
assert.deepEqual(total(newcastle), { center: null, lower: 33, upper: 68 });
assert.equal(newcastleCase.unknownWeight, 35);
assert.deepEqual(
  newcastleCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "OPT"]
);
assert.equal(newcastleCase.coverageReview.length, 31);
assert.equal(newcastleCase.sourceSnapshots.length, 23);
for (const [id, lower, upper] of [
  ["PCS", 27, 77],
  ["MED", 27, 77],
  ["ISR", 24, 74],
  ["LON", 27, 72],
  ["TEC", 27, 72],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...newcastle };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...newcastle, PCS: 60 }), { center: null, lower: 36, upper: 71 });
assert.deepEqual(total({ ...newcastle, MED: 60 }), { center: null, lower: 36, upper: 71 });

const lundCase = realCases.find(c => c.candidateId === 624);
assert.equal(
  lundCase.priorityCompletionReview.sha256,
  digest(lundCase.priorityCompletionReview.path)
);
assert.equal(
  lundCase.priorityCompletionReview.researchReportSha256,
  digest(lundCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(lund), { center: null, lower: 42, upper: 67 });
assert.equal(lundCase.unknownWeight, 25);
assert.deepEqual(
  lundCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "OPT"]
);
assert.equal(lundCase.coverageReview.length, 31);
assert.equal(lundCase.sourceSnapshots.length, 15);
for (const [id, lower, upper] of [
  ["PCS", 36, 76],
  ["ISR", 33, 73],
  ["MED", 33, 73],
  ["RES", 36, 71],
  ["LON", 36, 71],
  ["TEC", 36, 71],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...lund };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...lund, MED: 40 }), { center: null, lower: 39, upper: 64 });
assert.deepEqual(total({ ...lund, PCS: 60 }), { center: null, lower: 45, upper: 70 });

const almereCase = realCases.find(c => c.candidateId === 1956);
assert.equal(
  almereCase.priorityCompletionReview.sha256,
  digest(almereCase.priorityCompletionReview.path)
);
assert.equal(
  almereCase.priorityCompletionReview.researchReportSha256,
  digest(almereCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(almere), { center: null, lower: 42, upper: 62 });
assert.equal(almereCase.unknownWeight, 20);
assert.deepEqual(
  almereCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["LON", "OPT"]
);
for (const [id, lower, upper] of [
  ["PCS", 36, 71],
  ["GSS", 36, 71],
  ["ISR", 33, 68],
  ["MED", 33, 68],
  ["RES", 36, 66],
  ["TEC", 36, 66],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...almere };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...almere, MED: 40 }), { center: null, lower: 39, upper: 59 });
assert.deepEqual(total({ ...almere, PCS: 60 }), { center: null, lower: 45, upper: 65 });

const portsmouthCase = realCases.find(c => c.candidateId === 4867);
assert.equal(
  portsmouthCase.priorityCompletionReview.sha256,
  digest(portsmouthCase.priorityCompletionReview.path)
);
assert.equal(
  portsmouthCase.priorityCompletionReview.researchReportSha256,
  digest(portsmouthCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(portsmouth), { center: null, lower: 33, upper: 68 });
assert.equal(portsmouthCase.unknownWeight, 35);
assert.deepEqual(
  portsmouthCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "OPT"]
);
for (const [id, lower, upper] of [
  ["PCS", 27, 77],
  ["MED", 27, 77],
  ["ISR", 24, 74],
  ["LON", 27, 72],
  ["TEC", 27, 72],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...portsmouth };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...portsmouth, MED: 60 }), { center: null, lower: 36, upper: 71 });
const portsmouthMed = portsmouthCase.dimensions.find((d: { id: string }) => d.id === "MED");
assert(portsmouthMed.sourceIds.includes("N01"));
assert.equal(portsmouthCase.sourceSnapshots.length, 18);
assert.equal(portsmouthCase.failedSourceSnapshots.length, 4);
assert.equal(portsmouthCase.sourceAndStopLedger.rootSupplement.combinedActualLegs, 20);

const birminghamCase = realCases.find(c => c.candidateId === 3799);
assert.equal(
  birminghamCase.priorityCompletionReview.sha256,
  digest(birminghamCase.priorityCompletionReview.path)
);
assert.equal(
  birminghamCase.priorityCompletionReview.researchReportSha256,
  digest(birminghamCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(birmingham), { center: null, lower: 30, upper: 65 });
assert.equal(birminghamCase.unknownWeight, 35);
assert.deepEqual(
  birminghamCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "OPT"]
);
for (const [id, lower, upper] of [
  ["PCS", 24, 74],
  ["ISR", 24, 74],
  ["MED", 24, 74],
  ["LON", 24, 69],
  ["TEC", 24, 69],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...birmingham };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...birmingham, MED: 60 }), { center: null, lower: 33, upper: 68 });
assert.equal(birminghamCase.sourceSnapshots.length, 20);
assert(birminghamCase.sourceSnapshots.every((s: { validOriginal: boolean }) => s.validOriginal));
assert.equal(birminghamCase.failedSourceSnapshots.length, 2);
assert.equal(birminghamCase.sourceAndStopLedger.normalHTTPActualLegs, 18);

const rostockCase = realCases.find(c => c.candidateId === 4586);
assert.equal(
  rostockCase.priorityCompletionReview.sha256,
  digest(rostockCase.priorityCompletionReview.path)
);
assert.equal(
  rostockCase.priorityCompletionReview.researchReportSha256,
  digest(rostockCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(rostock), { center: null, lower: 30, upper: 80 });
assert.equal(rostockCase.unknownWeight, 50);
assert.deepEqual(
  rostockCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "RES", "TEC"]
);
for (const [id, lower, upper] of [
  ["ISR", 21, 86],
  ["MED", 21, 86],
  ["LON", 24, 84],
  ["OPT", 24, 84],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...rostock };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...rostock, MED: 40 }), { center: null, lower: 27, upper: 77 });
assert.equal(rostockCase.sourceSnapshots.length, 22);
assert(rostockCase.sourceSnapshots.every((s: { validOriginal: boolean }) => s.validOriginal));
assert.equal(
  rostockCase.failedSourceSnapshots.filter((s: { status: number }) => s.status === 404).length,
  1
);
assert.equal(
  rostockCase.failedSourceSnapshots.filter((s: { status: number }) => [302, 307].includes(s.status))
    .length,
  2
);
assert.equal(rostockCase.sourceAndStopLedger.normalHTTPActualLegs, 18);

const middlesbroughCase = realCases.find(c => c.candidateId === 4740);
assert.equal(
  middlesbroughCase.priorityCompletionReview.sha256,
  digest(middlesbroughCase.priorityCompletionReview.path)
);
assert.equal(
  middlesbroughCase.priorityCompletionReview.researchReportSha256,
  digest(middlesbroughCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(middlesbrough), { center: null, lower: 33, upper: 68 });
assert.equal(middlesbroughCase.unknownWeight, 35);
assert.deepEqual(
  middlesbroughCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "RES", "LON"]
);
for (const [id, lower, upper] of [
  ["GSS", 27, 77],
  ["ISR", 24, 74],
  ["MED", 27, 77],
  ["TEC", 27, 72],
  ["OPT", 27, 72],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...middlesbrough };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...middlesbrough, MED: 60 }), { center: null, lower: 36, upper: 71 });
assert.equal(middlesbroughCase.sourceSnapshots.length, 26);
assert(middlesbroughCase.sourceSnapshots.every((s: { validOriginal: boolean }) => s.validOriginal));
assert.equal(
  middlesbroughCase.sourceSnapshots.find((s: { id: string }) => s.id === "S05").scoreEligible,
  false
);
assert.equal(
  middlesbroughCase.failedSourceSnapshots.filter((s: { status: number }) => s.status === 403)
    .length,
  2
);
assert.equal(middlesbroughCase.sourceAndStopLedger.normalHTTPActualLegs, 18);

const kuopioCase = realCases.find(c => c.candidateId === 823);
assert.equal(
  kuopioCase.priorityCompletionReview.sha256,
  digest(kuopioCase.priorityCompletionReview.path)
);
assert.equal(
  kuopioCase.priorityCompletionReview.researchReportSha256,
  digest(kuopioCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(kuopio), { center: null, lower: 36, upper: 71 });
assert.equal(kuopioCase.unknownWeight, 35);
assert.deepEqual(
  kuopioCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "OPT"]
);
for (const [id, lower, upper] of [
  ["PCS", 27, 77],
  ["ISR", 27, 77],
  ["MED", 30, 80],
  ["LON", 30, 75],
  ["TEC", 30, 75],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...kuopio };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...kuopio, ISR: 40 }), { center: null, lower: 33, upper: 68 });
assert.deepEqual(total({ ...kuopio, MED: 60 }), { center: null, lower: 39, upper: 74 });
assert.equal(kuopioCase.sourceSnapshots.length, 22);
assert(kuopioCase.sourceSnapshots.every((s: { validOriginal: boolean }) => s.validOriginal));
assert.equal(
  kuopioCase.sourceSnapshots.find((s: { id: string }) => s.id === "S13").scoreEligible,
  false
);
assert.equal(kuopioCase.failedSourceSnapshots.length, 0);
assert.equal(kuopioCase.sourceAndStopLedger.normalHTTPActualLegs, 18);

const hilversumCase = realCases.find(c => c.candidateId === 2032);
assert.equal(
  hilversumCase.priorityCompletionReview.sha256,
  digest(hilversumCase.priorityCompletionReview.path)
);
assert.equal(
  hilversumCase.priorityCompletionReview.researchReportSha256,
  digest(hilversumCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(hilversum), { center: null, lower: 21, upper: 76 });
assert.equal(hilversumCase.unknownWeight, 55);
assert.deepEqual(
  hilversumCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "LON", "TEC", "OPT"]
);
for (const [id, lower, upper] of [
  ["PCS", 12, 82],
  ["ISR", 15, 85],
  ["MED", 15, 85],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...hilversum };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(total({ ...hilversum, ISR: 60 }), { center: null, lower: 24, upper: 79 });
assert.deepEqual(total({ ...hilversum, MED: 60 }), { center: null, lower: 24, upper: 79 });
assert.equal(hilversumCase.sourceSnapshots.length, 21);
assert(hilversumCase.sourceSnapshots.every((s: { validOriginal: boolean }) => s.validOriginal));
assert.equal(hilversumCase.webOnlySources.length, 1);
assert.equal(hilversumCase.webOnlySources[0].sha256, null);
assert.equal(hilversumCase.failedSourceSnapshots.length, 1);
assert.equal(hilversumCase.sourceAndStopLedger.normalHTTPActualLegs, 18);

const odenseCase = realCases.find(c => c.candidateId === 389);
assert.equal(
  odenseCase.priorityCompletionReview.sha256,
  digest(odenseCase.priorityCompletionReview.path)
);
assert.equal(
  odenseCase.priorityCompletionReview.researchReportSha256,
  digest(odenseCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(odense), { center: null, lower: 24, upper: 69 });
assert.equal(odenseCase.unknownWeight, 45);
assert.deepEqual(
  odenseCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "LON", "OPT"]
);
for (const [id, lower, upper] of [
  ["PCS", 18, 78],
  ["ISR", 18, 78],
  ["MED", 18, 78],
  ["TEC", 18, 73],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...odense };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const id of ["PCS", "ISR", "MED"] as const)
  assert.deepEqual(total({ ...odense, [id]: 60 }), { center: null, lower: 27, upper: 72 });
assert.deepEqual(total({ ...odense, TEC: 40 }), { center: null, lower: 22, upper: 67 });
assert.equal(odenseCase.sourceSnapshots.length, 19);
assert(odenseCase.sourceSnapshots.every((s: { validOriginal: boolean }) => s.validOriginal));
assert.equal(
  odenseCase.sourceSnapshots.find((s: { id: string }) => s.id === "S14").scoreEligible,
  false
);
assert.equal(odenseCase.failedSourceSnapshots.length, 0);
assert.equal(odenseCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(odenseCase.rootScopeReview.rootPdfPageCount, 8);

assert.equal(vienna.RES, 60);
assert.equal(
  viennaGssCase.resourceCompletionReview.sha256,
  digest(viennaGssCase.resourceCompletionReview.path)
);
assert.equal(
  viennaGssCase.resourceCompletionReview.researchReportSha256,
  digest(viennaGssCase.resourceCompletionReview.researchReport)
);
assert.deepEqual(total({ ...vienna, RES: 40 }), { center: 58, lower: 58, upper: 58 });
assert.deepEqual(total({ ...vienna, RES: 80 }), { center: 62, lower: 62, upper: 62 });
for (const d of viennaGssCase.dimensions.filter((d: { id: string }) => d.id !== "RES"))
  assert.equal(
    createHash("sha256").update(JSON.stringify(d)).digest("hex"),
    viennaGssCase.resourceCompletionReview.originalSevenDimensionJSONHashes[d.id]
  );
assert.equal(viennaGssCase.sourceSnapshots.length, 44);
assert.equal(viennaGssCase.resourceCompletionReview.rootPdfPageCount, 2);
assert.equal(viennaGssCase.resourceCompletionReview.newHTTPActualLegs, 4);
assert.equal(
  viennaGssCase.resourceWebOnlySources.filter((s: { scoreEligible: boolean }) => s.scoreEligible)
    .length,
  3
);
assert(
  viennaGssCase.resourceWebOnlySources.every(
    (s: { websiteRawSha256: null }) => s.websiteRawSha256 === null
  )
);
assert.equal(viennaGssCase.resourceFailedSourceSnapshots.length, 1);
assert.equal(viennaGssCase.resourceUnrequestedLocatedSources[0].normalHTTPAttempted, false);
assert.equal(viennaGssCase.resourceScopeReview.householdMeanEqualsMedianCitizenIncome, false);
assert.equal(viennaGssCase.resourceScopeReview.consumptionShareIsIncomeBurdenRatio, false);
assert.deepEqual(
  viennaGssCase.dimensions.find((d: { id: string }) => d.id === "GSS").withdrawToUnknownDomain,
  [45, 70]
);
assert.deepEqual(viennaGssCase.sensitivity.GSSWithdrawn, [51, 66]);

const corbyCase = realCases.find(c => c.candidateId === 5236);
assert.equal(
  corbyCase.priorityCompletionReview.sha256,
  digest(corbyCase.priorityCompletionReview.path)
);
assert.equal(
  corbyCase.priorityCompletionReview.researchReportSha256,
  digest(corbyCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(corby), { center: null, lower: 6, upper: 91 });
assert.deepEqual(total({ ...corby, MED: 60 }), { center: null, lower: 9, upper: 94 });
assert.deepEqual(total({}), { center: null, lower: 0, upper: 100 });
assert.equal(corbyCase.unknownWeight, 85);
assert.equal(
  corbyCase.dimensions.filter((d: { score: number | null }) => d.score !== null).length,
  1
);
assert.equal(corbyCase.sourceSnapshots.length, 16);
assert(corbyCase.sourceSnapshots.every((s: { validOriginal: boolean }) => s.validOriginal));
assert.equal(
  corbyCase.sourceSnapshots.find((s: { id: string }) => s.id === "S03").scoreEligible,
  false
);
assert.equal(corbyCase.failedSourceSnapshots.length, 6);
assert.equal(corbyCase.routingSourceSnapshots.length, 2);
assert.equal(corbyCase.sourceAndStopLedger.normalHTTPActualLegs, 16);
assert.equal(corbyCase.rootScopeReview.rootPdfPageCount, 4);
assert.equal(corbyCase.rootScopeReview.processDeviations.length, 1);
assert.equal(corbyCase.referenceBoundaryCheck.allCandidatesChecked, 9031);

assert.equal(
  philadelphiaCase.resourceCompletionReview.sha256,
  digest(philadelphiaCase.resourceCompletionReview.path)
);
assert.equal(
  philadelphiaCase.resourceCompletionReview.researchReportSha256,
  digest(philadelphiaCase.resourceCompletionReview.researchReport)
);
for (const d of philadelphiaCase.dimensions.filter((d: { id: string }) => d.id !== "RES"))
  assert.equal(
    createHash("sha256").update(JSON.stringify(d)).digest("hex"),
    philadelphiaCase.resourceCompletionReview.originalSevenDimensionJSONHashes[d.id]
  );
assert.equal(
  createHash("sha256")
    .update(JSON.stringify(philadelphiaCase.sourceSnapshots.slice(0, 15)))
    .digest("hex"),
  philadelphiaCase.resourceCompletionReview.originalFifteenSourceSnapshotsJSONHash
);
assert.equal(
  philadelphiaCase.dimensions.find((d: { id: string }) => d.id === "RES").subpillars.energy,
  "partial"
);
assert.equal(philadelphiaCase.sourceSnapshots.length, 18);
assert.equal(philadelphiaCase.resourceSourceManifestSupplement.sources.length, 7);
assert.equal(philadelphiaCase.resourceFailedSourceSnapshots.length, 1);
assert.equal(philadelphiaCase.resourceCompletionReview.newHTTPActualLegs, 4);
assert.equal(philadelphiaCase.resourceCompletionReview.strictProcessDifferenceCount, 6);
assert.equal(
  philadelphiaCase.resourceScopeReview.reliability88MinEqualsAnnualPerHouseholdOutage,
  false
);
assert.equal(
  philadelphiaCase.resourceScopeReview.supplyPremiumEqualsAllCustomersTotalBillInflation,
  false
);
for (const [RES, center] of [
  [40, 58],
  [60, 60],
  [80, 62],
] as const)
  assert.deepEqual(total({ ...philadelphia, RES }), { center, lower: center, upper: center });
assert.equal(
  philadelphiaCase.resourceReconsiderationReview.sha256,
  digest(philadelphiaCase.resourceReconsiderationReview.path)
);
assert.equal(philadelphiaCase.resourceReconsiderationReview.newExternalFacts, 0);
assert.equal(philadelphiaCase.resourceReconsiderationReview.newHTTPActualLegs, 0);
const philadelphiaWithoutResources = { ...philadelphia };
delete philadelphiaWithoutResources.RES;
assert.deepEqual(total(philadelphiaWithoutResources), { center: null, lower: 54, upper: 64 });

const livingstonCase = realCases.find(c => c.candidateId === 2011);
assert.equal(
  livingstonCase.priorityCompletionReview.sha256,
  digest(livingstonCase.priorityCompletionReview.path)
);
assert.equal(
  livingstonCase.priorityCompletionReview.researchReportSha256,
  digest(livingstonCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(livingston), { center: null, lower: 21, upper: 81 });
assert.equal(livingstonCase.unknownWeight, 60);
assert.deepEqual(
  livingstonCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "RES", "LON", "OPT"]
);
assert.deepEqual(total({ ...livingston, MED: 60 }), { center: null, lower: 24, upper: 84 });
assert.deepEqual(total({ ...livingston, ISR: 40 }), { center: null, lower: 18, upper: 78 });
for (const [id, lower, upper] of [
  ["ISR", 12, 87],
  ["MED", 15, 90],
  ["TEC", 15, 85],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...livingston };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(livingstonCase.sourceSnapshots.length, 22);
assert(livingstonCase.sourceSnapshots.every((s: { validOriginal: boolean }) => s.validOriginal));
assert.equal(
  livingstonCase.sourceSnapshots.find((s: { id: string }) => s.id === "S06").validSubstantiveBody,
  false
);
assert.equal(
  livingstonCase.sourceSnapshots.find((s: { id: string }) => s.id === "S16").scoreEligible,
  false
);
assert.equal(
  livingstonCase.sourceSnapshots.find((s: { id: string }) => s.id === "S16").postCutoffContext,
  true
);
assert.equal(livingstonCase.failedSourceSnapshots.length, 1);
assert.equal(livingstonCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(livingstonCase.rootScopeReview.rootPdfPageCount, 6);
assert.equal(
  livingstonCase.rootScopeReview.AandESeriesWhole2011OrStJohnDenominatorEstablished,
  false
);
assert.deepEqual(
  livingstonCase.dimensions.find((d: { id: string }) => d.id === "TEC").conditionalAlternatives,
  []
);

const szczecinCase = realCases.find(c => c.candidateId === 140);
assert.equal(
  szczecinCase.priorityCompletionReview.sha256,
  digest(szczecinCase.priorityCompletionReview.path)
);
assert.equal(
  szczecinCase.priorityCompletionReview.researchReportSha256,
  digest(szczecinCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(szczecin), { center: null, lower: 30, upper: 80 });
assert.equal(szczecinCase.unknownWeight, 50);
assert.deepEqual(
  szczecinCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "RES", "OPT"]
);
for (const [id, lower, upper] of [
  ["ISR", 21, 86],
  ["MED", 21, 86],
  ["LON", 24, 84],
  ["TEC", 24, 84],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...szczecin };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(szczecinCase.sourceSnapshots.length, 20);
assert(szczecinCase.sourceSnapshots.every((s: { validOriginal: boolean }) => s.validOriginal));
assert.equal(szczecinCase.failedSourceSnapshots.length, 2);
assert(
  szczecinCase.webReadSources.every(
    (s: { websiteRawSHA256: string | null }) => s.websiteRawSHA256 === null
  )
);
assert.equal(szczecinCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(szczecinCase.rootScopeReview.specificCARTProductPayerDirectlyVerified, false);
assert.equal(szczecinCase.rootScopeReview.CARTSpecificRepeatFollowupDirectlyVerified, false);
assert.equal(szczecinCase.rootScopeReview.rootSelectedPdfTextPageCount, 30);
assert.equal(szczecinCase.rootScopeReview.rootPdfPageCount, 7);
assert(
  szczecinCase.dimensions.every(
    (d: { conditionalAlternatives: number[] }) => d.conditionalAlternatives.length === 0
  )
);

const bedfordCase = realCases.find(c => c.candidateId === 5373);
assert.equal(
  bedfordCase.priorityCompletionReview.sha256,
  digest(bedfordCase.priorityCompletionReview.path)
);
assert.equal(
  bedfordCase.priorityCompletionReview.researchReportSha256,
  digest(bedfordCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(bedford), { center: null, lower: 27, upper: 72 });
assert.equal(bedfordCase.unknownWeight, 45);
assert.deepEqual(
  bedfordCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "LON", "OPT"]
);
for (const [id, value, lower, upper] of [
  ["PCS", 60, 30, 75],
  ["ISR", 40, 24, 69],
  ["MED", 60, 30, 75],
] as const)
  assert.deepEqual(total({ ...bedford, [id]: value }), { center: null, lower, upper });
for (const [id, lower, upper] of [
  ["PCS", 21, 81],
  ["ISR", 18, 78],
  ["MED", 21, 81],
  ["TEC", 21, 76],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...bedford };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(bedfordCase.sourceSnapshots.length, 25);
assert.equal(bedfordCase.failedSourceSnapshots.length, 1);
assert.equal(bedfordCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(bedfordCase.rootScopeReview.rootSelectedPdfTextPageCount, 20);
assert.equal(bedfordCase.rootScopeReview.rootPdfPageCount, 7);
assert.equal(bedfordCase.rootScopeReview.TrustWaitingEqualsWholeBedfordResidentRate, false);
assert.equal(bedfordCase.rootScopeReview.actual2026Still65UnrepairedPropertiesClaimed, false);
assert(
  bedfordCase.webReadSources.every(
    (s: { websiteRawSHA256: string | null }) => s.websiteRawSHA256 === null
  )
);
assert.deepEqual(
  bedfordCase.dimensions.find((d: { id: string }) => d.id === "TEC").conditionalAlternatives,
  []
);

const aarhusCase = realCases.find(c => c.candidateId === 229);
assert.equal(
  aarhusCase.priorityCompletionReview.sha256,
  digest(aarhusCase.priorityCompletionReview.path)
);
assert.equal(
  aarhusCase.priorityCompletionReview.researchReportSha256,
  digest(aarhusCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(aarhus), { center: 57, lower: 57, upper: 57 });
assert.equal(aarhusCase.unknownWeight, 0);
assert.deepEqual(
  aarhusCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  []
);
assert.deepEqual(total({ ...aarhus, PCS: 60 }), { center: 60, lower: 60, upper: 60 });
assert.deepEqual(total({ ...aarhus, ISR: 40 }), { center: 54, lower: 54, upper: 54 });
for (const [id, lower, upper] of [
  ["PCS", 51, 66],
  ["GSS", 48, 63],
  ["ISR", 48, 63],
  ["MED", 48, 63],
  ["RES", 51, 61],
  ["LON", 51, 61],
  ["TEC", 51, 61],
  ["OPT", 51, 61],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...aarhus };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const [RES, center] of [
  [40, 55],
  [60, 57],
  [80, 59],
] as const)
  assert.deepEqual(total({ ...aarhus, RES }), { center, lower: center, upper: center });
assert.equal(aarhusCase.sourceSnapshots.length, 22);
assert.equal(aarhusCase.failedSourceSnapshots.length, 4);
assert.equal(aarhusCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(aarhusCase.rootScopeReview.rootSelectedPdfTextPageCount, 23);
assert.equal(aarhusCase.rootScopeReview.rootPdfPageCount, 6);
assert.equal(aarhusCase.rootScopeReview.sewer2085IsCompletionYear, true);
assert.equal(aarhusCase.rootScopeReview.residenceBanEffectiveIn2025, false);
assert.equal(aarhusCase.rootScopeReview.expected2026EqualsVerifiedProjectStatus, false);
assert.equal(aarhusCase.rootScopeReview.utilitySelfSupplyEqualsHouseholdEnergySecurity, false);
assert.equal(aarhusCase.rootScopeReview.specificLocalCARTProductPayerDirectlyVerified, false);
assert.equal(aarhusCase.rootScopeReview.patientExperienceEqualsClinicalOutcomes, false);
assert(
  aarhusCase.dimensions
    .filter((d: { id: string }) => !["PCS", "ISR"].includes(d.id))
    .every((d: { conditionalAlternatives: number[] }) => d.conditionalAlternatives.length === 0)
);

assert.equal(aarhusCase.routingSourceSnapshots.length, 1);
assert.equal(
  aarhusCase.resourceCompletionReview.sha256,
  digest(aarhusCase.resourceCompletionReview.path)
);
assert.equal(aarhusCase.resourceCompletionReview.rootFreshPdfPagesPersonallyViewed, 4);
assert.equal(aarhusCase.resourceCompletionReview.householdNetBudgetDirectlyMeasured, false);
assert.equal(aarhusCase.resourceCompletionReview.cumulativeNormalHTTPActualLegs, 22);

const nottinghamCase = realCases.find(c => c.candidateId === 4767);
assert.equal(
  nottinghamCase.priorityCompletionReview.sha256,
  digest(nottinghamCase.priorityCompletionReview.path)
);
assert.equal(
  nottinghamCase.priorityCompletionReview.researchReportSha256,
  digest(nottinghamCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(nottingham), { center: null, lower: 33, upper: 73 });
assert.equal(nottinghamCase.unknownWeight, 40);
assert.deepEqual(
  nottinghamCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "OPT"]
);
assert.deepEqual(total({ ...nottingham, MED: 60 }), { center: null, lower: 36, upper: 76 });
assert.deepEqual(total({ ...nottingham, ISR: 40 }), { center: null, lower: 30, upper: 70 });
for (const [id, lower, upper] of [
  ["ISR", 24, 79],
  ["RES", 27, 77],
  ["MED", 27, 82],
  ["LON", 27, 77],
  ["TEC", 27, 77],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...nottingham };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(nottinghamCase.sourceSnapshots.length, 22);
assert.equal(nottinghamCase.failedSourceSnapshots.length, 2);
assert.equal(nottinghamCase.routingSourceSnapshots.length, 1);
assert.equal(nottinghamCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(nottinghamCase.rootScopeReview.rootSelectedPdfTextPageCount, 25);
assert.equal(nottinghamCase.rootScopeReview.rootPdfPageCount, 6);
assert.equal(nottinghamCase.rootScopeReview.actualInfusedLocalCARTCohortDirectlyVerified, false);
assert.equal(nottinghamCase.rootScopeReview.specificLocalProductPayerDirectlyVerified, false);
assert.equal(nottinghamCase.rootScopeReview.genericPIFUEqualsCARTSpecificFollowup, false);
assert.equal(nottinghamCase.rootScopeReview.TrustWaitingEqualsAllFUAUntreatedRate, false);
assert.equal(nottinghamCase.rootScopeReview.resourcesRepresentMeasuredMedianCompleteBudget, false);
assert.equal(nottinghamCase.rootScopeReview.droughtModelEqualsActualRestrictions, false);
assert.equal(nottinghamCase.rootScopeReview.commissionerExitRecommendedEqualsCompleted, false);
assert.equal(
  nottinghamCase.sourceSnapshots.find((s: { id: string }) => s.id === "S17").scoreEligible,
  false
);
assert(
  nottinghamCase.dimensions
    .filter((d: { id: string }) => !["ISR", "MED"].includes(d.id))
    .every((d: { conditionalAlternatives: number[] }) => d.conditionalAlternatives.length === 0)
);

const burtonCase = realCases.find(c => c.candidateId === 4261);
assert.equal(
  burtonCase.priorityCompletionReview.sha256,
  digest(burtonCase.priorityCompletionReview.path)
);
assert.equal(
  burtonCase.priorityCompletionReview.researchReportSha256,
  digest(burtonCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(burtonOnTrent), { center: null, lower: 24, upper: 79 });
assert.equal(burtonCase.unknownWeight, 55);
assert.deepEqual(
  burtonCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "LON", "TEC", "OPT"]
);
for (const id of ["PCS", "ISR"] as const)
  assert.deepEqual(total({ ...burtonOnTrent, [id]: 40 }), { center: null, lower: 21, upper: 76 });
assert.deepEqual(total({ ...burtonOnTrent, MED: 60 }), { center: null, lower: 27, upper: 82 });
for (const [id, lower, upper] of [
  ["PCS", 15, 85],
  ["ISR", 15, 85],
  ["MED", 18, 88],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...burtonOnTrent };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(burtonCase.sourceSnapshots.length, 21);
assert.equal(burtonCase.failedSourceSnapshots.length, 3);
assert.equal(burtonCase.webReadSources.length, 2);
assert.equal(burtonCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(burtonCase.rootScopeReview.rootSelectedPdfTextPageCount, 17);
assert.equal(burtonCase.rootScopeReview.rootPdfPageCount, 4);
assert.equal(burtonCase.rootScopeReview.TrustWaitingEqualsBurtonUntreatedRate, false);
assert.equal(burtonCase.rootScopeReview.sharedTrustResearchEqualsLocalSustainedProduction, false);
assert(
  burtonCase.webReadSources.every(
    (s: { isWebsiteRaw: boolean; scoreEligible: boolean }) => !s.isWebsiteRaw && !s.scoreEligible
  )
);

const daugavpilsCase = realCases.find(c => c.candidateId === 436);
assert.equal(
  daugavpilsCase.priorityCompletionReview.sha256,
  digest(daugavpilsCase.priorityCompletionReview.path)
);
assert.equal(
  daugavpilsCase.priorityCompletionReview.researchReportSha256,
  digest(daugavpilsCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(daugavpils), { center: null, lower: 24, upper: 84 });
assert.equal(daugavpilsCase.unknownWeight, 60);
assert.deepEqual(
  daugavpilsCase.dimensions
    .filter((d: { score: number | null }) => d.score !== null)
    .map((d: { id: string }) => d.id),
  ["ISR", "MED", "TEC"]
);
for (const [id, lower, upper] of [
  ["ISR", 15, 90],
  ["MED", 15, 90],
  ["TEC", 18, 88],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...daugavpils };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert(
  daugavpilsCase.dimensions.every(
    (d: { conditionalAlternatives: number[] }) => d.conditionalAlternatives.length === 0
  )
);
assert.equal(daugavpilsCase.sourceSnapshots.length, 18);
assert.equal(daugavpilsCase.failedSourceSnapshots.length, 1);
assert.deepEqual(
  daugavpilsCase.routingSourceSnapshots.map((s: { status: number }) => s.status),
  [302, 301]
);
assert.equal(daugavpilsCase.routingSourceSnapshots[0].actualTransportIsTLS, false);
assert.equal(daugavpilsCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(daugavpilsCase.rootScopeReview.rootSelectedPdfTextPageCount, 18);
assert.equal(daugavpilsCase.rootScopeReview.rootPdfPageCount, 6);
assert.equal(daugavpilsCase.rootScopeReview.correctedBloodShortageClaimAdoptedAsPatientHarm, false);
assert.equal(
  daugavpilsCase.rootScopeReview.allNVDPersonalEligibilityAndCopayTermsDirectlyRead,
  false
);
assert.equal(
  daugavpilsCase.rootScopeReview.MEDUsualPayerAndNetCareBridgeNecessaryAndRevocable,
  true
);

const lasPalmasCase = realCases.find(c => c.candidateId === 543);
assert.equal(
  lasPalmasCase.priorityCompletionReview.sha256,
  digest(lasPalmasCase.priorityCompletionReview.path)
);
assert.equal(
  lasPalmasCase.priorityCompletionReview.researchReportSha256,
  digest(lasPalmasCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(lasPalmas), { center: null, lower: 30, upper: 80 });
assert.deepEqual(total({ ...lasPalmas, MED: 40 }), { center: null, lower: 27, upper: 77 });
assert.deepEqual(
  lasPalmasCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "RES", "OPT"]
);
for (const [id, lower, upper] of [
  ["ISR", 21, 86],
  ["MED", 21, 86],
  ["LON", 24, 84],
  ["TEC", 24, 84],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...lasPalmas };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(lasPalmasCase.sourceSnapshots.length, 16);
assert.equal(lasPalmasCase.failedSourceSnapshots.length, 5);
assert.equal(lasPalmasCase.routingSourceSnapshots[0].actualTransportIsTLS, false);
assert.equal(lasPalmasCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(lasPalmasCase.rootScopeReview.rootSelectedPdfTextPageCount, 12);
assert.equal(lasPalmasCase.rootScopeReview.rootPdfPageCount, 8);
assert.equal(lasPalmasCase.rootScopeReview.complaintCountsAreAdjudicatedHarmRate, false);
assert.equal(lasPalmasCase.rootScopeReview.specificLocalCARTProductPayerDirectlyVerified, false);
assert.equal(lasPalmasCase.rootScopeReview.matureTisaDLBCLClassSourceActuallyRead, true);
assert.equal(lasPalmasCase.webReadSources[0].isWebsiteRaw, false);
assert.equal(lasPalmasCase.webReadSources[0].sha256, null);
assert(
  lasPalmasCase.coverageReview.length === 31 &&
    lasPalmasCase.coverageReview.every(
      (c: { score: number | null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const gottingenCase = realCases.find(c => c.candidateId === 4083);
assert.equal(gottingenCase.sourceName, "Göttingen");
assert.deepEqual(gottingen, { PCS: 60, ISR: 60, MED: 40, LON: 60, TEC: 60 });
assert.deepEqual(total(gottingen), { center: null, lower: 36, upper: 71 });
assert.equal(gottingenCase.unknownWeight, 35);
assert.equal(
  gottingenCase.priorityCompletionReview.sha256,
  digest(gottingenCase.priorityCompletionReview.path)
);
assert.deepEqual(total({ ...gottingen, MED: 60 }), { center: null, lower: 39, upper: 74 });
assert.deepEqual(total({ ...gottingen, LON: 40 }), { center: null, lower: 34, upper: 69 });
for (const id of ["PCS", "ISR", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...gottingen };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    gottingenCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  gottingenCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "OPT"]
);
assert(
  gottingenCase.coverageReview.length === 31 &&
    gottingenCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(gottingenCase.rootScopeReview.authorPCSUnknownRootAdopted60, true);
assert.equal(gottingenCase.rootScopeReview.data2021DescribedAs2026Census, false);
assert.equal(gottingenCase.rootScopeReview.strokeMortalityIsCausalErrorRate, false);
assert.equal(gottingenCase.rootScopeReview.overlappingStemCellCountsSummedAsUniquePeople, false);

const warsawCase = realCases.find(c => c.candidateId === 3222);
assert.equal(warsawCase.sourceName, "Warsaw");
assert.deepEqual(warsaw, { PCS: 60, GSS: 40, ISR: 60, LON: 60, TEC: 60 });
assert.deepEqual(total(warsaw), { center: null, lower: 36, upper: 71 });
assert.equal(warsawCase.unknownWeight, 35);
assert.equal(
  warsawCase.priorityCompletionReview.sha256,
  digest(warsawCase.priorityCompletionReview.path)
);
assert.deepEqual(total({ ...warsaw, GSS: 60 }), { center: null, lower: 39, upper: 74 });
assert.deepEqual(total({ ...warsaw, LON: 40 }), { center: null, lower: 34, upper: 69 });
for (const id of ["PCS", "GSS", "ISR", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...warsaw };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    warsawCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  warsawCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["RES", "MED", "OPT"]
);
assert(
  warsawCase.coverageReview.length === 31 &&
    warsawCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(warsawCase.rootScopeReview.authorLONUnknownRootAdopted60, true);
assert.equal(warsawCase.rootScopeReview.R02ProvesWarsawProviderContract, false);
assert.equal(warsawCase.rootScopeReview.national1142IsLocalPatientCount, false);
assert.equal(warsawCase.rootScopeReview.prosecutionChargesAreConvictions, false);

const trondheimCase = realCases.find(c => c.candidateId === 452);
assert.equal(trondheimCase.sourceName, "Trondheim");
assert.deepEqual(trondheim, { PCS: 60, ISR: 60, MED: 40 });
assert.deepEqual(total(trondheim), { center: null, lower: 24, upper: 79 });
assert.equal(trondheimCase.unknownWeight, 55);
assert.equal(
  trondheimCase.priorityCompletionReview.sha256,
  digest(trondheimCase.priorityCompletionReview.path)
);
assert.deepEqual(total({ ...trondheim, MED: 60 }), { center: null, lower: 27, upper: 82 });
assert.deepEqual(total({ ...trondheim, ISR: 40 }), { center: null, lower: 21, upper: 76 });
for (const id of ["PCS", "ISR", "MED"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...trondheim };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    trondheimCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  trondheimCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "LON", "TEC", "OPT"]
);
assert(
  trondheimCase.coverageReview.length === 31 &&
    trondheimCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(trondheimCase.rootScopeReview.authorPCSUnknownRootAdopted60, true);
assert.equal(trondheimCase.rootScopeReview.allSixMobilizationsWereNaturalDisasterRescues, false);
assert.equal(trondheimCase.rootScopeReview.allWaitingPeopleHadNoCare, false);
assert.equal(trondheimCase.rootScopeReview.decisions7310AreActiveUsers, false);

const lutonCase = realCases.find(c => c.candidateId === 5356);
assert.equal(lutonCase.sourceName, "Luton");
assert.deepEqual(luton, { ISR: 60, MED: 40, TEC: 60 });
assert.deepEqual(total(luton), { center: null, lower: 21, upper: 81 });
assert.equal(lutonCase.unknownWeight, 60);
assert.equal(
  lutonCase.priorityCompletionReview.sha256,
  digest(lutonCase.priorityCompletionReview.path)
);
assert.deepEqual(total({ ...luton, MED: 60 }), { center: null, lower: 24, upper: 84 });
assert.deepEqual(total({ ...luton, ISR: 40 }), { center: null, lower: 18, upper: 78 });
for (const id of ["ISR", "MED", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...luton };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    lutonCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  lutonCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "RES", "LON", "OPT"]
);
assert(
  lutonCase.coverageReview.length === 31 &&
    lutonCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.deepEqual(
  lutonCase.dimensions.find((d: { id: string }) => d.id === "TEC").conditionalAlternatives,
  [60]
);
assert.equal(lutonCase.rootScopeReview.BedfordTelephoneTriageTransferredToLuton, false);
assert.equal(lutonCase.rootScopeReview.futureBadgerNetAlreadyDelivered, false);
assert.equal(lutonCase.rootScopeReview.fictionalSupportCaseIsRealAward, false);

const leonCase = realCases.find(c => c.candidateId === 2571);
assert.equal(leonCase.sourceName, "León");
assert.deepEqual(leon, { ISR: 60, MED: 40, LON: 60, TEC: 60 });
assert.deepEqual(total(leon), { center: null, lower: 27, upper: 77 });
assert.equal(leonCase.unknownWeight, 50);
assert.equal(
  leonCase.priorityCompletionReview.sha256,
  digest(leonCase.priorityCompletionReview.path)
);
assert.deepEqual(total({ ...leon, MED: 60 }), { center: null, lower: 30, upper: 80 });
for (const id of ["ISR", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...leon };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    leonCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  leonCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "RES", "OPT"]
);
assert(
  leonCase.coverageReview.length === 31 &&
    leonCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(leonCase.rootScopeReview.maintenanceAlwaysClinicallyNecessary, false);
assert.equal(leonCase.rootScopeReview.priority3DelayAloneTriggersMED40, false);
assert.equal(leonCase.rootScopeReview.approvalMeansBankPaymentOrMealsDelivered, false);
assert.equal(leonCase.rootScopeReview.futureCARTHematologyDayHospitalAlreadyDelivered, false);

const gronowoGorneCase = realCases.find(c => c.candidateId === 2531);
assert.equal(gronowoGorneCase.sourceName, "Gronowo Górne");
assert.deepEqual(gronowoGorne, { MED: 60, TEC: 60 });
assert.deepEqual(total(gronowoGorne), { center: null, lower: 15, upper: 90 });
assert.equal(gronowoGorneCase.unknownWeight, 75);
assert.equal(
  gronowoGorneCase.priorityCompletionReview.sha256,
  digest(gronowoGorneCase.priorityCompletionReview.path)
);
for (const id of ["MED", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...gronowoGorne };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    gronowoGorneCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  gronowoGorneCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "ISR", "RES", "LON", "OPT"]
);
assert(
  gronowoGorneCase.coverageReview.length === 31 &&
    gronowoGorneCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(gronowoGorneCase.rootScopeReview.hospitalAnnualVolumeIsFuaUniqueCoverage, false);
assert.equal(gronowoGorneCase.rootScopeReview.providerRAndDClaimIsNamedClientOutcome, false);

const saskatoonCase = realCases.find(c => c.candidateId === 1751);
assert.equal(saskatoonCase.sourceName, "Saskatoon");
assert.deepEqual(saskatoon, { PCS: 60, ISR: 60, MED: 40, LON: 40, TEC: 60 });
assert.deepEqual(total(saskatoon), { center: null, lower: 34, upper: 69 });
assert.equal(saskatoonCase.unknownWeight, 35);
assert.equal(
  saskatoonCase.priorityCompletionReview.sha256,
  digest(saskatoonCase.priorityCompletionReview.path)
);
assert.deepEqual(total({ ...saskatoon, LON: 60 }), { center: null, lower: 36, upper: 71 });
assert.deepEqual(total({ ...saskatoon, MED: 60 }), { center: null, lower: 37, upper: 72 });
for (const id of ["PCS", "ISR", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...saskatoon };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    saskatoonCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  saskatoonCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "OPT"]
);
assert(
  saskatoonCase.coverageReview.length === 31 &&
    saskatoonCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(saskatoonCase.rootScopeReview.offeredSurgeryIsCompletedProcedureRate, false);
assert.equal(saskatoonCase.rootScopeReview.criteriaComplianceIsSurvivalRate, false);
assert.equal(saskatoonCase.rootScopeReview.assessmentAndWaitYearsAdded, false);
assert.equal(saskatoonCase.rootScopeReview.future2027DrugRenewalUsedAs2026Rule, false);
assert.equal(saskatoonCase.rootScopeReview.netDrugCostUnknownPenalizedAs40, false);
assert.deepEqual(
  saskatoonCase.dimensions.find((d: { id: string }) => d.id === "PCS").conditionalAlternatives,
  [60]
);

const rugbyCase = realCases.find(c => c.candidateId === 4817);
assert.equal(rugbyCase.sourceName, "Rugby");
assert.deepEqual(rugby, { ISR: 60, MED: 40, LON: 60, TEC: 60 });
assert.deepEqual(total(rugby), { center: null, lower: 27, upper: 77 });
assert.equal(rugbyCase.unknownWeight, 50);
assert.equal(
  rugbyCase.priorityCompletionReview.sha256,
  digest(rugbyCase.priorityCompletionReview.path)
);
assert.deepEqual(total({ ...rugby, MED: 60 }), { center: null, lower: 30, upper: 80 });
assert.deepEqual(total({ ...rugby, ISR: 40 }), { center: null, lower: 24, upper: 74 });
for (const id of ["ISR", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...rugby };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    rugbyCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  rugbyCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "RES", "OPT"]
);
assert(
  rugbyCase.coverageReview.length === 31 &&
    rugbyCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(rugbyCase.rootScopeReview.all212PatientsReadyForDischarge, false);
assert.equal(rugbyCase.rootScopeReview.allTrustPatientsAreRugbyResidents, false);
assert.equal(rugbyCase.rootScopeReview.unreadImmuneMedicationProtocolClaimed, false);
assert.equal(rugbyCase.rootScopeReview.NancyFactoryCapacityTransferredToRugby, false);

const dubaiReferenceCase = realCases.find(c => c.candidateId === 357);
assert.equal(dubaiReferenceCase.sourceName, "Dubai");
assert.deepEqual(dubaiReference, { ISR: 60, MED: 60, TEC: 60 });
assert.deepEqual(total(dubaiReference), { center: null, lower: 24, upper: 84 });
assert.equal(
  dubaiReferenceCase.priorityCompletionReview.sha256,
  digest(dubaiReferenceCase.priorityCompletionReview.path)
);
assert.equal(
  dubaiReferenceCase.priorityCompletionReview.researchReportSha256,
  digest(dubaiReferenceCase.priorityCompletionReview.researchReport)
);
for (const id of ["ISR", "MED", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...dubaiReference };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    dubaiReferenceCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  dubaiReferenceCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "RES", "LON", "OPT"]
);
assert(
  dubaiReferenceCase.coverageReview.length === 31 &&
    dubaiReferenceCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(dubaiReferenceCase.rootScopeReview.localKidneyOrganReplacementActuallyDelivered, true);
assert.equal(dubaiReferenceCase.rootScopeReview.kidney28LongTermCureOrSurvivalDefined, false);
assert.equal(dubaiReferenceCase.rootScopeReview.allFuaCitizensEnayaEligible, false);
assert.equal(
  dubaiReferenceCase.rootScopeReview.maternityNoWaitingImpliesTransplantNoWaiting,
  false
);
assert.equal(dubaiReferenceCase.rootScopeReview.airportPostcutoffEmptyWidgetProvesClosure, false);

const hsinchuReferenceCase = realCases.find(c => c.candidateId === 491);
assert.equal(hsinchuReferenceCase.sourceName, "Hsinchu");
assert.deepEqual(hsinchuReference, { ISR: 60, MED: 60, TEC: 60 });
assert.deepEqual(total(hsinchuReference), { center: null, lower: 24, upper: 84 });
assert.equal(
  hsinchuReferenceCase.priorityCompletionReview.sha256,
  digest(hsinchuReferenceCase.priorityCompletionReview.path)
);
assert.equal(
  hsinchuReferenceCase.priorityCompletionReview.researchReportSha256,
  digest(hsinchuReferenceCase.priorityCompletionReview.researchReport)
);
for (const id of ["ISR", "MED", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...hsinchuReference };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    hsinchuReferenceCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  hsinchuReferenceCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "RES", "LON", "OPT"]
);
assert(
  hsinchuReferenceCase.coverageReview.length === 31 &&
    hsinchuReferenceCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(hsinchuReferenceCase.rootScopeReview.NHIOriginalBodyReobtained, false);
assert.equal(hsinchuReferenceCase.rootScopeReview.S16AllWardsOrUniversalCoverage, false);
assert.equal(
  hsinchuReferenceCase.rootScopeReview.floodDelistingMeans38PhysicalWorksCompleted,
  false
);

const shenzhenReferenceCase = realCases.find(c => c.candidateId === 9725);
assert.equal(shenzhenReferenceCase.sourceName, "Guangzhou");
assert.deepEqual(shenzhenReference, { ISR: 60, RES: 60, MED: 60, LON: 60, TEC: 60 });
assert.deepEqual(total(shenzhenReference), { center: null, lower: 36, upper: 76 });
assert.equal(
  shenzhenReferenceCase.priorityCompletionReview.sha256,
  digest(shenzhenReferenceCase.priorityCompletionReview.path)
);
assert.equal(
  shenzhenReferenceCase.priorityCompletionReview.researchReportSha256,
  digest(shenzhenReferenceCase.priorityCompletionReview.researchReport)
);
for (const id of ["ISR", "RES", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...shenzhenReference };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    shenzhenReferenceCase.sensitivity.withdrawals[id]
  );
}
assert.deepEqual(
  shenzhenReferenceCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "GSS", "OPT"]
);
assert(
  shenzhenReferenceCase.coverageReview.length === 31 &&
    shenzhenReferenceCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);
assert.equal(shenzhenReferenceCase.rootScopeReview.S13DepositIsHSCTFinalNetBill, false);
assert.equal(shenzhenReferenceCase.rootScopeReview.foreignSurvivalOrPayerTransferred, false);

const lubeckCase = realCases.find(c => c.candidateId === 4221);
assert.equal(
  lubeckCase.priorityCompletionReview.sha256,
  digest(lubeckCase.priorityCompletionReview.path)
);
assert.equal(
  lubeckCase.priorityCompletionReview.researchReportSha256,
  digest(lubeckCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(lubeck, { PCS: 40, ISR: 60, MED: 60, TEC: 60 });
assert.deepEqual(total(lubeck), { center: null, lower: 30, upper: 75 });
assert.deepEqual(total({ ...lubeck, PCS: 60 }), { center: null, lower: 33, upper: 78 });
assert.deepEqual(total({ ...lubeck, MED: 40 }), { center: null, lower: 27, upper: 72 });
for (const id of ["PCS", "ISR", "MED", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...lubeck };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    lubeckCase.sensitivity.withdrawals[id]
  );
}
assert(
  lubeckCase.coverageReview.length === 31 &&
    lubeckCase.coverageReview.every(
      (r: { score: null; fullyMeasured: boolean }) => r.score === null && !r.fullyMeasured
    )
);

const corkCase = realCases.find(c => c.candidateId === 259);
assert.equal(
  corkCase.priorityCompletionReview.sha256,
  digest(corkCase.priorityCompletionReview.path)
);
assert.equal(
  corkCase.priorityCompletionReview.researchReportSha256,
  digest(corkCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(cork, { ISR: 60, MED: 40, LON: 40, TEC: 60 });
assert.deepEqual(total(cork), { center: null, lower: 25, upper: 75 });
assert.deepEqual(total({ ...cork, MED: 60 }), { center: null, lower: 28, upper: 78 });
assert.deepEqual(total({ ...cork, LON: 60 }), { center: null, lower: 27, upper: 77 });
for (const id of ["ISR", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...cork };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    corkCase.sensitivity.withdrawals[id]
  );
}
assert(
  corkCase.coverageReview.length === 31 &&
    corkCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);
assert(
  corkCase.rootScopeReview.rteHttpModifiedAfterCutoff &&
    corkCase.rootScopeReview.rteArticleMetadataBeforeCutoff
);
assert(!corkCase.rootScopeReview.interviewFamiliesReceivedBMLTApartmentsVerified);
assert(!corkCase.rootScopeReview.currentOrdinaryWardVasoactivePracticeVerified);

const kielCase = realCases.find(c => c.candidateId === 3942);
assert.equal(
  kielCase.priorityCompletionReview.sha256,
  digest(kielCase.priorityCompletionReview.path)
);
assert.equal(
  kielCase.priorityCompletionReview.researchReportSha256,
  digest(kielCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(kiel, { ISR: 60, MED: 60, TEC: 60, OPT: 60 });
assert.deepEqual(total(kiel), { center: null, lower: 30, upper: 80 });
assert.deepEqual(total({ ...kiel, MED: 40 }), { center: null, lower: 27, upper: 77 });
for (const id of ["ISR", "MED", "TEC", "OPT"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...kiel };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    kielCase.sensitivity.withdrawals[id]
  );
}
assert(
  kielCase.coverageReview.length === 31 &&
    kielCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const gorzowCase = realCases.find(c => c.candidateId === 461);
assert.equal(
  gorzowCase.priorityCompletionReview.sha256,
  digest(gorzowCase.priorityCompletionReview.path)
);
assert.equal(
  gorzowCase.priorityCompletionReview.researchReportSha256,
  digest(gorzowCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(gorzow, { PCS: 60, ISR: 60, MED: 40, LON: 60 });
assert.deepEqual(total(gorzow), { center: null, lower: 30, upper: 75 });
assert.deepEqual(total({ ...gorzow, MED: 60 }), { center: null, lower: 33, upper: 78 });
assert.deepEqual(total({ ...gorzow, ISR: 40 }), { center: null, lower: 27, upper: 72 });
assert.deepEqual(total({ ...gorzow, TEC: 60 }), { center: null, lower: 36, upper: 71 });
for (const id of ["PCS", "ISR", "MED", "LON"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...gorzow };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    gorzowCase.sensitivity.withdrawals[id]
  );
}
for (const flag of [
  "drillIsRealFloodOutcome",
  "allSheltersCertifiedUsable",
  "waitlistIsAllResidents",
  "waitCodeUrgencyCertified",
  "DpsResidentDeathsAreWaitingDeaths",
  "cardiacContractProvesHSCTPayment",
  "allTransplantFollowupAndFamilyCostsPaid",
  "LeuvenOutcomesAndPayerTransferredLocally",
  "allogeneicPermissionIsActualInfusion",
  "allFoodNeedsMetByGenericSocialBenefits",
  "waterProfitIsWaterReliability",
  "compostIntakeIsFinishedProductOutput",
  "futureProductionLineCertifiedComplete",
  "allWorkshopFirmsAdoptedAI",
  "seniorCardIsAllAgeResidentAdoption",
  "S15IsOriginal2025PdfBytes",
  "sourceFailurePenalizesCity",
])
  assert.equal(gorzowCase.rootScopeReview[flag], false);
assert(
  gorzowCase.coverageReview.length === 31 &&
    gorzowCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);
assert(
  gorzowCase.webReadSources.every(
    (s: { sha256: null; isWebsiteRaw: boolean }) => s.sha256 === null && !s.isWebsiteRaw
  )
);

const lodzCase = realCases.find(c => c.candidateId === 2787);
assert.equal(
  lodzCase.priorityCompletionReview.sha256,
  digest(lodzCase.priorityCompletionReview.path)
);
assert.equal(
  lodzCase.priorityCompletionReview.researchReportSha256,
  digest(lodzCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(lodz, { GSS: 60, ISR: 60, RES: 60, LON: 60, TEC: 60 });
assert.deepEqual(total(lodz), { center: null, lower: 36, upper: 76 });
assert.deepEqual(total({ ...lodz, GSS: 40 }), { center: null, lower: 33, upper: 73 });
assert.deepEqual(total({ ...lodz, RES: 40 }), { center: null, lower: 34, upper: 74 });
assert.deepEqual(total({ ...lodz, MED: 60 }), { center: null, lower: 45, upper: 70 });
for (const id of ["GSS", "ISR", "RES", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...lodz };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    lodzCase.sensitivity.withdrawals[id]
  );
}
for (const flag of [
  "allFraudVictimsAreLocal",
  "arrestEqualsConviction",
  "postArrestRecurrenceEstablished",
  "magnesiumMinimumRequiresUtilitySupplementation",
  "TomaszowWaterTableIsLodzTable",
  "allFoodRecipientsAreMedianLocalResidents",
  "annualFoodMaximumAllDelivered",
  "allHeatCustomersEqualFuaPopulation",
  "futureBiogasPlantAlreadyOperating",
  "PlockFactoryIsInLodz",
  "hospitalToolEntryIsWebsiteRaw",
  "undatedTransplantCountIs2026Register",
  "LeuvenSurvivalAndPayerTransferredToLodz",
  "autoimmuneCARTTrialIsMatureRoutineDelivery",
  "sourceFailurePenalizesCity",
])
  assert.equal(lodzCase.rootScopeReview[flag], false);
assert(
  lodzCase.coverageReview.length === 31 &&
    lodzCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);
assert(
  lodzCase.webReadSources.every(
    (s: { sha256: null; isWebsiteRaw: boolean }) => s.sha256 === null && !s.isWebsiteRaw
  )
);

const maldonadoCase = realCases.find(c => c.candidateId === 1145);
assert.equal(
  maldonadoCase.priorityCompletionReview.sha256,
  digest(maldonadoCase.priorityCompletionReview.path)
);
assert.equal(
  maldonadoCase.priorityCompletionReview.researchReportSha256,
  digest(maldonadoCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(maldonado, { ISR: 60, MED: 60, LON: 60, TEC: 60 });
assert.deepEqual(total(maldonado), { center: null, lower: 30, upper: 80 });
assert.deepEqual(total({ ...maldonado, LON: 40 }), { center: null, lower: 28, upper: 78 });
assert.deepEqual(total({ ...maldonado, RES: 60 }), { center: null, lower: 36, upper: 76 });
assert.deepEqual(total({ ...maldonado, PCS: 60 }), { center: null, lower: 39, upper: 74 });
for (const id of ["ISR", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...maldonado };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    maldonadoCase.sensitivity.withdrawals[id]
  );
}
for (const flag of [
  "departmentEqualsFua",
  "allNationalEnergyBeneficiariesAreLocal",
  "allAffiliationIsFree",
  "approvalEqualsRealizedTransplant",
  "historicNationalSurvivalIsCurrentLocalRate",
  "allTransplantTravelAndFamilyCostsPaid",
  "genericDrugFollowupIsHSCTProtocol",
  "currentLinkedNormCertifiedLatest2026",
  "campusPointProvesProjectFootprint",
  "additionalTreatmentCapacityAllUsed",
  "sourceFailurePenalizesCity",
])
  assert.equal(maldonadoCase.rootScopeReview[flag], false);
assert(
  maldonadoCase.coverageReview.length === 31 &&
    maldonadoCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const flensburgCase = realCases.find(c => c.candidateId === 3395);
assert.equal(
  flensburgCase.priorityCompletionReview.sha256,
  digest(flensburgCase.priorityCompletionReview.path)
);
assert.equal(
  flensburgCase.priorityCompletionReview.researchReportSha256,
  digest(flensburgCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(flensburg, { PCS: 60, ISR: 60, MED: 60, LON: 60, TEC: 60 });
assert.deepEqual(total(flensburg), { center: null, lower: 39, upper: 74 });
assert.deepEqual(total({ ...flensburg, MED: 40 }), { center: null, lower: 36, upper: 71 });
assert.deepEqual(total({ ...flensburg, LON: 40 }), { center: null, lower: 37, upper: 72 });
for (const id of ["PCS", "ISR", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...flensburg };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    flensburgCase.sensitivity.withdrawals[id]
  );
}
for (const flag of [
  "floodWallTestIsRealStormValidation",
  "heatPumpAlreadyOperating",
  "boiler13RepairCertifiedComplete",
  "allUtilityCustomersAreLocalResidents",
  "allStemFollowupPublicAndFree",
  "S10RejectionMechanismAccepted",
  "LeuvenSurvivalRateTransferredToFlensburg",
  "BelgianPayerTransferredToGermany",
  "copayCapCoversAllFamilyAndPrivateCosts",
  "IQMBodyObservationYear2024",
  "R10Decoded",
  "BICompletedTestProvesPermanent2026Use",
  "allHistoricResearchCurrentCommercialOutput",
])
  assert.equal(flensburgCase.rootScopeReview[flag], false);
assert(
  flensburgCase.coverageReview.length === 31 &&
    flensburgCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);
assert(
  flensburgCase.webReadSources.every(
    (s: { sha256: null; isWebsiteRaw: boolean }) => s.sha256 === null && !s.isWebsiteRaw
  )
);

const bilbaoCase = realCases.find(c => c.candidateId === 3539);
assert.equal(
  bilbaoCase.priorityCompletionReview.sha256,
  digest(bilbaoCase.priorityCompletionReview.path)
);
assert.equal(
  bilbaoCase.priorityCompletionReview.researchReportSha256,
  digest(bilbaoCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(bilbao, { PCS: 60, ISR: 60, MED: 60, LON: 60, TEC: 60 });
assert.deepEqual(total(bilbao), { center: null, lower: 39, upper: 74 });
assert.deepEqual(total({ ...bilbao, MED: 40 }), { center: null, lower: 36, upper: 71 });
assert.deepEqual(total({ ...bilbao, LON: 40 }), { center: null, lower: 37, upper: 72 });
assert.deepEqual(total({ ...bilbao, MED: 40, LON: 40 }), { center: null, lower: 34, upper: 69 });
for (const id of ["PCS", "ISR", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...bilbao };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    bilbaoCase.sensitivity.withdrawals[id]
  );
}
for (const flag of [
  "prescribed530901HoursAllDelivered",
  "clinicalGuidesProveInfusionCountOrSurvivalRate",
  "socialWorkEntryProvesCarerCostsPaid",
  "publicHealthRightMeansAllCareCostsCovered",
  "CanaryExtraBenefitsTransferredToBasque",
  "EMASIndexProvesClinicalOutcomes",
  "all34WomenRescuedInBilbao",
  "suspectsAreConvicted",
  "tapSamplesProveEveryHouseholdYearSafe",
  "drinkingWaterAndLegionellaSamplesSamePool",
  "ValenciaFloodResponseIsLocalBilbaoOutcome",
  "cityTransportNavigationProvesActualInternationalOperations",
  "allTecnaliaProjectsCountedLocal",
])
  assert.equal(bilbaoCase.rootScopeReview[flag], false);
assert(
  bilbaoCase.coverageReview.length === 31 &&
    bilbaoCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const bydgoszczCase = realCases.find(c => c.candidateId === 1961);
assert.equal(
  bydgoszczCase.priorityCompletionReview.sha256,
  digest(bydgoszczCase.priorityCompletionReview.path)
);
assert.equal(
  bydgoszczCase.priorityCompletionReview.researchReportSha256,
  digest(bydgoszczCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(bydgoszcz, { PCS: 60, ISR: 60, RES: 60, MED: 40, LON: 60, TEC: 60, OPT: 60 });
assert.deepEqual(total(bydgoszcz), { center: null, lower: 48, upper: 63 });
assert.deepEqual(total({ ...bydgoszcz, MED: 60 }), { center: null, lower: 51, upper: 66 });
for (const id of ["PCS", "ISR", "RES", "MED", "LON", "TEC", "OPT"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...bydgoszcz };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    bydgoszczCase.sensitivity.withdrawals[id]
  );
}
for (const flag of [
  "all12095AreClinicalOutcomes",
  "all600TransplantsSuccessful",
  "allAgesClinicallyEligible",
  "WestPomeraniaNetworkProvesLocalPayer",
  "allCareCostsCovered",
  "dischargeSheetProvesCompletedFollowup",
  "all40TramsNewIn2025",
  "airport199312UniqueResidents",
  "suspectsAreConvicted",
  "productionSupplyDifferenceIsLeakage",
  "PM10ConflictResolved",
])
  assert.equal(bydgoszczCase.rootScopeReview[flag], false);
assert(
  bydgoszczCase.coverageReview.length === 31 &&
    bydgoszczCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const alkmaarCase = realCases.find(c => c.candidateId === 1326);
assert.equal(
  alkmaarCase.priorityCompletionReview.sha256,
  digest(alkmaarCase.priorityCompletionReview.path)
);
assert.equal(
  alkmaarCase.priorityCompletionReview.researchReportSha256,
  digest(alkmaarCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(alkmaar, { PCS: 60, GSS: 40, ISR: 40, MED: 60, TEC: 60 });
assert.deepEqual(total(alkmaar), { center: null, lower: 36, upper: 66 });
for (const id of ["PCS", "GSS", "ISR", "MED", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...alkmaar };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    alkmaarCase.sensitivity.withdrawals[id]
  );
}
for (const id of ["GSS", "ISR"] as const)
  assert.deepEqual(total({ ...alkmaar, [id]: 60 }), { center: null, lower: 39, upper: 69 });
assert(
  alkmaarCase.webReadSources.every(
    (s: { sha256: null; isWebsiteRaw: boolean }) => s.sha256 === null && !s.isWebsiteRaw
  )
);
for (const f of [
  "HSMRSignificantlySuperior",
  "Castricum95Certified1326Local",
  "all768HousingDelivered",
  "syngas17914IsGreenGasInjected",
  "suspectsAreConvicted",
  "newAttackSameGangProven",
  "allCareCostsCovered",
])
  assert.equal(alkmaarCase.rootScopeReview[f], false);
assert(
  alkmaarCase.coverageReview.length === 31 &&
    alkmaarCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const miltonKeynesCase = realCases.find(c => c.candidateId === 5087);
assert.equal(
  miltonKeynesCase.priorityCompletionReview.sha256,
  digest(miltonKeynesCase.priorityCompletionReview.path)
);
assert.equal(
  miltonKeynesCase.priorityCompletionReview.researchReportSha256,
  digest(miltonKeynesCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(miltonKeynes, { PCS: 40, ISR: 60, MED: 40, LON: 60, TEC: 60 });
assert.deepEqual(total(miltonKeynes), { center: null, lower: 33, upper: 68 });
for (const id of ["PCS", "ISR", "MED", "LON", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...miltonKeynes };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    miltonKeynesCase.sensitivity.withdrawals[id]
  );
}
for (const id of ["PCS", "MED"] as const)
  assert.deepEqual(total({ ...miltonKeynes, [id]: 60 }), { center: null, lower: 36, upper: 71 });
assert(
  miltonKeynesCase.webReadSources.every(
    (s: { sha256: null; isWebsiteRaw: boolean }) => s.sha256 === null && !s.isWebsiteRaw
  )
);
for (const f of [
  "floodPropertiesArePeople",
  "foreignOutcomeIsLocalOutcome",
  "OxfordBmtIs5087LocalDelivery",
  "futureHubIsDelivered",
  "crimeOutcomesAreConvictions",
])
  assert.equal(miltonKeynesCase.rootScopeReview[f], false);
assert(
  miltonKeynesCase.coverageReview.length === 31 &&
    miltonKeynesCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const blackpoolCase = realCases.find(c => c.candidateId === 2574);
assert.equal(
  blackpoolCase.priorityCompletionReview.sha256,
  digest(blackpoolCase.priorityCompletionReview.path)
);
assert.equal(
  blackpoolCase.priorityCompletionReview.researchReportSha256,
  digest(blackpoolCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(blackpool, { PCS: 60, GSS: 60, ISR: 60, RES: 60, TEC: 60 });
assert.deepEqual(total(blackpool), { center: null, lower: 39, upper: 74 });
assert.deepEqual(total({ ...blackpool, GSS: 40 }), { center: null, lower: 36, upper: 71 });
for (const id of ["PCS", "GSS", "ISR", "RES", "TEC"] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...blackpool };
  delete withdrawn[id];
  assert.deepEqual(
    [total(withdrawn).lower, total(withdrawn).upper],
    blackpoolCase.sensitivity.withdrawals[id]
  );
}
assert.equal(blackpoolCase.sourceSnapshots.length, 9);
assert.equal(blackpoolCase.webReadSources.length, 3);
assert(
  blackpoolCase.webReadSources.every(
    (s: { sha256: null; isWebsiteRaw: boolean }) => s.sha256 === null && !s.isWebsiteRaw
  )
);
for (const flag of [
  "knivesAreBlackpoolAttackers",
  "joint12000PropertiesAreAllLocal",
  "foodItemsAreHouseholds",
  "medianResidentsAutomaticallyAidEligible",
  "initialLostResponsesHaveKnownStatus",
])
  assert.equal(blackpoolCase.rootScopeReview[flag], false);
assert(
  blackpoolCase.coverageReview.length === 31 &&
    blackpoolCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const vilniusCase = realCases.find(c => c.candidateId === 853);
assert.equal(
  vilniusCase.priorityCompletionReview.sha256,
  digest(vilniusCase.priorityCompletionReview.path)
);
assert.equal(
  vilniusCase.priorityCompletionReview.researchReportSha256,
  digest(vilniusCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(vilnius, { PCS: 40, GSS: 40, ISR: 40, LON: 60, TEC: 60, OPT: 40 });
assert.deepEqual(total(vilnius), { center: null, lower: 34, upper: 59 });
for (const [id, lower, upper] of [
  ["PCS", 28, 68],
  ["GSS", 28, 68],
  ["ISR", 28, 68],
  ["OPT", 30, 65],
  ["TEC", 28, 63],
  ["LON", 28, 63],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...vilnius };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
for (const id of ["PCS", "GSS", "ISR"] as const)
  assert.deepEqual(total({ ...vilnius, [id]: 60 }), { center: null, lower: 37, upper: 62 });
assert.deepEqual(total({ ...vilnius, OPT: 60 }), { center: null, lower: 36, upper: 61 });
assert.equal(vilniusCase.sourceSnapshots.length, 9);
assert.equal(vilniusCase.webReadSources.length, 8);
assert(
  vilniusCase.webReadSources.every(
    (s: { sha256: null; isWebsiteRaw: boolean }) => s.sha256 === null && !s.isWebsiteRaw
  )
);
assert.equal(vilniusCase.rootScopeReview.foreignHsctOutcomeIsVilniusOutcome, false);
assert.equal(vilniusCase.rootScopeReview.housingStockFlowSameCohort, false);
assert.equal(vilniusCase.rootScopeReview.foreignStateResponsibilityAdjudicated, false);
assert(
  vilniusCase.coverageReview.length === 31 &&
    vilniusCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const panevezysCase = realCases.find(c => c.candidateId === 580);
assert.equal(
  panevezysCase.priorityCompletionReview.sha256,
  digest(panevezysCase.priorityCompletionReview.path)
);
assert.equal(
  panevezysCase.priorityCompletionReview.researchReportSha256,
  digest(panevezysCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(panevezys, { ISR: 60, MED: 60, TEC: 60 });
assert.deepEqual(total(panevezys), { center: null, lower: 24, upper: 84 });
for (const [id, lower, upper] of [
  ["ISR", 15, 90],
  ["MED", 15, 90],
  ["TEC", 18, 88],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...panevezys };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.equal(panevezysCase.sourceSnapshots.length, 12);
assert(
  panevezysCase.webReadSources.every(
    (s: { sha256: null; isWebsiteRaw: boolean }) => s.sha256 === null && !s.isWebsiteRaw
  )
);
assert.equal(panevezysCase.rootScopeReview.exactLocalHospitalEveryServiceContractVerified, false);
assert.equal(panevezysCase.rootScopeReview.robotPrototypeEqualsCommercialDeployment, false);
assert(
  panevezysCase.coverageReview.length === 31 &&
    panevezysCase.coverageReview.every(
      (c: { score: null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const larbertCase = realCases.find(c => c.candidateId === 1934);
assert.equal(
  larbertCase.priorityCompletionReview.sha256,
  digest(larbertCase.priorityCompletionReview.path)
);
assert.equal(
  larbertCase.priorityCompletionReview.researchReportSha256,
  digest(larbertCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(larbert), { center: null, lower: 36, upper: 71 });
assert.equal(larbertCase.unknownWeight, 35);
assert.deepEqual(total({ ...larbert, GSS: 40 }), { center: null, lower: 33, upper: 68 });
assert.deepEqual(total({ ...larbert, MED: 60 }), { center: null, lower: 39, upper: 74 });
for (const [id, lower, upper] of [
  ["GSS", 27, 77],
  ["ISR", 27, 77],
  ["MED", 30, 80],
  ["LON", 30, 75],
  ["TEC", 30, 75],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...larbert };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(
  larbertCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["PCS", "RES", "OPT"]
);
assert.equal(larbertCase.sourceSnapshots.length, 24);
assert.equal(larbertCase.failedSourceSnapshots.length, 1);
assert.equal(larbertCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(larbertCase.rootScopeReview.rootSelectedPdfTextPageCount, 12);
assert.equal(larbertCase.rootScopeReview.rootPdfPageCount, 7);
assert.equal(larbertCase.rootScopeReview.waitMetricEqualsDeathOrUntreatedRate, false);
assert.equal(larbertCase.rootScopeReview.localAllogeneicTransplantDirectlyVerified, false);
assert.equal(larbertCase.rootScopeReview.factory2026ProductionRestartVerified, false);
assert.equal(larbertCase.rootScopeReview.clinicalTrialOpeningEqualsProvenEfficacy, false);
assert(
  larbertCase.coverageReview.length === 31 &&
    larbertCase.coverageReview.every(
      (c: { score: number | null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);

const bremenCase = realCases.find(c => c.candidateId === 2877);
assert.equal(
  bremenCase.priorityCompletionReview.sha256,
  digest(bremenCase.priorityCompletionReview.path)
);
assert.equal(
  bremenCase.priorityCompletionReview.researchReportSha256,
  digest(bremenCase.priorityCompletionReview.researchReport)
);
assert.deepEqual(total(bremen), { center: null, lower: 39, upper: 74 });
assert.equal(bremenCase.unknownWeight, 35);
for (const [id, lower, upper] of [
  ["PCS", 30, 80],
  ["ISR", 30, 80],
  ["MED", 30, 80],
  ["LON", 33, 78],
  ["TEC", 33, 78],
] as const) {
  const withdrawn: Partial<Record<DimensionId, number>> = { ...bremen };
  delete withdrawn[id];
  assert.deepEqual(total(withdrawn), { center: null, lower, upper });
}
assert.deepEqual(
  bremenCase.dimensions
    .filter((d: { score: number | null }) => d.score === null)
    .map((d: { id: string }) => d.id),
  ["GSS", "RES", "OPT"]
);
assert.equal(bremenCase.sourceSnapshots.length, 23);
assert.equal(bremenCase.failedSourceSnapshots.length, 1);
assert.equal(bremenCase.sourceAndStopLedger.normalHTTPActualLegs, 18);
assert.equal(bremenCase.rootScopeReview.plannedCARTCountedAsOperating, false);
assert.equal(bremenCase.rootScopeReview.statutoryCopayCapCoversAllHouseholdCare, false);
assert(
  bremenCase.coverageReview.length === 31 &&
    bremenCase.coverageReview.every(
      (c: { score: number | null; fullyMeasured: boolean }) => c.score === null && !c.fullyMeasured
    )
);
