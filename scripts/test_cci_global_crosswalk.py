import struct
import unittest

from shapely import STRtree, box, from_wkt, to_wkb, union_all, MultiPolygon

from cci_global_crosswalk import geometry, overlaps


class CrosswalkTest(unittest.TestCase):
    def test_header_validates_crs(self):
        polygon = box(0, 0, 2, 2)
        header = b"GP\x00\x01" + struct.pack("<i", 54009)
        self.assertTrue(geometry(header + to_wkb(polygon))[0].equals(polygon))
        with self.assertRaises(ValueError):
            geometry(b"GP\x00\x01" + struct.pack("<i", 4326) + to_wkb(polygon))
        with self.assertRaises(ValueError):
            geometry(b"invalid")

    def test_repair_is_recorded_and_changed_area_rejected(self):
        header = b"GP\x00\x01" + struct.pack("<i", 54009)
        ring = from_wkt("POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0, -1 0, -1 -1, 0 -1, 0 0))")
        repaired, audit = geometry(header + to_wkb(ring))
        self.assertTrue(repaired.is_valid)
        self.assertEqual(audit["originalAreaM2"], audit["repairedAreaM2"])
        with self.assertRaises(ValueError):
            geometry(header + to_wkb(MultiPolygon([box(0, 0, 2, 2), box(1, 0, 3, 2)])))

    def test_all_splits_retained_and_touch_excluded(self):
        fuas = [box(0, 0, 1, 1), box(1, 0, 2, 1), box(2, 0, 3, 1)]
        matches = list(overlaps(box(0, 0, 2, 1), STRtree(fuas), fuas))
        self.assertEqual([index for index, _ in matches], [0, 1])
        self.assertEqual(union_all([part for _, part in matches]).area, 2)
        self.assertEqual(list(overlaps(box(10, 0, 11, 1), STRtree(fuas), fuas)), [])

    def test_coverage_union_does_not_double_count(self):
        fuas = [box(0, 0, 2, 1), box(1, 0, 3, 1)]
        parts = [part for _, part in overlaps(box(0, 0, 3, 1), STRtree(fuas), fuas)]
        self.assertEqual(sum(part.area for part in parts), 4)
        self.assertEqual(union_all(parts).area, 3)


if __name__ == "__main__":
    unittest.main()
