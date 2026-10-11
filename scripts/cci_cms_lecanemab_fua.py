"""Locate published J0174 provider addresses; never infer treatment sites or scores."""

import argparse
import csv
import json
import math
import re
from collections import Counter
from pathlib import Path

import pyproj
import shapely
from shapely import STRtree

from cci_global_crosswalk import ROOT, FUA_TABLE, digest, load, write_csv


def assignments(records, responses, fuas):
    if len({key for key, _, _, _ in fuas}) != len(fuas):
        raise ValueError('Duplicate FUA ID')
    providers = {}
    for record in records:
        npi = record['Rndrng_NPI']
        if not re.fullmatch(r'[0-9]{10}', npi) or npi in providers:
            raise ValueError('Invalid or duplicate provider NPI')
        units = float(record['Tot_Srvcs'])
        if (record['HCPCS_Cd'] != 'J0174' or record['HCPCS_Desc'] != 'Injection, lecanemab-irmb, 1 mg'
                or record['Place_Of_Srvc'] != 'O' or record['Rndrng_Prvdr_Cntry'] != 'US'
                or int(record['Tot_Benes']) <= 10 or int(record['Tot_Bene_Day_Srvcs']) <= 0
                or not math.isfinite(units) or units <= 0):
            raise ValueError('Unexpected claims scope or units')
        providers[npi] = record
    tree = STRtree([r[2] for r in fuas])
    project = pyproj.Transformer.from_crs(4326, 'ESRI:54009', always_xy=True)
    seen, rows = set(), []
    exact, uncertain = Counter(), Counter()
    for response in responses:
        if len(response) not in (3, 8):
            raise ValueError('Unexpected Census response width')
        npi, echoed, outcome = response[:3]
        if npi not in providers or npi in seen:
            raise ValueError('Unknown or duplicate Census provider ID')
        seen.add(npi)
        record = providers[npi]
        expected = ', '.join(record[k] for k in (
            'Rndrng_Prvdr_St1', 'Rndrng_Prvdr_City', 'Rndrng_Prvdr_State_Abrvtn', 'Rndrng_Prvdr_Zip5'))
        if echoed != expected:
            raise ValueError('Census input-address echo mismatch')
        quality = address = longitude = latitude = ''
        matches = []
        status = {'No_Match': 'address_unmatched', 'Tie': 'address_ambiguous'}.get(outcome)
        if outcome == 'Match':
            if len(response) != 8 or response[3] not in ('Exact', 'Non_Exact') or not response[4]:
                raise ValueError('Invalid Census address match')
            quality, address = response[3:5]
            coordinate = response[5].split(',')
            if len(coordinate) != 2:
                raise ValueError('Invalid Census coordinates')
            longitude, latitude = map(float, coordinate)
            if not (math.isfinite(longitude) and math.isfinite(latitude)
                    and -180 <= longitude <= 180 and -90 <= latitude <= 90):
                raise ValueError('Invalid Census coordinates')
            x, y = project.transform(longitude, latitude)
            if not (math.isfinite(x) and math.isfinite(y)):
                raise ValueError('Invalid projected Census coordinates')
            matches = sorted(int(i) for i in tree.query(shapely.Point(x, y), predicate='intersects'))
            if quality == 'Non_Exact':
                status = 'non_exact_address_review'
            elif len(matches) != 1:
                status = 'multiple_fua_review' if matches else 'outside_frozen_fuas'
            else:
                status = 'exact_registered_address_signal' if fuas[matches[0]][3] == 'USA' else 'country_boundary_review'
            for i in matches:
                if status == 'exact_registered_address_signal':
                    exact[fuas[i][0]] += 1
                else:
                    uncertain[fuas[i][0]] += 1
        elif status is None or len(response) != 3:
            raise ValueError('Invalid unmatched Census response')
        rows.append({
            'provider_npi': npi, 'registered_street1': record['Rndrng_Prvdr_St1'],
            'registered_street2': record['Rndrng_Prvdr_St2'], 'registered_city': record['Rndrng_Prvdr_City'],
            'registered_state': record['Rndrng_Prvdr_State_Abrvtn'], 'registered_zip5': record['Rndrng_Prvdr_Zip5'],
            'geocoder_status': outcome, 'match_type': quality, 'matched_address': address,
            'longitude': longitude, 'latitude': latitude, 'mapping_status': status,
            'efua_ids': ';'.join(str(fuas[i][0]) for i in matches),
            'record_beneficiaries': record['Tot_Benes'], 'record_beneficiary_days': record['Tot_Bene_Day_Srvcs'],
            'drug_billing_units_1mg': record['Tot_Srvcs'],
        })
    if seen != set(providers):
        raise ValueError('Incomplete Census provider set')
    coverage = [{
        'efua_id': key, 'source_name': name, 'country_iso': country,
        'exact_registered_npi_records': exact[key], 'uncertain_address_npi_records': uncertain[key],
        'status': 'exact_registered_address_signal' if exact[key] else
                  'no_exact_signal_not_no_adoption' if country == 'USA' else 'outside_payer_frame_not_no_adoption',
    } for key, name, _, country in fuas]
    return sorted(rows, key=lambda r: r['provider_npi']), coverage


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--fua', required=True, type=Path)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    claims_path = folder / 'cci-cms-2024-lecanemab-claims.csv'
    source_path = folder / 'cci-cms-2024-lecanemab-source.json'
    geo_source_path = folder / 'cci-cms-lecanemab-geocoding-source.json'
    source = json.loads(source_path.read_text())
    geo_source = json.loads(geo_source_path.read_text())
    if (source['datasetId'] != '335e5f35-eca6-482d-87b3-f99883e213e3'
            or source['observedFrom'] != '2024-01-01' or source['observedThrough'] != '2024-12-31'
            or source['hcpcsCode'] != 'J0174' or geo_source['benchmarkId'] != 4
            or geo_source['benchmark'] != 'Public_AR_Current'
            or geo_source['recordCount'] != source['publishedRecordCount']):
        raise ValueError('Unexpected claims year or Census benchmark')
    if digest(claims_path) != source['csvSha256'] or geo_source['claimsCsvSha256'] != source['csvSha256']:
        raise ValueError('Claims source checksum mismatch')
    for name, expected in geo_source['files'].items():
        path = folder / name
        if digest(path) != expected['sha256'] or path.stat().st_size != expected['bytes']:
            raise ValueError('Census source checksum mismatch')
    with claims_path.open(newline='') as stream:
        records = list(csv.DictReader(stream))
    if len(records) != source['publishedRecordCount']:
        raise ValueError('Incomplete claims source')
    with (folder / 'cci-cms-lecanemab-addresses.csv').open(newline='') as stream:
        submitted = list(csv.reader(stream))
    expected = [[r[k] for k in ('Rndrng_NPI', 'Rndrng_Prvdr_St1', 'Rndrng_Prvdr_City',
                               'Rndrng_Prvdr_State_Abrvtn', 'Rndrng_Prvdr_Zip5')] for r in records]
    if submitted != expected:
        raise ValueError('Census submission differs from complete claims addresses')
    with (folder / 'cci-cms-lecanemab-geocodes.csv').open(newline='') as stream:
        responses = list(csv.reader(stream))
    provenance = json.loads((folder / 'cci-global-candidates-r2019a.provenance.json').read_text())
    candidate_path = folder / 'cci-global-candidates-r2019a.csv'
    if digest(candidate_path) != provenance['csvSha256']:
        raise ValueError('Candidate source checksum mismatch')
    with candidate_path.open() as stream:
        candidates = list(csv.DictReader(stream))
    countries = {int(r['efua_id']): r['country_iso'] for r in candidates}
    fuas, repairs = load(args.fua, FUA_TABLE, 'eFUA_ID', 'eFUA_name', provenance['geoPackageSha256'])
    if len(candidates) != len(countries) or len(fuas) != provenance['rowCount'] or {r[0] for r in fuas} != set(countries):
        raise ValueError('Incomplete or duplicated candidate universe')
    rows, coverage = assignments(records, responses, [(k, n, g, countries[k]) for k, n, g in fuas])
    files = {'cci-cms-lecanemab-provider-fua.csv': rows, 'cci-cms-lecanemab-efua-coverage.csv': coverage}
    for name, data in files.items():
        write_csv(folder / name, data)
    output = {
        'status': 'registered_claims_address_signal_not_local_delivery_or_scores',
        'recordCount': len(rows), 'candidateCount': len(coverage),
        'geocoderStatusCounts': dict(Counter(r['geocoder_status'] for r in rows)),
        'matchTypeCounts': dict(Counter(r['match_type'] for r in rows)),
        'mappingStatusCounts': dict(Counter(r['mapping_status'] for r in rows)),
        'coverageStatusCounts': dict(Counter(r['status'] for r in coverage)),
        'claimsSourceSha256': digest(source_path), 'geocodingSourceSha256': digest(geo_source_path),
        'fuaSourceSha256': provenance['geoPackageSha256'], 'candidateCsvSha256': digest(candidate_path),
        'scriptSha256': digest(Path(__file__)), 'geometryHelperSha256': digest(Path(__file__).with_name('cci_global_crosswalk.py')),
        'outputs': {name: digest(folder / name) for name in files}, 'geometryRepairs': repairs,
        'shapelyVersion': shapely.__version__, 'pyprojVersion': pyproj.__version__,
        'method': 'All source NPIs and submitted-address echoes checked. Census match points projected always_xy from WGS84 to ESRI:54009; exact unique USA-FUA intersections alone counted as address signals. Non-exact, tied, absent, outside, multiple and country-conflicting matches retained for review; no name/nearest-city, population or performance assignment.',
        'limitations': 'Census Exact is an address-range match, not a building or historical treatment-site verification. NPPES addresses are from the following year-end under the CMS methodology. Provider records do not locate patients or treatments and do not deduplicate people across NPIs. Single-drug Medicare FFS scope, privacy suppression and payer exclusions remain. No record is not no service; other countries are outside this payer frame. Signals arrange further research only, not LON anchors, 2026 local continuity, access, affordability, outcomes or exclusion bounds.',
    }
    (folder / 'cci-cms-lecanemab-fua-audit.json').write_text(json.dumps(output, indent=2) + '\n')
    print(json.dumps({k: output[k] for k in ('recordCount', 'candidateCount', 'mappingStatusCounts', 'coverageStatusCounts')}, indent=2))


if __name__ == '__main__':
    main()
