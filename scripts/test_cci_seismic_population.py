import unittest

import numpy as np
from rasterio.io import MemoryFile
from rasterio.transform import from_origin
from rasterio.vrt import WarpedVRT
from shapely.geometry import box

from cci_seismic_population import weighted, zone


class SeismicPopulationTest(unittest.TestCase):
    def test_warp_does_not_turn_unmasked_nan_into_zero_hazard(self):
        with MemoryFile() as p, MemoryFile() as h:
            options = dict(driver="GTiff", width=2, height=2, count=1,
                           dtype="float64", crs="EPSG:4326", transform=from_origin(0, 2, 1, 1))
            with p.open(**options, nodata=-200) as pop, h.open(**options, nodata=np.finfo(float).max) as src:
                pop.write(np.ones((2, 2)), 1)
                src.write(np.array([[np.nan, .2], [0., .4]]), 1)
            with p.open() as pop, h.open() as src:
                with WarpedVRT(src, crs=pop.crs, transform=pop.transform, width=2, height=2,
                               nodata=float("nan")) as hazard:
                    result = zone(pop, hazard, box(0, 0, 2, 2))
            self.assertEqual(result["pga_missing_population"], 1)
            self.assertEqual(result["pga_observed_population"], 3)
            self.assertAlmostEqual(result["mean_pga_g_among_observed"], .2)

    def test_unmasked_nan_and_unknown_population_do_not_enter_mean(self):
        pop = np.ma.array([10., 30., 20., 100., 99.], mask=[0, 0, 0, 1, 0])
        hazard = np.ma.array([0., .4, np.nan, 1., 1.])
        result = weighted(pop, hazard, np.array([1, 1, 1, 1, 0], dtype=bool))
        self.assertEqual(result["known_projected_population"], 60)
        self.assertEqual(result["pga_missing_population"], 20)
        self.assertEqual(result["unknown_population_cells"], 1)
        self.assertAlmostEqual(result["mean_pga_g_among_observed"], .3)
        self.assertEqual(result["population_at_source_zero_pga"], 10)

    def test_missing_hazard_and_zero_population_leave_mean_blank(self):
        for pop in (np.ma.array([10.]), np.ma.array([0.])):
            result = weighted(pop, np.ma.array([np.nan]), np.array([True]))
            self.assertEqual(result["mean_pga_g_among_observed"], "")
        self.assertEqual(result["pga_observed_population_share"], "")


if __name__ == "__main__":
    unittest.main()
