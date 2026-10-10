"""Inspect all frozen works footers before committing to a bulk column read."""

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
from pathlib import Path
import struct
import urllib.request

import pyarrow as pa
import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest, write_csv

FILTERS = {'id', 'publication_year', 'type', 'is_xpac', 'is_retracted', 'authors_count'}
AFFILIATIONS = {
    'authorships.list.element.author.id',
    'authorships.list.element.affiliations.list.element.institution_ids.list.element',
    'authorships.list.element.affiliations.list.element.raw_affiliation_string',
    'authorships.list.element.institutions.list.element.id',
    'authorships.list.element.institutions.list.element.lineage.list.element',
}


def could_include_year(minimum, maximum, year):
    # Missing statistics never justify skipping a row group.
    return minimum is None or maximum is None or minimum <= year <= maximum


def inspect_file(item, index, cache, year):
    url = item['url'].replace('s3://openalex/', 'https://openalex.s3.amazonaws.com/', 1)
    if not url.startswith('https://openalex.s3.amazonaws.com/data/parquet/works/'):
        raise ValueError('Unexpected snapshot URL')
    size = item['meta']['content_length']
    record = cache / f'{index:04}.json'
    if record.exists():
        saved = json.loads(record.read_text())
        if saved['url'] != url or saved['source_bytes'] != size or saved['target_year'] != year:
            raise ValueError('Cached footer belongs to different source or query')
        footer = (cache / f'{index:04}.footer').read_bytes()
        if hashlib.sha256(footer).hexdigest() != saved['footer_sha256']:
            raise ValueError('Cached footer checksum mismatch')
        etag = saved['source_etag']
    else:
        def fetch(start, end, etag=None):
            headers = {'Range':f'bytes={start}-{end}'}
            if etag:
                headers['If-Match'] = etag
            with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=45) as response:
                if response.status != 206 or response.headers.get('Content-Range') != f'bytes {start}-{end}/{size}':
                    raise ValueError('Range response does not match frozen size')
                data = response.read()
                if len(data) != end-start+1:
                    raise ValueError('Truncated range response')
                return data, response.headers['ETag']
        tail, etag = fetch(size-8, size-1)
        if tail[-4:] != b'PAR1':
            raise ValueError('Invalid Parquet footer magic')
        length = struct.unpack('<I', tail[:4])[0]
        if not 0 < length < size-8:
            raise ValueError('Invalid footer length')
        footer, returned_etag = fetch(size-8-length, size-1, etag)
        if etag != returned_etag:
            raise ValueError('Source changed between range requests')
    meta = pq.read_metadata(pa.BufferReader(b'PAR1'+footer))
    if meta.num_rows != item['meta']['record_count']:
        raise ValueError('Footer row count differs from manifest')
    result = {'file_index':index, 'url':url, 'source_bytes':size, 'source_etag':etag,
              'target_year':year,'rows':meta.num_rows,'row_groups':meta.num_row_groups,
              'eligible_groups':0,'potential_rows':0,'unknown_year_statistics_groups':0,
              'filter_column_bytes':0,'affiliation_column_bytes':0,'full_authorship_column_bytes':0,
              'footer_bytes':len(footer),'footer_sha256':hashlib.sha256(footer).hexdigest()}
    for index_group in range(meta.num_row_groups):
        group = meta.row_group(index_group)
        columns = {group.column(i).path_in_schema:group.column(i) for i in range(group.num_columns)}
        if not (FILTERS | AFFILIATIONS) <= columns.keys():
            raise ValueError('Required projection columns missing')
        stats = columns['publication_year'].statistics
        low, high = (stats.min, stats.max) if stats and stats.has_min_max else (None, None)
        if low is None or high is None:
            result['unknown_year_statistics_groups'] += 1
        if not could_include_year(low, high, year):
            continue
        result['eligible_groups'] += 1
        result['potential_rows'] += group.num_rows
        result['filter_column_bytes'] += sum(columns[p].total_compressed_size for p in FILTERS)
        result['affiliation_column_bytes'] += sum(columns[p].total_compressed_size for p in AFFILIATIONS)
        result['full_authorship_column_bytes'] += sum(c.total_compressed_size for p,c in columns.items() if p.startswith('authorships.'))
    if not record.exists():
        (cache / f'{index:04}.footer').write_bytes(footer)
    record.write_text(json.dumps(result,indent=2)+'\n')
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', type=Path, required=True)
    parser.add_argument('--cache', type=Path, required=True)
    args = parser.parse_args()
    source = json.loads((ROOT/'docs/data/cci-openalex-works-access-audit.json').read_text())['snapshot']
    if digest(args.manifest) != source['manifestSha256']:
        raise ValueError('Manifest checksum mismatch')
    manifest = json.loads(args.manifest.read_text())
    args.cache.mkdir(parents=True,exist_ok=True)
    results = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        jobs = [pool.submit(inspect_file,item,i,args.cache,2025) for i,item in enumerate(manifest['files'])]
        for job in as_completed(jobs):
            results.append(job.result())
            if len(results) % 100 == 0:
                print('Footers verified',len(results),'/',len(jobs),flush=True)
    results.sort(key=lambda r:r['file_index'])
    if sum(r['rows'] for r in results) != source['records']:
        raise ValueError('Incomplete snapshot accounting')
    folder=ROOT/'docs/data'
    output=folder/'cci-openalex-works-metadata.csv'
    write_csv(output,results)
    totals={key:sum(r[key] for r in results) for key in ('source_bytes','rows','row_groups','eligible_groups','potential_rows','unknown_year_statistics_groups','filter_column_bytes','affiliation_column_bytes','full_authorship_column_bytes','footer_bytes')}
    summary={'status':'complete_footer_audit_not_works_download','targetYear':2025,'files':len(results),
             'totals':totals,'manifestSha256':source['manifestSha256'],'scriptSha256':digest(Path(__file__)),
             'csvSha256':digest(output),'filterColumnPaths':sorted(FILTERS),'affiliationColumnPaths':sorted(AFFILIATIONS),
             'limitations':'Potential rows are row-group candidates, not actual 2025 works. Byte sums are selected compressed column chunks, not measured transfer or a total download bound. Footer hashes and ETags do not assert full-file SHA verification. Type, corpus, retraction and author completeness require record-level reads. No city output calculated.'}
    (folder/'cci-openalex-works-metadata.json').write_text(json.dumps(summary,indent=2)+'\n')
    print(json.dumps(totals,indent=2))


if __name__ == '__main__':
    main()
