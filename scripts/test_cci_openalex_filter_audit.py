import tempfile
import unittest
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq

from cci_global_crosswalk import digest
from cci_openalex_filter_audit import audit


def shard(folder, index, ids):
    records = [{'id': identifier, 'publication_year': 2025, 'type': 'article',
                'is_xpac': False, 'is_retracted': None, 'authors_count': None,
                'source_file_index': index, 'source_row_group': 0, 'source_row_offset': n}
               for n, identifier in enumerate(ids)]
    path = folder / f'{index:04}.parquet'
    pq.write_table(pa.Table.from_pylist(records), path)
    return {'fileIndex': index, 'parquetSha256': digest(path), 'year2025Rows': len(records),
            'typeCorpusRetractionCounts': [{'type': 'article', 'isXpac': False, 'isRetracted': None, 'count': len(records)}]}


class GlobalIdAuditTests(unittest.TestCase):
    def test_unique_ids_and_unknowns_preserved(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            parts = [shard(folder, 0, ['https://openalex.org/W1']), shard(folder, 1, ['https://openalex.org/W2'])]
            result = audit(parts, folder)
            self.assertEqual(result['uniqueWorkIds'], 2)
            self.assertEqual(result['unknownAuthorCounts'], 2)
            self.assertEqual(result['typeCorpusRetractionCounts'], [{'type': 'article', 'isXpac': False, 'isRetracted': None, 'count': 2}])
            parts[0]['year2025Rows'] = 10
            with self.assertRaisesRegex(ValueError, 'accounting mismatch'):
                audit(parts, folder)

    def test_cross_partition_duplicate_and_changed_file_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            parts = [shard(folder, 0, ['https://openalex.org/W1']), shard(folder, 1, ['https://openalex.org/W1'])]
            with self.assertRaisesRegex(ValueError, 'Duplicate work ID'):
                audit(parts, folder)
            (folder / '0000.parquet').write_bytes(b'changed')
            with self.assertRaisesRegex(ValueError, 'checksum mismatch'):
                audit(parts, folder)


if __name__ == '__main__':
    unittest.main()
