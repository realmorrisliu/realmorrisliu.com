"""Audit the two MAP healthcare rasters; no population aggregation or CCI scores."""

import argparse
import json
from pathlib import Path

import numpy as np
import rasterio
from rasterio.windows import Window

from cci_global_crosswalk import digest

ROOT = Path(__file__).resolve().parents[1]


def counts(values):
    mask = np.ma.getmaskarray(values)
    data = np.asarray(values)
    finite = ~mask & np.isfinite(data)
    return {
        "pixels": int(data.size),
        "masked": int(mask.sum()),
        "nonfinite_unmasked": int((~mask & ~np.isfinite(data)).sum()),
        "negative_unmasked": int((finite & (data < 0)).sum()),
        "zero_unmasked": int((finite & (data == 0)).sum()),
        "valid_nonnegative": int((finite & (data >= 0)).sum()),
    }


def compare(motor, walking):
    valid_m = ~np.ma.getmaskarray(motor) & np.isfinite(motor.data) & (motor.data >= 0)
    valid_w = ~np.ma.getmaskarray(walking) & np.isfinite(walking.data) & (walking.data >= 0)
    both = valid_m & valid_w
    return {
        "both_valid": int(both.sum()),
        "only_motorized_valid": int((valid_m & ~valid_w).sum()),
        "only_walking_valid": int((valid_w & ~valid_m).sum()),
        "walking_less_than_motorized": int((both & (walking.data < motor.data)).sum()),
        "walking_faster_by_over_1_minute": int((both & (motor.data - walking.data > 1)).sum()),
        "walking_faster_by_over_60_minutes": int((both & (motor.data - walking.data > 60)).sum()),
    }


def metadata(src):
    if src.count != 1 or src.crs is None:
        raise ValueError("Expected one georeferenced travel-time band")
    return {
        "width": src.width, "height": src.height, "crs": str(src.crs),
        "bounds": list(src.bounds), "transform": list(src.transform),
        "dtype": src.dtypes[0], "nodata": src.nodata,
        "units": list(src.units), "tags": src.tags(), "bandTags": src.tags(1),
    }


def audit(motor_path, walking_path):
    result = {"rasters": {}, "comparison": {}}
    with rasterio.open(motor_path) as motor, rasterio.open(walking_path) as walking:
        for label, src, path in [("motorized", motor, motor_path), ("walking", walking, walking_path)]:
            result["rasters"][label] = {
                "file": path.name, "sha256": digest(path), **metadata(src), "counts": {},
                "minimum_nonnegative": None, "maximum_nonnegative": None,
            }
        if (motor.crs, motor.transform, motor.shape) != (walking.crs, walking.transform, walking.shape):
            raise ValueError("Rasters do not share the same grid; no implicit resampling")
        for row in range(0, motor.height, 128):
            window = Window(0, row, motor.width, min(128, motor.height - row))
            m, w = motor.read(1, window=window, masked=True), walking.read(1, window=window, masked=True)
            for label, values in [("motorized", m), ("walking", w)]:
                item = result["rasters"][label]
                for key, value in counts(values).items():
                    item["counts"][key] = item["counts"].get(key, 0) + value
                valid = values.compressed()
                valid = valid[np.isfinite(valid) & (valid >= 0)]
                if valid.size:
                    for key, value, operation in [
                        ("minimum_nonnegative", float(valid.min()), min),
                        ("maximum_nonnegative", float(valid.max()), max),
                    ]:
                        item[key] = value if item[key] is None else operation(item[key], value)
            for key, value in compare(m, w).items():
                result["comparison"][key] = result["comparison"].get(key, 0) + value
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--motorized", required=True, type=Path)
    parser.add_argument("--walking", required=True, type=Path)
    args = parser.parse_args()
    result = audit(args.motorized, args.walking)
    result.update({
        "scriptSha256": digest(Path(__file__)),
        "rasterioVersion": rasterio.__version__, "gdalVersion": rasterio.__gdal_version__,
        "numpyVersion": np.__version__,
        "scope": "Raster integrity only; pixel counts are not resident coverage or CCI scores.",
    })
    output = ROOT / "docs/data/cci-healthcare-raster-audit.json"
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False) + "\n")
    print(output)


if __name__ == "__main__":
    main()
