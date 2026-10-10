import unittest

from cci_openalex_affiliation_audit import inspect


class AffiliationAuditTests(unittest.TestCase):
    def test_parent_overlap_and_unknown_affiliation_are_not_redistributed(self):
        directory = {'child': {'efua_ids': '1', 'mapping_status': 'directory_point_match'},
                     'parent': {'efua_ids': '2', 'mapping_status': 'directory_point_match'}}
        author = {'affiliations': [{'raw_affiliation_string': 'Lab', 'institution_ids': ['child', 'parent']},
                                   {'raw_affiliation_string': 'Unmatched', 'institution_ids': []}],
                  'institutions': [{'id': 'child', 'lineage': ['child', 'parent']}, {'id': 'parent', 'lineage': ['parent']}]}
        result = inspect([{'id': 'W1', 'publication_year': 2025, 'authors_count': 2, 'authorships': [author, {}]}], directory)
        self.assertEqual(result['counts']['direct_parent_child_overlap'], 1)
        self.assertEqual(result['counts']['multiple_directory_fuas'], 1)
        self.assertEqual(result['counts']['no_matched_institution'], 1)
        self.assertEqual(result['counts']['unmatched_raw_affiliation'], 1)
        self.assertNotIn('raw_flat_id_disagreement', result['counts'])
        self.assertEqual(result['examples']['no_matched_institution'][0]['directoryFuaIds'], [])

    def test_disagreement_and_missing_directory_are_distinct(self):
        author = {'affiliations': [{'institution_ids': ['missing']}], 'institutions': []}
        result = inspect([{'id': 'W1', 'publication_year': 2025, 'authors_count': 1, 'authorships': [author]}], {})
        self.assertEqual(result['counts']['raw_flat_id_disagreement'], 1)
        self.assertEqual(result['counts']['institution_missing_from_directory'], 1)
        self.assertNotIn('no_matched_institution', result['counts'])
        with self.assertRaisesRegex(ValueError, 'Incomplete'):
            inspect([{'id': 'W1', 'publication_year': 2025, 'authors_count': 2, 'authorships': [author]}], {})

    def test_partial_and_empty_byline_do_not_become_complete_attribution(self):
        directory = {'I1': {'efua_ids': '1', 'mapping_status': 'directory_point_match'}}
        author = {'affiliations': [{'institution_ids': ['I1']}],
                  'institutions': [{'id': 'I1', 'lineage': ['I1']}]}
        rows = [{'id': 'W1', 'publication_year': 2025, 'authors_count': 2, 'authorships': [author, {}]},
                {'id': 'W2', 'publication_year': 2025, 'authors_count': 0, 'authorships': []},
                {'id': 'W3', 'publication_year': 2025, 'authors_count': 1, 'authorships': [author]}]
        counts = inspect(rows, directory)['counts']
        self.assertEqual(counts['authorships_with_single_consistent_directory_fua'], 2)
        self.assertEqual(counts['works_with_any_single_consistent_directory_fua'], 2)
        self.assertEqual(counts['works_with_all_authorships_single_consistent_directory_fua'], 1)
        self.assertEqual(counts['works_with_no_authorships'], 1)


if __name__ == '__main__':
    unittest.main()
