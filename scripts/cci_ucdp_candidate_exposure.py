"""Review current preliminary violence consistently, without assigning GSS scores."""

import argparse
import csv
import json
from collections import Counter
from datetime import date
from pathlib import Path

import pyproj
from shapely import STRtree

from cci_global_crosswalk import FUA_TABLE, ROOT, digest, load, write_csv
from cci_ucdp_exposure import fatalities, locate

SOURCES = (
    ("GEDEvent_v26_01_26_06.csv", "68dd3d363b8edf4808bd6bf6f5d0412c3c722ffb1db367aeb8eff48bab80589a", 10051, "2026-07-20T17:46:11Z"),
    ("GEDEvent_v26_0_7.csv", "9fc2c6dd85eee91845512e8ef1055281d9fd028fb98748a6f2a27c6e8aa8c562", 1828, "2026-08-20T22:26:48Z"),
    ("GEDEvent_v26_0_8.csv", "2ad6e0b2bfdbaa31873716a3455096923a8539519d69d96aeeea2d0f44a34593", 1806, "2026-09-20T20:44:14Z"),
)
WINDOW = (date(2026, 1, 1), date(2026, 8, 31))
STATUSES = {"Clear", "Check dyad", "Check geography", "Check deaths", "Check type of violence",
            "Check", "Check vague or biased source", "Check incompatibility"}


def merge(snapshots):
    events, versions, overlaps = {}, {}, []
    for name, rows in snapshots:
        ids = set()
        for row in rows:
            key = int(row["id"])
            if key <= 0 or key in ids:
                raise ValueError("Duplicate or invalid ID within a release")
            ids.add(key)
            if key in events:
                changed = [field for field in row if row[field] != events[key][field]]
                overlaps.append({"event_id": key, "previous_release": versions[key],
                                 "later_release": name, "changed_fields": ";".join(changed)})
            events[key], versions[key] = row, name
    return events, versions, overlaps


