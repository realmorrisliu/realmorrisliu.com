import unittest
from cci_global_evidence_matrix import indexed, matrix


class EvidenceMatrixTest(unittest.TestCase):
    def test_missing_or_duplicated_candidate_is_rejected(self):
        with self.assertRaises(ValueError):
            indexed([{"efua_id": "1"}], {"1", "2"})
        with self.assertRaises(ValueError):
            indexed([{"efua_id": "1"}, {"efua_id": "1"}], {"1"})

    def test_partial_and_national_evidence_never_become_scores(self):
        base = {"efua_id": "1"}
        candidates = [{**base, "source_name": "Example", "country_iso": "AAA"}]
        history = [{**base, "research_slug": "union", "research_scope": "union_member_only"}]
        spatial = [{**base, "intersecting_centres": "2", "centre_area_share": "0.9"}]
        violence = [{**base, **{f"recorded_events_{y}": "0" for y in range(2021, 2026)}}]
        health = [{**base, "status": "no_observed_motorized_population"}]
        governance = [{**base, "available_dimensions": "6", "lookup_economy_code": "AAA"}]
        seismic = [{**base, "status": "no_observed_hazard_population"}]
        row = matrix(candidates, history, spatial, violence, health, governance, seismic)[0]
        self.assertEqual(row["GSS"], "no_assigned_events_not_zero_risk")
        self.assertEqual(row["ISR"], "country_context_only")
        self.assertEqual(row["MED"], "travel_model_missing")
        self.assertEqual(row["PCS"], "seismic_model_missing")
        self.assertEqual(row["historical_research_scope"], "union_member_only")
        self.assertEqual(row["cci_score_status"], "not_computed_under_global_protocol")
        seismic[0]["status"] = "partial_seismic_hazard_model"
        row = matrix(candidates, history, spatial, violence, health, governance, seismic)[0]
        self.assertEqual(row["PCS"], "partial_seismic_hazard_model")
        self.assertEqual(row["cci_score_status"], "not_computed_under_global_protocol")


if __name__ == "__main__":
    unittest.main()
