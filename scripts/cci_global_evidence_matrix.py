"""Combine audited evidence coverage; do not convert partial evidence into scores."""

import csv
import hashlib
import json
import math
from collections import Counter
from datetime import date
from pathlib import Path

from cci_global_coverage import DIMENSIONS, ROOT
from cci_unmatched_centre_review import verify as verify_unmatched_centres


def indexed(rows, expected):
    result = {}
    for row in rows:
        key = row["efua_id"]
        if key in result:
            raise ValueError("Duplicate candidate row")
        result[key] = row
    if set(result) != expected:
        raise ValueError("Evidence table must retain exactly the full candidate universe")
    return result


def local_cases(cases, expected):
    result = {}
    for case in cases:
        key = str(case['candidateId'])
        if key not in expected or key in result:
            raise ValueError('Unknown or duplicate local case candidate')
        if (case['status'] != 'real_conditional_calibration_case_not_ranking'
                or case['targetYear'] != 2026 or case['evidenceCutoff'] != '2026-10-10'
                or case['residentPerspective'] != 'local_citizen_ordinary_resident_median_income_usual_coverage'
                or case['boundaryVersion'] != 'GHS-FUA R2019A'):
            raise ValueError('Local case protocol mismatch')
        if Counter(d['id'] for d in case['dimensions']) != Counter(DIMENSIONS):
            raise ValueError('Local case needs exactly eight dimensions')
        if not all(d['score'] in (None, 20, 40, 60, 80) and d['rationale'] and d['assumption'] for d in case['dimensions']):
            raise ValueError('Local case needs anchored conditional judgments')
        partial = any(d['score'] is None for d in case['dimensions'])
        center = case['expectedConditionalTotal']
        if (partial and center is not None) or (not partial and
                (type(center) not in (int, float) or not math.isfinite(center) or not 0 <= center <= 100)):
            raise ValueError('Partial case cannot have a total centre; complete case needs one')
        result[key] = case
    return result


def network_coverage(rows, expected):
    if any(row['connection_type'] not in ('fixed', 'mobile') for row in rows):
        raise ValueError('Unknown network connection type')
    modes = {mode: indexed([row for row in rows if row['connection_type'] == mode], expected)
             for mode in ('fixed', 'mobile')}
    result = {}
    for key in expected:
        available = 0
        boundary = 0
        for mode in modes.values():
            row = mode[key]
            centroid, interior, edges = [int(row[field]) for field in ('centroid_tiles', 'interior_tiles', 'boundary_tiles')]
            if min(centroid, interior, edges) < 0 or centroid != interior + edges:
                raise ValueError('Invalid network tile accounting')
            boundary += edges
            has_measurement = False
            for metric in ('avg_d_kbps', 'avg_u_kbps', 'avg_lat_ms'):
                tests = int(row[f'centroid_{metric}_valid_tests'])
                value = row[f'centroid_{metric}_test_weighted_mean']
                if tests < 0 or bool(value) != (tests > 0):
                    raise ValueError('Network missingness and denominator disagree')
                if value and (not math.isfinite(float(value)) or float(value) <= 0):
                    raise ValueError('Invalid network sample mean')
                has_measurement |= bool(value)
            available += has_measurement
        result[key] = {'network_sample_connection_types':available, 'network_boundary_tiles':boundary}
    return result


