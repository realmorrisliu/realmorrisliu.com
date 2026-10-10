import unittest

import shapely
from shapely import STRtree, box

from cci_ookla_coverage import assignments


class CentroidCoverageTests(unittest.TestCase):
    def test_shared_boundary_and_outside_are_not_arbitrarily_assigned(self):
        tree = STRtree([box(0, 0, 1, 1), box(1, 0, 2, 1)])
        pairs, counts = assignments(shapely.points([0.5, 1, 3], [0.5, 0.5, 0.5]), tree)
        self.assertEqual(counts.tolist(), [1, 2, 0])
        self.assertEqual(pairs.tolist(), [[0], [0]])

    def test_no_matches_preserves_all_points(self):
        pairs, counts = assignments(shapely.points([3, 4], [3, 4]), STRtree([box(0, 0, 1, 1)]))
        self.assertEqual(pairs.shape, (2, 0))
        self.assertEqual(counts.tolist(), [0, 0])
