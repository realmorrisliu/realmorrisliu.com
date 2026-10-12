import unittest

import numpy as np
from rasterio.io import MemoryFile
from rasterio.transform import from_origin
from shapely.geometry import box, Polygon

from cci_wup_population_coverage import coverage, zone


class PopulationCoverageTests(unittest.TestCase):
    def test_known_only_partition_retains_missingness_and_source_zero(self):
        values = np.ma.array([10, 90, -200, float('nan'), 0, 500],
                             mask=[False, False, True, False, False, False])
        result = coverage(values, np.array([True, True, True, True, True, False]),
                          np.array([True, False, True, True, True, True]))
        self.assertEqual(result['known_projected_population'], 100)
        self.assertEqual(result['known_population_inside_old_frame'], 10)
        self.assertEqual(result['known_population_outside_old_frame'], 90)
        self.assertEqual(result['unknown_population_cells'], 2)
        self.assertEqual(result['old_frame_share_among_known_population'], 0.1)
        self.assertEqual(coverage(np.ma.array([0.0]), np.array([True]), np.array([True]))['old_frame_share_among_known_population'], '')
        with self.assertRaises(ValueError):
            coverage(values, np.array([True]), np.array([True]))
        with np.errstate(over='ignore'), self.assertRaises(ValueError):
            coverage(np.ma.array([1e308, 1e308]), np.array([True, True]), np.array([True, True]))

    def test_native_grid_coverage_is_not_area_fraction(self):
        with MemoryFile() as memory:
            with memory.open(driver='GTiff', height=2, width=2, count=1,
                             dtype='float64', crs='EPSG:4326', nodata=-200,
                             transform=from_origin(0, 2, 1, 1)) as dataset:
                dataset.write(np.array([[10., 90.], [10., 90.]]), 1)
                result = zone(dataset, box(0, 0, 2, 2), box(0, 0, 1, 2))
                self.assertEqual(result['status'], 'partial_projected_population_coverage')
                self.assertEqual(result['old_frame_share_among_known_population'], 0.1)
                self.assertEqual(result['known_population_outside_old_frame'], 180)
                empty = zone(dataset, box(0, 0, 2, 2), Polygon())
                self.assertEqual(empty['known_population_inside_old_frame'], 0)
                self.assertEqual(empty['known_population_outside_old_frame'], 200)

    def test_unavailable_and_outside_geometry_are_not_zero_coverage(self):
        with MemoryFile() as memory:
            with memory.open(driver='GTiff', height=2, width=2, count=1,
                             dtype='float64', crs='EPSG:4326', nodata=-200,
                             transform=from_origin(0, 2, 1, 1)) as dataset:
                dataset.write(np.full((2, 2), -200.), 1)
                result = zone(dataset, box(0, 0, 2, 2), box(0, 0, 1, 2))
                self.assertEqual(result['status'], 'population_unavailable')
                self.assertEqual(result['unknown_population_cells'], 4)
                self.assertEqual(result['old_frame_share_among_known_population'], '')
                outside = zone(dataset, box(10, 10, 11, 11), Polygon())
                self.assertEqual(outside['status'], 'outside_population_raster')
                self.assertEqual(outside['known_population_outside_old_frame'], '')
                wrapped = zone(dataset, box(-179, 0, 179, 1), Polygon())
                self.assertEqual(wrapped['status'], 'geometry_review')
                clipped = zone(dataset, box(-1, -1, 3, 3), Polygon())
                self.assertEqual(clipped['status'], 'partially_outside_population_raster')


if __name__ == '__main__':
    unittest.main()
