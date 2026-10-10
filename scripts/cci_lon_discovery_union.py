"""Union registry discovery paths by ID without turning query hits into LON evidence."""

import argparse
import csv
import hashlib
import json
from pathlib import Path

from cci_lon_registry_inventory import ROOT, inventory, load_pages


def union(searches):
    memberships = {}
    for name, rows in searches.items():
        seen = set()
        for row in rows:
            nct = row['nct_id']
            if nct in seen:
                raise ValueError('Duplicate study within query')
            seen.add(nct)
            memberships.setdefault(nct, []).append(name)
    return [{'nct_id': nct, 'discovery_queries': '|'.join(sorted(names)),
             'scope_review': 'not_determined_by_discovery', 'fua_assignment': 'not_assigned'}
            for nct, names in sorted(memberships.items())]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    searches, source_hashes, extra = {}, {}, []
    for name, manifest in [('aging_condition', 'cci-lon-registry-source.json'),
                           ('lonafarnib_intervention', 'cci-lon-lonafarnib-source.json')]:
        raw = (folder / manifest).read_bytes()
        source_hashes[manifest] = hashlib.sha256(raw).hexdigest()
        rows, sites = inventory(load_pages(json.loads(raw), args.source_dir))
        searches[name] = rows
        if name == 'lonafarnib_intervention':
            extra = [('cci-lon-lonafarnib-studies.csv', rows), ('cci-lon-lonafarnib-locations.csv', sites)]
    combined = union(searches)
    aging_ids = {r['nct_id'] for r in searches['aging_condition']}
    extra_ids = {r['nct_id'] for r in searches['lonafarnib_intervention']}
    known = {'NCT00425607', 'NCT00916747'}
    if not known <= extra_ids - aging_ids:
        raise ValueError('Known query omissions not recovered as expected')
    hashes = {}
    for name, rows in extra + [('cci-lon-discovery-union.csv', combined)]:
        path = folder / name
        with path.open('w', newline='') as stream:
            writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator='\n')
            writer.writeheader()
            writer.writerows(rows)
        hashes[name] = hashlib.sha256(path.read_bytes()).hexdigest()
    summary = {'scope': 'Union of two frozen searches, not complete global LON research',
               'queryCounts': {k: len(v) for k, v in searches.items()},
               'uniqueStudyCount': len(combined), 'overlapCount': len(aging_ids & extra_ids),
               'newStudyCount': len(extra_ids - aging_ids), 'knownOmissionsRecovered': sorted(known),
               'sourceManifestSha256': source_hashes, 'outputSha256': hashes}
    (folder / 'cci-lon-discovery-union.json').write_text(json.dumps(summary, indent=2)+'\n')
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