def needs_temporal_review(row):
    sources = [date.fromisoformat(value.strip()[:10]) for value in row["source_date"].split(";") if value.strip()]
    start = date.fromisoformat(row["date_start"][:10])
    return not sources or any(source > date(2026, 10, 10) for source in sources) or all(source < start for source in sources)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--fua", type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    manifest = json.loads((folder / "cci-global-candidates-r2019a.provenance.json").read_text())
    if digest(args.source_dir / "codebook.pdf") != "0107eac75e0b0bf0c0c1f2146dd1818af8ec943e254471b73453f53a64384d33":
        raise ValueError("Unexpected codebook snapshot")
    snapshots = []
    required = {"id", "year", "where_prec", "longitude", "latitude", "date_start", "date_end",
                "code_status", "source_date", "type_of_violence", "low", "best", "high"}
    for name, sha, count, _ in SOURCES:
        path = args.source_dir / name
        if digest(path) != sha:
            raise ValueError(f"Unexpected source checksum: {name}")
        with path.open(encoding="utf-8-sig") as stream:
            reader = csv.DictReader(stream)
            if not required <= set(reader.fieldnames or []):
                raise ValueError("Incomplete preliminary event schema")
            rows = list(reader)
        if len(rows) != count:
            raise ValueError("Unexpected release count")
        snapshots.append((name, rows))
    events, versions, overlaps = merge(snapshots)
    fuas, repairs = load(args.fua, FUA_TABLE, "eFUA_ID", "eFUA_name", manifest["geoPackageSha256"])
    tree = STRtree([item[2] for item in fuas])
    project = pyproj.Transformer.from_crs("EPSG:4326", "ESRI:54009", always_xy=True)
    results = [{"efua_id": key, "source_name": name, "clear_precise_events": 0,
                "pending_precise_events": 0, "clear_deaths_low": 0, "clear_deaths_best": 0,
                "clear_deaths_high": 0} for key, name, _ in fuas]
    ledger, dispositions, statuses = [], Counter(), Counter()
    for key, row in sorted(events.items()):
        if int(row["year"]) != 2026 or row["code_status"] not in STATUSES:
            raise ValueError("Unexpected event year or preliminary status")
        if int(row["type_of_violence"]) not in (1, 2, 3):
            raise ValueError("Unexpected violence type")
        statuses[row["code_status"]] += 1
        outcome, matches = locate(row, tree, project.transform, WINDOW)
        location_outcome = outcome
        estimates = fatalities(row)
        if estimates is None:
            outcome = "inconsistent_fatality_estimates"
        elif needs_temporal_review(row):
            outcome = "source_date_review_required"
        elif outcome == "assigned":
            result = results[matches[0]]
            if row["code_status"] == "Clear":
                outcome = "clear_precise_assigned"
                result["clear_precise_events"] += 1
                for label, value in zip(("low", "best", "high"), estimates):
                    result[f"clear_deaths_{label}"] += value
            else:
                outcome = "pending_precise_assigned"
                result["pending_precise_events"] += 1
        dispositions[outcome] += 1
        ledger.append({"event_id": key, "selected_release": versions[key], "disposition": outcome,
                       "location_disposition": location_outcome,
                       "point_fua_matches": ";".join(str(fuas[i][0]) for i in matches),
                       **{field: row[field] for field in ("code_status", "date_start", "date_end",
                                                         "source_date", "where_prec", "type_of_violence", "low", "best", "high")}})
    if len(events) != 13659 or len(results) != manifest["rowCount"] or len(overlaps) != 26:
        raise ValueError("Unexpected merged source/candidate accounting")
    files = {"cci-ucdp-candidate-2026-efua.csv": results,
             "cci-ucdp-candidate-2026-events.csv": ledger,
             "cci-ucdp-candidate-2026-overlaps.csv": overlaps}
    for name, rows in files.items():
        write_csv(folder / name, rows)
    summary = {
        "status": "preliminary_violence_review_not_gss_scores",
        "retrievedOn": "2026-10-12", "evidenceCutoff": "2026-10-10",
        "window": "2026-01-01/2026-08-31", "candidateCount": len(results),
        "sourceRecordCount": sum(len(rows) for _, rows in snapshots),
        "uniqueEventCount": len(events), "overlapCount": len(overlaps),
        "revisedOverlapCount": sum(bool(r["changed_fields"]) for r in overlaps),
        "sources": [{"url": f"https://ucdp.uu.se/downloads/candidateged/{name}",
                     "sha256": sha, "bytes": (args.source_dir / name).stat().st_size,
                     "recordCount": count, "httpLastModified": modified,
                     "publishedOn": None} for name, sha, count, modified in SOURCES],
        "codebookUrl": "https://ucdp.uu.se/downloads/candidateged/ucdp-candidate-codebook1.5.pdf",
        "codebookSha256": digest(args.source_dir / "codebook.pdf"),
        "indexUrl": "https://ucdp.uu.se/downloads/index.html",
        "indexSha256": digest(args.source_dir / "index.html"),
        "temporalReviewMeaning": "All listed source dates preceding an event start, any source date after the cutoff, or no source date triggers retained review, not proof of error: earlier material may legitimately identify actors. These records are not counted as current assigned impacts until reviewed. Source dates remain distinct from event dates.",
        "verifiedTemporalConflict": {
            "eventId": 623566, "candidateId": 7244, "datasetDate": "2026-03-30",
            "sourceUrl": "https://www.justice.gov/opa/pr/twenty-seven-members-and-associates-tren-de-aragua-splinter-faction-anti-tren-charged-2024",
            "sourcePublishedOn": "2026-02-13", "sourceAllegedEventDate": "2024-04-15",
            "meaning": "Source describes alleged 2024 double murder; 2026 indictment is not new deaths. Dataset value retained without silently rewriting or attributing a 2026 event. Source allegations are not conviction. Other temporal flags are not automatically proved errors.",
        },
        "publicationBeforeCutoffVerified": False,
        "releaseAssumption": "Fixed monthly versions, stated extraction schedule and pre-cutoff HTTP Last-Modified support inferred pre-cutoff availability; no independent historical archive obtained. Modification time is not verified publication time. This assumption is withdrawable; no case score or exclusion uses this intake.",
        "dispositions": dict(dispositions), "codeStatusCounts": dict(statuses),
        "candidatesWithClearPreciseEvents": sum(r["clear_precise_events"] > 0 for r in results),
        "candidatesWithPendingPreciseEvents": sum(r["pending_precise_events"] > 0 for r in results),
        "efuaSourceSha256": manifest["geoPackageSha256"], "repairedEfuaCount": len(repairs),
        "scriptSha256": digest(Path(__file__)),
        "locationHelperSha256": digest(ROOT / "scripts/cci_ucdp_exposure.py"),
        "geometryHelperSha256": digest(ROOT / "scripts/cci_global_crosswalk.py"),
        "files": {name: digest(folder / name) for name in files},
        "method": "All frozen candidates retained. Quarter/July/August releases merged by persistent ID, retaining later release once and documenting every overlap. Clear and pending precise-coded points remain separate. Dates must lie wholly within January-August. Coarse, outside, ambiguous, source-date-review and inconsistent records are retained, never repaired or guessed. Fatality bounds only summed for assigned Clear records.",
        "limitations": "Preliminary codes can change and overlapping deaths with different IDs are not adjudicated. Clear does not mean final confirmation. Precision 1 can be a settlement centroid, not GPS. September/October, nonlethal impacts, reporting gaps, regional/strategic exposure, mitigation and resident-specific outcomes remain unresolved. No match is not zero risk; counts and fatality bounds are not rates, complete city impacts, GSS scores or exclusion bounds.",
        "license": "CC BY 4.0; cite Hegre, Croicu, Eck and Högbladh (2020), Introducing the UCDP Candidate Events Dataset; Högbladh (2026), Codebook v1.5.",
    }
    (folder / "cci-ucdp-candidate-2026.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
    print({key: summary[key] for key in ("uniqueEventCount", "overlapCount", "revisedOverlapCount",
                                        "dispositions", "candidatesWithClearPreciseEvents")})


if __name__ == "__main__":
    main()
