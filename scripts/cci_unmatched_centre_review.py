"""Retain unmatched newer centres as unresolved competitors, without merging city identities."""

import argparse
import csv
import hashlib
import io
import json
import math
from collections import Counter
from pathlib import Path

from cci_global_coverage import DIMENSIONS, ROOT


def review_rows(ucdb, wup, links):
    catalog = {}
    for source, records, field in (('ucdb', ucdb, 'ucdb_id'), ('wup', wup, 'wup_2025_id')):
        for row in records:
            key = (source, int(row[field]))
            count = int(row['intersecting_efuas'])
            status = 'no_overlap' if count == 0 else 'single_overlap' if count == 1 else 'multiple_overlaps'
            if key[1] <= 0 or key in catalog or count < 0 or row['status'] != status:
                raise ValueError('Invalid, duplicate or inconsistent centre coverage')
            catalog[key] = row
    graph = {key: set() for key, row in catalog.items() if row['status'] == 'no_overlap'}
    outside_links = {key: set() for key in graph}
    pairs = set()
    degrees = Counter()
    for row in links:
        a, b = ('wup', int(row['wup_2025_id'])), ('ucdb', int(row['ucdb_id']))
        area, a_share, b_share = (float(row[field]) for field in
                                 ('overlap_km2', 'wup_area_share', 'ucdb_area_share'))
        if (a not in catalog or b not in catalog or (a, b) in pairs
                or not all(math.isfinite(v) for v in (area, a_share, b_share))
                or area <= 0 or not 0 < a_share <= 1 or not 0 < b_share <= 1):
            raise ValueError('Invalid, duplicate or unknown centre overlap')
        pairs.add((a, b))
        degrees[a] += 1
        for left, right in ((a, b), (b, a)):
            if left in graph:
                (graph[left] if right in graph else outside_links[left]).add(right)
    if any(int(row['intersecting_ucdb_centres']) != degrees[key]
           for key, row in catalog.items() if key[0] == 'wup'):
        raise ValueError('WUP centre-link inventory mismatch')
    rows, seen = [], set()
    for node in sorted(graph):
        if node in seen:
            continue
        pending, component = [node], set()
        while pending:
            key = pending.pop()
            if key in seen:
                continue
            seen.add(key)
            component.add(key)
            pending.extend(graph[key] - seen)
        group = f'{node[0]}:{node[1]}'
        indirect = any(outside_links[key] for key in component)
        for key in sorted(component):
            rows.append({
                'source': key[0], 'source_id': key[1], 'review_group': group,
                'unmatched_other_source_ids': ';'.join(str(other[1]) for other in sorted(graph[key])),
                'fua_overlapping_other_source_ids': ';'.join(str(other[1]) for other in sorted(outside_links[key])),
                'group_has_indirect_fua_link': str(indirect).lower(),
                'boundary_status': 'no_direct_fua_overlap_identity_unresolved',
                'retention_status': 'retained_unresolved_competitor',
                **{d: 'not_assessed_under_global_protocol' for d in DIMENSIONS},
                'cci_center': '',
            })
    return rows


def build():
    folder, inputs = ROOT / 'docs/data', {}

    def read(name, manifest_name, field):
        manifest_path = folder / manifest_name
        manifest = json.loads(manifest_path.read_text())
        raw = (folder / name).read_bytes()
        digest = hashlib.sha256(raw).hexdigest()
        if digest != manifest[field][name]:
            raise ValueError(f'Input hash mismatch: {name}')
        inputs[name] = {'sha256': digest, 'provenance': manifest_name,
                        'provenanceSha256': hashlib.sha256(manifest_path.read_bytes()).hexdigest()}
        return list(csv.DictReader(io.StringIO(raw.decode())))

    ucdb = read('cci-ucdb-efua-centre-coverage.csv', 'cci-ucdb-efua-crosswalk.json', 'files')
    wup = read('cci-wup-2025-centre-coverage.csv', 'cci-wup-2025-crosswalk.json', 'outputs')
    links = read('cci-wup-2025-ucdb-overlaps.csv', 'cci-wup-2025-crosswalk.json', 'outputs')
    if len(ucdb) != 11422 or len(wup) != 12140 or len(links) != 11400:
        raise ValueError('Frozen source inventory changed')
    rows = review_rows(ucdb, wup, links)
    groups = {r['review_group']: r['group_has_indirect_fua_link'] for r in rows}
    stream = io.StringIO(newline='')
    writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)
    raw = stream.getvalue().encode()
    summary = {
        'status': 'unmatched_centre_competitor_review_not_candidate_migration_or_ranking',
        'sourceVersions': {'ucdb': 'GHS-UCDB R2024A V1.2', 'wup': 'GHS-WUP R2025A V1.1, Year=2025'},
        'recordCount': len(rows), 'sourceRecordCounts': dict(Counter(r['source'] for r in rows)),
        'reviewGroupCount': len(groups),
        'groupsWithIndirectFuaLink': sum(v == 'true' for v in groups.values()),
        'groupsWithoutIndirectFuaLink': sum(v == 'false' for v in groups.values()),
        'unresolvedIdentityRecordCount': len(rows), 'supportedExclusionCount': 0,
        'globalRankingEligible': False,
        'inputs': inputs, 'scriptSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        'csvSha256': hashlib.sha256(raw).hexdigest(),
        'method': 'Every newer centre without direct positive-area FUA overlap is retained. '
                  'Connected components of their cross-source overlap graph are review groups only. '
                  'Links to other-source centres with FUA overlap remain explicit indirect contacts.',
        'limitations': 'Records and graph groups are not counts of distinct cities. Overlap, including '
                      'transitive overlap, establishes neither identity nor FUA resident coverage. '
                      'No centre inherits scores or an exclusion from an overlapping centre. '
                      'All eight dimensions and total centres remain unassessed. Frozen FUA candidates '
                      'remain separate; do not add these records to their ranking count. This review '
                      'does not cover every settlement below the source definitions or resolve migration.',
    }
    return raw, summary


def verify():
    raw, summary = build()
    folder = ROOT / 'docs/data'
    if ((folder / 'cci-unmatched-centre-review.csv').read_bytes() != raw
            or json.loads((folder / 'cci-unmatched-centre-review.json').read_text()) != summary):
        raise ValueError('Unmatched-centre review is stale; regenerate it')
    return summary


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    if args.check:
        summary = verify()
    else:
        raw, summary = build()
        folder = ROOT / 'docs/data'
        (folder / 'cci-unmatched-centre-review.csv').write_bytes(raw)
        (folder / 'cci-unmatched-centre-review.json').write_text(json.dumps(summary, indent=2) + '\n')
    print({k: summary[k] for k in ('recordCount', 'reviewGroupCount', 'groupsWithIndirectFuaLink',
                                   'globalRankingEligible')})


if __name__ == '__main__':
    main()
