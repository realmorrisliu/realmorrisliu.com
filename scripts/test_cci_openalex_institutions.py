import unittest
from cci_openalex_institutions import location_status


class InstitutionLocationTests(unittest.TestCase):
    def test_zero_coordinates_are_not_missing(self):
        self.assertEqual(location_status({'longitude':0,'latitude':0}), 'coordinates_available')

    def test_missing_and_invalid_locations_stay_distinct(self):
        self.assertEqual(location_status({'latitude':30}), 'coordinates_missing')
        for x in [181, float('nan'), '30', True]:
            self.assertEqual(location_status({'longitude':x,'latitude':0}), 'coordinates_invalid')
