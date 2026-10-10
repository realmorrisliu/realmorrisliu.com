import unittest

from cci_ucdb_field_audit import conflicts, connectivity_zero_devices, profile, seismic_partition


class FieldAuditTest(unittest.TestCase):
    def test_seismic_zero_share_requires_population_partition(self):
        rows = [(1, 100, 0, *([0] * 9)),
                (2, 100, 0, 100, *([0] * 8)),
                (3, 100, 50, 50, 0, 0, 0, 50, 0, 0, 0, 0),
                (4, 100, 80, 50, 0, 0, 0, 50, 0, 0, 0, 0)]
        self.assertEqual(seismic_partition(rows), {
            "unclassifiedPopulationIds": [1], "partitionMismatchIds": [1],
            "shareMismatchIds": [4],
        })
        for invalid in (None, float("nan"), -1):
            with self.assertRaises(ValueError):
                seismic_partition([(1, 100, 0, invalid, *([0] * 8))])

    def test_zero_devices_does_not_create_performance_evidence(self):
        rows = [(1, 0, 0, 0, 0), (2, None, None, None, None),
                (3, 20, 10, 0, 5), (4, 20, 10, 5, 0), (5, 20, 10, 5, None)]
        self.assertEqual(connectivity_zero_devices(rows), {
            "allFourZeroIds": [1],
            "positiveSpeedWithoutPositiveDevicesIds": [4, 5],
        })

    def test_zero_missing_text_and_nonfinite_remain_distinct(self):
        result = profile([None, "", "unknown", 0, -2, 7, float("inf")])
        self.assertEqual(result["null_count"], 1)
        self.assertEqual(result["blank_text_count"], 1)
        self.assertEqual(result["text_count"], 2)
        self.assertEqual(result["zero_count"], 1)
        self.assertEqual(result["negative_count"], 1)
        self.assertEqual(result["nonfinite_numeric_count"], 1)
        self.assertEqual(result["minimum"], -2)
        self.assertEqual(result["maximum"], 7)

    def test_conflicting_duplicate_not_silently_deduplicated(self):
        result = conflicts(["id", "value"], [(1, 10), (1, 20), (2, 0), (2, 0)])
        self.assertEqual(result, [
            {"id": 1, "rowCount": 2, "differentFields": {"value": [10, 20]}},
            {"id": 2, "rowCount": 2, "differentFields": {}},
        ])


if __name__ == "__main__":
    unittest.main()
