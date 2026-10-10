"""Audit reported tile-centroid coverage; no city performance or CCI scores."""

import argparse
import json
from pathlib import Path

import numpy as np
import pyarrow.parquet as pq
import pyproj
import shapely
from shapely import STRtree

from cci_global_crosswalk import ROOT, FUA_TABLE, digest, load, write_csv


def assignments(points, tree):
    """Boundary and overlapping matches remain ambiguous instead of choosing a city."""
    pairs = tree.query(points, predicate="intersects")
    counts = np.bincount(pairs[0], minlength=len(points))
    unique = counts[pairs[0]] == 1
    return pairs[:, unique], counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache', type=Path, required=True)
    parser.add_argument('--fua', type=Path, required=True)
    args = parser.parse_args()
    folder = ROOT / 'docs/data'
    source = json.loads((folder / 'cci-ookla-2026q3-source.json').read_text())
    fua_source = json.loads((folder / 'cci-global-candidates-r2019a.provenance.json').read_text())
    fuas, _ = load(args.fua, FUA_TABLE, 'eFUA_ID', 'eFUA_name', fua_source['geoPackageSha256'])
    if len(fuas) != 9031:
        raise ValueError('Incomplete candidate universe')
    tree = STRtree([row[2] for row in fuas])
    projection = pyproj.Transformer.from_crs(4326, 'ESRI:54009', always_xy=True)
    rows = [{'efua_id':key, 'source_name':name} for key, name, _ in fuas]
    audits = {}
    for item in source['files']:
        mode = item['mode']
        path = args.cache / f'ookla-{mode}-2026q3.parquet'
        if digest(path) != item['sha256']:
            raise ValueError('Network source checksum mismatch')
        parquet = pq.ParquetFile(path)
        if parquet.metadata.num_rows != item['rows']:
            raise ValueError('Network source row-count mismatch')
        totals = dict(rows=0, invalidCoordinates=0, outsideCentroids=0, ambiguousCentroids=0, uniquelyAssignedCentroids=0)
        assigned = np.zeros(len(fuas), dtype=np.int64)
        for batch in parquet.iter_batches(batch_size=65536, columns=['tile_x', 'tile_y']):
            x, y = [column.to_numpy(zero_copy_only=False) for column in batch.columns]
            valid = np.isfinite(x) & np.isfinite(y) & (abs(x) <= 180) & (abs(y) <= 90)
            totals['rows'] += len(x)
            totals['invalidCoordinates'] += int((~valid).sum())
            px, py = projection.transform(x[valid], y[valid])
            if not (np.isfinite(px).all() and np.isfinite(py).all()):
                raise ValueError('Nonfinite projected coordinates')
            pairs, counts = assignments(shapely.points(px, py), tree)
            totals['outsideCentroids'] += int((counts == 0).sum())
            totals['ambiguousCentroids'] += int((counts > 1).sum())
            totals['uniquelyAssignedCentroids'] += int((counts == 1).sum())
            assigned += np.bincount(pairs[1], minlength=len(fuas))
        if totals['rows'] != sum(value for key, value in totals.items() if key != 'rows'):
            raise ValueError('Incomplete source partition')
        if int(assigned.sum()) != totals['uniquelyAssignedCentroids']:
            raise ValueError('Incomplete candidate accounting')
        for row, count in zip(rows, assigned):
            row[f'{mode}_reported_centroid_tiles'] = int(count)
        audits[mode] = {**totals, 'candidatesWithCentroids':int((assigned > 0).sum()), 'candidatesWithoutCentroids':int((assigned == 0).sum())}
    output = folder / 'cci-ookla-efua-centroid-coverage.csv'
    write_csv(output, rows)
    summary = {
        'status':'reported_centroid_coverage_not_performance', 'candidateCount':len(rows),
        'sourceManifestSha256':digest(folder / 'cci-ookla-2026q3-source.json'),
        'fuaSourceSha256':fua_source['geoPackageSha256'], 'scriptSha256':digest(Path(__file__)),
        'outputSha256':digest(output), 'audits':audits,
        'method':'Transform source tile_x/y from EPSG:4326 to ESRI:54009. Count uniquely intersected FUA polygons; retain outside/ambiguous/invalid counts. All candidates retained.',
        'limitations':'Reported centroids are rounded; boundary tiles are not split or fully checked. Counts are rows, not independent users, population coverage, usable measurements, whole-FUA speed, or TEC scores. Zero assigned rows is not zero connectivity. Regional publication exclusions and sampling affect coverage.',
        'versions':{'shapely':shapely.__version__, 'pyproj':pyproj.__version__},
    }
    (folder / 'cci-ookla-efua-centroid-coverage.json').write_text(json.dumps(summary, indent=2)+'\n')
    print(json.dumps(audits, indent=2))


if __name__ == '__main__':
    main()
