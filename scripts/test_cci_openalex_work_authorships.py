import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import pyarrow.parquet as pq

from cci_global_crosswalk import digest
from cci_openalex_work_authorships import extract
from test_cci_openalex_attach_authorships import fixtures


def prepare(folder, empty=False):
    filters, group = fixtures()
    if empty:
        filters = filters.slice(0, 0)
    output = folder / 'output'
    output.mkdir()
    footer = b'checked synthetic footer'
    row = {'file_index': '19', 'footer_sha256': hashlib.sha256(footer).hexdigest()}
    (folder / '0019.footer').write_bytes(footer)
    path = folder / '0019.parquet'
    pq.write_table(filters, path)
    record = {'sourceHash': hashlib.sha256(json.dumps(row, sort_keys=True).encode()).hexdigest(),
              'parquetSha256': digest(path), 'year2025Rows': filters.num_rows}
    (folder / '0019.json').write_text(json.dumps(record))
    return row, output, group


class PartitionAuthorshipTests(unittest.TestCase):
    def test_join_round_trip_cache_reuse_and_corruption_rejection(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            row, output, group = prepare(folder)
            with patch('cci_openalex_work_authorships.read_group', return_value=(group, [{'bytes': 100}])) as reader:
                result = extract(row, folder, folder, output)
                self.assertEqual(result['records'], 3)
                self.assertEqual(result['authorshipCountStatuses']['count_list_mismatch'], 1)
                self.assertEqual(extract(row, folder, folder, output), result)
                self.assertEqual(reader.call_count, 1)
                (output / '0019.parquet').write_bytes(b'changed')
                with self.assertRaisesRegex(ValueError, 'checksum mismatch'):
                    extract(row, folder, folder, output)

    def test_empty_filter_shard_needs_no_network_or_parquet_output(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            row, output, _ = prepare(folder, empty=True)
            with patch('cci_openalex_work_authorships.read_group') as reader:
                result = extract(row, folder, folder, output)
                reader.assert_not_called()
                self.assertEqual(result['records'], 0)
                self.assertIsNone(result['parquetSha256'])
                self.assertFalse((output / '0019.parquet').exists())


if __name__ == '__main__':
    unittest.main()
