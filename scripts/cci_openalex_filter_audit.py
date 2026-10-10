"""Verify every completed filter shard and reject cross-file duplicate works."""

import argparse
from collections import Counter
from contextlib import closing
import csv
import json
from pathlib import Path
import re
import sqlite3
import tempfile

import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest


def audit(partitions, cache):
    counts = Counter()
    rows = unknown_authors = invalid_authors = 0
    indices = [p['fileIndex'] for p in partitions]
    if len(set(indices)) != len(indices):
        raise ValueError('Duplicate partition index')
    with tempfile.TemporaryDirectory() as folder, closing(sqlite3.connect(str(Path(folder) / 'ids.sqlite'))) as db:
        db.execute('PRAGMA cache_size=-131072')
        db.execute('CREATE TABLE works (id TEXT PRIMARY KEY, file INTEGER, row_group INTEGER, row_offset INTEGER, UNIQUE(file,row_group,row_offset))')
        for partition in partitions:
            index = partition['fileIndex']
            path = cache / f'{index:04}.parquet'
            if digest(path) != partition['parquetSha256']:
                raise ValueError(f'Projection checksum mismatch: {index}')
            file_counts = Counter()
            file_rows = 0
            for batch in pq.ParquetFile(path).iter_batches(batch_size=65536):
                records = batch.to_pylist()
                locations = []
                for record in records:
                    identifier = record['id']
                    if not isinstance(identifier, str) or not re.fullmatch(r'https://openalex.org/W[0-9]+', identifier):
                        raise ValueError('Invalid work ID')
                    if record['publication_year'] != 2025 or record['source_file_index'] != index:
                        raise ValueError('Wrong year or source partition')
                    group, offset = record['source_row_group'], record['source_row_offset']
                    if any(isinstance(v, bool) or not isinstance(v, int) or v < 0 for v in (group, offset)):
                        raise ValueError('Invalid source position')
                    kind, xpac, retracted = record['type'], record['is_xpac'], record['is_retracted']
                    if kind is not None and not isinstance(kind, str):
                        raise ValueError('Invalid work type')
                    if any(v is not None and not isinstance(v, bool) for v in (xpac, retracted)):
                        raise ValueError('Invalid corpus or retraction flag')
                    count = record['authors_count']
                    unknown_authors += count is None
                    invalid_authors += count is not None and (isinstance(count, bool) or not isinstance(count, int) or count < 0)
                    file_counts[(kind, xpac, retracted)] += 1
                    locations.append((identifier, index, group, offset))
                try:
                    db.executemany('INSERT INTO works VALUES (?,?,?,?)', locations)
                except sqlite3.IntegrityError as error:
                    raise ValueError(f'Duplicate work ID or source position while reading partition {index}') from error
                file_rows += len(records)
            expected = Counter()
            for entry in partition['typeCorpusRetractionCounts']:
                expected[(entry['type'], entry['isXpac'], entry['isRetracted'])] += entry['count']
            if file_rows != partition['year2025Rows'] or file_counts != expected:
                raise ValueError(f'Partition record accounting mismatch: {index}')
            rows += file_rows
            counts.update(file_counts)
            db.commit()
        if db.execute('SELECT COUNT(*) FROM works').fetchone()[0] != rows:
            raise ValueError('Unique ID accounting mismatch')
    return {'records': rows, 'uniqueWorkIds': rows, 'unknownAuthorCounts': unknown_authors,
            'invalidAuthorCounts': invalid_authors,
            'typeCorpusRetractionCounts': [{'type': key[0], 'isXpac': key[1], 'isRetracted': key[2], 'count': count} for key, count in sorted(counts.items(), key=lambda pair: str(pair[0]))]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache', type=Path, required=True)
    args = parser.parse_args()
    manifest_path = args.cache / 'manifest.json'
    manifest = json.loads(manifest_path.read_text())
    metadata_summary = json.loads((ROOT / 'docs/data/cci-openalex-works-metadata.json').read_text())
    metadata_path = ROOT / 'docs/data/cci-openalex-works-metadata.csv'
    if manifest['status'] != 'all_filter_columns_read_not_city_output' or manifest['targetYear'] != 2025:
        raise ValueError('Completed target-year manifest required')
    if digest(metadata_path) != manifest['metadataCsvSha256'] or manifest['metadataCsvSha256'] != metadata_summary['csvSha256']:
        raise ValueError('Frozen metadata mismatch')
    metadata = list(csv.DictReader(metadata_path.open()))
    partitions = manifest['partitions']
    if sorted(p['fileIndex'] for p in partitions) != list(range(len(metadata))) or manifest['files'] != len(metadata):
        raise ValueError('Incomplete partition set')
    if manifest['scannedRows'] != metadata_summary['totals']['potential_rows'] or manifest['columnBytes'] != metadata_summary['totals']['filter_column_bytes']:
        raise ValueError('Incomplete source row or byte accounting')
    result = audit(partitions, args.cache)
    if result['records'] != manifest['year2025Rows']:
        raise ValueError('Global 2025 count mismatch')
    output = {'status': 'complete_unique_2025_filter_inventory_not_city_output', 'manifestSha256': digest(manifest_path), 'metadataCsvSha256': manifest['metadataCsvSha256'], 'scriptSha256': digest(Path(__file__)), 'files': len(partitions), **result,
              'limitations': 'Uniqueness is by OpenAlex ID, not intellectual-work version deduplication. All types, corpora and retraction states remain separate; unknown and invalid author counts do not become zero. No affiliation completeness, city attribution or CCI score is established.'}
    (ROOT / 'docs/data/cci-openalex-filter-inventory.json').write_text(json.dumps(output, indent=2) + '\n')
    print({key: result[key] for key in ('records', 'uniqueWorkIds', 'unknownAuthorCounts', 'invalidAuthorCounts')})


if __name__ == '__main__':
    main()
