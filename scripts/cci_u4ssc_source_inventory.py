"""Link a frozen report index to candidate identities; never transfer indicators or scores."""

import argparse
import csv
import hashlib
import io
import json
import re
import unicodedata
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "docs/data"
COUNTRIES = {
    "Ecuador": "ECU", "Switzerland": "CHE", "Korea (Republic of)": "KOR",
    "Norway": "NOR", "Iran": "IRN", "Argentina": "ARG", "Spain": "ESP",
    "The Netherlands": "NLD", "Tunisia": "TUN",
}


def normalized(value):
    return "".join(c for c in unicodedata.normalize("NFKD", value).casefold() if c.isalnum())


def identity(label, candidates):
    city = label.split(",", 1)[0].strip()
    country = re.sub(r" \(\d{4}-\d{4}\)$", "", label.rsplit(",", 1)[1].strip())
    iso = COUNTRIES[country]
    return [r["efua_id"] for r in candidates
            if r["country_iso"] == iso and normalized(r["source_name"]) == normalized(city)]


def assemble(index, candidates):
    identifiers = {r["efua_id"] for r in candidates}
    if len(identifiers) != len(candidates) or len(identifiers) != 9031:
        raise ValueError("Expected all 9031 unique candidates")
    entries = index["entries"]
    if len(entries) != index["indexEntryCount"]:
        raise ValueError("Index entry count mismatch")
    urls = [link["url"] for e in entries for link in e["links"]]
    if len(urls) != len(set(urls)) or len(urls) != index["linkCount"]:
        raise ValueError("Repeated or missing report links")
    if any(urlparse(url).scheme != "https" or urlparse(url).hostname not in
           {"www.itu.int", "u4ssc.itu.int"} for url in urls):
        raise ValueError("Unexpected report URL origin")
    read_links = [link for e in entries for link in e["links"]
                  if link["originalSha256"] is not None]
    if len(read_links) != index["readReportCount"] or any(
            link["label"] != "Download" or link["format"] != "PDF"
            or not re.fullmatch(r"[0-9a-f]{64}", link["originalSha256"])
            or not isinstance(link["originalBytes"], int) or link["originalBytes"] <= 0
            for link in read_links):
        raise ValueError("Read bodies must refer to exact downloaded PDF URLs")
    references = {identifier: [] for identifier in identifiers}
    mapped, unresolved = [], []
    for ordinal, entry in enumerate(entries, 1):
        matches = identity(entry["reportingLabel"], candidates)
        record = {"entry": ordinal, "reportingLabel": entry["reportingLabel"],
                  "candidateIdentityMatches": matches,
                  "scope": "name_country_only_not_report_FUA_equivalence"}
        if len(matches) == 1:
            references[matches[0]].append(str(ordinal))
            mapped.append(record)
        else:
            unresolved.append(record)
    stream = io.StringIO(newline="")
    writer = csv.writer(stream, lineterminator="\n")
    writer.writerow(["efua_id", "source_name", "country_iso", "u4ssc_index_entry_refs",
                     "identity_status", "indicator_transfer", "cci_score_transfer"])
    for row in candidates:
        refs = references[row["efua_id"]]
        writer.writerow([row["efua_id"], row["source_name"], row["country_iso"], ";".join(refs),
                         "name_country_only" if refs else "no_exact_identity_not_no_service",
                         "none", "none"])
    return stream.getvalue().encode(), mapped, unresolved


def self_check():
    candidates = [{"efua_id": "1", "country_iso": "ECU", "source_name": "Quito"},
                  {"efua_id": "2", "country_iso": "CHE", "source_name": "Geneva"}]
    assert identity("Quito, Ecuador", candidates) == ["1"]
    assert identity("Canton of Geneva, Switzerland", candidates) == []
    assert identity("Pully, Switzerland (2020-2025)", candidates) == []
    assert identity("Quito, Ecuador", candidates + [candidates[0]]) == ["1", "1"]
    assert normalized("Tromsø") != normalized("Tromso")
    print("PASS: exact identity only; regional labels, duplicate names and unmatched versions retained")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--self-check", action="store_true")
    args = parser.parse_args()
    if args.self_check:
        self_check()
        return
    source = DATA / "cci-u4ssc-verification-index.json"
    catalog = DATA / "cci-global-candidates-r2019a.csv"
    index = json.loads(source.read_text())
    provenance = json.loads((DATA / "cci-global-candidates-r2019a.provenance.json").read_text())
    if hashlib.sha256(catalog.read_bytes()).hexdigest() != provenance["csvSha256"]:
        raise ValueError("Frozen candidate checksum mismatch")
    candidates = list(csv.DictReader(catalog.open()))
    content, mapped, unresolved = assemble(index, candidates)
    output = DATA / "cci-u4ssc-candidate-source-refs.csv"
    summary = {
        "status": "source_index_identity_inventory_not_CCI_or_prediction",
        "candidateCount": len(candidates), "indexEntries": len(index["entries"]),
        "uniqueLinks": index["linkCount"], "identityMappedEntries": len(mapped),
        "candidatesWithIdentityRefs": len({r["candidateIdentityMatches"][0] for r in mapped}),
        "unresolvedEntries": unresolved, "mappedEntries": mapped,
        "originalIndexSha256": index["sourceSha256"],
        "indexSnapshotSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "reportedKpiSnapshotSha256": hashlib.sha256((DATA / "cci-u4ssc-reported-kpis.json").read_bytes()).hexdigest(),
        "candidateCsvSha256": hashlib.sha256(catalog.read_bytes()).hexdigest(),
        "scriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "csvSha256": hashlib.sha256(content).hexdigest(),
        "readReportCount": index["readReportCount"],
        "globalRankingEligible": False, "indicatorTransfer": False, "scoreTransfer": False,
        "limitations": ["Index is not a global city sample or complete verification universe.",
                        "Report versions, languages and observation years stay separate.",
                        "Name-country identity is not administrative or functional coverage.",
                        "No match is not missing services, poor disclosure or exclusion."],
    }
    manifest = DATA / "cci-u4ssc-source-inventory.json"
    if args.check:
        if output.read_bytes() != content or json.loads(manifest.read_text()) != summary:
            raise ValueError("Source inventory is stale")
    else:
        output.write_bytes(content)
        manifest.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
    print({k: summary[k] for k in ["candidateCount", "indexEntries", "uniqueLinks",
                                  "identityMappedEntries", "candidatesWithIdentityRefs"]})


if __name__ == "__main__":
    main()
