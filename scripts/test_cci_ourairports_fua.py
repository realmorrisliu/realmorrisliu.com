import unittest

import pyproj
from shapely.geometry import box

from cci_ourairports_fua import assignments


def airport(identifier, longitude='0', latitude='0', kind='large_airport', service='yes'):
    return {'id': str(identifier), 'ident': f'A{identifier}', 'name': 'Airport',
            'longitude_deg': longitude, 'latitude_deg': latitude, 'type': kind,
            'scheduled_service': service, 'iso_country': 'ZZ', 'municipality': 'Misleading name'}


class AirportAssignmentsTests(unittest.TestCase):
    def test_all_candidates_and_unmatched_records_remain_without_inferred_access(self):
        rows, coverage = assignments([airport(1), airport(2, '20'), airport(3, ''), airport(4, 'nan'),
                                      airport(5, kind='closed'), airport(6, kind='closed_airport')],
                                     [(1, 'FUA', box(-100, -100, 100, 100)), (2, 'Empty', box(1000, 1000, 2000, 2000))])
        self.assertEqual([r['mapping_status'] for r in rows], ['directory_point_match', 'outside_frozen_fuas', 'coordinates_missing', 'coordinates_invalid', 'directory_point_match', 'directory_point_match'])
        self.assertEqual(coverage[0]['directory_point_airports'], 3)
        self.assertEqual(coverage[0]['scheduled_nonclosed_directory_points'], 1)
        self.assertEqual(coverage[1]['status'], 'no_in_area_point_not_no_transport')
        self.assertEqual(sum(r['closed_with_scheduled_service'] for r in rows), 2)

    def test_boundary_and_overlapping_matches_are_retained_not_double_assigned(self):
        point = pyproj.Transformer.from_crs(4326, 'ESRI:54009', always_xy=True).transform(1, 1)
        x, y = point
        rows, coverage = assignments([airport(1, '1', '1')],
                                     [(1, 'A', box(x, y, x + 100, y + 100)), (2, 'B', box(x - 100, y - 100, x + 100, y + 100))])
        self.assertEqual(rows[0]['efua_ids'], '1;2')
        self.assertEqual(rows[0]['mapping_status'], 'multiple_fua_matches')
        self.assertEqual(sum(r['directory_point_airports'] for r in coverage), 0)

    def test_duplicate_identity_and_unexpected_source_values_fail(self):
        for records in ([airport(1), airport(1)], [airport(1, kind='unknown')], [airport(1, service='maybe')]):
            with self.assertRaises(ValueError):
                assignments(records, [(1, 'FUA', box(-100, -100, 100, 100))])


if __name__ == '__main__':
    unittest.main()
