import unittest

from cci_lon_discovery_union import union


class DiscoveryUnionTest(unittest.TestCase):
    def test_overlap_retains_both_sources_without_double_counting(self):
        rows = union({'a': [{'nct_id': 'NCT1'}, {'nct_id': 'NCT2'}],
                      'b': [{'nct_id': 'NCT2'}, {'nct_id': 'NCT3'}]})
        self.assertEqual(len(rows), 3)
        self.assertEqual(rows[1]['discovery_queries'], 'a|b')
        self.assertEqual(rows[2]['discovery_queries'], 'b')
        self.assertTrue(all(r['scope_review'] == 'not_determined_by_discovery' for r in rows))

    def test_duplicates_within_query_are_rejected(self):
        with self.assertRaises(ValueError):
            union({'a': [{'nct_id': 'NCT1'}, {'nct_id': 'NCT1'}]})


if __name__ == '__main__':
    unittest.main()
