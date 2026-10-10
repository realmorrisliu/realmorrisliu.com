"""Verify the frozen GEM archive and audit its native PGA raster without scoring."""

import argparse
import hashlib
import json
import zipfile
from pathlib import Path

import numpy as np
import rasterio
from rasterio.windows import Window

from cci_global_crosswalk import ROOT, digest
from cci_healthcare_raster_audit import counts, metadata


def verify_archive(path, source):
    if path.stat().st_size != source["size"]:
        raise ValueError("Archive size mismatch")
    with path.open("rb") as stream:
        actual = "md5:" + hashlib.file_digest(stream, "md5").hexdigest()
    if actual != source["checksum"]:
        raise ValueError("Publisher checksum mismatch")
    with zipfile.ZipFile(path) as archive:
        if archive.testzip() is not None:
            raise ValueError("Archive CRC failure")
        members = [name for name in archive.namelist() if name.lower().endswith((".tif", ".tiff"))]
        if len(members) != 1:
            raise ValueError("Expected one unambiguous PGA raster")
        return members[0]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / "docs/data"
    source_path = folder / "cci-seismic-source.json"
    source = json.loads(source_path.read_text())
    member = verify_archive(args.archive, source["file"])
    with rasterio.open(f"zip://{args.archive.resolve()}!{member}") as src:
        result = {**metadata(src), "counts": {}, "minimum": None, "maximum": None}
        for row in range(0, src.height, 128):
            values = src.read(1, window=Window(0, row, src.width, min(128, src.height-row)), masked=True)
            for key, value in counts(values).items():
                result["counts"][key] = result["counts"].get(key, 0) + value
            valid = values.compressed()
            valid = valid[np.isfinite(valid) & (valid >= 0)]
            if valid.size:
                result["minimum"] = float(valid.min()) if result["minimum"] is None else min(result["minimum"], float(valid.min()))
                result["maximum"] = float(valid.max()) if result["maximum"] is None else max(result["maximum"], float(valid.max()))
        assert result["counts"]["pixels"] == src.width * src.height
    result.update({"archiveSha256": digest(args.archive), "rasterMember": member,
                   "sourceManifestSha256": digest(source_path), "scriptSha256": digest(Path(__file__)),
                   "helperSha256": digest(Path(__file__).with_name("cci_healthcare_raster_audit.py")),
                   "rasterioVersion": rasterio.__version__, "gdalVersion": rasterio.__gdal_version__,
                   "scope": "Native PGA raster integrity only; no population, MMI, damage or CCI score inference."})
    output = folder / "cci-seismic-raster-audit.json"
    output.write_text(json.dumps(result, indent=2, allow_nan=False) + "\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
