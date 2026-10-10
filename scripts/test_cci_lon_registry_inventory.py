import unittest

from cci_lon_registry_inventory import inventory


def study(nct, locations=None):
    return {'protocolSection': {'identificationModule': {'nctId': nct},
            'statusModule': {'overallStatus': 'COMPLETED', 'lastUpdatePostDateStruct': {'date': '2026-10-09'}},
            'designModule': {'studyType': 'INTERVENTIONAL'},
            'contactsLocationsModule': {'locations': locations or []}}}


class RegistryInventoryTest(unittest.TestCase):
    def test_missing_results_and_sites_do_not_imply_no_research(self):
        rows, sites = inventory([{'totalCount': 1, 'studies': [study('NCT00000001')]}])
        self.assertFalse(rows[0]['registry_results_section_present'])
        self.assertEqual(rows[0]['location_evidence_status'], 'not_listed_not_absent')
        self.assertEqual(rows[0]['lon_relevance'], 'not_adjudicated')
        self.assertEqual(rows[0]['fua_assignment'], 'not_assigned')
        self.assertEqual(sites, [])

    def test_multisite_study_preserves_one_trial_and_multiple_roles(self):
        s = study('NCT00000001', [{'city': 'A', 'country': 'X'}, {'city': 'B'}])
        s['resultsSection'] = {'participantFlowModule': {}}
        rows, sites = inventory([{'totalCount': 1, 'studies': [s]}])
        self.assertEqual(len(rows), 1)
        self.assertEqual(len(sites), 2)
        self.assertTrue(rows[0]['registry_results_section_present'])
        self.assertEqual(sites[1]['country'], '')
        self.assertEqual({r['role'] for r in sites}, {'registry_listed_location_not_resident_access'})

    def test_duplicate_truncation_and_count_drift_are_rejected(self):
        a = study('NCT00000001')
        cases = [[{'totalCount': 1, 'studies': [a], 'nextPageToken': 'more'}],
                 [{'totalCount': 2, 'studies': [a]}],
                 [{'totalCount': 2, 'studies': [a, a]}],
                 [{'totalCount': 2, 'studies': [a], 'nextPageToken': 'more'},
                  {'totalCount': 3, 'studies': [study('NCT00000002')]}]]
        for pages in cases:
            with self.subTest(pages=pages), self.assertRaises(ValueError):
                inventory(pages)


if __name__ == '__main__':
    unittest.main()
