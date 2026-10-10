"""Stream a complete authorship projection; retain unknown geographic attribution."""

import argparse
from collections import Counter
import csv
import hashlib
from itertools import zip_longest
import json
from pathlib import Path

import pyarrow.parquet as pq

from cci_global_crosswalk import ROOT, digest
from cci_openalex_affiliation_audit import inspect


def count_status(work):
    authors, declared = work['authorships'], work['authors_count']
    if not isinstance(authors, list):
        return 'missing_list'
    if declared is None:
        return 'unknown_declared_count'
    if isinstance(declared, bool) or not isinstance(declared, int) or declared < 0:
        return 'invalid_declared_count'
    if len(authors) != declared:
        return 'count_list_mismatch'
    return 'count_matches' if declared else 'no_authors'


def audit(cache, filters, manifest, inventory, metadata_rows, directory, filter_parts, batch_size=1024):
    if manifest['status'] != 'all_2025_authorship_projections_not_city_output':
        raise ValueError('Complete authorship manifest required')
    parts = manifest['partitions']
    indices = [p['fileIndex'] for p in parts]
    expected = [int(r['file_index']) for r in metadata_rows]
    if len(set(indices)) != len(indices) or sorted(indices) != sorted(expected) or len(parts) != inventory['files']:
        raise ValueError('Incomplete or duplicate partition inventory')
    if manifest['records'] != inventory['records'] or sum(p['records'] for p in parts) != inventory['records']:
        raise ValueError('Global record count mismatch')
    frozen_filters = {p['fileIndex']: p for p in filter_parts}
    if len(frozen_filters) != len(filter_parts) or sorted(frozen_filters) != sorted(indices):
        raise ValueError('Frozen filter partition inventory mismatch')
    sources = {int(r['file_index']): hashlib.sha256(json.dumps(r, sort_keys=True).encode()).hexdigest() for r in metadata_rows}
    script_hashes = {name: digest(ROOT / 'scripts' / name) for name in ('cci_openalex_work_authorships.py', 'cci_openalex_attach_authorships.py', 'cci_openalex_remote_affiliation_probe.py')}
    counts = Counter({'records': 0, 'works': 0, 'works_with_unassessed_incomplete_authorships': 0})
    statuses, strata, examples = Counter(), Counter(), {}
    for part in sorted(parts, key=lambda p: p['fileIndex']):
        stem = f"{part['fileIndex']:04}"
        frozen = frozen_filters[part['fileIndex']]
        if part['sourceHash'] != frozen['sourceHash'] or part['filterSha256'] != frozen['parquetSha256'] or part['records'] != frozen['year2025Rows']:
            raise ValueError('Frozen filter partition mismatch')
        if json.loads((cache / f'{stem}.json').read_text()) != part or part['sourceHash'] != sources[part['fileIndex']] or part['scriptHashes'] != script_hashes:
            raise ValueError('Authorship provenance mismatch')
        filter_path = filters / f'{stem}.parquet'
        filter_record = json.loads((filters / f'{stem}.json').read_text())
        if filter_record['sourceHash'] != part['sourceHash'] or digest(filter_path) != part['filterSha256'] or filter_record['parquetSha256'] != part['filterSha256'] or filter_record['year2025Rows'] != part['records']:
            raise ValueError('Filter provenance mismatch')
        base = pq.ParquetFile(filter_path)
        if base.metadata.num_rows != part['records']:
            raise ValueError('Partition row count mismatch')
        if not part['records']:
            if part['parquetSha256'] is not None or part['authorshipCountStatuses']:
                raise ValueError('Invalid empty partition')
            continue
        path = cache / f'{stem}.parquet'
        if digest(path) != part['parquetSha256']:
            raise ValueError('Authorship checksum mismatch')
        projection = pq.ParquetFile(path)
        names = base.schema_arrow.names
        if projection.metadata.num_rows != part['records']:
            raise ValueError('Partition row count mismatch')
        part_statuses = Counter()
        for filtered, joined in zip_longest(base.iter_batches(batch_size=batch_size), projection.iter_batches(batch_size=batch_size)):
            if filtered is None or joined is None or not joined.select(names).equals(filtered):
                raise ValueError('Work identity or filter values mismatch')
            complete = []
            for work in joined.to_pylist():
                if work['publication_year'] != 2025:
                    raise ValueError('Unexpected publication year')
                status = count_status(work)
                if status != work['authorship_count_status']:
                    raise ValueError('Authorship status mismatch')
                part_statuses[status] += 1
                strata[(work['type'], work['is_xpac'], work['is_retracted'])] += 1
                counts['records'] += 1
                if status in ('count_matches', 'no_authors'):
                    complete.append(work)
                else:
                    counts['works_with_unassessed_incomplete_authorships'] += 1
            result = inspect(complete, directory)
            counts.update(result['counts'])
            for flag, items in result['examples'].items():
                examples.setdefault(flag, []).extend(items[:max(0, 3 - len(examples.get(flag, [])))])
        if dict(part_statuses) != part['authorshipCountStatuses']:
            raise ValueError('Partition authorship status counts mismatch')
        statuses.update(part_statuses)
    expected_strata = {(r['type'], r['isXpac'], r['isRetracted']): r['count'] for r in inventory['typeCorpusRetractionCounts']}
    if counts['records'] != inventory['records'] or dict(strata) != expected_strata or counts['works'] + counts['works_with_unassessed_incomplete_authorships'] != counts['records']:
        raise ValueError('Incomplete global diagnostic accounting')
    return {'counts': dict(counts), 'authorshipCountStatuses': dict(statuses), 'examples': examples}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache', type=Path, required=True)
    parser.add_argument('--filters', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    inventory_path = folder / 'cci-openalex-filter-inventory.json'
    inventory = json.loads(inventory_path.read_text())
    manifest_path = args.cache / 'manifest.json'
    manifest = json.loads(manifest_path.read_text())
    metadata_path = folder / 'cci-openalex-works-metadata.csv'
    directory_path = folder / 'cci-openalex-institution-fua.csv'
    source = json.loads((folder / 'cci-openalex-institution-source.json').read_text())
    if inventory['status'] != 'complete_unique_2025_filter_inventory_not_city_output' or manifest['filterInventorySha256'] != digest(inventory_path) or digest(args.filters / 'manifest.json') != inventory['manifestSha256'] or digest(metadata_path) != inventory['metadataCsvSha256']:
        raise ValueError('Frozen global inventory mismatch')
    if digest(directory_path) != source['outputs'][directory_path.name]:
        raise ValueError('Institution directory checksum mismatch')
    rows = list(csv.DictReader(directory_path.open()))
    directory = {r['institution_id']: r for r in rows}
    if len(directory) != len(rows):
        raise ValueError('Duplicate institution ID')
    filter_manifest = json.loads((args.filters / 'manifest.json').read_text())
    result = audit(args.cache, args.filters, manifest, inventory, list(csv.DictReader(metadata_path.open())), directory, filter_manifest['partitions'])
    output = {'status': 'complete_2025_affiliation_diagnostics_not_city_output', 'authorshipManifestSha256': digest(manifest_path), 'filterInventorySha256': digest(inventory_path), 'institutionDirectorySha256': digest(directory_path), 'scriptSha256': digest(Path(__file__)), 'affiliationRuleSha256': digest(ROOT / 'scripts/cci_openalex_affiliation_audit.py'), **result,
              'limitations': 'Counts labelled works describe complete declared bylines only; records include incomplete lists retained as unassessed. Ambiguity flags overlap. No actual research-site verification, intellectual-version deduplication, fractional credit, city output or CCI score. Unknown affiliations are never redistributed to known cities.'}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix(args.output.suffix + '.part')
    temporary.write_text(json.dumps(output, indent=2) + '\n')
    temporary.replace(args.output)
    print(result['counts'])


if __name__ == '__main__':
    main()
