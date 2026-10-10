"""Map a complete frozen institution directory, without assigning research output."""

import argparse
import gzip
import json
import math
from collections import Counter
from pathlib import Path

import pyproj
import shapely
from shapely import STRtree

from cci_global_crosswalk import ROOT, FUA_TABLE, digest, load, write_csv


def location_status(geo):
    if not geo or geo.get('longitude') is None or geo.get('latitude') is None:
        return 'coordinates_missing'
    x, y = geo['longitude'], geo['latitude']
    if (any(isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v) for v in (x, y))
            or not -180 <= x <= 180 or not -90 <= y <= 90):
        return 'coordinates_invalid'
    return 'coordinates_available'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache', type=Path, required=True)
    parser.add_argument('--fua', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    source = json.loads((args.cache/'download.json').read_text())
    provenance = json.loads((folder/'cci-global-candidates-r2019a.provenance.json').read_text())
    fuas, _ = load(args.fua, FUA_TABLE, 'eFUA_ID', 'eFUA_name', provenance['geoPackageSha256'])
    if len(fuas) != provenance['rowCount']:
        raise ValueError('FUA universe incomplete')
    tree = STRtree([r[2] for r in fuas])
    projection = pyproj.Transformer.from_crs(4326, 'ESRI:54009', always_xy=True)
    seen, rows = set(), []
    counts = Counter()
    for item in source['files']:
        path = args.cache/item['localFile']
        if digest(path) != item['sha256'] or path.stat().st_size != item['bytes']:
            raise ValueError('Institution source mismatch')
        number = 0
        with gzip.open(path, 'rt') as stream:
            for line in stream:
                record = json.loads(line)
                identifier = record['id']
                if not identifier.startswith('https://openalex.org/I') or identifier in seen:
                    raise ValueError('Invalid or duplicate institution ID')
                seen.add(identifier)
                number += 1
                geo = record.get('geo') or {}
                status = location_status(geo)
                matched = []
                if status == 'coordinates_available':
                    x, y = projection.transform(geo['longitude'], geo['latitude'])
                    if not (math.isfinite(x) and math.isfinite(y)):
                        raise ValueError('Invalid projected institution location')
                    matched = sorted(int(i) for i in tree.query(shapely.Point(x, y), predicate='intersects'))
                    status = 'directory_point_match' if len(matched) == 1 else 'multiple_fua_matches' if matched else 'outside_frozen_fuas'
                if len(matched) == 1:
                    counts[fuas[matched[0]][0]] += 1
                rows.append({'institution_id':identifier,'ror':record.get('ror') or '',
                             'source_name':record['display_name'],'institution_type':record.get('type') or '',
                             'institution_status':record.get('status') or '',
                             'source_city':geo.get('city') or '', 'source_country_code':geo.get('country_code') or '',
                             'longitude':geo.get('longitude') if geo.get('longitude') is not None else '',
                             'latitude':geo.get('latitude') if geo.get('latitude') is not None else '',
                             'mapping_status':status,'efua_ids':';'.join(str(fuas[i][0]) for i in matched),
                             'lineage_ids':';'.join(record.get('lineage') or []),
                             'source_updated_date':record.get('updated_date') or ''})
        if number != item['expectedRecords']:
            raise ValueError('Partition record count mismatch')
    if len(rows) != source['expectedRecords']:
        raise ValueError('Incomplete institution snapshot')
    rows.sort(key=lambda row:row['institution_id'])
    candidates = [{'efua_id':key,'source_name':name,'directory_point_institutions':counts[key],
                   'status':'directory_points_only' if counts[key] else 'no_directory_point_not_zero_output'}
                  for key,name,_ in fuas]
    files = {'cci-openalex-institution-fua.csv':rows, 'cci-openalex-efua-directory-coverage.csv':candidates}
    for name, data in files.items():
        write_csv(folder/name,data)
    summary = {**source,'status':'institution_directory_not_knowledge_output','license':'CC0',
               'documentationUrl':'https://help.openalex.org/access/snapshot/',
               'recordCount':len(rows),'mappingStatusCounts':dict(Counter(r['mapping_status'] for r in rows)),
               'candidateCount':len(candidates),'candidatesWithDirectoryPoints':sum(counts[key]>0 for key,_,_ in fuas),
               'fuaSourceSha256':provenance['geoPackageSha256'],'scriptSha256':digest(Path(__file__)),
               'outputs':{name:digest(folder/name) for name in files},
               'method':'All snapshot partitions, SHA-256 and row counts verified. Source geo point projected to frozen FUA CRS; point intersection only, no names, ranking or country filter. Multiple matches retained, not assigned arbitrarily.',
               'limitations':'Directory geo can identify city rather than campus. Headquarters or parent location does not locate affiliated works. No works_count aggregation, current output, unique-work count, fractional attribution or knowledge-output score. Snapshot precedes September 28 affiliation-matcher change; live API and snapshot are separate versions.'}
    (folder/'cci-openalex-institution-source.json').write_text(json.dumps(summary,indent=2)+'\n')
    print(json.dumps({k:summary[k] for k in ('recordCount','mappingStatusCounts','candidateCount','candidatesWithDirectoryPoints')},indent=2))


if __name__ == '__main__':
    main()
