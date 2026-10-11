import unittest
import json
from pathlib import Path
from cci_global_evidence_matrix import indexed, legal_mobility_rules, local_cases, matrix, network_coverage


class EvidenceMatrixTest(unittest.TestCase):
    legal = json.loads((Path(__file__).resolve().parents[1] / 'docs/data/cci-legal-mobility-rules.json').read_text())

    def test_legal_paths_require_the_profile_and_keep_conditions(self):
        from copy import deepcopy
        rules = legal_mobility_rules(self.legal)
        self.assertEqual(rules['FIN']['destinationCountryIso'], 'DEU')
        self.assertEqual(rules['DEU']['destinationCountryIso'], 'FRA')
        self.assertEqual(rules['CHE']['destinationCountryIso'], 'FRA')
        for country in ('AUS', 'CAN', 'GBR', 'ISR', 'JPN', 'KOR', 'NZL', 'USA'):
            self.assertEqual(rules[country]['id'], 'section41_citizen_onshore_application_germany')
            self.assertEqual(rules[country]['destinationCountryIso'], 'DEU')
        for country in ('BRA', 'ASM', 'PRI', 'GIB'):
            self.assertNotIn(country, rules)
        for field, value in [('residentPerspective', 'foreign_resident'), ('evidenceCutoff', '2026-10-12')]:
            with self.assertRaisesRegex(ValueError, 'protocol mismatch'):
                legal_mobility_rules({**self.legal, field: value})
        for mutate, error in [
                (lambda d: d['sources'][0].update(versionDate='2026-10-11'), 'post-cutoff'),
                (lambda d: d['rules'][0].update(conditions=[]), 'conditions'),
                (lambda d: d['rules'][0].update(sources=['unknown']), 'known sources'),
                (lambda d: d['rules'][0]['originCountryIso'].append('DEU'), 'domestic destination'),
                (lambda d: d['rules'][0]['originCountryIso'].append('FIN'), 'Duplicate citizenship')]:
            document = deepcopy(self.legal)
            mutate(document)
            with self.assertRaisesRegex(ValueError, error):
                legal_mobility_rules(document)

    def test_conditional_cases_do_not_grant_exclusion_or_ranking(self):
        case = json.loads((Path(__file__).resolve().parents[1] / 'docs/data/cci-local-2026-london-case.json').read_text())
        self.assertEqual(local_cases([case], {'5288'})['5288']['expectedConditionalTotal'], 58)
        with self.assertRaisesRegex(ValueError, 'Unknown or duplicate'):
            local_cases([case], {'1'})
        with self.assertRaisesRegex(ValueError, 'Unknown or duplicate'):
            local_cases([case, case], {'5288'})
        with self.assertRaisesRegex(ValueError, 'protocol mismatch'):
            local_cases([{**case, 'status': 'ranking_eligible'}], {'5288'})
        with self.assertRaisesRegex(ValueError, 'protocol mismatch'):
            local_cases([{**case, 'evidenceCutoff': '2026-10-11'}], {'5288'})

    def test_partial_case_preserves_unknown_and_rejects_a_total_center(self):
        case = json.loads((Path(__file__).resolve().parents[1] / 'docs/data/cci-local-2026-gaza-case.json').read_text())
        validated = local_cases([case], {'312'})['312']
        self.assertIsNone(validated['expectedConditionalTotal'])
        self.assertIsNone(next(d['score'] for d in validated['dimensions'] if d['id'] == 'ISR'))
        with self.assertRaisesRegex(ValueError, 'Partial case cannot'):
            local_cases([{**case, 'expectedConditionalTotal': 14}], {'312'})
        case['dimensions'][0]['score'] = 0
        with self.assertRaisesRegex(ValueError, 'anchored conditional'):
            local_cases([case], {'312'})

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
        row = matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports, self.legal)[0]
        self.assertEqual(row["OPT"], "no_in_area_airport_point_not_no_access")
        self.assertEqual(row['legal_mobility_status'], 'no_reviewed_path_not_no_right')
        candidates[0]['country_iso'] = 'FIN'
        with_path = matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports, self.legal)[0]
        self.assertEqual(with_path['legal_mobility_rule'], 'other_eu_citizen_to_germany')
        self.assertEqual(with_path['cci_score_status'], row['cci_score_status'])
        self.assertEqual(with_path['local2026_screening_status'], row['local2026_screening_status'])
        self.assertEqual(with_path['OPT'], row['OPT'])
        candidates[0]['country_iso'] = 'USA'
        application = matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports, self.legal)[0]
        self.assertEqual(application['legal_mobility_rule'], 'section41_citizen_onshore_application_germany')
        for field in ('OPT', 'cci_score_status', 'local2026_screening_status'):
            self.assertEqual(application[field], row[field])
        candidates[0]['country_iso'] = 'AAA'
        self.assertEqual(row["TEC"], "network_samples_missing")
        self.assertEqual(row["wup_2025_intersecting_centres"], 0)
        with self.assertRaisesRegex(ValueError, "full candidate universe"):
            matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, [], airports, self.legal)
        self.assertEqual(row["GSS"], "no_assigned_events_not_zero_risk")
        self.assertEqual(row["ISR"], "country_context_only")
        self.assertEqual(row["MED"], "travel_model_missing")
        self.assertEqual(row["PCS"], "seismic_model_missing")
        self.assertEqual(row["RES"], "country_urban_water_context_only")
        self.assertEqual(row["historical_research_scope"], "union_member_only")
        self.assertEqual(row["cci_score_status"], "not_computed_under_global_protocol")
        self.assertEqual(row['local2026_case_status'], 'unassessed')
        self.assertEqual(row['local2026_screening_status'], 'retained_no_supported_exclusion')
        case = json.loads((Path(__file__).resolve().parents[1] / 'docs/data/cci-local-2026-london-case.json').read_text())
        case['candidateId'] = 1
        reviewed = matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports, self.legal, [case])[0]
        self.assertEqual(reviewed['local2026_case_status'], 'conditional_calibration_not_ranking')
        self.assertEqual(reviewed['local2026_retention_reason'], 'conditional_scores_not_exclusion_bounds')
        self.assertEqual(reviewed['local2026_screening_status'], 'retained_no_supported_exclusion')
        self.assertEqual(reviewed['cci_score_status'], 'not_computed_under_global_protocol')
        with self.assertRaises(ValueError):
            network_coverage(network[:1], {'1'})
        network[0].update(centroid_tiles='1', boundary_tiles='1', centroid_avg_d_kbps_valid_tests='2', centroid_avg_d_kbps_test_weighted_mean='100')
        airports[0].update(directory_point_airports="2", scheduled_nonclosed_directory_points="1", status="directory_points_only")
        wup[0]["intersecting_centres"] = "3"
        seismic[0]["status"] = "partial_seismic_hazard_model"
        water[0]["available_indicators"] = "0"
        row = matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports, self.legal)[0]
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
            matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports, self.legal)
        airports[0]['scheduled_nonclosed_directory_points'] = '1'
        with self.assertRaisesRegex(ValueError, 'full candidate universe'):
            matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, [], self.legal)

        wup[0]['intersecting_centres'] = '-1'
        with self.assertRaisesRegex(ValueError, 'Negative WUP centre count'):
            matrix(candidates, history, spatial, violence, health, governance, seismic, water, network, wup, airports, self.legal)

        network[0]['centroid_avg_d_kbps_valid_tests'] = '0'
        with self.assertRaises(ValueError):
            network_coverage(network, {'1'})


if __name__ == "__main__":
    unittest.main()
