"""Attach verified authorships by frozen source position, retaining incomplete lists."""

import argparse
from collections import Counter
import json
from pathlib import Path

import pyarrow as pa
import pyarrow.compute as pc
import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest


def attach(filters, group, file_index, group_index):
    selected = filters.filter(pc.and_(pc.equal(filters['source_file_index'], file_index), pc.equal(filters['source_row_group'], group_index)))
    offsets = selected['source_row_offset'].to_pylist()
    expected_offsets = [i for i, year in enumerate(group['publication_year'].to_pylist()) if year == 2025]
    if offsets != expected_offsets:
        raise ValueError('Filter positions do not cover exactly the target-year rows')
    matched = group.take(pa.array(offsets, type=pa.int64()))
    for column in ('id', 'publication_year', 'authors_count'):
        if selected[column].to_pylist() != matched[column].to_pylist():
            raise ValueError(f'Work identity mismatch in {column}')
    statuses = []
    for declared, authors in zip(matched['authors_count'].to_pylist(), matched['authorships'].to_pylist()):
        if not isinstance(authors, list):
            status = 'missing_list'
        elif declared is None:
            status = 'unknown_declared_count'
        elif isinstance(declared, bool) or not isinstance(declared, int) or declared < 0:
            status = 'invalid_declared_count'
        elif len(authors) != declared:
            status = 'count_list_mismatch'
        elif declared == 0:
            status = 'no_authors'
        else:
            status = 'count_matches'
        statuses.append(status)
    result = selected.append_column('authorships', matched['authorships'])
    return result.append_column('authorship_count_status', pa.array(statuses, type=pa.string()))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--filters', type=Path, required=True)
    parser.add_argument('--authorships', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    source = json.loads((folder / 'cci-openalex-remote-affiliation-probe.json').read_text())
    if digest(args.authorships) != source['savedProjectionSha256']:
        raise ValueError('Verified remote authorship projection required')
    index, group_index = source['fileIndex'], source['rowGroup']
    path = args.filters / f'{index:04}.parquet'
    manifest = json.loads(path.with_suffix('.json').read_text())
    if manifest['fileIndex'] != index or digest(path) != manifest['parquetSha256']:
        raise ValueError('Filter projection checksum or source mismatch')
    filters, authorships = pq.read_table(path), pq.read_table(args.authorships)
    result = attach(filters, authorships, index, group_index)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    pq.write_table(result, args.output, compression='zstd')
    if not pq.read_table(args.output).equals(result):
        raise ValueError('Joined projection round-trip mismatch')
    audit = {'status': 'single_row_group_work_authorship_join_not_city_output',
             'fileIndex': index, 'rowGroup': group_index, 'targetYear': 2025, 'records': result.num_rows,
             'authorshipCountStatuses': dict(Counter(result['authorship_count_status'].to_pylist())),
             'filterProjectionSha256': digest(path), 'authorshipProjectionSha256': digest(args.authorships),
             'joinedProjectionSha256': digest(args.output), 'scriptSha256': digest(Path(__file__)),
             'limitations': 'Exact frozen source-position and identity join for one group. Count matching does not prove publisher byline completeness. Incomplete or zero-author records remain flagged, never renormalized. No institution location decision, fractional credit or CCI score.'}
    (folder / 'cci-openalex-authorship-join-probe.json').write_text(json.dumps(audit, indent=2)+'\n')
    print({'records': result.num_rows, 'statuses': audit['authorshipCountStatuses']})


if __name__ == '__main__':
    main()
