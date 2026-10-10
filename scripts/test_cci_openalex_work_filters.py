import struct
import unittest

import pyarrow as pa
import pyarrow.parquet as pq

from cci_openalex_work_filters import projection


def fixture(years, ids=None):
    n = len(years)
    table = pa.table({'id': ids or [f'https://openalex.org/W{i}' for i in range(n)],
                      'publication_year': pa.array(years, type=pa.int32()),
                      'type': ['dataset'] * n, 'is_xpac': [True] * n,
                      'is_retracted': pa.array([None] * n, type=pa.bool_()),
                      'authors_count': [0] * n, 'unrelated': ['never fetch'] * n})
    sink = pa.BufferOutputStream()
    pq.write_table(table, sink, row_group_size=3)
    raw = sink.getvalue().to_pybytes()
    length = struct.unpack('<I', raw[-8:-4])[0]
    return raw, raw[-8-length:]


class FilterProjectionTests(unittest.TestCase):
    def test_projection_matches_full_read_and_preserves_location_and_unknowns(self):
        raw, footer = fixture([2023, 2023, 2023, 2024, 2025, None])
        ranges = []

        def fetch(start, end):
            ranges.append((start, end))
            return raw[start:end+1]

        table, scanned, downloaded = projection(footer, len(raw), fetch, 19)
        self.assertEqual(scanned, 3)
        self.assertEqual(downloaded, sum(end-start+1 for start, end in ranges))
        self.assertEqual(len(ranges), 6)
        self.assertEqual(table.to_pylist(), [{'authors_count': 0, 'id': 'https://openalex.org/W4', 'is_retracted': None, 'is_xpac': True, 'publication_year': 2025, 'type': 'dataset', 'source_row_group': 1, 'source_row_offset': 1, 'source_file_index': 19}])
        full = pq.read_table(pa.BufferReader(raw)).slice(4, 1)
        for column in full.column_names:
            if column != 'unrelated':
                self.assertEqual(table[column].to_pylist(), full[column].to_pylist())

    def test_rejects_truncated_range_and_duplicate_ids(self):
        raw, footer = fixture([2025, 2025], ['https://openalex.org/W1'] * 2)
        with self.assertRaisesRegex(ValueError, 'Truncated'):
            projection(footer, len(raw), lambda start, end: b'', 0)
        with self.assertRaisesRegex(ValueError, 'duplicate'):
            projection(footer, len(raw), lambda start, end: raw[start:end+1], 0)

    def test_disjoint_year_file_needs_no_column_requests(self):
        raw, footer = fixture([2023, 2024])
        def fetch(start, end):
            self.fail('Disjoint file requested column bytes')
        table, scanned, downloaded = projection(footer, len(raw), fetch, 0)
        self.assertEqual((table.num_rows, scanned, downloaded), (0, 0, 0))


if __name__ == '__main__':
    unittest.main()
