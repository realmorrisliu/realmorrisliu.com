import unittest
import numpy as np
from cci_ookla_measurements import weighted_parts


class SampleMeasurementsTests(unittest.TestCase):
    def test_weights_use_tests_not_tiles_or_devices(self):
        parts = weighted_parts(np.array([10., 100.]), np.array([9., 1.]), np.array([1., 1.]), np.array([0, 0]), 2)
        self.assertEqual([p.tolist() for p in parts], [[190., 0.], [10., 0.], [2, 0]])

    def test_invalid_measurements_and_counts_do_not_enter_denominator(self):
        parts = weighted_parts(np.array([0., -1., np.nan, 40., 50., 60.]), np.array([1.,1.,1.,0.,2.,2.5]), np.array([1.,1.,1.,1.,3.,1.]), np.zeros(6, dtype=int), 1)
        self.assertEqual([p.tolist() for p in parts], [[0.], [0.], [0]])
