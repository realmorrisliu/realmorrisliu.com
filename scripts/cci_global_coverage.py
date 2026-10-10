"""Inventory existing evidence against the frozen global universe; never infer scores."""

import argparse
import csv
import hashlib
import io
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIMENSIONS = ("PCS", "GSS", "ISR", "RES", "MED", "LON", "TEC", "OPT")
OUTCOMES = {"usable_observation", "context_only", "insufficient_evidence"}


def inventory(candidates, release):
    ids = [int(row["efua_id"]) for row in candidates]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate candidate IDs")
    references = {}
    slugs = set()
    counts = {dimension: Counter() for dimension in DIMENSIONS}
    for city in release["cities"]:
        if city["slug"] in slugs:
            raise ValueError("Duplicate research city")
        slugs.add(city["slug"])
        city_ids = city["boundary"]["eFuaIds"]
        if not city_ids or len(city_ids) != len(set(city_ids)):
            raise ValueError("Empty or duplicate city boundary IDs")
        audits = city["audit"]["dimensions"]
        if Counter(item["id"] for item in audits) != Counter(DIMENSIONS):
            raise ValueError("Each research city needs exactly eight dimension audits")
        for audit in audits:
            if audit["outcome"] not in OUTCOMES or not audit["sources"]:
                raise ValueError("Invalid audit outcome or missing source references")
            counts[audit["id"]][audit["outcome"]] += 1
        for identifier in city_ids:
            if identifier not in ids or identifier in references:
                raise ValueError("Unknown or multiply claimed candidate boundary")
            references[identifier] = city
    rows = []
    for candidate in candidates:
        identifier = int(candidate["efua_id"])
        city = references.get(identifier)
        row = {
            "efua_id": identifier,
            "source_name": candidate["source_name"],
            "country_iso": candidate["country_iso"],
            "research_slug": city["slug"] if city else "",
            "research_scope": (
                "single_efua" if len(city["boundary"]["eFuaIds"]) == 1
                else "union_member_only"
            ) if city else "not_researched",
            "observation_crosswalk": city["audit"]["boundaryReview"]["outcome"] if city else "not_reviewed",
        }
        for dimension in DIMENSIONS:
            audit = next((item for item in city["audit"]["dimensions"] if item["id"] == dimension), None) if city else None
            row[dimension] = audit["outcome"] if audit else "not_researched"
            # Union evidence must not be copied into each constituent as fitted inputs.
            row[f"{dimension}_recorded_inputs"] = (
                sum(item["owner"] == dimension for item in city["indicators"])
                if city and row["research_scope"] == "single_efua" else ""
            )
        rows.append(row)
    return rows, {
        "candidateCount": len(rows),
        "researchCityCount": len(slugs),
        "referencedEfuaCount": len(references),
        "singleEfuaResearchCount": sum(row["research_scope"] == "single_efua" for row in rows),
        "unionMemberCount": sum(row["research_scope"] == "union_member_only" for row in rows),
        "unresearchedEfuaCount": len(rows) - len(references),
        "recordedIndicatorCount": sum(len(city["indicators"]) for city in release["cities"]),
        "researchAuditCounts": {key: dict(value) for key, value in counts.items()},
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    candidate_path = folder / "cci-global-candidates-r2019a.csv"
    provenance = json.loads(candidate_path.with_suffix(".provenance.json").read_text())
    raw = candidate_path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != provenance["csvSha256"]:
        raise ValueError("Candidate checksum mismatch")
    candidates = list(csv.DictReader(io.StringIO(raw.decode())))
    if len(candidates) != provenance["rowCount"]:
        raise ValueError("Candidate row count mismatch")
    release_path = ROOT / "src/cci/data/releases/cci-2026.10.3.json"
    release_raw = release_path.read_bytes()
    release = json.loads(release_raw)
    rows, summary = inventory(candidates, release)
    buffer = io.StringIO(newline="")
    writer = csv.DictWriter(buffer, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    csv_text = buffer.getvalue()
    summary.update({
        "status": "evidence_inventory_not_global_ranking",
        "researchReleaseId": release["releaseId"],
        "researchReleaseFileSha256": hashlib.sha256(release_raw).hexdigest(),
        "candidateCsvSha256": provenance["csvSha256"],
        "coverageCsvSha256": hashlib.sha256(csv_text.encode()).hexdigest(),
        "interpretation": "Audit outcomes refer to the linked historical research city, not verified whole-FUA coverage. Union-member rows reference the same research once; counts are not duplicated. Recorded inputs are not automatically qualified measurements. Blank input counts mean not inventoried for this scope, not zero performance. No global eligibility or rank is inferred.",
    })
    for filename, content in {
        "cci-global-coverage-2026-10.csv": csv_text,
        "cci-global-coverage-2026-10.json": json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
    }.items():
        output = folder / filename
        if args.check:
            if not output.exists() or output.read_text() != content:
                raise ValueError(f"Stale coverage inventory: {filename}")
        else:
            output.write_text(content)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
