"""Read necessary authorship columns for all target-year works in frozen partitions."""

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
import csv
import hashlib
import json
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest
from cci_openalex_attach_authorships import attach
from cci_openalex_remote_affiliation_probe import read_group


def extract(row, filters_cache, footers, output):
    index = int(row['file_index'])
    stem = f'{index:04}'
    filter_path = filters_cache / f'{stem}.parquet'
    filter_record = json.loads((filters_cache / f'{stem}.json').read_text())
    source_hash = hashlib.sha256(json.dumps(row, sort_keys=True).encode()).hexdigest()
    if filter_record['sourceHash'] != source_hash or digest(filter_path) != filter_record['parquetSha256']:
        raise ValueError('Filter source or checksum mismatch')
    footer = (footers / f'{stem}.footer').read_bytes()
    if hashlib.sha256(footer).hexdigest() != row['footer_sha256']:
        raise ValueError('Footer checksum mismatch')
    script_hashes = {name: digest(ROOT / 'scripts' / name) for name in ('cci_openalex_work_authorships.py', 'cci_openalex_attach_authorships.py', 'cci_openalex_remote_affiliation_probe.py')}
    record_path, parquet_path = output / f'{stem}.json', output / f'{stem}.parquet'
    if record_path.exists():
        saved = json.loads(record_path.read_text())
        if saved['filterSha256'] != filter_record['parquetSha256'] or saved['sourceHash'] != source_hash or saved['scriptHashes'] != script_hashes:
            raise ValueError('Authorship cache version mismatch')
        if saved['records'] and digest(parquet_path) != saved['parquetSha256']:
            raise ValueError('Authorship cache checksum mismatch')
        return saved
    filters = pq.read_table(filter_path)
    if filters.num_rows != filter_record['year2025Rows']:
        raise ValueError('Filter row count mismatch')
    groups = sorted(set(filters['source_row_group'].to_pylist()))
    joined, ledger = [], []
    for group_index in groups:
        group, ranges = read_group(row, footer, group_index)
        joined.append(attach(filters, group, index, group_index))
        ledger.append({'rowGroup': group_index, 'ranges': ranges})
    counts = Counter()
    sha = None
    if joined:
        table = pa.concat_tables(joined).replace_schema_metadata(None)
        if table.num_rows != filters.num_rows or table['id'].to_pylist() != filters['id'].to_pylist():
            raise ValueError('Joined partition identity/count mismatch')
        counts.update(table['authorship_count_status'].to_pylist())
        temporary = parquet_path.with_suffix('.parquet.part')
        pq.write_table(table, temporary, compression='zstd')
        if not pq.read_table(temporary).equals(table):
            raise ValueError('Saved authorship partition round-trip mismatch')
        temporary.replace(parquet_path)
        sha = digest(parquet_path)
    result = {'fileIndex': index, 'sourceHash': source_hash, 'filterSha256': filter_record['parquetSha256'], 'scriptHashes': script_hashes,
              'records': filters.num_rows, 'groupsRead': len(groups), 'authorshipCountStatuses': dict(counts),
              'columnBytes': sum(r['bytes'] for entry in ledger for r in entry['ranges']),
              'parquetSha256': sha, 'rangeLedger': ledger}
    record_path.write_text(json.dumps(result, indent=2)+'\n')
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--filters', type=Path, required=True)
    parser.add_argument('--footers', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    audit = json.loads((folder / 'cci-openalex-filter-inventory.json').read_text())
    if digest(args.filters / 'manifest.json') != audit['manifestSha256'] or audit['status'] != 'complete_unique_2025_filter_inventory_not_city_output':
        raise ValueError('Complete unique filter inventory required')
    metadata = folder / 'cci-openalex-works-metadata.csv'
    if digest(metadata) != audit['metadataCsvSha256']:
        raise ValueError('Frozen metadata mismatch')
    rows = list(csv.DictReader(metadata.open()))
    args.output.mkdir(parents=True, exist_ok=True)
    results, failures = [], []
    with ThreadPoolExecutor(max_workers=4) as pool:
        jobs = {pool.submit(extract, row, args.filters, args.footers, args.output): row['file_index'] for row in rows}
        for job in as_completed(jobs):
            try:
                results.append(job.result())
            except Exception as error:
                failures.append(jobs[job])
                print('Failed file', jobs[job], repr(error), flush=True)
            if (len(results)+len(failures)) % 20 == 0:
                print('Completed', len(results), 'failed', len(failures), '/', len(rows), flush=True)
    if failures:
        raise RuntimeError(f'Incomplete authorship extraction; reuse caches on retry: {failures}')
    count = sum(r['records'] for r in results)
    if len(results) != audit['files'] or count != audit['records']:
        raise ValueError('Incomplete global authorship accounting')
    result = {'status': 'all_2025_authorship_projections_not_city_output', 'records': count, 'filterInventorySha256': digest(folder / 'cci-openalex-filter-inventory.json'), 'partitions': sorted(results, key=lambda r: r['fileIndex']),
              'limitations': 'Count/list discrepancies and unknowns retained. No publisher completeness, geographic attribution, intellectual-version deduplication or CCI score established.'}
    (args.output / 'manifest.json').write_text(json.dumps(result, indent=2)+'\n')
    print('Records', count, 'files', len(results))


if __name__ == '__main__':
    main()
