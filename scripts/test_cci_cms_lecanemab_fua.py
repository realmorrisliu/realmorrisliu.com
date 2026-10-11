import unittest

import pyproj
from shapely.geometry import box

from cci_cms_lecanemab_fua import assignments


def provider(npi='1000000000'):
    return {'Rndrng_NPI': npi, 'Rndrng_Prvdr_St1': '1 Main St', 'Rndrng_Prvdr_St2': 'Suite 9',
            'Rndrng_Prvdr_City': 'Misleading city name', 'Rndrng_Prvdr_State_Abrvtn': 'VA',
            'Rndrng_Prvdr_Zip5': '20164', 'Rndrng_Prvdr_Cntry': 'US',
            'HCPCS_Cd': 'J0174', 'HCPCS_Desc': 'Injection, lecanemab-irmb, 1 mg', 'Place_Of_Srvc': 'O',
            'Tot_Benes': '13', 'Tot_Bene_Day_Srvcs': '67', 'Tot_Srvcs': '49100'}


def response(npi='1000000000', outcome='Match', quality='Exact', coordinate='0,0'):
    row = [npi, '1 Main St, Misleading city name, VA, 20164', outcome]
    return row + [quality, '1 MAIN ST, MATCHED CITY, VA, 20164', coordinate, '12345', 'R'] if outcome == 'Match' else row


class ClaimsAddressTests(unittest.TestCase):
    fuas = [(1, 'Inside', box(-100, -100, 100, 100), 'USA'),
            (2, 'Empty US', box(1000, 1000, 2000, 2000), 'USA'),
            (3, 'Other payer frame', box(3000, 3000, 4000, 4000), 'CAN')]

    def test_all_records_and_candidates_retained_without_inferred_patient_counts(self):
        records = [provider(str(1000000000 + i)) for i in range(4)]
        responses = [response(records[0]['Rndrng_NPI']), response(records[1]['Rndrng_NPI'], outcome='No_Match'),
                     response(records[2]['Rndrng_NPI'], outcome='Tie'), response(records[3]['Rndrng_NPI'], coordinate='20,0')]
        rows, coverage = assignments(records, responses, self.fuas)
        self.assertEqual([r['mapping_status'] for r in rows],
                         ['exact_registered_address_signal', 'address_unmatched', 'address_ambiguous', 'outside_frozen_fuas'])
        self.assertEqual(rows[0]['record_beneficiaries'], '13')
        self.assertEqual(rows[0]['record_beneficiary_days'], '67')
        self.assertEqual(rows[0]['drug_billing_units_1mg'], '49100')
        self.assertEqual(coverage[0]['exact_registered_npi_records'], 1)
        self.assertEqual(coverage[1]['status'], 'no_exact_signal_not_no_adoption')
        self.assertEqual(coverage[2]['status'], 'outside_payer_frame_not_no_adoption')
        rows, _ = assignments([{**provider(), 'Tot_Srvcs': '600688.8'}], [response()], self.fuas)
        self.assertEqual(rows[0]['drug_billing_units_1mg'], '600688.8')

    def test_non_exact_and_overlapping_points_remain_review_not_positive_signals(self):
        rows, coverage = assignments([provider()], [response(quality='Non_Exact')], self.fuas)
        self.assertEqual(rows[0]['efua_ids'], '1')
        self.assertEqual(rows[0]['mapping_status'], 'non_exact_address_review')
        self.assertEqual(coverage[0]['exact_registered_npi_records'], 0)
        self.assertEqual(coverage[0]['uncertain_address_npi_records'], 1)
        fuas = [(1, 'A', box(0, 0, 100, 100), 'USA'), (2, 'B', box(-100, -100, 100, 100), 'USA')]
        rows, coverage = assignments([provider()], [response()], fuas)
        self.assertEqual(rows[0]['efua_ids'], '1;2')
        self.assertEqual(rows[0]['mapping_status'], 'multiple_fua_review')
        self.assertEqual(sum(r['exact_registered_npi_records'] for r in coverage), 0)

    def test_real_projection_and_country_conflict_are_not_name_assignment(self):
        x, y = pyproj.Transformer.from_crs(4326, 'ESRI:54009', always_xy=True).transform(-77.3938, 39.0243)
        rows, coverage = assignments([provider()], [response(coordinate='-77.3938,39.0243')],
                                     [(9, 'Unrelated name', box(x - 10, y - 10, x + 10, y + 10), 'USA')])
        self.assertEqual(rows[0]['efua_ids'], '9')
        self.assertEqual(coverage[0]['exact_registered_npi_records'], 1)
        rows, coverage = assignments([provider()], [response()], [(1, 'Border', self.fuas[0][2], 'CAN')])
        self.assertEqual(rows[0]['mapping_status'], 'country_boundary_review')
        self.assertEqual(coverage[0]['exact_registered_npi_records'], 0)

    def test_missing_duplicate_unknown_ids_and_changed_address_fail(self):
        for responses in ([], [response(), response()], [response(npi='1000000001')],
                          [[*response()[:1], 'Changed address', *response()[2:]]]):
            with self.assertRaises(ValueError):
                assignments([provider()], responses, self.fuas)
        with self.assertRaises(ValueError):
            assignments([provider(), provider()], [response()], self.fuas)

    def test_unexpected_match_shapes_and_nonfinite_coordinates_fail(self):
        for row in (response(coordinate='nan,0'), response(coordinate='0,91'), response(coordinate='1,2,3'),
                    response(quality='Unknown'), response()[:-1], response()[:3],
                    response(outcome='Unknown'), response(outcome='No_Match') + ['Extra']):
            with self.assertRaises(ValueError):
                assignments([provider()], [row], self.fuas)

    def test_wrong_drug_unit_payer_and_suppressed_records_fail(self):
        for field, value in (('HCPCS_Cd', 'J0175'), ('HCPCS_Desc', 'Injection, 10 mg'), ('Place_Of_Srvc', 'F'),
                             ('Rndrng_Prvdr_Cntry', 'CA'), ('Tot_Benes', '10'), ('Tot_Srvcs', '0'), ('Tot_Srvcs', 'nan')):
            with self.assertRaises(ValueError):
                assignments([{**provider(), field: value}], [response()], self.fuas)


if __name__ == '__main__':
    unittest.main()
