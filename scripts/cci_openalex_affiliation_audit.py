"""Inspect affiliation ambiguity before assigning works to directory locations."""

import argparse
from collections import Counter
import csv
import json
from pathlib import Path

import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest


def inspect(records, directory):
    counts = Counter()
    examples = {}
    for work in records:
        if work['publication_year'] != 2025:
            continue
        counts['works'] += 1
        authors = work['authorships']
        if not isinstance(authors, list) or len(authors) != work['authors_count']:
            raise ValueError('Incomplete author list')
        counts['authorships'] += len(authors)
        for position, author in enumerate(authors):
            affiliations = author.get('affiliations') or []
            institutions = author.get('institutions') or []
            raw_ids = {identifier for affiliation in affiliations for identifier in affiliation.get('institution_ids') or []}
            flat_ids = {institution['id'] for institution in institutions}
            direct = raw_ids | flat_ids
            locations = {directory[i]['efua_ids'] for i in direct if i in directory and directory[i]['mapping_status'] == 'directory_point_match'}
            parents = {(institution['id'], ancestor) for institution in institutions for ancestor in institution.get('lineage') or [] if ancestor != institution['id'] and ancestor in direct}
            flags = {
                'no_matched_institution': not direct,
                'raw_flat_id_disagreement': raw_ids != flat_ids,
                'unmatched_raw_affiliation': any(a.get('raw_affiliation_string') and not a.get('institution_ids') for a in affiliations),
                'no_affiliation_records': not affiliations,
                'institution_missing_from_directory': any(i not in directory for i in direct),
                'institution_without_unique_directory_fua': any(i in directory and directory[i]['mapping_status'] != 'directory_point_match' for i in direct),
                'multiple_directory_fuas': len(locations) > 1,
                'direct_parent_child_overlap': bool(parents),
            }
            for flag, present in flags.items():
                if present:
                    counts[flag] += 1
                    if len(examples.setdefault(flag, [])) < 3:
                        examples[flag].append({'workId': work['id'], 'authorshipPosition': position, 'directInstitutionIds': sorted(direct), 'directoryFuaIds': sorted(locations), 'parentChildPairs': sorted(parents)})
    return {'counts': dict(counts), 'examples': examples}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('projection', type=Path)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    provenance = json.loads((folder / 'cci-openalex-institution-source.json').read_text())
    directory_path = folder / 'cci-openalex-institution-fua.csv'
    if digest(directory_path) != provenance['outputs'][directory_path.name]:
        raise ValueError('Institution directory checksum mismatch')
    rows = list(csv.DictReader(directory_path.open()))
    directory = {r['institution_id']: r for r in rows}
    if len(directory) != len(rows):
        raise ValueError('Duplicate institution ID')
    source = json.loads((folder / 'cci-openalex-authorship-rowgroup-audit.json').read_text())
    if digest(args.projection) != source['projectionSha256']:
        raise ValueError('Previously verified row-group projection required')
    result = inspect(pq.read_table(args.projection).to_pylist(), directory)
    output = {'status': 'single_row_group_affiliation_diagnostics_not_city_output', 'selection': '2025 works in first row group of largest frozen works file; not representative', 'projectionSha256': digest(args.projection), 'institutionDirectorySha256': digest(directory_path), 'scriptSha256': digest(Path(__file__)), **result,
              'limitations': 'Flag counts overlap and count authorships, except works/authorships totals. Directory FUA matches are diagnostic points, not verified research locations. Parent-child overlap does not authorize dropping either institution. Unknown affiliations must not be redistributed to known cities. No full-snapshot rates, fractional output or score calculated.'}
    (folder / 'cci-openalex-affiliation-rowgroup-audit.json').write_text(json.dumps(output, indent=2) + '\n')
    print(result['counts'])


if __name__ == '__main__':
    main()
