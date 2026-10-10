import unittest

from cci_ucdb_field_audit import conflicts, profile


class FieldAuditTest(unittest.TestCase):
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
