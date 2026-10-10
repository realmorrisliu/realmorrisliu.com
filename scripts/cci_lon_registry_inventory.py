"""Inventory a frozen Aging registry search; never interpret hits as city capability."""

import argparse
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parents[1]


def inventory(pages):
    studies, locations, seen = [], [], set()
    total = pages[0]['totalCount']
    for index, page in enumerate(pages):
        if bool(page.get('nextPageToken')) != (index < len(pages) - 1):
            raise ValueError('Incomplete pagination')
        if page.get('totalCount', total) != total:
            raise ValueError('Changing result count')
        for study in page['studies']:
            p = study['protocolSection']
            nct = p['identificationModule']['nctId']
            if nct in seen:
                raise ValueError('Duplicate study across pages')
            seen.add(nct)
            status, design = p['statusModule'], p['designModule']
            sites = p.get('contactsLocationsModule', {}).get('locations', [])
            studies.append({'nct_id': nct, 'study_type': design['studyType'],
                            'status': status['overallStatus'],
                            'phases': '|'.join(design.get('phases', [])),
                            'conditions': json.dumps(p.get('conditionsModule', {}).get('conditions', []), ensure_ascii=False),
                            'last_update_posted': status['lastUpdatePostDateStruct']['date'],
                            'registry_results_section_present': bool(study.get('resultsSection')),
                            'listed_location_count': len(sites),
                            'location_evidence_status': 'listed_not_verified' if sites else 'not_listed_not_absent',
                            'lon_relevance': 'not_adjudicated', 'fua_assignment': 'not_assigned'})
            for number, site in enumerate(sites, 1):
                locations.append({'nct_id': nct, 'location_index': number,
                                  'facility': site.get('facility', ''), 'city': site.get('city', ''),
                                  'country': site.get('country', ''),
                                  'role': 'registry_listed_location_not_resident_access'})
    if len(studies) != total:
        raise ValueError('Result count mismatch')
    return sorted(studies, key=lambda r: r['nct_id']), sorted(locations, key=lambda r: (r['nct_id'], r['location_index']))


def load_pages(source, source_dir):
    pages = []
    for record in source['pages']:
        raw = (source_dir / record['file']).read_bytes()
        if len(raw) != record['bytes'] or hashlib.sha256(raw).hexdigest() != record['sha256']:
            raise ValueError('Source hash mismatch')
        query = parse_qs(urlparse(record['url']).query)
        expected = {k: [v] for k, v in source['query'].items()}
        if pages:
            expected['pageToken'] = [pages[-1]['nextPageToken']]
        if query != expected or urlparse(record['url']).netloc != 'clinicaltrials.gov':
            raise ValueError('Pagination query mismatch')
        pages.append(json.loads(raw))
    return pages


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    source = json.loads((folder / 'cci-lon-registry-source.json').read_text())
    pages = load_pages(source, args.source_dir)
    studies, locations = inventory(pages)
    hashes = {}
    for name, rows in [('cci-lon-registry-studies.csv', studies), ('cci-lon-registry-locations.csv', locations)]:
        path = folder / name
        with path.open('w', newline='') as stream:
            writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator='\n')
            writer.writeheader()
            writer.writerows(rows)
        hashes[name] = hashlib.sha256(path.read_bytes()).hexdigest()
    summary = {'scope': 'Complete frozen query result, not complete global LON evidence',
               'studyCount': len(studies), 'listedLocationCount': len(locations),
               'studyTypes': dict(sorted(Counter(r['study_type'] for r in studies).items())),
               'studiesWithRegistryResults': sum(r['registry_results_section_present'] for r in studies),
               'studiesWithoutListedLocations': sum(r['listed_location_count'] == 0 for r in studies),
               'distinctListedCountries': len({r['country'] for r in locations if r['country']}),
               'latestRecordUpdate': max(r['last_update_posted'] for r in studies),
               'sourceManifestSha256': hashlib.sha256((folder / 'cci-lon-registry-source.json').read_bytes()).hexdigest(),
               'outputSha256': hashes}
    (folder / 'cci-lon-registry-inventory.json').write_text(json.dumps(summary, indent=2) + '\n')
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
