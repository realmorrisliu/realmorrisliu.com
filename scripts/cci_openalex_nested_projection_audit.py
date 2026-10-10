"""Compare nested leaf projections with full cached authorship records."""

import argparse
import json
from pathlib import Path

import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest
from cci_openalex_works_metadata import AFFILIATIONS


def expected_author(author):
    if author is None:
        return None
    person = author.get('author')
    institutions = author.get('institutions')
    return {'author': None if person is None else {'id': person.get('id')},
            'affiliations': author.get('affiliations'),
            'institutions': None if institutions is None else [None if institution is None else {'id': institution.get('id'), 'lineage': institution.get('lineage')} for institution in institutions]}


def inspect(path):
    full = pq.ParquetFile(path)
    columns = ['id', 'publication_year', 'authors_count'] + sorted(AFFILIATIONS)
    # Dataset field paths differ from Parquet physical leaf paths for nested lists.
    projected = pq.ParquetFile(path).read(columns=columns).to_pylist()
    rows = authors = large = 0
    for batch in full.iter_batches(batch_size=4096):
        for record in batch.to_pylist():
            actual = projected[rows]
            expected = {key: record[key] for key in ('id', 'publication_year', 'authors_count')}
            expected['authorships'] = None if record['authorships'] is None else [expected_author(a) for a in record['authorships']]
            if actual != expected:
                raise ValueError(f'Nested projection changed record at {rows}')
            if not isinstance(actual['authorships'], list) or len(actual['authorships']) != actual['authors_count']:
                raise ValueError('Author list count mismatch')
            authors += len(actual['authorships'])
            large += len(actual['authorships']) > 100
            rows += 1
    if rows != len(projected):
        raise ValueError('Projection row count mismatch')
    return {'recordsCompared': rows, 'authorshipsCompared': authors, 'worksAbove100Authors': large, 'selectedPhysicalColumns': columns}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('projection', type=Path)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    source = json.loads((folder / 'cci-openalex-authorship-rowgroup-audit.json').read_text())
    if digest(args.projection) != source['projectionSha256']:
        raise ValueError('Verified cached projection required')
    result = {'status': 'cached_single_row_group_nested_projection_equivalence',
              'projectionSha256': digest(args.projection), 'scriptSha256': digest(Path(__file__)), **inspect(args.projection),
              'limitations': 'Exact selected-field equality in one cached row group, including order and null values. Not a remote range-read validation or full-snapshot author/affiliation completeness result. No city attribution.'}
    (folder / 'cci-openalex-nested-projection-audit.json').write_text(json.dumps(result, indent=2)+'\n')
    print({key: result[key] for key in ('recordsCompared', 'authorshipsCompared', 'worksAbove100Authors')})


if __name__ == '__main__':
    main()
