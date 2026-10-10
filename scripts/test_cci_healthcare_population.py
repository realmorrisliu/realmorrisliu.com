import unittest
import numpy as np
from rasterio.io import MemoryFile
from rasterio.transform import from_origin
from rasterio.vrt import WarpedVRT
from rasterio.enums import Resampling
from shapely.geometry import box
from cci_healthcare_population import weighted, zone


class PopulationWeightTest(unittest.TestCase):
    def test_missing_travel_gives_bounds_not_zero(self):
        result = weighted(np.ma.array([100., 900.]), np.ma.array([30., -9999.], mask=[0, 1]),
                          np.ma.array([90., 120.]), np.array([True, True]))
        self.assertEqual(result["motorized_mean_minutes_among_observed"], 30.)
        self.assertEqual(result["motorized_within_60_share_lower"], .1)
        self.assertEqual(result["motorized_within_60_share_upper"], 1.)
        self.assertEqual(result["walking_mean_minutes_among_observed"], 117.)

    def test_unknown_population_and_outside_do_not_become_residents(self):
        pop = np.ma.array([50., -200., 1000., 0.], mask=[0, 1, 0, 0])
        travel = np.ma.array([0., 0., 0., 0.])
        result = weighted(pop, travel, travel, np.array([True, True, False, True]))
        self.assertEqual(result["known_projected_population"], 50.)
        self.assertEqual(result["unknown_population_cells"], 1)
        self.assertEqual(result["motorized_within_60_share_lower"], 1.)

    def test_no_population_has_no_mean_or_share(self):
        result = weighted(np.ma.array([0.]), np.ma.array([10.]), np.ma.array([20.]), np.array([True]))
        self.assertEqual(result["motorized_mean_minutes_among_observed"], "")
        self.assertEqual(result["motorized_within_60_share_lower"], "")

    def test_shifted_grid_samples_travel_without_resampling_population(self):
        with MemoryFile() as pfile, MemoryFile() as tfile:
            with pfile.open(driver="GTiff", width=2, height=1, count=1, dtype="float64",
                            crs="EPSG:4326", transform=from_origin(.6, 1, 1, 1), nodata=-200) as p:
                p.write(np.array([[100., 200.]]), 1)
            with tfile.open(driver="GTiff", width=3, height=1, count=1, dtype="float32",
                            crs="EPSG:4326", transform=from_origin(0, 1, 1, 1), nodata=-9999) as t:
                t.write(np.array([[10., -9999., 100.]], dtype="float32"), 1)
            with pfile.open() as p, tfile.open() as t:
                with WarpedVRT(t, crs=p.crs, transform=p.transform, width=p.width, height=p.height,
                               resampling=Resampling.nearest, nodata=-9999) as travel:
                    result = zone(p, travel, travel, box(.6, 0, 2.6, 1))
                    self.assertEqual(result["known_projected_population"], 300.)
                    self.assertEqual(result["motorized_missing_population"], 100.)
                    self.assertEqual(result["motorized_mean_minutes_among_observed"], 100.)


if __name__ == "__main__":
    unittest.main()
