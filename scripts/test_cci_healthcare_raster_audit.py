import tempfile
import unittest
from pathlib import Path

import numpy as np
import rasterio
from rasterio.transform import from_origin

from cci_healthcare_raster_audit import audit, compare, counts


class HealthcareRasterAuditTest(unittest.TestCase):
    def test_missing_nonfinite_negative_and_zero_are_distinct(self):
        values = np.ma.array([0., 10., -1., np.nan, -9999.], mask=[0, 0, 0, 0, 1])
        self.assertEqual(counts(values), {
            "pixels": 5, "masked": 1, "nonfinite_unmasked": 1,
            "negative_unmasked": 1, "zero_unmasked": 1, "valid_nonnegative": 2,
        })

    def test_comparison_does_not_convert_missing_to_zero(self):
        motor = np.ma.array([0., 10., 8., -1.], mask=[0, 0, 1, 0])
        walking = np.ma.array([0., 5., 10., 2.], mask=False)
        self.assertEqual(compare(motor, walking), {
            "both_valid": 2, "only_motorized_valid": 0,
            "only_walking_valid": 2, "walking_less_than_motorized": 1,
            "walking_faster_by_over_1_minute": 1, "walking_faster_by_over_60_minutes": 0,
        })

    def test_shifted_grid_is_rejected(self):
        with tempfile.TemporaryDirectory() as folder:
            paths = [Path(folder) / name for name in ("motor.tif", "walking.tif")]
            for offset, path in enumerate(paths):
                with rasterio.open(path, "w", driver="GTiff", height=1, width=1, count=1,
                                   dtype="float32", crs="EPSG:4326",
                                   transform=from_origin(offset, 1, 1, 1)) as dest:
                    dest.write(np.array([[1.]], dtype="float32"), 1)
            with self.assertRaisesRegex(ValueError, "same grid"):
                audit(*paths)

    def test_geotiff_nodata_survives_full_audit(self):
        with tempfile.TemporaryDirectory() as folder:
            paths = [Path(folder) / name for name in ("motor.tif", "walking.tif")]
            for path, values in zip(paths, ([0., -9999.], [5., 10.])):
                with rasterio.open(path, "w", driver="GTiff", height=1, width=2, count=1,
                                   dtype="float32", crs="EPSG:4326", nodata=-9999.,
                                   transform=from_origin(0, 1, 1, 1)) as dest:
                    dest.write(np.array([values], dtype="float32"), 1)
            result = audit(*paths)
            self.assertEqual(result["rasters"]["motorized"]["counts"]["masked"], 1)
            self.assertEqual(result["rasters"]["motorized"]["minimum_nonnegative"], 0.)
            self.assertEqual(result["rasters"]["walking"]["maximum_nonnegative"], 10.)
            self.assertEqual(result["comparison"]["only_walking_valid"], 1)


if __name__ == "__main__":
    unittest.main()
