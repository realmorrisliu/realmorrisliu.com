"""Combine audited evidence coverage; do not convert partial evidence into scores."""

import csv
import hashlib
import json
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


def matrix(candidates, history, spatial, violence, healthcare, governance):
    expected = {r["efua_id"] for r in candidates}
    if len(expected) != len(candidates):
        raise ValueError("Duplicate universe IDs")
    history, spatial, violence, healthcare, governance = [
        indexed(rows, expected) for rows in (history, spatial, violence, healthcare, governance)]
    rows = []
    for candidate in candidates:
        key = candidate["efua_id"]
        h, s, v, m, g = (table[key] for table in (history, spatial, violence, healthcare, governance))
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
        rows.append({
            "efua_id": key, "source_name": candidate["source_name"], "country_iso": candidate["country_iso"],
            "historical_research_slug": h["research_slug"], "historical_research_scope": h["research_scope"],
            "PCS": "not_assembled", "GSS": "partial_event_history" if events else "no_assigned_events_not_zero_risk",
            "ISR": "country_context_only" if context_count else "country_context_missing",
            "RES": "not_assembled", "MED": med, "LON": "not_assembled",
            "TEC": "not_assembled", "OPT": "not_assembled",
            "ucdb_intersecting_centres": s["intersecting_centres"],
            "ucdb_centre_area_share": s["centre_area_share"],
            "ucdp_assigned_events_2021_2025": events,
            "wgi_country_dimensions_available": context_count,
            "wgi_lookup_economy_code": g["lookup_economy_code"],
            "cci_score_status": "not_computed_under_global_protocol",
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
    rows = matrix(candidates, history, spatial, violence, healthcare, governance)
    output = folder / "cci-global-evidence-matrix.csv"
    with output.open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    summary = {
        "status": "partial_evidence_inventory_not_ranking", "candidateCount": len(rows),
        "dimensionStatusCounts": {d: dict(Counter(r[d] for r in rows)) for d in DIMENSIONS},
        "scoreStatusCounts": dict(Counter(r["cci_score_status"] for r in rows)),
        "notAssembledMeaning": "Existing sources may contain relevant fields, but no qualified whole-candidate measurement has been assembled here.",
        "historicalMeaning": "Historical city research references are not global-protocol scores; union members do not inherit duplicated scores.",
        "subpillarSupport": {"GSS": ["organized_violence: partial historical events only"],
                             "ISR": ["governance: country context only"],
                             "MED": ["access: historical spatial model only"]},
        "sourceJoinKey": "efua_id; source tables and their provenance remain authoritative for values and limitations",
        "inputs": inputs, "scriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "csvSha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    }
    (folder / "cci-global-evidence-matrix.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(summary["dimensionStatusCounts"])


if __name__ == "__main__":
    main()
