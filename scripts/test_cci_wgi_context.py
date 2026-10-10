import unittest
from cci_wgi_context import aggregate, country_links


class WgiContextTest(unittest.TestCase):
    def test_negative_estimate_and_zero_score_are_valid(self):
        row = ["AAAge2025", "Example", "AAA", "", "", 2025, "ge", 2, -3., .2, -3.3, -2.7, 0., 2., 0., 4.]
        result = aggregate(row, "ge")
        self.assertEqual(result["score"], 0.)
        self.assertEqual(result["estimate"], -3.)
        row[9] = float("nan")
        with self.assertRaises(ValueError):
            aggregate(row, "ge")

    def test_missing_country_does_not_inherit_another_jurisdiction(self):
        candidates = [{"efua_id": "1", "source_name": "Example", "country_iso": "XNC"}]
        result = country_links(candidates, [{"source_id": "CYPge2025"}])[0]
        self.assertEqual(result["available_dimensions"], 0)
        self.assertEqual(result["ge_country_context_ref"], "")

    def test_verified_alias_and_duplicate_rejection(self):
        candidates = [{"efua_id": "1", "source_name": "Example", "country_iso": "XKO"}]
        source = {"source_id": "XKXge2025"}
        self.assertEqual(country_links(candidates, [source])[0]["ge_country_context_ref"], "XKXge2025")
        with self.assertRaises(ValueError):
            country_links(candidates, [source, source])


if __name__ == "__main__":
    unittest.main()
