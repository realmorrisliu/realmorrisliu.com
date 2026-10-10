import unittest
import hashlib
import json
import struct
import tempfile
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq
from cci_openalex_works_metadata import could_include_year, inspect_file, FILTERS, AFFILIATIONS


class YearPruningTests(unittest.TestCase):
    def test_missing_statistics_do_not_drop_records(self):
        self.assertTrue(could_include_year(None,None,2025))
        self.assertTrue(could_include_year(2000,None,2025))

    def test_only_disjoint_year_ranges_are_skipped(self):
        self.assertTrue(could_include_year(2025,2026,2025))
        self.assertTrue(could_include_year(2010,2025,2025))
        self.assertFalse(could_include_year(2010,2024,2025))
        self.assertFalse(could_include_year(2026,2027,2025))


class CachedFooterTests(unittest.TestCase):
    def test_cached_metadata_prunes_only_disjoint_group_and_checks_integrity(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = Path(directory)
            values = {key:[1, 1, 1, 1] for key in FILTERS | AFFILIATIONS}
            values['publication_year'] = [2024, 2024, 2025, 2025]
            sink = pa.BufferOutputStream()
            pq.write_table(pa.table(values), sink, row_group_size=2)
            raw = sink.getvalue().to_pybytes()
            length = struct.unpack('<I', raw[-8:-4])[0]
            footer = raw[-8-length:]
            item = {'url':'s3://openalex/data/parquet/works/test.parquet',
                    'meta':{'content_length':len(raw),'record_count':4}}
            record = {'url':'https://openalex.s3.amazonaws.com/data/parquet/works/test.parquet',
                      'source_bytes':len(raw),'target_year':2025,'source_etag':'fixture',
                      'footer_sha256':hashlib.sha256(footer).hexdigest()}
            (cache/'0000.json').write_text(json.dumps(record))
            (cache/'0000.footer').write_bytes(footer)
            result = inspect_file(item,0,cache,2025)
            self.assertEqual(result['row_groups'],2)
            self.assertEqual(result['eligible_groups'],1)
            self.assertEqual(result['potential_rows'],2)
            self.assertGreater(result['filter_column_bytes'],0)
            with self.assertRaisesRegex(ValueError,'different source or query'):
                inspect_file(item,0,cache,2024)
            (cache/'0000.footer').write_bytes(footer+b'corrupt')
            with self.assertRaisesRegex(ValueError,'checksum mismatch'):
                inspect_file(item,0,cache,2025)
