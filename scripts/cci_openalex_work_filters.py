"""Read frozen works filter columns, retaining every 2025 type and corpus."""

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
import csv
import hashlib
import json
from pathlib import Path
import tempfile
import urllib.request

import pyarrow as pa
import pyarrow.compute as pc
import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest
from cci_openalex_works_metadata import FILTERS, could_include_year


def projection(footer, size, fetch, file_index):
    meta = pq.read_metadata(pa.BufferReader(b'PAR1' + footer))
    tables = []
    scanned = downloaded = 0
    # Sparse holes avoid downloading unrelated columns; only populated columns may be read.
    with tempfile.TemporaryFile() as sparse:
        sparse.write(b'PAR1')
        sparse.seek(size - len(footer))
        sparse.write(footer)
        for group_index in range(meta.num_row_groups):
            group = meta.row_group(group_index)
            columns = {group.column(i).path_in_schema: group.column(i) for i in range(group.num_columns)}
            if not FILTERS <= columns.keys():
                raise ValueError('Required filter columns missing')
            stats = columns['publication_year'].statistics
            low, high = (stats.min, stats.max) if stats and stats.has_min_max else (None, None)
            if not could_include_year(low, high, 2025):
                continue
            for name in sorted(FILTERS):
                column = columns[name]
                offset = column.dictionary_page_offset if column.has_dictionary_page else column.data_page_offset
                length = column.total_compressed_size
                if offset < 4 or length <= 0 or offset + length > size - len(footer):
                    raise ValueError('Column range outside file data')
                data = fetch(offset, offset + length - 1)
                if len(data) != length:
                    raise ValueError('Truncated column response')
                sparse.seek(offset)
                sparse.write(data)
                downloaded += length
            sparse.flush()
            table = pq.ParquetFile(sparse).read_row_group(group_index, columns=sorted(FILTERS))
            if table.num_rows != group.num_rows:
                raise ValueError('Projected row count differs from metadata')
            scanned += table.num_rows
            table = table.append_column('source_row_group', pa.array([group_index] * table.num_rows, type=pa.int32()))
            table = table.append_column('source_row_offset', pa.array(range(table.num_rows), type=pa.int64()))
            table = table.filter(pc.equal(table['publication_year'], 2025))
            tables.append(table)
    if tables:
        result = pa.concat_tables(tables).replace_schema_metadata(None)
    else:
        schema = pa.schema([(name, meta.schema.to_arrow_schema().field(name).type) for name in sorted(FILTERS)] + [('source_row_group', pa.int32()), ('source_row_offset', pa.int64())])
        result = pa.Table.from_batches([], schema=schema)
    result = result.append_column('source_file_index', pa.array([file_index] * result.num_rows, type=pa.int32()))
    ids = result['id'].to_pylist()
    if any(not isinstance(identifier, str) or not identifier.startswith('https://openalex.org/W') for identifier in ids) or len(set(ids)) != len(ids):
        raise ValueError('Invalid or duplicate work IDs within file')
    return result, scanned, downloaded


def extract(row, footers, output):
    index = int(row['file_index'])
    stem = f'{index:04}'
    footer = (footers / f'{stem}.footer').read_bytes()
    if hashlib.sha256(footer).hexdigest() != row['footer_sha256']:
        raise ValueError('Frozen footer checksum mismatch')
    source_hash = hashlib.sha256(json.dumps(row, sort_keys=True).encode()).hexdigest()
    record_path = output / f'{stem}.json'
    parquet_path = output / f'{stem}.parquet'
    if record_path.exists():
        record = json.loads(record_path.read_text())
        if record['sourceHash'] != source_hash or record['parquetSha256'] != digest(parquet_path):
            raise ValueError('Cached projection source or checksum mismatch')
        return record
    size = int(row['source_bytes'])
    if not row['url'].startswith('https://openalex.s3.amazonaws.com/data/parquet/works/'):
        raise ValueError('Unexpected works source URL')

    def fetch(start, end):
        request = urllib.request.Request(row['url'], headers={'Range': f'bytes={start}-{end}', 'If-Match': row['source_etag']})
        with urllib.request.urlopen(request, timeout=90) as response:
            if response.status != 206 or response.headers.get('Content-Range') != f'bytes {start}-{end}/{size}' or response.headers.get('ETag') != row['source_etag']:
                raise ValueError('Source range or version mismatch')
            return response.read()

    table, scanned, downloaded = projection(footer, size, fetch, index)
    if scanned != int(row['potential_rows']) or downloaded != int(row['filter_column_bytes']):
        raise ValueError('Projection differs from frozen column accounting')
    counts = Counter((r['type'], r['is_xpac'], r['is_retracted']) for r in table.select(['type', 'is_xpac', 'is_retracted']).to_pylist())
    temporary = parquet_path.with_suffix('.parquet.part')
    pq.write_table(table, temporary, compression='zstd')
    temporary.replace(parquet_path)
    record = {'fileIndex': index, 'sourceHash': source_hash, 'parquetSha256': digest(parquet_path), 'scannedRows': scanned, 'year2025Rows': table.num_rows, 'columnBytes': downloaded, 'typeCorpusRetractionCounts': [{'type': key[0], 'isXpac': key[1], 'isRetracted': key[2], 'count': count} for key, count in sorted(counts.items(), key=lambda pair: str(pair[0]))]}
    record_path.write_text(json.dumps(record, indent=2) + '\n')
    return record


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--footers', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    summary = json.loads((ROOT / 'docs/data/cci-openalex-works-metadata.json').read_text())
    metadata = ROOT / 'docs/data/cci-openalex-works-metadata.csv'
    if digest(metadata) != summary['csvSha256']:
        raise ValueError('Metadata manifest checksum mismatch')
    rows = list(csv.DictReader(metadata.open()))
    if len(rows) != summary['files']:
        raise ValueError('Incomplete metadata manifest')
    args.output.mkdir(parents=True, exist_ok=True)
    results, failures = [], []
    with ThreadPoolExecutor(max_workers=8) as pool:
        jobs = {pool.submit(extract, row, args.footers, args.output): row['file_index'] for row in rows}
        for job in as_completed(jobs):
            try:
                results.append(job.result())
            except Exception as error:
                failures.append(jobs[job])
                print('Failed file', jobs[job], repr(error), flush=True)
            if (len(results) + len(failures)) % 20 == 0:
                print('Files completed', len(results), 'failed', len(failures), '/', len(rows), flush=True)
    if failures:
        raise RuntimeError(f'Incomplete projection; rerun to reuse verified caches: {failures}')
    if sum(r['scannedRows'] for r in results) != summary['totals']['potential_rows']:
        raise ValueError('Incomplete global row accounting')
    result = {'status': 'all_filter_columns_read_not_city_output', 'targetYear': 2025, 'files': len(results), 'metadataCsvSha256': summary['csvSha256'], 'scriptSha256': digest(Path(__file__)), 'scannedRows': sum(r['scannedRows'] for r in results), 'year2025Rows': sum(r['year2025Rows'] for r in results), 'columnBytes': sum(r['columnBytes'] for r in results), 'limitations': 'All 2025 types and corpora retained, including retracted and unknown flags. Cross-file duplicate IDs still require audit. Column bytes exclude retries and failed attempts. No affiliations or city output read.', 'partitions': sorted(results, key=lambda r: r['fileIndex'])}
    (args.output / 'manifest.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: result[key] for key in ('files', 'scannedRows', 'year2025Rows', 'columnBytes')})


if __name__ == '__main__':
    main()
