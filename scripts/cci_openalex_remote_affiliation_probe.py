"""Verify remote nested column ranges against the independently saved full row group."""

import argparse
import csv
import hashlib
import json
from pathlib import Path
import tempfile
import urllib.request

import pyarrow as pa
import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest
from cci_openalex_works_metadata import AFFILIATIONS


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--footers', type=Path, required=True)
    parser.add_argument('--reference', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    source = json.loads((folder / 'cci-openalex-works-access-audit.json').read_text())['parquetProbe']
    previous = json.loads((folder / 'cci-openalex-authorship-rowgroup-audit.json').read_text())
    metadata = folder / 'cci-openalex-works-metadata.csv'
    if digest(metadata) != json.loads((folder / 'cci-openalex-works-metadata.json').read_text())['csvSha256']:
        raise ValueError('Metadata checksum mismatch')
    if digest(args.reference) != previous['projectionSha256']:
        raise ValueError('Independent reference checksum mismatch')
    row = next(r for r in csv.DictReader(metadata.open()) if r['url'] == source['url'])
    footer = (args.footers / f"{int(row['file_index']):04}.footer").read_bytes()
    if hashlib.sha256(footer).hexdigest() != row['footer_sha256']:
        raise ValueError('Footer checksum mismatch')
    size = int(row['source_bytes'])
    meta = pq.read_metadata(pa.BufferReader(b'PAR1' + footer))
    group_index = source['rowGroupRead']
    group = meta.row_group(group_index)
    selected = {'id', 'publication_year', 'authors_count'} | AFFILIATIONS
    columns = {group.column(i).path_in_schema: group.column(i) for i in range(group.num_columns)}
    if not selected <= columns.keys():
        raise ValueError('Required physical columns missing')
    ranges = []
    with tempfile.TemporaryFile() as sparse:
        sparse.write(b'PAR1')
        sparse.seek(size - len(footer))
        sparse.write(footer)
        for name in sorted(selected):
            column = columns[name]
            start = column.dictionary_page_offset if column.has_dictionary_page else column.data_page_offset
            end = start + column.total_compressed_size - 1
            if not 4 <= start <= end < size - len(footer):
                raise ValueError('Invalid physical column bounds')
            request = urllib.request.Request(row['url'], headers={'Range': f'bytes={start}-{end}', 'If-Match': row['source_etag']})
            with urllib.request.urlopen(request, timeout=90) as response:
                if response.status != 206 or response.headers.get('Content-Range') != f'bytes {start}-{end}/{size}' or response.headers.get('ETag') != row['source_etag']:
                    raise ValueError('Remote range or version mismatch')
                data = response.read()
            if len(data) != end - start + 1:
                raise ValueError('Truncated column range')
            sparse.seek(start)
            sparse.write(data)
            ranges.append({'column': name, 'start': start, 'end': end, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        sparse.flush()
        actual = pq.ParquetFile(sparse).read_row_group(group_index, columns=sorted(selected)).replace_schema_metadata(None)
    expected = pq.ParquetFile(args.reference).read(columns=sorted(selected)).replace_schema_metadata(None)
    if actual.num_rows != group.num_rows or not actual.equals(expected):
        raise ValueError('Remote projection differs from independent cached projection')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    pq.write_table(actual, args.output, compression='zstd')
    if not pq.read_table(args.output).equals(actual):
        raise ValueError('Saved projection round-trip mismatch')
    result = {'status': 'single_remote_row_group_projection_verified_not_global',
              'sourceUrl': row['url'], 'sourceEtag': row['source_etag'], 'fileIndex': int(row['file_index']), 'rowGroup': group_index,
              'rowsCompared': actual.num_rows, 'columnBytesRead': sum(r['bytes'] for r in ranges), 'ranges': ranges,
              'referenceSha256': digest(args.reference), 'savedProjectionSha256': digest(args.output), 'scriptSha256': digest(Path(__file__)),
              'limitations': 'Exact selected-field equality with an independently saved row group, not full-snapshot source byline completeness or city attribution. Eight HTTP body ranges counted; transport overhead and any failed attempts excluded.'}
    (folder / 'cci-openalex-remote-affiliation-probe.json').write_text(json.dumps(result, indent=2) + '\n')
    print({'rowsCompared': actual.num_rows, 'columnBytesRead': result['columnBytesRead'], 'savedProjectionBytes': args.output.stat().st_size})


if __name__ == '__main__':
    main()
