"""Audit a saved works projection; never infer complete affiliations from API flags."""

import argparse
import hashlib
import json
from pathlib import Path

import pyarrow.parquet as pq


def inspect(records):
    ids = set()
    large, mismatches = [], []
    for row in records:
        identifier = row['id']
        if identifier in ids:
            raise ValueError('Duplicate work ID')
        ids.add(identifier)
        count = row['authors_count']
        authors = row['authorships']
        if isinstance(count, bool) or not isinstance(count, int) or count < 0 or not isinstance(authors, list):
            raise ValueError('Invalid author count/list')
        observation = {'id':identifier, 'publication_year':row['publication_year'],
                       'authors_count':count, 'returned_authorships':len(authors)}
        if count > 100:
            large.append(observation)
        if count != len(authors):
            mismatches.append(observation)
    return {'recordsRead':len(ids), 'largeAuthorRecords':len(large), 'largeAuthorExamples':large,
            'countListMismatches':mismatches}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('projection', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    records = pq.read_table(args.projection).to_pylist()
    with args.projection.open('rb') as stream:
        sha = hashlib.file_digest(stream, 'sha256').hexdigest()
    result = {'status':'single_row_group_audit_not_global_validation', 'projectionSha256':sha,
              'projectionBytes':args.projection.stat().st_size, **inspect(records)}
    args.output.write_text(json.dumps(result,indent=2)+'\n')
    print({key:result[key] for key in ('recordsRead','largeAuthorRecords')}, 'mismatches',len(result['countListMismatches']))


if __name__ == '__main__':
    main()
