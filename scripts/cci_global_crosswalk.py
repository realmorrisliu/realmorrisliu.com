"""Intersect frozen eFUA and UCDB polygons; never transfer scores by city name."""

import argparse
import csv
import hashlib
import json
import sqlite3
import struct
from collections import Counter
from pathlib import Path

import shapely
from shapely import STRtree, from_wkb, union_all

ROOT = Path(__file__).resolve().parents[1]
FUA_TABLE = "GHS_FUA_UCDB2015_GLOBE_R2019A_54009_1K_V1_0"
UC_TABLE = "GHSL_UCDB_THEME_GENERAL_CHARACTERISTICS_GLOBE_R2024A"


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def geometry(blob):
    # GeoPackage binary header precedes standard WKB; reject unsupported encodings.
    if not blob or len(blob) < 9 or blob[:3] != b"GP\x00":
        raise ValueError("Invalid GeoPackage header")
    flags = blob[3]
    envelope = (flags >> 1) & 7
    if flags & 0xF0 or envelope > 4:
        raise ValueError("Empty, extended or reserved GeoPackage geometry")
    endian = "<" if flags & 1 else ">"
    if struct.unpack(endian + "i", blob[4:8])[0] != 54009:
        raise ValueError("Expected common Mollweide SRS 54009")
    offset = 8 + (0, 32, 48, 48, 64)[envelope]
    result = from_wkb(blob[offset:])
    if result.geom_type not in ("Polygon", "MultiPolygon") or result.area <= 0:
        raise ValueError("Empty or non-polygon geometry")
    repair = None
    if not result.is_valid:
        fixed = shapely.make_valid(result)
        if (fixed.geom_type not in ("Polygon", "MultiPolygon") or not fixed.is_valid
                or abs(fixed.area - result.area) > 1e-6 or fixed.bounds != result.bounds):
            raise ValueError("Geometry repair changes area, extent or polygon type")
        repair = {
            "reason": shapely.is_valid_reason(result),
            "originalAreaM2": result.area,
            "repairedAreaM2": fixed.area,
            "derivedWkbSha256": hashlib.sha256(shapely.to_wkb(fixed)).hexdigest(),
        }
        result = fixed
    return result, repair


def overlaps(polygon, tree, polygons):
    for index in sorted(tree.query(polygon).tolist()):
        part = polygon.intersection(polygons[index])
        if part.area > 0:
            yield index, part


def load(path, table, identifier, name, expected_hash):
    if digest(path) != expected_hash:
        raise ValueError(f"Source checksum mismatch: {path}")
    with sqlite3.connect(path.resolve().as_uri() + "?mode=ro", uri=True) as connection:
        if connection.execute(
            "SELECT srs_id FROM gpkg_geometry_columns WHERE table_name=?", (table,)
        ).fetchone() != (54009,):
            raise ValueError("Unexpected geometry SRS")
        rows = connection.execute(
            f'SELECT "{identifier}", "{name}", geom FROM "{table}" ORDER BY "{identifier}"'
        ).fetchall()
    if len({row[0] for row in rows}) != len(rows):
        raise ValueError("Duplicate source IDs")
    records, repairs = [], []
    for key, label, blob in rows:
        polygon, repair = geometry(blob)
        records.append((int(key), label, polygon))
        if repair:
            repairs.append({"sourceId": int(key), **repair})
    return records, repairs


def write_csv(path, rows):
    with path.open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fua", required=True, type=Path)
    parser.add_argument("--ucdb", required=True, type=Path)
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    old = json.loads((folder / "cci-global-candidates-r2019a.provenance.json").read_text())
    new = json.loads((folder / "cci-ucdb-r2024a-v1-2.inventory.json").read_text())
    fuas, fua_repairs = load(args.fua, FUA_TABLE, "eFUA_ID", "eFUA_name", old["geoPackageSha256"])
    centres, uc_repairs = load(args.ucdb, UC_TABLE, "ID_UC_G0", "GC_UCN_MAI_2025", new["geoPackageSha256"])
    if len(fuas) != old["rowCount"] or len(centres) != 11422:
        raise ValueError("Unexpected source count")
    polygons = [row[2] for row in fuas]
    tree = STRtree(polygons)
    edges, uc_rows = [], []
    fua_parts = [[] for _ in fuas]
    for identifier, name, polygon in centres:
        matches = list(overlaps(polygon, tree, polygons))
        for index, part in matches:
            fua_parts[index].append(part)
            edges.append({
                "ucdb_id": identifier,
                "efua_id": fuas[index][0],
                "overlap_km2": round(part.area / 1e6, 6),
                "uc_area_share": round(part.area / polygon.area, 9),
                "efua_area_share": round(part.area / polygons[index].area, 9),
            })
        covered = union_all([part for _, part in matches]).area / polygon.area
        if not 0 <= covered <= 1 + 1e-9:
            raise ValueError("Impossible centre coverage")
        uc_rows.append({
            "ucdb_id": identifier, "source_name": name,
            "intersecting_efuas": len(matches),
            "covered_area_share": round(covered, 9),
            "status": "no_overlap" if not matches else "single_overlap" if len(matches) == 1 else "multiple_overlaps",
        })
    fua_rows = [{
        "efua_id": key, "source_name": name,
        "intersecting_centres": len(parts),
        "centre_area_share": round(union_all(parts).area / polygon.area, 9),
    } for (key, name, polygon), parts in zip(fuas, fua_parts)]
    outputs = {
        "cci-ucdb-efua-overlaps.csv": edges,
        "cci-ucdb-efua-centre-coverage.csv": uc_rows,
        "cci-ucdb-efua-fua-coverage.csv": fua_rows,
    }
    for filename, rows in outputs.items():
        write_csv(folder / filename, rows)
    summary = {
        "status": "polygon_overlap_not_indicator_crosswalk",
        "scriptSha256": digest(Path(__file__)),
        "efuaCount": len(fuas), "urbanCentreCount": len(centres),
        "intersectionCount": len(edges),
        "centreOverlapCounts": dict(Counter(row["status"] for row in uc_rows)),
        "efuasWithoutCentreOverlap": sum(not row["intersecting_centres"] for row in fua_rows),
        "partiallyCoveredCentres": sum(0 < row["covered_area_share"] < 1 for row in uc_rows),
        "efuaSourceSha256": old["geoPackageSha256"],
        "ucdbSourceSha256": new["geoPackageSha256"],
        "shapelyVersion": shapely.__version__, "geosVersion": shapely.geos_version_string,
        "geometryRepairs": {"efua": fua_repairs, "urbanCentre": uc_repairs},
        "files": {filename: digest(folder / filename) for filename in outputs},
        "method": "Positive-area polygon intersections in shared SRS 54009. No name, nearest-neighbour, country or population filter. Invalid polygons repaired only with GEOS make_valid when area and extent are unchanged; each repair recorded, original sources unchanged. No snapping. Touch-only pairs excluded. Coverage uses geometric union to avoid double counting overlaps.",
        "limitations": "Area overlap is not population or service coverage and does not license transferring a centre average to a whole FUA. Unmatched centres are not assumed low-scoring or newly formed. Multiple overlaps and out-of-frame centres remain unresolved, not discarded. No dimension scores or ranks computed.",
    }
    (folder / "cci-ucdb-efua-crosswalk.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
