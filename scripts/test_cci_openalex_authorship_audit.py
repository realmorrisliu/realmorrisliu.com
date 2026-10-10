import unittest
from cci_openalex_authorship_audit import inspect


class AuthorshipAuditTests(unittest.TestCase):
    def test_large_complete_and_truncated_lists_are_distinguished(self):
        rows = [{'id':'W1','publication_year':2025,'authors_count':101,'authorships':[{}]*101},
                {'id':'W2','publication_year':2025,'authors_count':300,'authorships':[{}]*100}]
        result = inspect(rows)
        self.assertEqual(result['largeAuthorRecords'], 2)
        self.assertEqual([r['id'] for r in result['countListMismatches']], ['W2'])

    def test_duplicate_works_are_rejected(self):
        row = {'id':'W1','publication_year':2025,'authors_count':0,'authorships':[]}
        with self.assertRaises(ValueError):
            inspect([row,row])
