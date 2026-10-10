import unittest

from pyproj import Transformer
from shapely import STRtree, box

from cci_ucdp_exposure import locate, fatalities


class EventLocationTest(unittest.TestCase):
    def test_inconsistent_fatalities_not_reordered_or_imputed(self):
        self.assertEqual(fatalities({"low": "0", "best": "2", "high": "3"}), (0, 2, 3))
        self.assertIsNone(fatalities({"low": "3", "best": "2", "high": "4"}))
        self.assertIsNone(fatalities({"low": "0", "best": "0", "high": "0"}))

    def setUp(self):
        self.row = {"date_start": "2025-01-01", "date_end": "2025-01-01", "where_prec": "1", "longitude": "1", "latitude": "1"}
        self.tree = STRtree([box(0, 0, 2, 2), box(2, 0, 4, 2)])

    def test_ambiguous_border_not_assigned_twice(self):
        self.assertEqual(locate(self.row, self.tree, lambda x, y: (x, y)), ("assigned", [0]))
        self.row["longitude"] = "2"
        self.assertEqual(locate(self.row, self.tree, lambda x, y: (x, y)), ("ambiguous_boundary", [0, 1]))

    def test_coarse_location_and_cross_window_are_not_precise_evidence(self):
        self.row["where_prec"] = "2"
        self.assertEqual(locate(self.row, self.tree, lambda x, y: (x, y))[0], "coarse_location")
        self.row["date_end"] = "2026-01-01"
        self.assertEqual(locate(self.row, self.tree, lambda x, y: (x, y))[0], "crosses_window")

    def test_projection_roundtrip_and_invalid_coordinates(self):
        forward = Transformer.from_crs("EPSG:4326", "ESRI:54009", always_xy=True)
        reverse = Transformer.from_crs("ESRI:54009", "EPSG:4326", always_xy=True)
        lon, lat = reverse.transform(*forward.transform(121.5, 31.2))
        self.assertAlmostEqual(lon, 121.5)
        self.assertAlmostEqual(lat, 31.2)
        self.row["longitude"] = "nan"
        with self.assertRaises(ValueError):
            locate(self.row, self.tree, forward.transform)


if __name__ == "__main__":
    unittest.main()