def legal_mobility_rules(document):
    if (document['status'] != 'conditional_legal_paths_not_opt_scores'
            or document['targetYear'] != 2026 or document['evidenceCutoff'] != '2026-10-10'
            or document['residentPerspective'] != 'local_citizen_ordinary_resident_median_income_usual_coverage'
            or not document['citizenshipAssumption']):
        raise ValueError('Legal mobility protocol mismatch')
    sources = {s['id'] for s in document['sources']}
    if len(sources) != len(document['sources']) or any(
            date.fromisoformat(s['versionDate']) > date.fromisoformat(document['evidenceCutoff'])
            for s in document['sources']):
        raise ValueError('Duplicate source or post-cutoff legal evidence')
    result = {}
    if len({r['id'] for r in document['rules']}) != len(document['rules']):
        raise ValueError('Duplicate legal rule')
    for rule in document['rules']:
        if (rule['status'] != 'conditional_legal_path_under_citizenship_assumption'
                or not rule['conditions'] or not rule['sources'] or not set(rule['sources']) <= sources):
            raise ValueError('Legal rule needs conditions and known sources')
        for country in rule['originCountryIso']:
            if country in result or country == rule['destinationCountryIso']:
                raise ValueError('Duplicate citizenship rule or domestic destination')
            result[country] = rule
    return result


def matrix(candidates, history, spatial, violence, healthcare, governance, seismic, water, network, wup, airports, claims, legal, current_violence, cases=()):
    expected = {r["efua_id"] for r in candidates}
    if len(expected) != len(candidates):
        raise ValueError("Duplicate universe IDs")
    history, spatial, violence, healthcare, governance, seismic, water, wup, airports, claims = [
        indexed(rows, expected) for rows in (history, spatial, violence, healthcare, governance, seismic, water, wup, airports, claims)]
    current_violence = indexed(current_violence, expected)
    network = network_coverage(network, expected)
    cases = local_cases(cases, expected)
    legal = legal_mobility_rules(legal)
    rows = []
    for candidate in candidates:
        key = candidate["efua_id"]
        h, s, v, m, g, q = (table[key] for table in (history, spatial, violence, healthcare, governance, seismic))
        pcs = {
            "partial_seismic_hazard_model": "partial_seismic_hazard_model",
            "no_observed_hazard_population": "seismic_model_missing",
            "zero_selected_population": "population_denominator_zero",
            "population_unavailable": "population_unavailable",
            "geometry_review": "geometry_review",
            "outside_population_raster": "outside_population_raster",
            "partially_outside_population_raster": "partial_spatial_coverage",
        }[q["status"]]
        wup_count = int(wup[key]["intersecting_centres"])
        if wup_count < 0:
            raise ValueError("Negative WUP centre count")
        water_count = int(water[key]["available_indicators"])
        if not 0 <= water_count <= 2:
            raise ValueError("Invalid water context count")
        events = sum(int(v[f"recorded_events_{year}"]) for year in range(2021, 2026))
        if events < 0:
            raise ValueError("Negative recorded event count")
        clear_current = int(current_violence[key]["clear_precise_events"])
        pending_current = int(current_violence[key]["pending_precise_events"])
        if min(clear_current, pending_current) < 0:
            raise ValueError("Negative preliminary event count")
        med = {
            "partial_travel_evidence": "partial_access_model",
            "no_observed_motorized_population": "travel_model_missing",
            "zero_selected_population": "population_denominator_zero",
            "population_unavailable": "population_unavailable",
            "geometry_review": "geometry_review",
            "outside_population_raster": "outside_population_raster",
            "partially_outside_population_raster": "partial_spatial_coverage",
        }[m["status"]]
        context_count = int(g["available_dimensions"])
        if not 0 <= context_count <= 6:
            raise ValueError("Invalid country context count")
        airport_count = int(airports[key]['directory_point_airports'])
        scheduled_count = int(airports[key]['scheduled_nonclosed_directory_points'])
        if not 0 <= scheduled_count <= airport_count:
            raise ValueError('Invalid airport directory accounting')
        airport_status = 'directory_points_only' if airport_count else 'no_in_area_point_not_no_transport'
        if airports[key]['status'] != airport_status:
            raise ValueError('Airport directory status mismatch')
        exact_claims = int(claims[key]['exact_registered_npi_records'])
        uncertain_claims = int(claims[key]['uncertain_address_npi_records'])
        claims_status = 'exact_registered_address_signal' if exact_claims else (
            'no_exact_signal_not_no_adoption' if candidate['country_iso'] == 'USA' else 'outside_payer_frame_not_no_adoption')
        if (exact_claims < 0 or uncertain_claims < 0 or claims[key]['country_iso'] != candidate['country_iso']
                or claims[key]['status'] != claims_status or (exact_claims and candidate['country_iso'] != 'USA')):
            raise ValueError('Invalid claims address coverage or payer frame')
        rule = legal.get(candidate['country_iso'])
        rows.append({
            "efua_id": key, "source_name": candidate["source_name"], "country_iso": candidate["country_iso"],
            "historical_research_slug": h["research_slug"], "historical_research_scope": h["research_scope"],
            "PCS": pcs, "GSS": "partial_event_history" if events else "no_assigned_events_not_zero_risk",
            "ISR": "country_context_only" if context_count else "country_context_missing",
            "RES": "country_urban_water_context_only" if water_count else "water_context_missing",
            "MED": med, "LON": "partial_claims_registered_address_signal" if exact_claims else "not_assembled",
            "TEC": "partial_network_samples" if network[key]["network_sample_connection_types"] else "network_samples_missing",
            "OPT": "airport_directory_points_only" if airport_count else "no_in_area_airport_point_not_no_access",
            "airport_directory_points": airport_count,
            "scheduled_nonclosed_airport_directory_points": scheduled_count,
            "legal_mobility_status": rule['status'] if rule else 'no_reviewed_path_not_no_right',
            "legal_mobility_rule": rule['id'] if rule else '',
            "legal_mobility_destination": rule['destinationCountryIso'] if rule else '',
            'lon_claims_exact_registered_npi_records': exact_claims,
            'lon_claims_uncertain_address_npi_records': uncertain_claims,
            'lon_claims_scope_status': claims_status,
            **network[key],
            "ucdb_intersecting_centres": s["intersecting_centres"],
            "wup_2025_intersecting_centres": wup_count,
            "ucdb_centre_area_share": s["centre_area_share"],
            "ucdp_assigned_events_2021_2025": events,
            "ucdp_2026_clear_precise_events": clear_current,
            "ucdp_2026_pending_precise_events": pending_current,
            "wgi_country_dimensions_available": context_count,
            "wgi_lookup_economy_code": g["lookup_economy_code"],
            "cci_score_status": "not_computed_under_global_protocol",
            "local2026_case_status": 'conditional_calibration_not_ranking' if key in cases else 'unassessed',
            "local2026_case_review": cases[key]['evidenceReview'] if key in cases else '',
            "local2026_screening_status": 'retained_no_supported_exclusion',
            "local2026_retention_reason": 'conditional_scores_not_exclusion_bounds' if key in cases else 'partial_sources_do_not_bound_whole_dimensions',
        })
    return rows


