"""Locate directory hierarchy ambiguity without assigning works to parent cities."""

import csv
import json
from collections import defaultdict
from pathlib import Path

from cci_global_crosswalk import ROOT, digest, write_csv


def profile(rows):
    directory = {r['institution_id']: r for r in rows}
    if len(directory) != len(rows):
        raise ValueError('Duplicate institution ID')
    children = defaultdict(set)
    for row in rows:
        for ancestor in set(filter(None, row['lineage_ids'].split(';'))) - {row['institution_id']}:
            children[ancestor].add(row['institution_id'])
    output = []
    for parent, descendants in sorted(children.items()):
        members = descendants | {parent}
        known = [directory[i] for i in members if i in directory]
        fuas = sorted({r['efua_ids'] for r in known if r['mapping_status'] == 'directory_point_match'})
        unlocated = sum(r['mapping_status'] != 'directory_point_match' for r in known)
        parent_row = directory.get(parent, {})
        output.append({'institution_id': parent, 'source_name': parent_row.get('source_name', ''),
                       'parent_in_directory': parent in directory,
                       'parent_efua_ids': parent_row.get('efua_ids', ''),
                       'descendant_records': len(descendants), 'hierarchy_directory_fua_count': len(fuas),
                       'hierarchy_directory_fua_ids': ';'.join(fuas),
                       'known_members_without_unique_fua': unlocated,
                       'members_missing_from_directory': len(members) - len(known)})
    return output


def main():
    folder = ROOT / 'docs/data'
    path = folder / 'cci-openalex-institution-fua.csv'
    source = json.loads((folder / 'cci-openalex-institution-source.json').read_text())
    if digest(path) != source['outputs'][path.name]:
        raise ValueError('Frozen institution directory checksum mismatch')
    rows = list(csv.DictReader(path.open()))
    if len(rows) != source['recordCount']:
        raise ValueError('Incomplete institution directory')
    output = profile(rows)
    target = folder / 'cci-openalex-hierarchy-locations.csv'
    write_csv(target, output)
    summary = {'status': 'complete_directory_hierarchy_diagnostic_not_work_attribution',
               'directoryRecords': len(rows), 'ancestorIds': len(output),
               'ancestorsMissingFromDirectory': sum(not r['parent_in_directory'] for r in output),
               'hierarchiesWithMultipleDirectoryFuas': sum(r['hierarchy_directory_fua_count'] > 1 for r in output),
               'hierarchiesWithUnlocatedKnownMembers': sum(r['known_members_without_unique_fua'] > 0 for r in output),
               'directorySha256': digest(path), 'csvSha256': digest(target), 'scriptSha256': digest(Path(__file__)),
               'method': 'Each non-self lineage ID receives distinct descendant directory records. Count unique directory FUA points among ancestor plus descendants; no paper counts used.',
               'limitations': 'Hierarchy includes ancestral and successor relationships from the frozen source, not only direct parent-child links. Multiple points demonstrate possible location ambiguity, not where any work occurred. A single point or no listed descendants does not prove a single-campus institution. Missing directory or FUA matches remain unknown. No institutions excluded and no city output assigned.'}
    (folder / 'cci-openalex-hierarchy-locations.json').write_text(json.dumps(summary, indent=2)+'\n')
    print({key: summary[key] for key in ('directoryRecords', 'ancestorIds', 'ancestorsMissingFromDirectory', 'hierarchiesWithMultipleDirectoryFuas', 'hierarchiesWithUnlocatedKnownMembers')})


if __name__ == '__main__':
    main()
