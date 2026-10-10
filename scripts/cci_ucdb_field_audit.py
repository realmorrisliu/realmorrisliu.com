"""Profile raw UCDB fields without interpreting non-null values as CCI evidence."""

import argparse
import csv
import hashlib
import json
import math
import sqlite3
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def profile(values):
    finite = [v for v in values if isinstance(v, (int, float)) and math.isfinite(v)]
    return {
        "rows": len(values),
        "null_count": sum(v is None for v in values),
        "blank_text_count": sum(isinstance(v, str) and not v.strip() for v in values),
        "text_count": sum(isinstance(v, str) for v in values),
        "finite_numeric_count": len(finite),
        "nonfinite_numeric_count": sum(isinstance(v, (int, float)) and not math.isfinite(v) for v in values),
        "zero_count": sum(v == 0 for v in finite),
        "negative_count": sum(v < 0 for v in finite),
        "minimum": min(finite) if finite else "",
        "maximum": max(finite) if finite else "",
    }


def conflicts(columns, rows):
    groups = defaultdict(list)
    for row in rows:
        groups[row[0]].append(row)
    result = []
    for identifier, records in sorted(groups.items()):
        if len(records) < 2:
            continue
        differences = {}
        for index, column in enumerate(columns):
            values = list(dict.fromkeys(record[index] for record in records))
            if len(values) > 1:
                differences[column] = values
        result.append({"id": identifier, "rowCount": len(records), "differentFields": differences})
    return result


def connectivity_zero_devices(rows):
    """Keep source zeros, but identify measurements unsupported by device counts."""
    return {
        "allFourZeroIds": [identifier for identifier, *values in rows if all(v == 0 for v in values)],
        "positiveSpeedWithoutPositiveDevicesIds": [
            identifier for identifier, download, upload, latency, devices in rows
            if download is not None and download > 0 and (devices is None or devices <= 0)
        ],
    }


