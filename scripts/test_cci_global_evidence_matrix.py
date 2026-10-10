import unittest
from cci_global_evidence_matrix import indexed, matrix, network_coverage


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
        water = [{**base, "available_indicators": "1"}]
        wup = [{**base, "intersecting_centres": "0"}]
        network = [{**base, 'connection_type':mode, 'centroid_tiles':'0', 'interior_tiles':'0', 'boundary_tiles':'0',
                    **{f'centroid_{metric}_{field}':value for metric in ('avg_d_kbps','avg_u_kbps','avg_lat_ms')
                       for field,value in [('valid_tests','0'),('test_weighted_mean','')]}}
                   for mode in ('fixed','mobile')]
        airports = [{**base, "directory_point_airports": "0", "scheduled_nonclosed_directory_points": "0", "status": "no_in_area_point_not_no_transport"}]
        row = matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports)[0]
        self.assertEqual(row["OPT"], "no_in_area_airport_point_not_no_access")
        self.assertEqual(row["TEC"], "network_samples_missing")
        self.assertEqual(row["wup_2025_intersecting_centres"], 0)
        with self.assertRaisesRegex(ValueError, "full candidate universe"):
            matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, [], airports)
        self.assertEqual(row["GSS"], "no_assigned_events_not_zero_risk")
        self.assertEqual(row["ISR"], "country_context_only")
        self.assertEqual(row["MED"], "travel_model_missing")
        self.assertEqual(row["PCS"], "seismic_model_missing")
        self.assertEqual(row["RES"], "country_urban_water_context_only")
        self.assertEqual(row["historical_research_scope"], "union_member_only")
        self.assertEqual(row["cci_score_status"], "not_computed_under_global_protocol")
        with self.assertRaises(ValueError):
            network_coverage(network[:1], {'1'})
        network[0].update(centroid_tiles='1', boundary_tiles='1', centroid_avg_d_kbps_valid_tests='2', centroid_avg_d_kbps_test_weighted_mean='100')
        airports[0].update(directory_point_airports="2", scheduled_nonclosed_directory_points="1", status="directory_points_only")
        wup[0]["intersecting_centres"] = "3"
        seismic[0]["status"] = "partial_seismic_hazard_model"
        water[0]["available_indicators"] = "0"
        row = matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports)[0]
        self.assertEqual(row["OPT"], "airport_directory_points_only")
        self.assertEqual(row["scheduled_nonclosed_airport_directory_points"], 1)
        self.assertEqual(row["TEC"], "partial_network_samples")
        self.assertEqual(row["wup_2025_intersecting_centres"], 3)
        self.assertEqual(row["network_sample_connection_types"], 1)
        self.assertEqual(row["network_boundary_tiles"], 1)
        self.assertEqual(row["PCS"], "partial_seismic_hazard_model")
        self.assertEqual(row["RES"], "water_context_missing")
        self.assertEqual(row["cci_score_status"], "not_computed_under_global_protocol")

        airports[0]['scheduled_nonclosed_directory_points'] = '3'
        with self.assertRaisesRegex(ValueError, 'airport directory accounting'):
            matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports)
        airports[0]['scheduled_nonclosed_directory_points'] = '1'
        with self.assertRaisesRegex(ValueError, 'full candidate universe'):
            matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, [])

        wup[0]['intersecting_centres'] = '-1'
        with self.assertRaisesRegex(ValueError, 'Negative WUP centre count'):
            matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports)

        network[0]['centroid_avg_d_kbps_valid_tests'] = '0'
        with self.assertRaises(ValueError):
            network_coverage(network, {'1'})


if __name__ == "__main__":
    unittest.main()
