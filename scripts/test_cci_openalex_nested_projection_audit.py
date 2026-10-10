import tempfile
import unittest
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq

from cci_openalex_nested_projection_audit import inspect


class NestedProjectionTests(unittest.TestCase):
    def test_full_author_order_empty_lists_and_nulls_survive_leaf_projection(self):
        author = {'author': {'id': 'A1', 'display_name': 'not selected'},
                  'affiliations': [{'institution_ids': ['I1'], 'raw_affiliation_string': 'Lab'}],
                  'institutions': [{'id': 'I1', 'lineage': ['I1', 'P1'], 'display_name': 'not selected'}]}
        records = [{'id': 'W1', 'publication_year': 2025, 'authors_count': 103,
                    'authorships': [author] * 101 + [{'author': None, 'affiliations': [], 'institutions': []}, {'author': {'id': None, 'display_name': None}, 'affiliations': None, 'institutions': None}]}]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'fixture.parquet'
            pq.write_table(pa.Table.from_pylist(records), path)
            result = inspect(path)
            self.assertEqual(result['recordsCompared'], 1)
            self.assertEqual(result['authorshipsCompared'], 103)
            self.assertEqual(result['worksAbove100Authors'], 1)
            records[0]['authors_count'] = 100
            pq.write_table(pa.Table.from_pylist(records), path)
            with self.assertRaisesRegex(ValueError, 'count mismatch'):
                inspect(path)


if __name__ == '__main__':
    unittest.main()
