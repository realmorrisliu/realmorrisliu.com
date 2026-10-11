import unittest

from cci_global_coverage import DIMENSIONS
from cci_unmatched_centre_review import review_rows


class UnmatchedCentreReviewTests(unittest.TestCase):
    def test_transitive_overlap_groups_without_merging_or_score_inheritance(self):
        ucdb = [self.uc(1), self.uc(2), self.uc(3, 2)]
        wup = [self.wup(1, 2), self.wup(2, 2), self.wup(3, 0)]
        links = [self.link(1, 1), self.link(1, 2), self.link(2, 2), self.link(2, 3)]
        rows = review_rows(ucdb, wup, links)
        self.assertEqual(len(rows), 5)
        shared = [r for r in rows if r['review_group'] == 'ucdb:1']
        self.assertEqual(len(shared), 4)
        self.assertTrue(all(r['group_has_indirect_fua_link'] == 'true' for r in shared))
        self.assertEqual(next(r for r in rows if r['source'] == 'wup' and r['source_id'] == 2)
                         ['fua_overlapping_other_source_ids'], '3')
        for r in rows:
            self.assertEqual(r['cci_center'], '')
            self.assertEqual(r['retention_status'], 'retained_unresolved_competitor')
            self.assertTrue(all(r[d] == 'not_assessed_under_global_protocol' for d in DIMENSIONS))
        self.assertEqual(rows[-1]['group_has_indirect_fua_link'], 'false')

    def test_namespace_and_isolated_records_are_preserved(self):
        rows = review_rows([self.uc(1)], [self.wup(1, 0)], [])
        self.assertEqual(len(rows), 2)
        self.assertEqual({r['review_group'] for r in rows}, {'ucdb:1', 'wup:1'})

    def test_duplicate_unknown_and_invalid_links_fail_closed(self):
        uc, wup, link = [self.uc(1)], [self.wup(1, 1)], self.link(1, 1)
        for links in ([link, link], [self.link(1, 2)], [{**link, 'overlap_km2': 'nan'}],
                      [{**link, 'wup_area_share': '0'}], []):
            with self.assertRaises(ValueError):
                review_rows(uc, wup, links)
        with self.assertRaises(ValueError):
            review_rows(uc + uc, wup, [link])
        with self.assertRaises(ValueError):
            review_rows([{**uc[0], 'status': 'single_overlap'}], wup, [link])

    @staticmethod
    def uc(key, fuas=0):
        return {'ucdb_id': str(key), 'intersecting_efuas': str(fuas),
                'status': 'no_overlap' if fuas == 0 else 'single_overlap' if fuas == 1 else 'multiple_overlaps'}

    @staticmethod
    def wup(key, links):
        return {'wup_2025_id': str(key), 'intersecting_efuas': '0', 'status': 'no_overlap',
                'intersecting_ucdb_centres': str(links)}

    @staticmethod
    def link(wup, ucdb):
        return {'wup_2025_id': str(wup), 'ucdb_id': str(ucdb), 'overlap_km2': '1',
                'wup_area_share': '0.5', 'ucdb_area_share': '0.5'}


if __name__ == '__main__':
    unittest.main()
