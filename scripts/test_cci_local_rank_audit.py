import unittest

from cci_global_coverage import DIMENSIONS
from cci_local_rank_audit import positions, total


class RankAuditTests(unittest.TestCase):
    weights = dict(zip(DIMENSIONS, (15, 15, 15, 10, 15, 10, 10, 10)))

    def test_unknowns_are_not_midpoints_or_renormalized(self):
        scores = dict.fromkeys(DIMENSIONS, 60)
        scores['LON'] = 40
        del scores['MED']
        self.assertEqual(total(scores, self.weights), {'center': None, 'lower': 49, 'upper': 64})
        self.assertEqual(total({}, self.weights), {'center': None, 'lower': 0, 'upper': 100})

    def test_unassessed_tail_defeats_sample_only_ranks(self):
        ranges = [{'lower': 60, 'upper': 60}, *[{'lower': 58, 'upper': 58}] * 3,
                  *[{'lower': 0, 'upper': 100}] * 9027]
        result = positions(ranges)
        self.assertEqual(result[0], {'bestPosition': 1, 'worstPosition': 9028})
        self.assertEqual(result[1], {'bestPosition': 2, 'worstPosition': 9031})
        self.assertEqual(result[-1], {'bestPosition': 1, 'worstPosition': 9031})

    def test_tie_at_32_does_not_prove_membership(self):
        ranges = [{'lower': 80, 'upper': 80}] * 31 + [{'lower': 60, 'upper': 60}] * 2
        self.assertEqual(positions(ranges)[-1], {'bestPosition': 32, 'worstPosition': 33})

    def test_strictly_lower_candidate_can_be_excluded_only_in_given_domains(self):
        ranges = [{'lower': 60, 'upper': 100}] * 32 + [{'lower': 0, 'upper': 59}]
        self.assertEqual(positions(ranges)[-1], {'bestPosition': 33, 'worstPosition': 33})
        ranges[-1]['upper'] = 60
        self.assertEqual(positions(ranges)[-1], {'bestPosition': 1, 'worstPosition': 33})

    def test_rejecting_other_assumptions_widens_position_range(self):
        self.assertEqual(positions([{'lower': 0, 'upper': 100}] * 4),
                         [{'bestPosition': 1, 'worstPosition': 4}] * 4)

    def test_invalid_numeric_inputs_fail_closed(self):
        for score in (float('nan'), float('inf'), -1, 101, True):
            with self.assertRaises(ValueError):
                total({'MED': score}, self.weights)
        with self.assertRaises(ValueError):
            total({'UNKNOWN': 60}, self.weights)
        with self.assertRaises(ValueError):
            total({}, {**self.weights, 'MED': 16})
        for lower, upper in ((61, 60), (-1, 60), (0, 101), (0, float('inf'))):
            with self.assertRaises(ValueError):
                positions([{'lower': lower, 'upper': upper}])


if __name__ == '__main__':
    unittest.main()
