import hashlib
import json
from collections import Counter
from pathlib import Path
import tempfile
import unittest

import pyarrow as pa
import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest
from cci_openalex_global_affiliation_audit import audit


def fixture(folder, complete_only=False):
    cache, filters = folder / 'cache', folder / 'filters'
    cache.mkdir()
    filters.mkdir()
    author = {'affiliations': [{'institution_ids': ['I1'], 'raw_affiliation_string': 'Lab'}],
              'institutions': [{'id': 'I1', 'lineage': ['I1']}]}
    base = pa.table({'id': ['W1', 'W2', 'W3', 'W4'], 'publication_year': [2025] * 4,
                     'authors_count': [1, 1 if complete_only else 2, 0, 1], 'type': ['article', 'article', 'dataset', 'other'],
                     'is_xpac': [False, False, True, False], 'is_retracted': [False, False, None, False],
                     'source_file_index': [0] * 4, 'source_row_group': [0] * 4,
                     'source_row_offset': list(range(4))})
    statuses = ['count_matches', 'count_matches' if complete_only else 'count_list_mismatch', 'no_authors', 'count_matches' if complete_only else 'missing_list']
    joined = base.append_column('authorships', pa.array([[author], [author], [], [author] if complete_only else None]))
    joined = joined.append_column('authorship_count_status', pa.array(statuses))
    pq.write_table(base, filters / '0000.parquet')
    pq.write_table(joined, cache / '0000.parquet')
    rows = [{'file_index': '0'}]
    source_hash = hashlib.sha256(json.dumps(rows[0], sort_keys=True).encode()).hexdigest()
    filter_hash = digest(filters / '0000.parquet')
    (filters / '0000.json').write_text(json.dumps({'sourceHash': source_hash, 'parquetSha256': filter_hash, 'year2025Rows': 4}))
    part = {'fileIndex': 0, 'records': 4, 'sourceHash': source_hash, 'filterSha256': filter_hash,
            'scriptHashes': {name: digest(ROOT / 'scripts' / name) for name in ('cci_openalex_work_authorships.py', 'cci_openalex_attach_authorships.py', 'cci_openalex_remote_affiliation_probe.py')},
            'parquetSha256': digest(cache / '0000.parquet'),
            'authorshipCountStatuses': dict(Counter(statuses))}
    (cache / '0000.json').write_text(json.dumps(part))
    manifest = {'status': 'all_2025_authorship_projections_not_city_output', 'records': 4, 'partitions': [part]}
    inventory = {'files': 1, 'records': 4, 'typeCorpusRetractionCounts': [
        {'type': 'article', 'isXpac': False, 'isRetracted': False, 'count': 2},
        {'type': 'dataset', 'isXpac': True, 'isRetracted': None, 'count': 1},
        {'type': 'other', 'isXpac': False, 'isRetracted': False, 'count': 1}]}
    directory = {'I1': {'efua_ids': '1', 'mapping_status': 'directory_point_match'}}
    frozen_filters = [{'fileIndex': 0, 'sourceHash': source_hash, 'parquetSha256': filter_hash, 'year2025Rows': 4}]
    return cache, filters, manifest, inventory, rows, directory, frozen_filters