def seismic_partition(rows):
    """Check population accounting before interpreting a reported zero exposure."""
    result = {"unclassifiedPopulationIds": [], "partitionMismatchIds": [],
              "shareMismatchIds": []}
    for identifier, population, share, *classes in rows:
        if (len(classes) != 9 or any(not isinstance(v, (float, int)) or
                not math.isfinite(v) or v < 0 for v in (population, share, *classes))
                or population <= 0 or share > 100):
            raise ValueError("Invalid seismic population partition")
        classified = sum(classes)
        if classified == 0:
            result["unclassifiedPopulationIds"].append(identifier)
        # Accounting tolerance, not a model uncertainty bound.
        if abs(classified - population) > max(0.01, population * 0.00001):
            result["partitionMismatchIds"].append(identifier)
        if abs(100 * sum(classes[4:]) / population - share) > 0.01:
            result["shareMismatchIds"].append(identifier)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ucdb", required=True, type=Path)
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    manifest = json.loads((folder / "cci-ucdb-r2024a-v1-2.inventory.json").read_text())
    with args.ucdb.open("rb") as stream:
        if hashlib.file_digest(stream, "sha256").hexdigest() != manifest["geoPackageSha256"]:
            raise ValueError("UCDB checksum mismatch")
    profiles, duplicate_tables = [], []
    with sqlite3.connect(args.ucdb.resolve().as_uri() + "?mode=ro", uri=True) as db:
        for table in manifest["tables"]:
            name, columns = table["table"], table["columns"]
            schema = db.execute(f'PRAGMA table_info("{name}")').fetchall()
            if [row[1] for row in schema if row[1] not in ("fid", "geom")] != columns:
                raise ValueError("Table schema does not match inventory")
            quoted = ",".join('"' + column + '"' for column in columns)
            rows = db.execute(f'SELECT {quoted} FROM "{name}" ORDER BY ID_UC_G0').fetchall()
            if len(rows) != table["records"] or len({row[0] for row in rows}) != table["uniqueIds"]:
                raise ValueError("Table row count does not match inventory")
            duplicates = conflicts(columns, rows)
            if duplicates:
                duplicate_tables.append({"table": name, "duplicates": duplicates})
            for index, column in enumerate(columns):
                values = [row[index] for row in rows]
                profiles.append({
                    "table": name, "field": column,
                    "unique_ids_with_nonnull_value": len({row[0] for row in rows if row[index] is not None}),
                    "conflicting_id_count": sum(column in item["differentFields"] for item in duplicates),
                    **profile(values),
                })
        health_mismatch = db.execute(
            "SELECT SUM(HL_FCL_HOS_2024 IS NULL AND HL_SHP_HOS_2025 IS NOT NULL), "
            "SUM(HL_FCL_HOS_2024 IS NOT NULL AND HL_SHP_HOS_2025 IS NULL) "
            "FROM GHSL_UCDB_THEME_HEALTH_GLOBE_R2024A"
        ).fetchone()
        connectivity = {}
        for year in range(2020, 2024):
            for mode in ("F", "M"):
                columns = [f'SC_CON_{metric}{mode}_{year}' for metric in ("DS", "US", "AL", "ND")]
                quoted = ",".join('"' + column + '"' for column in columns)
                rows = db.execute(
                    f'SELECT ID_UC_G0,{quoted} FROM GHSL_UCDB_THEME_SOCIOECONOMIC_GLOBE_R2024A ORDER BY ID_UC_G0'
                ).fetchall()
                connectivity[f"{mode}_{year}"] = connectivity_zero_devices(rows)
        classes = ",".join(f'EX_E{i:02}_POP_2025' for i in (1, 2, 4, 5, 6, 7, 8, 9, 10))
        seismic = seismic_partition(db.execute(
            f'SELECT ID_UC_G0, GC_POP_TOT_2025, EX_SHA_POP_2025,{classes} '
            'FROM GHSL_UCDB_THEME_EXPOSURE_GLOBE_R2024A ORDER BY ID_UC_G0'
        ).fetchall())
    csv_path = folder / "cci-ucdb-field-profile.csv"
    with csv_path.open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(profiles[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(profiles)
    summary = {
        "status": "raw_values_not_semantic_coverage",
        "sourceGeoPackageSha256": manifest["geoPackageSha256"],
        "scriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "profileCsvSha256": hashlib.sha256(csv_path.read_bytes()).hexdigest(),
        "tableCount": len(manifest["tables"]),
        "tableFieldCount": len(profiles),
        "uniqueFieldNames": len({row["field"] for row in profiles}),
        "duplicateTables": duplicate_tables,
        "seismicPopulationPartition2025": {
            **seismic,
            "populationTolerance": "max(0.01 person, total population * 0.00001)",
            "shareTolerancePercentagePoints": 0.01,
            "interpretation": "Compare all nine MMI class population counts to source urban-centre population, and MMI >= 6 share to its class numerator. Arithmetic agreement does not establish hazard coverage. Positive population with zero in every class is unresolved, not zero hazard. No imputation or eFUA score transfer.",
        },
        "connectivityZeroDeviceAudit": {
            "bySourceSuffixAndYear": connectivity,
            "interpretation": "All-four-zero records have zero download, upload, latency and devices. Preserve raw zeros but exclude from performance interpretation pending source clarification; zero latency is not evidence of excellent service. F/M are source suffixes, not resolution of the duplicated download field name in the manual.",
        },
        "healthCrossFieldMissingness": {
            "countMissingButProximityPresent": health_mismatch[0],
            "countPresentButProximityMissing": health_mismatch[1],
            "interpretation": "Different fields and labelled years; no causal inference or imputation. Null hospital counts must not be converted to zero facilities.",
        },
        "limitations": "Profiles count source rows, including duplicates. Unique IDs with values do not certify coverage: blanks, placeholders, model estimates and conflicting records need field-specific interpretation. Zero is retained, never converted to missing or good performance. Negative values are counted, not automatically rejected. No indicators transferred to eFUAs or scored.",
    }
    (folder / "cci-ucdb-field-audit.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
    print(f"Profiled {len(profiles)} table fields; duplicate tables: {len(duplicate_tables)}")


if __name__ == "__main__":
    main()