def main():
    folder = ROOT / "docs/data"
    inputs = {}
    outside = verify_unmatched_centres()

    def read(name, manifest_name, field, nested=False):
        metadata_path = folder / manifest_name
        metadata = json.loads(metadata_path.read_text())
        expected = metadata[field][name] if nested else metadata[field]
        raw = (folder / name).read_bytes()
        if hashlib.sha256(raw).hexdigest() != expected:
            raise ValueError(f"Input checksum mismatch: {name}")
        inputs[name] = {"sha256": expected, "provenance": manifest_name,
                        "provenanceSha256": hashlib.sha256(metadata_path.read_bytes()).hexdigest()}
        with (folder / name).open() as stream:
            return list(csv.DictReader(stream))

    candidates = read("cci-global-candidates-r2019a.csv", "cci-global-candidates-r2019a.provenance.json", "csvSha256")
    history = read("cci-global-coverage-2026-10.csv", "cci-global-coverage-2026-10.json", "coverageCsvSha256")
    spatial = read("cci-ucdb-efua-fua-coverage.csv", "cci-ucdb-efua-crosswalk.json", "files", True)
    violence = read("cci-ucdp-2021-2025-efua.csv", "cci-ucdp-2021-2025.json", "files", True)
    healthcare = read("cci-healthcare-efua-population.csv", "cci-healthcare-efua-population.json", "csvSha256")
    governance = read("cci-wgi-efua-context.csv", "cci-wgi-context.json", "outputs", True)
    seismic = read("cci-seismic-efua-population.csv", "cci-seismic-efua-population.json", "csvSha256")
    water = read("cci-water-efua-context.csv", "cci-water-context.json", "outputs", True)
    network = read("cci-ookla-efua-sampled-measurements.csv", "cci-ookla-efua-sampled-measurements.json", "csvSha256")
    wup = read("cci-wup-2025-fua-coverage.csv", "cci-wup-2025-crosswalk.json", "outputs", True)
    population_rows = read('cci-wup-2025-population-coverage.csv', 'cci-wup-2025-population-coverage.json', 'csvSha256')
    population = json.loads((folder / 'cci-wup-2025-population-coverage.json').read_text())
    population_source = json.loads((folder / 'cci-healthcare-population-source.json').read_text())
    wup_source = json.loads((folder / 'cci-wup-2025-crosswalk.json').read_text())
    for field, path in {
        'scriptSha256': 'scripts/cci_wup_population_coverage.py',
        'crosswalkHelperSha256': 'scripts/cci_global_crosswalk.py',
        'wupHelperSha256': 'scripts/cci_wup_crosswalk.py',
        'wupCrosswalkSha256': 'docs/data/cci-wup-2025-crosswalk.json',
        'populationSourceSha256': 'docs/data/cci-healthcare-population-source.json',
    }.items():
        if population[field] != hashlib.sha256((ROOT / path).read_bytes()).hexdigest():
            raise ValueError('Stale population coverage provenance')
    centre_inventory = read('cci-wup-2025-centre-coverage.csv', 'cci-wup-2025-crosswalk.json', 'outputs', True)
    if (population['status'] != 'native_projected_population_coverage_not_candidate_migration_or_scores'
            or population['targetEpoch'] != 2025 or population['frozenFuaCount'] != len(candidates)
            or population['populationSha256'] != population_source['sha256']
            or population['wupArchiveSha256'] != wup_source['archiveSha256']
            or population['fuaSha256'] != json.loads((folder / 'cci-global-candidates-r2019a.provenance.json').read_text())['geoPackageSha256']
            or len(population_rows) != population['centreCount']
            or len({r['wup_2025_id'] for r in population_rows}) != len(population_rows)
            or {r['wup_2025_id'] for r in population_rows} != {r['wup_2025_id'] for r in centre_inventory}):
        raise ValueError('Population coverage scope mismatch')
    for row in population_rows:
        if not row['known_projected_population']:
            continue
        observed, within, uncovered = [float(row[k]) for k in ('known_projected_population', 'known_population_inside_old_frame', 'known_population_outside_old_frame')]
        if (not all(math.isfinite(v) and v >= 0 for v in (observed, within, uncovered))
                or not math.isclose(observed, within + uncovered, rel_tol=1e-12, abs_tol=1e-6)
                or (observed > 0 and not math.isclose(float(row['old_frame_share_among_known_population']), within / observed))):
            raise ValueError('Population coverage partition mismatch')
    population_counts = {
        'statusCounts': dict(Counter(r['status'] for r in population_rows)),
        'centresWithKnownPopulation': sum(bool(r['known_projected_population']) and float(r['known_projected_population']) > 0 for r in population_rows),
        'centresWithKnownOutsidePopulation': sum(bool(r['known_population_outside_old_frame']) and float(r['known_population_outside_old_frame']) > 0 for r in population_rows),
        'centresWithUnknownPopulationCells': sum(bool(r['unknown_population_cells']) and int(r['unknown_population_cells']) > 0 for r in population_rows),
        'centresWithoutOldFuaOverlap': sum(int(r['intersecting_efuas']) == 0 for r in population_rows),
        'centresWithPartialKnownPopulationCoverage': sum(bool(r['old_frame_share_among_known_population']) and 0 < float(r['old_frame_share_among_known_population']) < 1 for r in population_rows),
        'centresWithOutsideAreaButNoSampledOutsidePopulation': sum(float(r['old_frame_area_share']) < 1 - 1e-9 and r['known_population_outside_old_frame'] != '' and float(r['known_population_outside_old_frame']) == 0 for r in population_rows),
    }
    if any(population[key] != value for key, value in population_counts.items()):
        raise ValueError('Population coverage counts disagree with every centre row')
    airports = read("cci-ourairports-efua-coverage.csv", "cci-ourairports-fua-audit.json", "outputs", True)
    claims = read("cci-cms-lecanemab-efua-coverage.csv", "cci-cms-lecanemab-fua-audit.json", "outputs", True)
    current_violence = read("cci-ucdp-candidate-2026-efua.csv", "cci-ucdp-candidate-2026.json", "files", True)
    research = read('cci-openalex-efua-record-presence.csv', 'cci-openalex-efua-record-presence.json', 'csvSha256')
    research_source = json.loads((folder / 'cci-openalex-efua-record-presence.json').read_text())
    if (research_source['status'] != 'complete_2025_directory_record_associations_not_output_or_scores'
            or research_source['candidateCount'] != len(candidates)
            or research_source['snapshotDate'] != '2026-09-23' or research_source['publicationYear'] != 2025
            or research_source['evidenceCutoff'] != '2026-10-10'
            or research_source['candidateCsvSha256'] != inputs['cci-global-candidates-r2019a.csv']['sha256']
            or research_source['scriptSha256'] != hashlib.sha256((ROOT / 'scripts/cci_openalex_global_affiliation_audit.py').read_bytes()).hexdigest()
            or research_source['affiliationRuleSha256'] != hashlib.sha256((ROOT / 'scripts/cci_openalex_affiliation_audit.py').read_bytes()).hexdigest()
            or research_source['diagnosticSha256'] != hashlib.sha256((folder / 'cci-openalex-global-affiliation-audit.json').read_bytes()).hexdigest()):
        raise ValueError('Research directory association protocol mismatch')
    current_source = json.loads((folder / "cci-ucdp-candidate-2026.json").read_text())
    if (current_source["status"] != "preliminary_violence_review_not_gss_scores"
            or current_source["candidateCount"] != len(candidates)
            or current_source["publicationBeforeCutoffVerified"] is not False):
        raise ValueError("Preliminary violence protocol mismatch")
    legal_path = folder / 'cci-legal-mobility-rules.json'
    legal = json.loads(legal_path.read_text())
    review = ROOT / 'docs' / legal['evidenceReview']
    if review.parent != ROOT / 'docs' or not review.is_file():
        raise ValueError('Legal review must be an existing document')
    inputs[legal_path.name] = {'sha256': hashlib.sha256(legal_path.read_bytes()).hexdigest(),
                               'provenance': review.name,
                               'provenanceSha256': hashlib.sha256(review.read_bytes()).hexdigest()}
    service_path = folder / 'cci-u4ssc-source-inventory.json'
    service = json.loads(service_path.read_text())
    if (service['candidateCount'] != len(candidates)
            or service['candidateCsvSha256'] != inputs['cci-global-candidates-r2019a.csv']['sha256']
            or service['globalRankingEligible'] or service['indicatorTransfer'] or service['scoreTransfer']
            or service['scriptSha256'] != hashlib.sha256((ROOT / 'scripts/cci_u4ssc_source_inventory.py').read_bytes()).hexdigest()
            or service['csvSha256'] != hashlib.sha256((folder / 'cci-u4ssc-candidate-source-refs.csv').read_bytes()).hexdigest()
            or service['indexSnapshotSha256'] != hashlib.sha256((folder / 'cci-u4ssc-verification-index.json').read_bytes()).hexdigest()):
        raise ValueError('Cross-city service source inventory mismatch')
    inputs[service_path.name] = {'sha256': hashlib.sha256(service_path.read_bytes()).hexdigest(),
                                'provenance': 'cci-global-priority-coverage-review.md',
                                'provenanceSha256': hashlib.sha256((ROOT / 'docs/cci-global-priority-coverage-review.md').read_bytes()).hexdigest()}
    knowledge_path = folder / 'cci-wipo2025-identity-index.json'
    knowledge = json.loads(knowledge_path.read_text())
    if (knowledge['candidateCsvSha256'] != inputs['cci-global-candidates-r2019a.csv']['sha256']
            or knowledge['candidateCount'] != len(candidates)
            or len(knowledge['entries']) != knowledge['labels']
            or knowledge['globalRankingEligible'] or knowledge['metricTransfer']
            or any(entry['metricsTransferred'] for entry in knowledge['entries'])
            or knowledge['review']['sha256'] != hashlib.sha256((ROOT / knowledge['review']['path']).read_bytes()).hexdigest()):
        raise ValueError('Knowledge identity source snapshot mismatch')
    inputs[knowledge_path.name] = {'sha256': hashlib.sha256(knowledge_path.read_bytes()).hexdigest(),
                                  'provenance': Path(knowledge['review']['path']).name,
                                  'provenanceSha256': knowledge['review']['sha256']}
    cases = []
    for city in ('singapore', 'london', 'helsinki', 'zurich', 'gaza', 'tokyo', 'washington', 'new-york', 'paris', 'san-jose', 'los-angeles', 'osaka-kyoto', 'boston', 'seoul', 'lisbon', 'chicago', 'prague', 'beijing', 'shanghai', 'jakarta', 'nanjing', 'guangzhou', 'wuhan', 'xian', 'surabaya', 'hangzhou', 'copenhagen', 'saifai', 'grimsby', 'tampere', 'cima', 'oulu', 'leicester', 'dublin', 'turku', 'edinburgh', 'jyvaskyla', 'coventry', 'loughborough', 'fazeley', 'malmo', 'santa-cruz-de-tenerife', 'sheffield', 'aalborg', 'geneva', 'seattle', 'salt-lake-city', 'sydney', 'melbourne', 'toronto', 'vancouver', 'vienna', 'brisbane', 'groningen', 'taipei', 'frankfurt', 'stockholm', 'hong-kong', 'amsterdam', 'madrid', 'berlin', 'montreal', 'fukuoka', 'milan', 'barcelona', 'basel', 'munich', 'oslo', 'antwerp'):
        path = folder / f'cci-local-2026-{city}-case.json'
        case = json.loads(path.read_text())
        review = ROOT / 'docs' / case['evidenceReview']
        if review.parent != ROOT / 'docs' or not review.is_file():
            raise ValueError('Local case review must be an existing document')
        inputs[path.name] = {'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                             'provenance': review.name,
                             'provenanceSha256': hashlib.sha256(review.read_bytes()).hexdigest()}
        cases.append(case)
    rows = matrix(candidates, history, spatial, violence, healthcare, governance, seismic, water, network, wup, airports, claims, legal, current_violence, cases)
    research = indexed(research, {r['efua_id'] for r in candidates})
    for row in rows:
        signal = research[row['efua_id']]
        total = int(signal['record_presence'])
        expected_status = 'directory_record_association_not_output' if total else 'no_qualifying_association_not_no_research'
        if total < 0 or signal['status'] != expected_status or sum(int(v) for k, v in signal.items() if '__xpac_' in k) != total:
            raise ValueError('Research directory association accounting mismatch')
        row.update(tec_directory_record_associations=total, tec_directory_record_status=signal['status'])
    if (sum(r['tec_directory_record_associations'] for r in rows) != research_source['recordCandidateAssociations']
            or sum(r['tec_directory_record_associations'] > 0 for r in rows) != research_source['candidatesWithAssociation']):
        raise ValueError('Global research directory association totals mismatch')
    output = folder / "cci-global-evidence-matrix.csv"
    with output.open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    summary = {
        "status": "partial_evidence_inventory_not_ranking", "candidateCount": len(rows),
        "outsideFrameReview": {
            "manifest": "cci-unmatched-centre-review.json",
            "manifestSha256": hashlib.sha256((folder / "cci-unmatched-centre-review.json").read_bytes()).hexdigest(),
            **{k: outside[k] for k in ('csvSha256', 'recordCount', 'reviewGroupCount',
                                       'groupsWithIndirectFuaLink', 'globalRankingEligible')},
        },
        "boundaryCoverageCounts": {"withoutUcdbCentreOverlap": sum(int(r["ucdb_intersecting_centres"]) == 0 for r in rows),
                                   "withoutWup2025CentreOverlap": sum(r["wup_2025_intersecting_centres"] == 0 for r in rows)},
        "boundaryMeaning": "Centre intersections describe geometric coverage only. UCDB and WUP are separate sources; their IDs and counts cannot be merged directly. Zero intersections do not exclude a candidate or imply a score.",
        "boundaryPopulationCoverage": {
            "manifest": "cci-wup-2025-population-coverage.json",
            **{key: population[key] for key in ('status', 'targetEpoch', 'centreCount', 'frozenFuaCount', 'centresWithKnownPopulation', 'centresWithKnownOutsidePopulation', 'centresWithoutOldFuaOverlap', 'centresWithPartialKnownPopulationCoverage', 'centresWithOutsideAreaButNoSampledOutsidePopulation', 'centresWithUnknownPopulationCells', 'method', 'limitations')},
        },
        "crossCityServiceSources": {
            "manifest": service_path.name,
            "manifestSha256": hashlib.sha256(service_path.read_bytes()).hexdigest(),
            **{key: service[key] for key in ('candidateCount', 'indexEntries', 'uniqueLinks',
                                            'identityMappedEntries', 'candidatesWithIdentityRefs',
                                            'readReportCount', 'indicatorTransfer', 'scoreTransfer',
                                            'globalRankingEligible')},
        },
        "dimensionStatusCounts": {d: dict(Counter(r[d] for r in rows)) for d in DIMENSIONS},
        "knowledgeIdentitySources": {
            "manifest": knowledge_path.name,
            "manifestSha256": hashlib.sha256(knowledge_path.read_bytes()).hexdigest(),
            **{key: knowledge[key] for key in ('labels', 'exactUniqueIdentityEntries',
                                              'unresolvedEntries', 'metricTransfer', 'globalRankingEligible')},
            "scope": "Frozen name-country source references, not cluster-FUA equivalence or scores",
        },
        "scoreStatusCounts": dict(Counter(r["cci_score_status"] for r in rows)),
        'researchDirectorySignals': {key: research_source[key] for key in ('status', 'snapshotDate', 'publicationYear', 'evidenceCutoff', 'candidateCount', 'candidatesWithAssociation', 'recordCandidateAssociations', 'distinctRecordsWithAssociation', 'limitations')},
        "legalMobility": {
            'targetYear': legal['targetYear'], 'evidenceCutoff': legal['evidenceCutoff'],
            'residentPerspective': legal['residentPerspective'],
            'statusCounts': dict(Counter(r['legal_mobility_status'] for r in rows)),
            'ruleCandidateCounts': dict(Counter(r['legal_mobility_rule'] for r in rows if r['legal_mobility_rule'])),
            'countryCandidateCounts': dict(sorted(Counter(r['country_iso'] for r in rows if r['legal_mobility_rule']).items())),
            'meaning': 'Reviewed destination-specific legal conditions under the local citizenship assumption: EU/EEA/Swiss conditional residence rights, section 41 procedural onshore applications and Chinese and Indonesian citizens qualifying skilled-work national-visa routes are distinct. An application route is not approved residence or work. Unknown is not denial; residence does not establish citizenship. No affordability, job access, crisis operation, whole OPT score or exclusion bound established.',
        },
        "preliminary2026Violence": {
            "manifest": "cci-ucdp-candidate-2026.json",
            "manifestSha256": hashlib.sha256((folder / "cci-ucdp-candidate-2026.json").read_bytes()).hexdigest(),
            **{key: current_source[key] for key in ("window", "candidatesWithClearPreciseEvents",
               "candidatesWithPendingPreciseEvents", "publicationBeforeCutoffVerified", "releaseAssumption")},
            "meaning": "Clear and pending current-window coded points retained separately; preliminary source and temporal-review limits remain. Zero is a table count, not zero violence or low risk. Existing GSS states and judgments unchanged; no score or exclusion uses this intake.",
        },
        "local2026Screening": {
            "targetYear": 2026, "evidenceCutoff": "2026-10-10",
            "residentPerspective": "local_citizen_ordinary_resident_median_income_usual_coverage",
            "conditionalCaseCount": len(cases),
            "completeConditionalCaseCount": sum(c['expectedConditionalTotal'] is not None for c in cases),
            "partialCaseCount": sum(c['expectedConditionalTotal'] is None for c in cases),
            "unassessedCount": sum(r['local2026_case_status'] == 'unassessed' for r in rows),
            "retainedCount": len(rows), "supportedExclusionCount": 0,
            "statusCounts": dict(Counter(r['local2026_screening_status'] for r in rows)),
            "meaning": "Whole-scope exclusion screening of assembled evidence, not full city evaluation. Partial sources and conditional calibration scores establish no whole-dimension exclusion bound or qualified 32nd-place threshold. All candidates remain possible competitors; no exclusions or ranking eligibility granted.",
        },
        "notAssembledMeaning": "Existing sources may contain relevant fields, but no qualified whole-candidate measurement has been assembled here.",
        "historicalMeaning": "Historical city research references are not global-protocol scores; union members do not inherit duplicated scores.",
        "subpillarSupport": {"PCS": ["geophysical: reference-rock seismic hazard only, not building losses"],
                             "RES": ["water: country urban service context only, not city reliability"],
                             "GSS": ["organized_violence: partial historical events plus separate preliminary January-August 2026 coded-point review; source release assumption, temporal conflicts, pending statuses and unassigned records retained, not complete impacts or GSS scores"],
                             "ISR": ["governance: country context only"],
                             "MED": ["access: historical spatial model only"],
                             "LON": ["translation: 2024 published single-drug Medicare FFS claims associated with next-year-end provider registered addresses; exact Census range points are not treatment sites or patient residences; missing, uncertain and outside-payer states retained, no resident access, quality or whole-dimension score"],
                             "TEC": ["digital_infrastructure: self-selected 2026 Q3 network tests only; boundary sensitivity retained, not population access or complete technology capability",
                                     "knowledge_output: 2025 work-ID presence associated with qualifying frozen institution directory FUAs; types, corpus and retraction flags retained separately; not verified research sites, deduplicated intellectual works, contributions, quality or resident diffusion; zero associations do not imply zero research"],
                             "OPT": ["transport_redundancy: directory airport points and scheduled nonclosed flags only; no resident access, routes, independent alternatives or common failures measured",
                                     "legal_mobility: reviewed Germany/France conditions under modelled citizenship only; conditional residence rights differ from section 41 onshore applications and Chinese and Indonesian citizens qualifying skilled-work national-visa routes; conditional paths are not approved residence or work; no actual affordability, employment or crisis operation measured"]},
        "sourceJoinKey": "efua_id; source tables and their provenance remain authoritative for values and limitations",
        "inputs": inputs, "scriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "csvSha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    }
    (folder / "cci-global-evidence-matrix.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(summary["dimensionStatusCounts"])


if __name__ == "__main__":
    main()
