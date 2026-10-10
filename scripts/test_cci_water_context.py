import unittest

from cci_water_context import aggregates, complete, links


class WaterContextTest(unittest.TestCase):
    def test_missing_and_zero_remain_distinct_and_aggregates_excluded(self):
        countries = [{"id": "AAA", "iso2Code": "AA", "name": "Example", "region": {"id": "R"}},
                     {"id": "HIC", "iso2Code": "XD", "name": "High income", "region": {"id": "NA"}}]
        base = {"countryiso3code": "AAA", "country": {"id": "AA"}, "date": "2024"}
        rows = [{**base, "indicator": {"id": "SH.H2O.SMDW.UR.ZS"}, "value": None},
                {**base, "indicator": {"id": "SH.H2O.BASW.UR.ZS"}, "value": 0},
                {**base, "countryiso3code": "", "country": {"id": "XD"},
                 "indicator": {"id": "SH.H2O.SMDW.UR.ZS"}, "value": 99}]
        result = aggregates(rows, countries)
        self.assertEqual(len(result), 2)
        mapped = links([{"efua_id": "1", "source_name": "Example", "country_iso": "AAA"}], result)[0]
        self.assertEqual(mapped["available_indicators"], 1)
        self.assertEqual(mapped["safely_managed_context_ref"], "")
        self.assertTrue(mapped["at_least_basic_context_ref"])
        with self.assertRaises(ValueError):
            aggregates(rows + [rows[0]], countries)
        with self.assertRaises(ValueError):
            aggregates([{**rows[0], "value": float("nan")}], countries)

    def test_incomplete_pagination_is_rejected(self):
        with self.assertRaises(ValueError):
            complete([{"page": 1, "pages": 2, "total": 2}, [{}]])


if __name__ == "__main__":
    unittest.main()
