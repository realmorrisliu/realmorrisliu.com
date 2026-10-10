"""Preserve urban drinking-water country context, excluding regional aggregates."""

import argparse
import csv
import hashlib
import json
import math
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDICATORS = {"SH.H2O.SMDW.UR.ZS": "safely_managed", "SH.H2O.BASW.UR.ZS": "at_least_basic"}


def complete(payload):
    meta, rows = payload
    if int(meta["page"]) != 1 or int(meta["pages"]) != 1 or int(meta["total"]) != len(rows):
        raise ValueError("Incomplete API page")
    return rows


def aggregates(records, countries):
    by_code = {r["id"]: r for r in countries}
    by_two = {r["iso2Code"]: r for r in countries}
    if len(by_code) != len(countries) or len(by_two) != len(countries):
        raise ValueError("Ambiguous country metadata")
    result, seen = [], set()
    for row in records:
        code, indicator = row["countryiso3code"], row["indicator"]["id"]
        if indicator not in INDICATORS or row["date"] != "2024":
            raise ValueError("Unexpected indicator or year")
        country = by_code.get(code) if code else by_two.get(row["country"]["id"])
        if country is None or country["iso2Code"] != row["country"]["id"]:
            raise ValueError("Unresolved source geography")
        key = (country["id"], indicator)
        if key in seen:
            raise ValueError("Duplicate source observation")
        seen.add(key)
        value = row["value"]
        if value is not None and (isinstance(value, bool) or not isinstance(value, (int, float)) or
                                   not math.isfinite(value) or not 0 <= value <= 100):
            raise ValueError("Invalid percentage")
        if country["region"]["id"] == "NA":
            continue
        result.append({"source_id": f"{country['id']}:{indicator}:2024", "country_code": country["id"],
                       "country_name": country["name"], "indicator": indicator, "year": 2024,
                       "value_percent": "" if value is None else value,
                       "status": "missing" if value is None else "country_urban_estimate"})
    return sorted(result, key=lambda r: r["source_id"])


def links(candidates, observations):
    available = {r["source_id"] for r in observations if r["status"] != "missing"}
    result = []
    for candidate in candidates:
        code = candidate["country_iso"]
        mapped = "XKX" if code == "XKO" else code
        refs = {label + "_context_ref": f"{mapped}:{indicator}:2024"
                if f"{mapped}:{indicator}:2024" in available else ""
                for indicator, label in INDICATORS.items()}
        result.append({"efua_id": candidate["efua_id"], "source_name": candidate["source_name"],
                       "fua_country_code": code, "lookup_country_code": mapped,
                       "evidence_scale": "country_urban_context_not_city_measurement",
                       "available_indicators": sum(bool(v) for v in refs.values()), **refs})
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    source = json.loads((folder / "cci-water-source.json").read_text())
    raw = {}
    for name, record in source["files"].items():
        data = (args.source_dir / name).read_bytes()
        if hashlib.sha256(data).hexdigest() != record["sha256"]:
            raise ValueError("Source hash mismatch")
        raw[name] = complete(json.loads(data))
    for indicator in INDICATORS:
        if len(raw[indicator + ".json"]) != 1 or raw[indicator + ".json"][0]["id"] != indicator:
            raise ValueError("Indicator metadata mismatch")
    observations = aggregates(raw["jmp-water-2024.json"], raw["worldbank-countries.json"])
    candidate_path = folder / "cci-global-candidates-r2019a.csv"
    provenance = json.loads((folder / "cci-global-candidates-r2019a.provenance.json").read_text())
    if hashlib.sha256(candidate_path.read_bytes()).hexdigest() != provenance["csvSha256"]:
        raise ValueError("Candidate hash mismatch")
    with candidate_path.open() as stream:
        candidates = list(csv.DictReader(stream))
    if len(candidates) != provenance["rowCount"] or len({r["efua_id"] for r in candidates}) != len(candidates):
        raise ValueError("Candidate identity mismatch")
    mapped = links(candidates, observations)
    outputs = {}
    for name, rows in (("cci-water-2024-country-urban.csv", observations), ("cci-water-efua-context.csv", mapped)):
        path = folder / name
        with path.open("w", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator="\n")
            writer.writeheader()
            writer.writerows(rows)
        outputs[name] = hashlib.sha256(path.read_bytes()).hexdigest()
    summary = {"scope": "Country urban population estimates, not city observations or water resilience scores.",
               "observationYear": 2024, "candidateCount": len(mapped),
               "countryRecords": len(observations),
               "availableCountriesByIndicator": dict(Counter(r["indicator"] for r in observations if r["status"] != "missing")),
               "candidateIndicatorCounts": dict(Counter(r["available_indicators"] for r in mapped)),
               "sourceManifestSha256": hashlib.sha256((folder / "cci-water-source.json").read_bytes()).hexdigest(),
               "scriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
               "candidateCsvSha256": provenance["csvSha256"], "outputs": outputs,
               "limitations": "National urban definition may differ from eFUA. No inherited parent-jurisdiction values; XKO to XKX uses previously verified Kosovo alias. At-least-basic includes safely managed and must not be added to it. Missing safely managed is not zero and is not replaced by basic. No city score or 2026 nowcast."}
    (folder / "cci-water-context.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(summary["candidateIndicatorCounts"])


if __name__ == "__main__":
    main()
