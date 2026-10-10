"""Combine audited evidence coverage; do not convert partial evidence into scores."""

import csv
import hashlib
import json
import math
from collections import Counter
from pathlib import Path

from cci_global_coverage import DIMENSIONS, ROOT


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
        if not all(d['score'] in (20, 40, 60, 80) and d['rationale'] and d['assumption'] for d in case['dimensions']):
            raise ValueError('Local case needs anchored conditional judgments')
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


def matrix(candidates, history, spatial, violence, healthcare, governance, seismic, water, network, wup, airports, cases=()):
    expected = {r["efua_id"] for r in candidates}
    if len(expected) != len(candidates):
        raise ValueError("Duplicate universe IDs")
    history, spatial, violence, healthcare, governance, seismic, water, wup, airports = [
        indexed(rows, expected) for rows in (history, spatial, violence, healthcare, governance, seismic, water, wup, airports)]
    network = network_coverage(network, expected)
    cases = local_cases(cases, expected)
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
        rows.append({
            "efua_id": key, "source_name": candidate["source_name"], "country_iso": candidate["country_iso"],
            "historical_research_slug": h["research_slug"], "historical_research_scope": h["research_scope"],
            "PCS": pcs, "GSS": "partial_event_history" if events else "no_assigned_events_not_zero_risk",
            "ISR": "country_context_only" if context_count else "country_context_missing",
            "RES": "country_urban_water_context_only" if water_count else "water_context_missing",
            "MED": med, "LON": "not_assembled",
            "TEC": "partial_network_samples" if network[key]["network_sample_connection_types"] else "network_samples_missing",
            "OPT": "airport_directory_points_only" if airport_count else "no_in_area_airport_point_not_no_access",
            "airport_directory_points": airport_count,
            "scheduled_nonclosed_airport_directory_points": scheduled_count,
            **network[key],
            "ucdb_intersecting_centres": s["intersecting_centres"],
            "wup_2025_intersecting_centres": wup_count,
            "ucdb_centre_area_share": s["centre_area_share"],
            "ucdp_assigned_events_2021_2025": events,
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
    airports = read("cci-ourairports-efua-coverage.csv", "cci-ourairports-fua-audit.json", "outputs", True)
    cases = []
    for city in ('singapore', 'london'):
        path = folder / f'cci-local-2026-{city}-case.json'
        case = json.loads(path.read_text())
        review = ROOT / 'docs' / case['evidenceReview']
        if review.parent != ROOT / 'docs' or not review.is_file():
            raise ValueError('Local case review must be an existing document')
        inputs[path.name] = {'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                             'provenance': review.name,
                             'provenanceSha256': hashlib.sha256(review.read_bytes()).hexdigest()}
        cases.append(case)
    rows = matrix(candidates, history, spatial, violence, healthcare, governance, seismic, water, network, wup, airports, cases)
    output = folder / "cci-global-evidence-matrix.csv"
    with output.open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    summary = {
        "status": "partial_evidence_inventory_not_ranking", "candidateCount": len(rows),
        "boundaryCoverageCounts": {"withoutUcdbCentreOverlap": sum(int(r["ucdb_intersecting_centres"]) == 0 for r in rows),
                                   "withoutWup2025CentreOverlap": sum(r["wup_2025_intersecting_centres"] == 0 for r in rows)},
        "boundaryMeaning": "Centre intersections describe geometric coverage only. UCDB and WUP are separate sources; their IDs and counts cannot be merged directly. Zero intersections do not exclude a candidate or imply a score.",
        "dimensionStatusCounts": {d: dict(Counter(r[d] for r in rows)) for d in DIMENSIONS},
        "scoreStatusCounts": dict(Counter(r["cci_score_status"] for r in rows)),
        "local2026Screening": {
            "targetYear": 2026, "evidenceCutoff": "2026-10-10",
            "residentPerspective": "local_citizen_ordinary_resident_median_income_usual_coverage",
            "conditionalCaseCount": len(cases),
            "unassessedCount": sum(r['local2026_case_status'] == 'unassessed' for r in rows),
            "retainedCount": len(rows), "supportedExclusionCount": 0,
            "statusCounts": dict(Counter(r['local2026_screening_status'] for r in rows)),
            "meaning": "Whole-scope exclusion screening of assembled evidence, not full city evaluation. Partial sources and conditional calibration scores establish no whole-dimension exclusion bound or qualified 32nd-place threshold. All candidates remain possible competitors; no exclusions or ranking eligibility granted.",
        },
        "notAssembledMeaning": "Existing sources may contain relevant fields, but no qualified whole-candidate measurement has been assembled here.",
        "historicalMeaning": "Historical city research references are not global-protocol scores; union members do not inherit duplicated scores.",
        "subpillarSupport": {"PCS": ["geophysical: reference-rock seismic hazard only, not building losses"],
                             "RES": ["water: country urban service context only, not city reliability"],
                             "GSS": ["organized_violence: partial historical events only"],
                             "ISR": ["governance: country context only"],
                             "MED": ["access: historical spatial model only"],
                             "TEC": ["digital_infrastructure: self-selected 2026 Q3 network tests only; boundary sensitivity retained, not population access or complete technology capability"],
                             "OPT": ["transport_redundancy: directory airport points and scheduled nonclosed flags only; no resident access, routes, independent alternatives or common failures measured"]},
        "sourceJoinKey": "efua_id; source tables and their provenance remain authoritative for values and limitations",
        "inputs": inputs, "scriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "csvSha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    }
    (folder / "cci-global-evidence-matrix.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(summary["dimensionStatusCounts"])


if __name__ == "__main__":
    main()
