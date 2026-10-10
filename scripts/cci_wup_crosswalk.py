"""Audit all 2025 WUP centres against frozen FUA boundaries without transferring scores."""

import argparse
from collections import Counter
import hashlib
import io
import json
from pathlib import Path
from zipfile import ZipFile

from pyproj import CRS
import shapefile
import shapely
from shapely.geometry import shape

from cci_global_crosswalk import ROOT, FUA_TABLE, digest, load, overlaps, write_csv

SOURCE = 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/GHSL/GHS_WUP_MTUC_GLOBE_R2025A/V1-1/GHS_WUP_MTUC_GLOBE_R2025A_V1_1_vector.zip'
SHA256 = '7f927a52a1f4a833c7c65eb6fd0e1bee86f53e329a8453cb6e04c7459c49acfa'
STEM = 'GHS_WUP_MTUC_MT_GLOBE_R2025A_v1_1'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--archive', type=Path, required=True)
    parser.add_argument('--fua', type=Path, required=True)
    args = parser.parse_args()
    if digest(args.archive) != SHA256:
        raise ValueError('Frozen WUP archive checksum mismatch')
    folder = ROOT / 'docs/data'
    old = json.loads((folder / 'cci-global-candidates-r2019a.provenance.json').read_text())
    fuas, repairs = load(args.fua, FUA_TABLE, 'eFUA_ID', 'eFUA_name', old['geoPackageSha256'])
    if len(fuas) != old['rowCount']:
        raise ValueError('Incomplete FUA universe')
    polygons = [r[2] for r in fuas]
    tree = shapely.STRtree(polygons)
    edges, centres, centre_repairs = [], [], []
    fua_counts = Counter()
    with ZipFile(args.archive) as archive:
        if archive.testzip() is not None:
            raise ValueError('ZIP integrity failure')
        files = {name: {'bytes': archive.getinfo(name).file_size, 'sha256': hashlib.sha256(archive.read(name)).hexdigest()} for name in archive.namelist()}
        if CRS.from_wkt(archive.read(STEM + '.prj').decode()) != CRS.from_user_input('ESRI:54009'):
            raise ValueError('Unexpected WUP CRS')
        with shapefile.Reader(**{ext: io.BytesIO(archive.read(STEM + '.' + ext)) for ext in ('shp', 'shx', 'dbf')}) as reader:
            years, seen = Counter(), set()
            for record in reader.iterRecords():
                identifier, year = record['ID_UC_G0'], record['Year']
                key = (identifier, year)
                if key in seen or not isinstance(identifier, int) or identifier < 1 or year not in range(1975, 2101, 5) or record['ID_MTUC'] != f'{identifier}_{year}':
                    raise ValueError('Invalid or duplicate centre-year identity')
                seen.add(key)
                years[year] += 1
                if year != 2025:
                    continue
                polygon = shape(reader.shape(record.oid).__geo_interface__)
                if polygon.geom_type not in ('Polygon', 'MultiPolygon') or polygon.area <= 0:
                    raise ValueError(f'Empty or non-polygon WUP geometry: {identifier}')
                if not polygon.is_valid:
                    fixed = shapely.make_valid(polygon)
                    if fixed.geom_type not in ('Polygon', 'MultiPolygon') or not fixed.is_valid or abs(fixed.area - polygon.area) > 1e-6 or fixed.bounds != polygon.bounds:
                        raise ValueError(f'WUP repair changes area, extent or polygon type: {identifier}')
                    centre_repairs.append({'sourceId': identifier, 'reason': shapely.is_valid_reason(polygon), 'originalAreaM2': polygon.area, 'repairedAreaM2': fixed.area, 'derivedWkbSha256': hashlib.sha256(shapely.to_wkb(fixed)).hexdigest()})
                    polygon = fixed
                matches = list(overlaps(polygon, tree, polygons))
                covered = shapely.union_all([part for _, part in matches]).area / polygon.area
                if not 0 <= covered <= 1 + 1e-9:
                    raise ValueError('Invalid area coverage')
                for index, part in matches:
                    efua = fuas[index][0]
                    fua_counts[efua] += 1
                    edges.append({'wup_2025_id': identifier, 'efua_id': efua, 'overlap_km2': round(part.area / 1e6, 6), 'centre_area_share': round(part.area / polygon.area, 9)})
                centres.append({'wup_2025_id': identifier, 'intersecting_efuas': len(matches), 'covered_area_share': round(covered, 9), 'status': 'no_overlap' if not matches else 'single_overlap' if len(matches) == 1 else 'multiple_overlaps'})
            # Source manual Table 20 specifies 12,140 centres in 2025; include no other epoch.
            if len(seen) != len(reader) or len(centres) != years[2025] or years[2025] != 12140:
                raise ValueError('Source record or 2025 population-of-centres count mismatch')
    fua_rows = [{'efua_id': identifier, 'intersecting_centres': fua_counts[identifier]} for identifier, _, _ in fuas]
    if sum(row['intersecting_efuas'] for row in centres) != len(edges) or sum(fua_counts.values()) != len(edges):
        raise ValueError('Intersection accounting mismatch')
    outputs = {'cci-wup-2025-efua-overlaps.csv': edges, 'cci-wup-2025-centre-coverage.csv': centres, 'cci-wup-2025-fua-coverage.csv': fua_rows}
    for name, rows in outputs.items():
        write_csv(folder / name, rows)
    summary = {'status': 'wup_2025_polygon_overlap_not_candidate_migration_or_scores', 'sourceUrl': SOURCE, 'archiveSha256': SHA256, 'archiveBytes': args.archive.stat().st_size, 'archiveFiles': files, 'scriptSha256': digest(Path(__file__)), 'sharedCrosswalkScriptSha256': digest(ROOT / 'scripts/cci_global_crosswalk.py'), 'efuaSourceSha256': old['geoPackageSha256'], 'sourceRecordsByYear': dict(sorted(years.items())), 'sourceRecords': len(seen), 'targetYear': 2025, 'urbanCentres': len(centres), 'efuas': len(fuas), 'intersectionCount': len(edges), 'centreOverlapCounts': dict(Counter(r['status'] for r in centres)), 'efuasWithoutCentreOverlap': sum(r['intersecting_centres'] == 0 for r in fua_rows), 'efuaGeometryRepairs': repairs, 'centreGeometryRepairs': centre_repairs, 'outputs': {name: digest(folder / name) for name in outputs}, 'versions': {'pyshp': shapefile.__version__, 'shapely': shapely.__version__, 'geos': shapely.geos_version_string}, 'method': 'All 2025 polygons, positive-area intersection in common Mollweide CRS, no name or country filters, union for coverage. Invalid geometry repaired only if area, extent and polygon type are preserved; every repair recorded. Same policy as frozen FUA crosswalk.', 'limitations': 'WUP urban centres are not commuting areas. IDs are local to this source, not UCDB IDs. Unmatched and multi-overlap centres remain unresolved. Area overlap does not establish population coverage or permit transferring scores. No replacement of frozen candidates or historical releases.'}
    (folder / 'cci-wup-2025-crosswalk.json').write_text(json.dumps(summary, indent=2) + '\n')
    print({k: summary[k] for k in ('sourceRecords', 'urbanCentres', 'efuas', 'intersectionCount', 'centreOverlapCounts', 'efuasWithoutCentreOverlap')})


if __name__ == '__main__':
    main()
