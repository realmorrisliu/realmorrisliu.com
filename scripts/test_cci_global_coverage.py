import unittest

from cci_global_coverage import DIMENSIONS, inventory


def city(ids):
    return {
        "slug": "example",
        "boundary": {"eFuaIds": ids},
        "audit": {
            "boundaryReview": {"outcome": "unresolved"},
            "dimensions": [{"id": key, "outcome": "context_only", "sources": ["source"]} for key in DIMENSIONS],
        },
        "indicators": [{"owner": "PCS"}],
    }


class CoverageTest(unittest.TestCase):
    def setUp(self):
        self.candidates = [{"efua_id": str(i), "source_name": str(i), "country_iso": "AAA"} for i in (1, 2, 3)]

    def test_union_is_not_two_scored_cities_and_missing_is_not_zero(self):
        rows, summary = inventory(self.candidates, {"cities": [city([1, 2])]})
        self.assertEqual(summary["researchCityCount"], 1)
        self.assertEqual(summary["unionMemberCount"], 2)
        self.assertEqual(summary["researchAuditCounts"]["PCS"]["context_only"], 1)
        self.assertEqual(rows[0]["research_scope"], "union_member_only")
        self.assertEqual(rows[0]["PCS_recorded_inputs"], "")
        self.assertEqual(rows[2]["PCS"], "not_researched")
        self.assertEqual(rows[2]["PCS_recorded_inputs"], "")

    def test_direct_inputs_do_not_imply_fitted_observations(self):
        rows, _ = inventory(self.candidates, {"cities": [city([1])]})
        self.assertEqual(rows[0]["PCS_recorded_inputs"], 1)
        self.assertEqual(rows[0]["observation_crosswalk"], "unresolved")

    def test_invalid_mapping_and_incomplete_audit_fail(self):
        for ids in ([4], [1, 1], []):
            with self.assertRaises(ValueError):
                inventory(self.candidates, {"cities": [city(ids)]})
        incomplete = city([1])
        incomplete["audit"]["dimensions"].pop()
        with self.assertRaises(ValueError):
            inventory(self.candidates, {"cities": [incomplete]})
        with self.assertRaises(ValueError):
            inventory(self.candidates + self.candidates, {"cities": []})


if __name__ == "__main__":
    unittest.main()
