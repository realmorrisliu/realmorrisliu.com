import unittest

import numpy as np
from rasterio.io import MemoryFile
from rasterio.transform import from_origin
from shapely.geometry import box

from cci_healthcare_fua_coverage import coverage, summarize


class HealthcareFuaCoverageTest(unittest.TestCase):
    def test_outside_pixels_do_not_count(self):
        motor = np.ma.array([0., 10., 20.], mask=[0, 1, 0])
        walking = np.ma.array([0., 30., 1.], mask=[0, 0, 0])
        result = summarize(motor, walking, np.array([True, True, False]))
        self.assertEqual(result["selected_pixel_centres"], 2)
        self.assertEqual(result["only_walking_valid"], 1)
        self.assertEqual(result["walking_less_than_motorized"], 0)

    def test_boundary_selection_missing_and_outside(self):
        with MemoryFile() as memory:
            with memory.open(driver="GTiff", width=2, height=2, count=1, dtype="float32",
                             crs="EPSG:4326", transform=from_origin(0, 2, 1, 1), nodata=-9999) as raster:
                raster.write(np.array([[1, -9999], [3, 4]], dtype="float32"), 1)
                result = coverage(raster, raster, box(0, 0, 2, 2))
                self.assertEqual(result["selected_pixel_centres"], 4)
                self.assertEqual(result["both_valid"], 3)
                self.assertEqual(result["neither_valid"], 1)
                self.assertEqual(coverage(raster, raster, box(3, 3, 4, 4))["status"], "outside_raster")
                self.assertEqual(coverage(raster, raster, box(-1, 0, 1, 2))["status"], "partially_outside_raster")
                self.assertEqual(coverage(raster, raster, box(.1, .1, .2, .2))["status"], "no_pixel_centres")


if __name__ == "__main__":
    unittest.main()
