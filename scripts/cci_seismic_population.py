"""Summarize native 2025 population against GEM 2023.1 PGA; no CCI scores."""

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


def weighted(pop, hazard, inside):
    valid_pop = inside & ~np.ma.getmaskarray(pop) & np.isfinite(pop.data) & (pop.data >= 0)
    observed = valid_pop & ~np.ma.getmaskarray(hazard) & np.isfinite(hazard.data) & (hazard.data >= 0)
    total = float(pop.data[valid_pop].sum(dtype=np.float64))
    covered = float(pop.data[observed].sum(dtype=np.float64))
    missing = float(pop.data[valid_pop & ~observed].sum(dtype=np.float64))
    return {
        "selected_population_cells": int(inside.sum()),
        "unknown_population_cells": int((inside & ~valid_pop).sum()),
        "known_projected_population": total,
        "pga_observed_population": covered,
        "pga_missing_population": missing,
        "pga_observed_population_share": covered / total if total > 0 else "",
        "mean_pga_g_among_observed":
            float(np.sum(pop.data[observed] * hazard.data[observed], dtype=np.float64) / covered)
            if covered > 0 else "",
        "population_at_source_zero_pga": float(pop.data[observed & (hazard.data == 0)].sum(dtype=np.float64)),
    }


def zone(population, hazard, polygon):
    empty = {k: "" for k in weighted(np.ma.array([], dtype=float), np.ma.array([], dtype=float),
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
                      hazard.read(1, window=window, masked=True), inside)
    status = "partial_seismic_hazard_model"
    if result["known_projected_population"] == 0:
        status = "population_unavailable" if result["unknown_population_cells"] else "zero_selected_population"
    elif result["pga_observed_population"] == 0:
        status = "no_observed_hazard_population"
    if full != window:
        status = "partially_outside_population_raster"
    return {"status": status, **result}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ("fua", "population", "hazard"):
        parser.add_argument("--" + name, required=True, type=Path)
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    pop_source = json.loads((folder / "cci-healthcare-population-source.json").read_text())
    hazard_source = json.loads((folder / "cci-seismic-source.json").read_text())
    fua_source = json.loads((folder / "cci-global-candidates-r2019a.provenance.json").read_text())
    for path, expected in ((args.population, pop_source["sha256"]),
                           (args.hazard, hazard_source["memberSha256"]["v2023_1_pga_475_rock_3min.tif"])):
        if digest(path) != expected:
            raise ValueError("Source checksum mismatch")
    fuas, _ = load(args.fua, FUA_TABLE, "eFUA_ID", "eFUA_name", fua_source["geoPackageSha256"])
    if len(fuas) != fua_source["rowCount"]:
        raise ValueError("Candidate count mismatch")
    project = pyproj.Transformer.from_crs("ESRI:54009", "EPSG:4326", always_xy=True).transform
    rows = []
    with rasterio.open(args.population) as population, rasterio.open(args.hazard) as source:
        if population.crs.to_epsg() != 4326 or source.crs.to_epsg() != 4326 or population.count != 1 or source.count != 1:
            raise ValueError("Expected geographic single-band inputs")
        with WarpedVRT(source, crs=population.crs, transform=population.transform,
                       width=population.width, height=population.height,
                       resampling=Resampling.nearest, nodata=float("nan")) as hazard:
            for identifier, name, polygon in fuas:
                geographic = transform(project, shapely.segmentize(polygon, 1000))
                rows.append({"efua_id": identifier, "source_name": name,
                             **zone(population, hazard, geographic)})
    output = folder / "cci-seismic-efua-population.csv"
    write_csv(output, rows)
    summary = {
        "scope": "2025 projected population sampled against 2023.1 reference-rock PGA model, not losses or scores.",
        "candidateCount": len(rows), "statusCounts": dict(Counter(r["status"] for r in rows)),
        "candidatesWithMissingHazardPopulation": sum(isinstance(r["pga_missing_population"], float) and r["pga_missing_population"] > 0 for r in rows),
        "method": "Native population cell centres inside 1000m-densified eFUA boundaries. PGA nearest-neighbour sampled with actual source transform. Masked, nonfinite and negative values excluded; conditional mean covers only known population with finite nonnegative PGA. Source zeros retained separately, not interpreted as guaranteed safety.",
        "limitations": "Whole-cell population allocation and coarse hazard sampling approximate small/coastal areas. Unknown population is excluded from the denominator but counted as cells. No MMI conversion, soil amplification, building fragility or damage inference.",
        "sourceLicense": hazard_source["license"],
        "scriptSha256": digest(Path(__file__)), "helperSha256": digest(Path(__file__).with_name("cci_global_crosswalk.py")),
        "csvSha256": digest(output), "fuaSha256": fua_source["geoPackageSha256"],
        "populationSha256": pop_source["sha256"], "hazardSha256": digest(args.hazard),
        "rasterioVersion": rasterio.__version__, "gdalVersion": rasterio.__gdal_version__,
        "pyprojVersion": pyproj.__version__, "shapelyVersion": shapely.__version__,
    }
    (folder / "cci-seismic-efua-population.json").write_text(json.dumps(summary, indent=2, allow_nan=False) + "\n")
    print(summary["statusCounts"])


if __name__ == "__main__":
    main()
