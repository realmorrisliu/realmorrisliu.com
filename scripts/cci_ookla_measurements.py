"""Calculate sampled network means with explicit centroid/boundary sensitivity."""

import argparse
import json
from pathlib import Path

import numpy as np
import pyarrow.parquet as pq
import pyproj
import shapely
from shapely import STRtree

from cci_global_crosswalk import ROOT, FUA_TABLE, digest, load, write_csv
from cci_ookla_coverage import assignments

METRICS = ('avg_d_kbps', 'avg_u_kbps', 'avg_lat_ms')


def weighted_parts(values, tests, devices, indexes, size):
    # Zero performance is quarantined, not interpreted as an outage or ideal latency.
    valid = (np.isfinite(values) & (values > 0) & np.isfinite(tests) & (tests > 0)
             & (tests == np.floor(tests)) & np.isfinite(devices) & (devices > 0)
             & (devices == np.floor(devices)) & (devices <= tests))
    return (
        np.bincount(indexes[valid], weights=values[valid] * tests[valid], minlength=size),
        np.bincount(indexes[valid], weights=tests[valid], minlength=size),
        np.bincount(indexes[valid], minlength=size),
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache', type=Path, required=True)
    parser.add_argument('--fua', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    source_path = folder / 'cci-ookla-2026q3-source.json'
    source = json.loads(source_path.read_text())
    provenance = json.loads((folder / 'cci-global-candidates-r2019a.provenance.json').read_text())
    fuas, _ = load(args.fua, FUA_TABLE, 'eFUA_ID', 'eFUA_name', provenance['geoPackageSha256'])
    if len(fuas) != 9031:
        raise ValueError('Incomplete candidate universe')
    polygons = np.array([r[2] for r in fuas], dtype=object)
    tree = STRtree(polygons)
    project = pyproj.Transformer.from_crs(4326, 'ESRI:54009', always_xy=True)
    rows, audits = [], {}
    for item in source['files']:
        mode = item['mode']
        path = args.cache / f'ookla-{mode}-2026q3.parquet'
        if digest(path) != item['sha256']:
            raise ValueError('Source checksum mismatch')
        data = pq.ParquetFile(path)
        seen = set()
        totals = dict(rows=0, outside=0, ambiguous=0, assigned=0, interior=0, roundedAssignmentChanges=0)
        assigned = np.zeros(len(fuas), dtype=np.int64)
        interior = assigned.copy()
        sums = {(scope, metric):np.zeros((3, len(fuas)))
                for scope in ('centroid', 'interior') for metric in METRICS}
        for batch in data.iter_batches(batch_size=32768):
            raw = batch.to_pydict()
            keys = raw['quadkey']
            if any(k is None or len(k) != 16 or set(k) - set('0123') for k in keys):
                raise ValueError('Invalid quadkey')
            if len(set(keys)) != len(keys) or any(k in seen for k in keys):
                raise ValueError('Duplicate tile in quarterly source')
            seen.update(keys)
            tiles = shapely.from_wkt(raw['tile'])
            if not (shapely.is_valid(tiles).all() and (shapely.get_type_id(tiles) == 3).all()):
                raise ValueError('Invalid tile polygon')
            bounds = shapely.bounds(tiles)
            if not (np.isfinite(bounds).all() and (bounds[:,0] >= -180).all()
                    and (bounds[:,2] <= 180).all() and (bounds[:,1] >= -90).all()
                    and (bounds[:,3] <= 90).all() and (shapely.area(tiles) > 0).all()):
                raise ValueError('Invalid geographic tile extent')
            centers = shapely.centroid(tiles)
            points = shapely.transform(centers, project.transform, interleaved=False)
            pairs, counts = assignments(points, tree)
            rounded, _ = assignments(shapely.points(*project.transform(raw['tile_x'], raw['tile_y'])), tree)
            exact_ids = np.full(len(tiles), -1, dtype=int)
            rounded_ids = exact_ids.copy()
            exact_ids[pairs[0]] = pairs[1]
            rounded_ids[rounded[0]] = rounded[1]
            totals['roundedAssignmentChanges'] += int((exact_ids != rounded_ids).sum())
            selected, candidates = pairs
            # Projected straight edges approximate curved transformed edges; this is a sensitivity scenario.
            projected_tiles = shapely.transform(tiles[selected], project.transform, interleaved=False)
            contained = shapely.covers(polygons[candidates], projected_tiles)
            totals['rows'] += len(tiles)
            totals['outside'] += int((counts == 0).sum())
            totals['ambiguous'] += int((counts > 1).sum())
            totals['assigned'] += len(selected)
            totals['interior'] += int(contained.sum())
            assigned += np.bincount(candidates, minlength=len(fuas))
            interior += np.bincount(candidates[contained], minlength=len(fuas))
            tests = np.asarray(raw['tests'], dtype=float)[selected]
            devices = np.asarray(raw['devices'], dtype=float)[selected]
            for metric in METRICS:
                values = np.asarray(raw[metric], dtype=float)[selected]
                for scope, mask in [('centroid', np.ones(len(selected), dtype=bool)), ('interior', contained)]:
                    sums[scope, metric] += np.array(weighted_parts(values[mask], tests[mask], devices[mask], candidates[mask], len(fuas)))
        if totals['rows'] != item['rows'] or totals['rows'] != totals['outside'] + totals['ambiguous'] + totals['assigned']:
            raise ValueError('Source accounting mismatch')
        for i, (identifier, name, _) in enumerate(fuas):
            row = {'efua_id':identifier, 'source_name':name, 'connection_type':mode,
                   'centroid_tiles':int(assigned[i]), 'interior_tiles':int(interior[i]),
                   'boundary_tiles':int(assigned[i]-interior[i])}
            for (scope, metric), parts in sums.items():
                numerator, denominator, valid_tiles = parts[:,i]
                row[f'{scope}_{metric}_test_weighted_mean'] = numerator / denominator if denominator else ''
                row[f'{scope}_{metric}_valid_tests'] = int(denominator)
                row[f'{scope}_{metric}_valid_tiles'] = int(valid_tiles)
                row[f'{scope}_{metric}_quarantined_tiles'] = int((assigned if scope == 'centroid' else interior)[i] - valid_tiles)
            rows.append(row)
        audits[mode] = totals
        print(mode, totals, flush=True)
    output = folder / 'cci-ookla-efua-sampled-measurements.csv'
    write_csv(output, rows)
    summary = {'status':'partial_sample_measurements_not_city_scores', 'candidateCount':len(fuas),
               'sourceManifestSha256':digest(source_path), 'fuaSha256':provenance['geoPackageSha256'],
               'scriptSha256':digest(Path(__file__)), 'assignmentScriptSha256':digest(ROOT/'scripts/cci_ookla_coverage.py'),
               'csvSha256':digest(output), 'audits':audits,
               'method':'WKT polygon centroids transformed to Mollweide, unique FUA intersections only. Test-weighted means of positive finite core tile metrics with positive integral tests/devices and devices <= tests. Zero/negative/null/nonfinite values quarantined per metric. Interior scenario excludes projected tiles not wholly covered by assigned FUA.',
               'limitations':'Self-selected quarterly tests, not resident means. Interior scenario is boundary sensitivity, not a confidence interval or certified geometric bound: projected tile edges are straight chords. Sparse loaded-latency fields excluded because total tests is not their measured-test denominator. Tile rounded averages limit precision. No affordability, uptime, inclusion, full TEC score or ranking inferred.',
               'versions':{'shapely':shapely.__version__, 'pyproj':pyproj.__version__}}
    (folder/'cci-ookla-efua-sampled-measurements.json').write_text(json.dumps(summary,indent=2)+'\n')


if __name__ == '__main__':
    main()
