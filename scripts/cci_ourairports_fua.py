"""Locate every frozen airport record; do not infer resident transport access."""

import argparse
from collections import Counter
import csv
import json
import math
from pathlib import Path

import pyproj
import shapely
from shapely import STRtree

from cci_global_crosswalk import ROOT, FUA_TABLE, digest, load, write_csv


def assignments(records, fuas):
    if len({key for key, _, _ in fuas}) != len(fuas):
        raise ValueError('Duplicate FUA ID')
    tree = STRtree([r[2] for r in fuas])
    projection = pyproj.Transformer.from_crs(4326, 'ESRI:54009', always_xy=True)
    ids, idents, rows = set(), set(), []
    counts, scheduled = Counter(), Counter()
    types = {'balloonport', 'closed', 'closed_airport', 'heliport', 'large_airport', 'medium_airport', 'seaplane_base', 'small_airport'}
    for record in records:
        identifier, ident = int(record['id']), record['ident']
        if identifier <= 0 or identifier in ids or not ident or ident in idents:
            raise ValueError('Invalid or duplicate airport identity')
        ids.add(identifier)
        idents.add(ident)
        kind, service = record['type'], record['scheduled_service']
        if kind not in types or service not in ('yes', 'no'):
            raise ValueError('Unexpected airport type or service value')
        x, y = record['longitude_deg'], record['latitude_deg']
        status, matches = 'coordinates_missing', []
        if x and y:
            try:
                lon, lat = float(x), float(y)
                valid = math.isfinite(lon) and math.isfinite(lat) and -180 <= lon <= 180 and -90 <= lat <= 90
            except ValueError:
                valid = False
            status = 'coordinates_invalid'
            if valid:
                px, py = projection.transform(lon, lat)
                if not (math.isfinite(px) and math.isfinite(py)):
                    raise ValueError('Invalid projected airport location')
                matches = sorted(int(i) for i in tree.query(shapely.Point(px, py), predicate='intersects'))
                status = 'directory_point_match' if len(matches) == 1 else 'multiple_fua_matches' if matches else 'outside_frozen_fuas'
        closed = kind in ('closed', 'closed_airport')
        if len(matches) == 1:
            counts[fuas[matches[0]][0]] += 1
            scheduled[fuas[matches[0]][0]] += service == 'yes' and not closed
        rows.append({'airport_id': identifier, 'ident': ident, 'source_name': record['name'],
                     'airport_type': kind, 'scheduled_service': service,
                     'source_country_code': record['iso_country'], 'served_municipality': record['municipality'],
                     'longitude': x, 'latitude': y, 'mapping_status': status,
                     'efua_ids': ';'.join(str(fuas[i][0]) for i in matches),
                     'closed_with_scheduled_service': int(closed and service == 'yes')})
    coverage = [{'efua_id': key, 'source_name': name, 'directory_point_airports': counts[key],
                 'scheduled_nonclosed_directory_points': scheduled[key],
                 'status': 'directory_points_only' if counts[key] else 'no_in_area_point_not_no_transport'}
                for key, name, _ in fuas]
    return sorted(rows, key=lambda r: r['airport_id']), coverage


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--airports', type=Path, required=True)
    parser.add_argument('--fua', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    source_path = folder / 'cci-ourairports-source.json'
    source = json.loads(source_path.read_text())
    if digest(args.airports) != source['sha256'] or args.airports.stat().st_size != source['bytes']:
        raise ValueError('Airport source checksum mismatch')
    provenance = json.loads((folder / 'cci-global-candidates-r2019a.provenance.json').read_text())
    fuas, repairs = load(args.fua, FUA_TABLE, 'eFUA_ID', 'eFUA_name', provenance['geoPackageSha256'])
    if len(fuas) != provenance['rowCount']:
        raise ValueError('Incomplete FUA universe')
    with args.airports.open(encoding='utf-8', newline='') as stream:
        records = list(csv.DictReader(stream))
    if len(records) != source['expectedRecords']:
        raise ValueError('Incomplete airport source')
    rows, coverage = assignments(records, fuas)
    files = {'cci-ourairports-fua.csv': rows, 'cci-ourairports-efua-coverage.csv': coverage}
    for name, data in files.items():
        write_csv(folder / name, data)
    output = {'status': 'airport_directory_points_not_transport_redundancy',
              'sourceManifestSha256': digest(source_path), 'fuaSourceSha256': provenance['geoPackageSha256'],
              'scriptSha256': digest(Path(__file__)), 'recordCount': len(rows), 'candidateCount': len(coverage),
              'typeCounts': dict(Counter(r['airport_type'] for r in rows)),
              'scheduledServiceCounts': dict(Counter(r['scheduled_service'] for r in rows)),
              'mappingStatusCounts': dict(Counter(r['mapping_status'] for r in rows)),
              'candidatesWithDirectoryPoints': sum(r['directory_point_airports'] > 0 for r in coverage),
              'candidatesWithScheduledNonclosedPoints': sum(r['scheduled_nonclosed_directory_points'] > 0 for r in coverage),
              'closedWithScheduledService': sum(r['closed_with_scheduled_service'] for r in rows),
              'geometryRepairs': repairs, 'shapelyVersion': shapely.__version__, 'pyprojVersion': pyproj.__version__,
              'outputs': {name: digest(folder / name) for name in files},
              'method': 'All records retained, source ID and ident unique; coordinates projected from WGS84 to frozen FUA CRS. Point intersection only; multiple matches retained, excluded from unique-location totals. No city-name, country, nearest-airport or population filter. Closed records retained but excluded from scheduled nonclosed counts.',
              'limitations': 'No in-area point does not mean no airport access: airports outside a FUA can serve its residents. Municipality is not physical location. Points and directory service flags do not measure completed flights, fares, ground connections, capacity, independent alternatives or common failures. No legal mobility, asset portability, network continuity, OPT scores or ranks.'}
    (folder / 'cci-ourairports-fua-audit.json').write_text(json.dumps(output, indent=2) + '\n')
    print(json.dumps({k: output[k] for k in ('recordCount', 'candidateCount', 'mappingStatusCounts', 'candidatesWithDirectoryPoints', 'candidatesWithScheduledNonclosedPoints', 'closedWithScheduledService')}, indent=2))


if __name__ == '__main__':
    main()
