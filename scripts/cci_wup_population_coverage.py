"""Sample native 2025 population inside WUP centres against the old FUA frame."""

import argparse
from collections import Counter, defaultdict
import csv
import io
import json
from pathlib import Path
from zipfile import ZipFile

import numpy as np
from pyproj import CRS, Transformer
import rasterio
from rasterio.errors import WindowError
from rasterio.features import geometry_mask, geometry_window
import shapefile
import shapely
from shapely.geometry import shape
from shapely.ops import transform

from cci_global_crosswalk import FUA_TABLE, ROOT, digest, load, write_csv
from cci_wup_crosswalk import SHA256, STEM


def coverage(population, inside, covered):
    if population.shape != inside.shape or inside.shape != covered.shape:
        raise ValueError('Population and geometry masks disagree')
    valid = inside & ~np.ma.getmaskarray(population) & np.isfinite(population.data) & (population.data >= 0)
    observed = float(population.data[valid].sum(dtype=np.float64))
    within = float(population.data[valid & covered].sum(dtype=np.float64))
    outside = float(population.data[valid & ~covered].sum(dtype=np.float64))
    if not np.isfinite([observed, within, outside]).all() or not np.isclose(within + outside, observed, rtol=1e-12, atol=1e-6):
        raise ValueError('Population partition accounting failed')
    return {
        'selected_population_cells': int(inside.sum()),
        'unknown_population_cells': int((inside & ~valid).sum()),
        'known_projected_population': observed,
        'known_population_inside_old_frame': within,
        'known_population_outside_old_frame': outside,
        'old_frame_share_among_known_population': within / observed if observed > 0 else '',
    }


