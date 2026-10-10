"""Count MAP valid and discordant raster cells inside every frozen eFUA."""

import argparse
import json
from collections import Counter
from pathlib import Path

import numpy as np
import pyproj
import rasterio
import shapely
from rasterio.features import geometry_mask, geometry_window
from rasterio.errors import WindowError
from shapely.ops import transform

from cci_global_crosswalk import FUA_TABLE, ROOT, digest, load, write_csv
from cci_healthcare_raster_audit import compare


def summarize(motor, walking, inside):
    motor = np.ma.array(motor.data, mask=np.ma.getmaskarray(motor) | ~inside)
    walking = np.ma.array(walking.data, mask=np.ma.getmaskarray(walking) | ~inside)
    result = compare(motor, walking)
    selected = int(inside.sum())
    result.update({
        "selected_pixel_centres": selected,
        "neither_valid": selected - result["both_valid"]
                         - result["only_motorized_valid"] - result["only_walking_valid"],
    })
    return result


def coverage(motor, walking, polygon):
    empty = {key: "" for key in summarize(
        np.ma.array([], dtype=float), np.ma.array([], dtype=float), np.array([], dtype=bool))}
    # Geographic wrapping requires a separate split, never a world-spanning polygon.
    if not polygon.is_valid or polygon.bounds[2] - polygon.bounds[0] > 180:
        return {"status": "geometry_review", **empty}
    try:
        full = geometry_window(motor, [polygon], boundless=True)
        window = full.intersection(rasterio.windows.Window(0, 0, motor.width, motor.height))
    except WindowError:
        return {"status": "outside_raster", **empty}
    inside = geometry_mask([polygon], out_shape=(int(window.height), int(window.width)),
                           transform=motor.window_transform(window), invert=True, all_touched=False)
    result = summarize(motor.read(1, window=window, masked=True),
                       walking.read(1, window=window, masked=True), inside)
    status = "has_valid_pixels" if result["both_valid"] else "no_valid_pixels"
    if result["selected_pixel_centres"] == 0:
        status = "no_pixel_centres"
    if full != window:
        status = "partially_outside_raster"
    return {"status": status, **result}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fua", required=True, type=Path)
    parser.add_argument("--motorized", required=True, type=Path)
    parser.add_argument("--walking", required=True, type=Path)
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    provenance = json.loads((folder / "cci-global-candidates-r2019a.provenance.json").read_text())
    raster_audit = json.loads((folder / "cci-healthcare-raster-audit.json").read_text())
    for label, path in [("motorized", args.motorized), ("walking", args.walking)]:
        if digest(path) != raster_audit["rasters"][label]["sha256"]:
            raise ValueError("Raster input checksum mismatch")
    fuas, repairs = load(args.fua, FUA_TABLE, "eFUA_ID", "eFUA_name", provenance["geoPackageSha256"])
    if len(fuas) != provenance["rowCount"]:
        raise ValueError("Candidate count mismatch")
    project = pyproj.Transformer.from_crs("ESRI:54009", "EPSG:4326", always_xy=True).transform
    rows = []
    with rasterio.open(args.motorized) as motor, rasterio.open(args.walking) as walking:
        if (motor.crs, motor.transform, motor.shape) != (walking.crs, walking.transform, walking.shape):
            raise ValueError("Grid mismatch")
        for identifier, name, polygon in fuas:
            geographic = transform(project, shapely.segmentize(polygon, 1000))
            rows.append({"efua_id": identifier, "source_name": name,
                         **coverage(motor, walking, geographic)})
    output = folder / "cci-healthcare-efua-coverage.csv"
    write_csv(output, rows)
    summary = {
        "scope": "Pixel-centre coverage audit, not population or area weighted, no CCI scores.",
        "candidateCount": len(rows), "statusCounts": dict(Counter(r["status"] for r in rows)),
        "candidatesWithWalkingFasterOver1Minute": sum(
            isinstance(r["walking_faster_by_over_1_minute"], int) and r["walking_faster_by_over_1_minute"] > 0
            for r in rows),
        "candidatesWithMissingCells": sum(isinstance(r["neither_valid"], int) and r["neither_valid"] > 0
                                           for r in rows),
        "fuaSha256": provenance["geoPackageSha256"],
        "rasterSha256": {key: value["sha256"] for key, value in raster_audit["rasters"].items()},
        "scriptSha256": digest(Path(__file__)), "csvSha256": digest(output),
        "helperSha256": {name: digest(Path(__file__).with_name(name)) for name in
                         ("cci_global_crosswalk.py", "cci_healthcare_raster_audit.py")},
        "boundaryMethod": "Segmentize Mollweide edges at 1000 m; transform always_xy to EPSG:4326; select pixel centres.",
        "geometryRepairs": repairs, "rasterioVersion": rasterio.__version__,
        "pyprojVersion": pyproj.__version__, "shapelyVersion": shapely.__version__,
    }
    (folder / "cci-healthcare-efua-coverage.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2, allow_nan=False) + "\n")
    print({key: summary[key] for key in ("candidateCount", "statusCounts", "candidatesWithWalkingFasterOver1Minute")})


if __name__ == "__main__":
    main()