class GlobalAffiliationAuditTests(unittest.TestCase):
    def test_empty_partition_is_accounted_without_authorship_parquet(self):
        with tempfile.TemporaryDirectory() as temporary:
            args = fixture(Path(temporary))
            filter_path = args[1] / '0000.parquet'
            pq.write_table(pq.read_table(filter_path).slice(0, 0), filter_path)
            part = args[2]['partitions'][0]
            part.update(records=0, parquetSha256=None, filterSha256=digest(filter_path), authorshipCountStatuses={})
            (args[1] / '0000.json').write_text(json.dumps({'sourceHash': part['sourceHash'], 'parquetSha256': part['filterSha256'], 'year2025Rows': 0}))
            (args[0] / '0000.json').write_text(json.dumps(part))
            (args[0] / '0000.parquet').unlink()
            args[2]['records'] = 0
            args[3].update(records=0, typeCorpusRetractionCounts=[])
            args[6][0].update(parquetSha256=part['filterSha256'], year2025Rows=0)
            result = audit(*args)
            self.assertEqual(result['counts']['records'], 0)
            self.assertEqual(result['authorshipCountStatuses'], {})

    def test_zero_incomplete_count_is_explicit(self):
        with tempfile.TemporaryDirectory() as temporary:
            counts = audit(*fixture(Path(temporary), complete_only=True))['counts']
            self.assertEqual(counts['records'], 4)
            self.assertEqual(counts['works'], 4)
            self.assertEqual(counts['works_with_unassessed_incomplete_authorships'], 0)

    def test_streaming_preserves_unknowns_and_empty_bylines(self):
        with tempfile.TemporaryDirectory() as temporary:
            args = fixture(Path(temporary))
            small = audit(*args, batch_size=1)
            self.assertEqual(small, audit(*args, batch_size=3))
            counts = small['counts']
            self.assertEqual(counts['records'], 4)
            self.assertEqual(counts['works_with_unassessed_incomplete_authorships'], 2)
            self.assertEqual(counts['works'], 2)
            self.assertEqual(counts['works_with_no_authorships'], 1)
            self.assertEqual(counts['works_with_all_authorships_single_consistent_directory_fua'], 1)
            self.assertEqual(counts['authorships'], 1)

    def test_duplicate_or_incomplete_manifest_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            args = fixture(Path(temporary))
            args[2]['partitions'] *= 2
            with self.assertRaisesRegex(ValueError, 'partition inventory'):
                audit(*args)
            args[2]['partitions'] = []
            with self.assertRaisesRegex(ValueError, 'partition inventory'):
                audit(*args)

    def test_rebound_cache_cannot_change_frozen_filter_membership(self):
        with tempfile.TemporaryDirectory() as temporary:
            args = fixture(Path(temporary))
            filter_path, path = args[1] / '0000.parquet', args[0] / '0000.parquet'
            for changed_path in (filter_path, path):
                changed = pq.read_table(changed_path).set_column(0, 'id', pa.array(['changed', 'W2', 'W3', 'W4']))
                pq.write_table(changed, changed_path)
            part = args[2]['partitions'][0]
            part.update(filterSha256=digest(filter_path), parquetSha256=digest(path))
            (args[1] / '0000.json').write_text(json.dumps({'sourceHash': part['sourceHash'], 'parquetSha256': part['filterSha256'], 'year2025Rows': 4}))
            (args[0] / '0000.json').write_text(json.dumps(part))
            with self.assertRaisesRegex(ValueError, 'Frozen filter partition mismatch'):
                audit(*args)

    def test_corruption_and_rebound_identity_change_are_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            args = fixture(Path(temporary))
            path = args[0] / '0000.parquet'
            changed = pq.read_table(path).set_column(0, 'id', pa.array(['changed', 'W2', 'W3', 'W4']))
            pq.write_table(changed, path)
            with self.assertRaisesRegex(ValueError, 'checksum'):
                audit(*args)
            args[2]['partitions'][0]['parquetSha256'] = digest(path)
            (args[0] / '0000.json').write_text(json.dumps(args[2]['partitions'][0]))
            with self.assertRaisesRegex(ValueError, 'identity'):
                audit(*args)

    def test_forged_status_and_global_type_totals_are_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            args = fixture(Path(temporary))
            args[3]['typeCorpusRetractionCounts'][0]['count'] = 1
            with self.assertRaisesRegex(ValueError, 'global diagnostic accounting'):
                audit(*args)
            args[3]['typeCorpusRetractionCounts'][0]['count'] = 2
            path = args[0] / '0000.parquet'
            table = pq.read_table(path)
            table = table.set_column(table.schema.get_field_index('authorship_count_status'), 'authorship_count_status', pa.array(['count_matches', 'count_matches', 'no_authors', 'missing_list']))
            pq.write_table(table, path)
            args[2]['partitions'][0]['parquetSha256'] = digest(path)
            (args[0] / '0000.json').write_text(json.dumps(args[2]['partitions'][0]))
            with self.assertRaisesRegex(ValueError, 'status mismatch'):
                audit(*args)


if __name__ == '__main__':
    unittest.main()
