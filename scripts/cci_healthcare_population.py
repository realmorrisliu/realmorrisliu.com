"""Weight historical healthcare travel times on the native projected-population grid."""

import argparse
import json
from collections import Counter
from pathlib import Path

import numpy as np
import pyproj
import rasterio
import shapely
from rasterio.enums import Resampling
from rasterio.errors import WindowError
from rasterio.features import geometry_mask, geometry_window
from rasterio.vrt import WarpedVRT
from shapely.ops import transform

from cci_global_crosswalk import FUA_TABLE, ROOT, digest, load, write_csv


def weighted(pop, motor, walking, inside):
    valid_pop = inside & ~np.ma.getmaskarray(pop) & np.isfinite(pop.data) & (pop.data >= 0)
    total = float(pop.data[valid_pop].sum(dtype=np.float64))
    result = {"selected_population_cells": int(inside.sum()),
              "unknown_population_cells": int((inside & ~valid_pop).sum()),
              "known_projected_population": total}
    masks = []
    for label, travel in [("motorized", motor), ("walking", walking)]:
        observed = valid_pop & ~np.ma.getmaskarray(travel) & np.isfinite(travel.data) & (travel.data >= 0)
        observed_pop = float(pop.data[observed].sum(dtype=np.float64))
        missing_pop = float(pop.data[valid_pop & ~observed].sum(dtype=np.float64))
        within = float(pop.data[observed & (travel.data <= 60)].sum(dtype=np.float64))
        result.update({
            f"{label}_observed_population": observed_pop,
            f"{label}_missing_population": missing_pop,
            f"{label}_within_60_minutes_population": within,
            f"{label}_mean_minutes_among_observed":
                float(np.sum(pop.data[observed] * travel.data[observed], dtype=np.float64) / observed_pop)
                if observed_pop > 0 else "",
            f"{label}_within_60_share_lower": within / total if total > 0 else "",
            f"{label}_within_60_share_upper": (within + missing_pop) / total if total > 0 else "",
        })
        masks.append(observed)
    different = masks[0] & masks[1] & (motor.data - walking.data > 1)
    result["walking_faster_over_1_minute_population"] = float(pop.data[different].sum(dtype=np.float64))
    return result


def zone(population, motor, walking, polygon):
    empty = {k: "" for k in weighted(*(np.ma.array([], dtype=float) for _ in range(3)),
                                      np.array([], dtype=bool))}
    if not polygon.is_valid or polygon.bounds[2] - polygon.bounds[0] > 180:
        return {"status": "geometry_review", **empty}
    try:
        full = geometry_window(population, [polygon], boundless=True)
        window = full.intersection(rasterio.windows.Window(0, 0, population.width, population.height))
    except WindowError:
        return {"status": "outside_population_raster", **empty}
    inside = geometry_mask([polygon], out_shape=(int(window.height), int(window.width)),
                           transform=population.window_transform(window), invert=True, all_touched=False)
    result = weighted(population.read(1, window=window, masked=True),
                      motor.read(1, window=window, masked=True),
                      walking.read(1, window=window, masked=True), inside)
    status = "partial_travel_evidence"
    if result["known_projected_population"] == 0:
        status = "population_unavailable" if result["unknown_population_cells"] else "zero_selected_population"
    if result["known_projected_population"] > 0 and result["motorized_observed_population"] == 0:
        status = "no_observed_motorized_population"
    if full != window:
        status = "partially_outside_population_raster"
    return {"status": status, **result}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for arg in ("fua", "population", "motorized", "walking"):
        parser.add_argument("--" + arg, required=True, type=Path)
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    pop_source = json.loads((folder / "cci-healthcare-population-source.json").read_text())
    audit = json.loads((folder / "cci-healthcare-raster-audit.json").read_text())
    fua_source = json.loads((folder / "cci-global-candidates-r2019a.provenance.json").read_text())
    for path, expected in [(args.population, pop_source["sha256"]),
                           (args.motorized, audit["rasters"]["motorized"]["sha256"]),
                           (args.walking, audit["rasters"]["walking"]["sha256"])]:
        if digest(path) != expected:
            raise ValueError("Source checksum mismatch")
    fuas, _ = load(args.fua, FUA_TABLE, "eFUA_ID", "eFUA_name", fua_source["geoPackageSha256"])
    if len(fuas) != fua_source["rowCount"]:
        raise ValueError("Candidate count mismatch")
    project = pyproj.Transformer.from_crs("ESRI:54009", "EPSG:4326", always_xy=True).transform
    rows = []
    with rasterio.open(args.population) as population, rasterio.open(args.motorized) as m, rasterio.open(args.walking) as w:
        if population.crs.to_epsg() != 4326 or population.count != 1:
            raise ValueError("Expected geographic single-band population")
        options = dict(crs=population.crs, transform=population.transform, width=population.width,
                       height=population.height, resampling=Resampling.nearest, nodata=-9999.)
        with WarpedVRT(m, **options) as motor, WarpedVRT(w, **options) as walking:
            for identifier, name, polygon in fuas:
                geographic = transform(project, shapely.segmentize(polygon, 1000))
                rows.append({"efua_id": identifier, "source_name": name,
                             **zone(population, motor, walking, geographic)})
    output = folder / "cci-healthcare-efua-population.csv"
    write_csv(output, rows)
    summary = {
        "scope": "2025 projected population on 2019 healthcare model; no CCI scores or current clinical claims.",
        "candidateCount": len(rows), "statusCounts": dict(Counter(r["status"] for r in rows)),
        "candidatesWithMissingMotorizedPopulation": sum(
            isinstance(r["motorized_missing_population"], float) and r["motorized_missing_population"] > 0 for r in rows),
        "candidatesWithOver1PercentMissingMotorizedPopulation": sum(
            isinstance(r["known_projected_population"], float) and
            r["motorized_missing_population"] > .01 * r["known_projected_population"] for r in rows),
        "candidatesWithPopulatedWalkingFasterCells": sum(
            isinstance(r["walking_faster_over_1_minute_population"], float) and
            r["walking_faster_over_1_minute_population"] > 0 for r in rows),
        "populationMethod": "Native population cell centres inside densified eFUA; population is not resampled.",
        "travelMethod": "Nearest source travel cell at each population centre, via GDAL WarpedVRT; NoData retained.",
        "missingBounds": "Bounds cover missing travel only among known selected population; not statistical confidence intervals.",
        "scriptSha256": digest(Path(__file__)), "helperSha256": digest(Path(__file__).with_name("cci_global_crosswalk.py")),
        "csvSha256": digest(output), "fuaSha256": fua_source["geoPackageSha256"],
        "populationSha256": pop_source["sha256"],
        "rasterSha256": {k: v["sha256"] for k, v in audit["rasters"].items()},
        "rasterioVersion": rasterio.__version__, "gdalVersion": rasterio.__gdal_version__,
        "pyprojVersion": pyproj.__version__, "shapelyVersion": shapely.__version__,
    }
    (folder / "cci-healthcare-efua-population.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(summary["statusCounts"])


if __name__ == "__main__":
    main()