def zone(population, centre, covered):
    empty = {key: '' for key in coverage(np.ma.array([], dtype=float),
                                        np.array([], dtype=bool), np.array([], dtype=bool))}
    if (not centre.is_valid or centre.is_empty or centre.bounds[2] - centre.bounds[0] > 180
            or not covered.is_valid):
        return {'status': 'geometry_review', **empty}
    try:
        full = geometry_window(population, [centre], boundless=True)
        window = full.intersection(rasterio.windows.Window(0, 0, population.width, population.height))
    except WindowError:
        return {'status': 'outside_population_raster', **empty}
    dimensions = (int(window.height), int(window.width))
    grid = population.window_transform(window)
    inside = geometry_mask([centre], out_shape=dimensions, transform=grid,
                           invert=True, all_touched=False)
    mask = (geometry_mask([covered], out_shape=dimensions, transform=grid,
                          invert=True, all_touched=False) if not covered.is_empty
            else np.zeros(dimensions, dtype=bool))
    result = coverage(population.read(1, window=window, masked=True), inside, mask)
    status = 'partial_projected_population_coverage'
    if result['known_projected_population'] == 0:
        status = ('population_unavailable' if result['unknown_population_cells']
                  else 'zero_selected_projected_population_not_no_residents')
    if full != window:
        status = 'partially_outside_population_raster'
    return {'status': status, **result}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('archive', 'fua', 'population'):
        parser.add_argument('--' + name, required=True, type=Path)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    wup = json.loads((folder / 'cci-wup-2025-crosswalk.json').read_text())
    old = json.loads((folder / 'cci-global-candidates-r2019a.provenance.json').read_text())
    pop_source = json.loads((folder / 'cci-healthcare-population-source.json').read_text())
    if (digest(args.archive) != SHA256 or wup['archiveSha256'] != SHA256
            or digest(args.population) != pop_source['sha256'] or pop_source['epoch'] != 2025):
        raise ValueError('Frozen source checksum or population epoch mismatch')
    fuas, _ = load(args.fua, FUA_TABLE, 'eFUA_ID', 'eFUA_name', old['geoPackageSha256'])
    if len(fuas) != 9031:
        raise ValueError('Incomplete frozen candidate frame')
    fua_polygons = {key: polygon for key, _, polygon in fuas}
    joins = defaultdict(set)
    source_path = folder / 'cci-wup-2025-efua-overlaps.csv'
    if digest(source_path) != wup['outputs'][source_path.name]:
        raise ValueError('Stale polygon crosswalk')
    for row in csv.DictReader(source_path.open()):
        centre, fua = int(row['wup_2025_id']), int(row['efua_id'])
        if fua not in fua_polygons or fua in joins[centre] or float(row['overlap_km2']) <= 0:
            raise ValueError('Invalid polygon crosswalk identity or overlap')
        joins[centre].add(fua)
    source_path = folder / 'cci-wup-2025-centre-coverage.csv'
    if digest(source_path) != wup['outputs'][source_path.name]:
        raise ValueError('Stale centre inventory')
    expected = {int(row['wup_2025_id']): row for row in csv.DictReader(source_path.open())}
    if len(expected) != 12140 or set(joins) - set(expected):
        raise ValueError('Incomplete centre identities')
    project = Transformer.from_crs('ESRI:54009', 'EPSG:4326', always_xy=True).transform
    rows, seen, repairs, years = [], set(), [], Counter()
    with ZipFile(args.archive) as archive, rasterio.open(args.population) as population:
        if archive.testzip() is not None or CRS.from_wkt(archive.read(STEM + '.prj').decode()) != CRS.from_user_input('ESRI:54009'):
            raise ValueError('Invalid archive or centre CRS')
        if (population.crs.to_epsg() != 4326 or population.count != 1
                or population.width != pop_source['width'] or population.height != pop_source['height']
                or list(population.transform) != pop_source['transform']
                or population.nodata != pop_source['nodata']):
            raise ValueError('Population grid differs from frozen provenance')
        with shapefile.Reader(**{ext: io.BytesIO(archive.read(STEM + '.' + ext))
                                 for ext in ('shp', 'shx', 'dbf')}) as reader:
            for record in reader.iterRecords():
                key, year = record['ID_UC_G0'], record['Year']
                if ((key, year) in seen or not isinstance(key, int) or key < 1
                        or year not in range(1975, 2101, 5) or record['ID_MTUC'] != f'{key}_{year}'):
                    raise ValueError('Invalid or duplicate source centre-year identity')
                seen.add((key, year))
                years[year] += 1
                if year != 2025:
                    continue
                polygon = shape(reader.shape(record.oid).__geo_interface__)
                if polygon.geom_type not in ('Polygon', 'MultiPolygon') or polygon.area <= 0:
                    raise ValueError('Empty or non-polygon centre')
                if not polygon.is_valid:
                    fixed = shapely.make_valid(polygon)
                    if (fixed.geom_type not in ('Polygon', 'MultiPolygon') or not fixed.is_valid
                            or abs(fixed.area - polygon.area) > 1e-6 or fixed.bounds != polygon.bounds):
                        raise ValueError('Centre repair changes area, extent or type')
                    repairs.append(key)
                    polygon = fixed
                if key not in expected or len(joins[key]) != int(expected[key]['intersecting_efuas']):
                    raise ValueError('Centre and crosswalk disagree')
                parts = [polygon.intersection(fua_polygons[fua]) for fua in sorted(joins[key])]
                covered = shapely.union_all(parts)
                area_share = covered.area / polygon.area
                if not 0 <= area_share <= 1 + 1e-9 or abs(area_share - float(expected[key]['covered_area_share'])) > 1e-8:
                    raise ValueError('Polygon coverage differs from the frozen crosswalk')
                geographic = transform(project, shapely.segmentize(polygon, 1000))
                covered_geographic = transform(project, shapely.segmentize(covered, 1000))
                rows.append({'wup_2025_id': key, 'intersecting_efuas': len(joins[key]),
                             'old_frame_area_share': area_share,
                             **zone(population, geographic, covered_geographic)})
            if (len(seen) != len(reader) or len(seen) != wup['sourceRecords']
                    or dict(sorted(years.items())) != {int(k): v for k, v in wup['sourceRecordsByYear'].items()}
                    or {row['wup_2025_id'] for row in rows} != set(expected)):
                raise ValueError('Incomplete original archive or 2025 centre scope')
    output = folder / 'cci-wup-2025-population-coverage.csv'
    write_csv(output, sorted(rows, key=lambda row: row['wup_2025_id']))
    summary = {
        'status': 'native_projected_population_coverage_not_candidate_migration_or_scores',
        'targetEpoch': 2025, 'centreCount': len(rows), 'frozenFuaCount': len(fuas),
        'statusCounts': dict(Counter(row['status'] for row in rows)),
        'centresWithKnownPopulation': sum(isinstance(row['known_projected_population'], float) and row['known_projected_population'] > 0 for row in rows),
        'centresWithKnownOutsidePopulation': sum(isinstance(row['known_population_outside_old_frame'], float) and row['known_population_outside_old_frame'] > 0 for row in rows),
        'centresWithUnknownPopulationCells': sum(isinstance(row['unknown_population_cells'], int) and row['unknown_population_cells'] > 0 for row in rows),
        'centresWithoutOldFuaOverlap': sum(row['intersecting_efuas'] == 0 for row in rows),
        'centresWithPartialKnownPopulationCoverage': sum(isinstance(row['old_frame_share_among_known_population'], float) and 0 < row['old_frame_share_among_known_population'] < 1 for row in rows),
        'centresWithOutsideAreaButNoSampledOutsidePopulation': sum(row['old_frame_area_share'] < 1 - 1e-9 and row['known_population_outside_old_frame'] == 0 for row in rows),
        'centreGeometryRepairIds': repairs,
        'method': 'Native population cell centres inside 1000m-densified WUP2025 polygons; whole-cell values partitioned by the union of every positive-area intersecting old FUA. Covered and uncovered known cells conserve each centre total. No uniform density, raster reprojection or cross-centre population sum.',
        'limitations': 'Projected residential population, not census, citizenship, income or insured residents. Coarse whole-cell allocation and transformed boundary approximation affect small/coastal areas. Unknown population is counted as cells and excluded from the known-only share, not imputed zero. Geometry-review/outside-raster records remain unresolved. No commuting identity, whole-FUA resident coverage, cross-centre deduplicated global population, migration, scores, exclusion or global ranking eligibility follows.',
        'populationSource': pop_source['source'], 'populationSourceSha256': digest(folder / 'cci-healthcare-population-source.json'),
        'populationSha256': pop_source['sha256'], 'wupArchiveSha256': SHA256,
        'wupCrosswalkSha256': digest(folder / 'cci-wup-2025-crosswalk.json'),
        'fuaSha256': old['geoPackageSha256'], 'csvSha256': digest(output),
        'scriptSha256': digest(Path(__file__)),
        'crosswalkHelperSha256': digest(ROOT / 'scripts/cci_global_crosswalk.py'),
        'wupHelperSha256': digest(ROOT / 'scripts/cci_wup_crosswalk.py'),
        'versions': {'rasterio': rasterio.__version__, 'gdal': rasterio.__gdal_version__,
                     'shapely': shapely.__version__},
    }
    (folder / 'cci-wup-2025-population-coverage.json').write_text(json.dumps(summary, indent=2, allow_nan=False) + '\n')
    print({key: summary[key] for key in ('centreCount', 'centresWithKnownPopulation',
                                       'centresWithKnownOutsidePopulation', 'statusCounts')})


if __name__ == '__main__':
    main()
