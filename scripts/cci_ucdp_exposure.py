"""Aggregate precisely located GED records, not city safety scores or forecasts."""

import argparse
import csv
import io
import json
import math
import zipfile
from collections import Counter
from datetime import date
from pathlib import Path

import pyproj
import shapely
from shapely import Point, STRtree

from cci_global_crosswalk import FUA_TABLE, ROOT, digest, load, write_csv

SOURCE_SHA = "8c941d84954e555ee2e54f40fa04d9203bf1e2f962203d0a9930966c4947c667"
YEARS = range(2021, 2026)


def fatalities(row):
    low, best, high = (int(row[key]) for key in ("low", "best", "high"))
    return (low, best, high) if 0 <= low <= best <= high and high >= 1 else None


def locate(row, tree, transform):
    start, end = date.fromisoformat(row["date_start"][:10]), date.fromisoformat(row["date_end"][:10])
    if start > end:
        raise ValueError("Reversed event dates")
    if start < date(2021, 1, 1) or end > date(2025, 12, 31):
        return "crosses_window", []
    precision = int(row["where_prec"])
    if precision not in range(1, 8):
        raise ValueError("Unknown location precision")
    if precision != 1:
        return "coarse_location", []
    lon, lat = float(row["longitude"]), float(row["latitude"])
    if not math.isfinite(lon) or not math.isfinite(lat) or not -180 <= lon <= 180 or not -90 <= lat <= 90:
        raise ValueError("Invalid coordinates")
    x, y = transform(lon, lat)
    if not math.isfinite(x) or not math.isfinite(y):
        raise ValueError("Projection failed")
    matches = sorted(tree.query(Point(x, y), predicate="covered_by").tolist())
    return ("assigned" if len(matches) == 1 else "ambiguous_boundary" if matches else "outside_frame"), matches


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ged", type=Path, required=True)
    parser.add_argument("--fua", type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    manifest = json.loads((folder / "cci-global-candidates-r2019a.provenance.json").read_text())
    if digest(args.ged) != SOURCE_SHA:
        raise ValueError("Unexpected GED source checksum")
    fuas, repairs = load(args.fua, FUA_TABLE, "eFUA_ID", "eFUA_name", manifest["geoPackageSha256"])
    tree = STRtree([item[2] for item in fuas])
    project = pyproj.Transformer.from_crs("EPSG:4326", "ESRI:54009", always_xy=True)
    results = []
    for key, name, _ in fuas:
        results.append({
            "efua_id": key, "source_name": name,
            **{f"recorded_events_{year}": 0 for year in YEARS},
            "state_based_events": 0, "non_state_events": 0, "one_sided_events": 0,
            "recorded_deaths_low": 0, "recorded_deaths_best": 0, "recorded_deaths_high": 0,
        })
    dispositions, precision_counts, source_years = Counter(), Counter(), Counter()
    ids, assignments, unresolved = set(), [], []
    with zipfile.ZipFile(args.ged) as archive:
        reader = csv.DictReader(io.TextIOWrapper(archive.open("GEDEvent_v26_1.csv"), encoding="utf-8-sig"))
        required = {"id", "year", "where_prec", "latitude", "longitude", "date_start", "date_end", "low", "best", "high", "type_of_violence"}
        if not required.issubset(reader.fieldnames or []):
            raise ValueError("Incomplete GED schema")
        for row in reader:
            event_id, year = int(row["id"]), int(row["year"])
            if event_id in ids:
                raise ValueError("Duplicate event ID")
            ids.add(event_id)
            source_years[year] += 1
            if year not in YEARS:
                continue
            precision_counts[row["where_prec"]] += 1
            outcome, matches = locate(row, tree, project.transform)
            estimates = fatalities(row) if outcome == "assigned" else None
            if outcome == "assigned" and estimates is None:
                outcome = "inconsistent_fatality_estimates"
            dispositions[outcome] += 1
            if outcome != "assigned":
                unresolved.append({"event_id": event_id, "year": year, "reason": outcome})
                continue
            low, best, high = estimates
            kind = int(row["type_of_violence"])
            if kind not in (1, 2, 3):
                raise ValueError("Unexpected violence type")
            result = results[matches[0]]
            result[f"recorded_events_{year}"] += 1
            result[("state_based_events", "non_state_events", "one_sided_events")[kind - 1]] += 1
            for key, value in zip(("low", "best", "high"), (low, best, high)):
                result[f"recorded_deaths_{key}"] += value
            assignments.append({"event_id": event_id, "year": year, "efua_id": result["efua_id"]})
    if len(ids) != 417968 or len(results) != manifest["rowCount"]:
        raise ValueError("Unexpected source/candidate count")
    files = {
        "cci-ucdp-2021-2025-efua.csv": results,
        "cci-ucdp-2021-2025-assignments.csv": sorted(assignments, key=lambda row: row["event_id"]),
        "cci-ucdp-2021-2025-unassigned.csv": sorted(unresolved, key=lambda row: row["event_id"]),
    }
    for filename, rows in files.items():
        write_csv(folder / filename, rows)
    summary = {
        "status": "recorded_organized_violence_not_cci_score",
        "version": "UCDP GED 26.1", "retrievedAt": "2026-10-10",
        "sourceUrl": "https://ucdp.uu.se/downloads/ged/ged261-csv.zip",
        "codebookUrl": "https://ucdp.uu.se/downloads/ged/ged261.pdf",
        "license": "CC BY 4.0; citation required",
        "citation": "Sundberg and Melander (2013), Introducing the UCDP Georeferenced Event Dataset; Högbladh (2026), UCDP GED Codebook version 26.1; Davies, Pettersson and Öberg (2026), Organized violence 1989–2025, and violent political protests.",
        "sourceSha256": SOURCE_SHA, "efuaSourceSha256": manifest["geoPackageSha256"],
        "scriptSha256": digest(Path(__file__)), "geometryHelperSha256": digest(ROOT / "scripts/cci_global_crosswalk.py"),
        "sourceRecordCount": len(ids), "sourceYears": dict(sorted(source_years.items())),
        "window": "2021-01-01/2025-12-31", "windowRecordCount": sum(dispositions.values()),
        "locationPrecisionCounts": dict(sorted(precision_counts.items())),
        "dispositions": dict(dispositions), "candidateCount": len(results),
        "candidatesWithAssignedRecords": len({row["efua_id"] for row in assignments}),
        "repairedEfuaCount": len(repairs), "shapelyVersion": shapely.__version__,
        "pyprojVersion": pyproj.__version__, "projVersion": pyproj.proj_version_str,
        "projection": project.definition,
        "files": {name: digest(folder / name) for name in files},
        "method": "All frozen eFUAs; all GED records with year 2021–2025 checked. Only where_prec=1 and dates wholly within the window assigned by uniquely covered projected point. Coarse locations, ambiguous boundaries and outside-frame events retained separately, never guessed. Otherwise assignable events with inconsistent fatality bounds are quarantined, not corrected. Types and low/best/high source fatality estimates remain separate.",
        "limitations": "Recorded zero is not zero violence or safety. Location precision 1 may be a settlement centroid, not exact GPS. Reporting, inclusion thresholds and location uncertainty remain. Unassigned events may affect candidates; this is not complete local exposure, regional spillover, future risk, crime, a population rate, or a CCI score. The annual source ends in 2025, not current 2026 coverage.",
    }
    (folder / "cci-ucdp-2021-2025.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({key: summary[key] for key in ("windowRecordCount", "dispositions", "candidateCount", "candidatesWithAssignedRecords")}, indent=2))


if __name__ == "__main__":
    main()
