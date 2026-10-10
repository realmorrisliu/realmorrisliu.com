import unittest

from cci_openalex_hierarchy import profile


def institution(identifier, lineage, fua, status='directory_point_match'):
    return {'institution_id': identifier, 'lineage_ids': lineage, 'efua_ids': fua,
            'mapping_status': status, 'source_name': identifier}


class HierarchyTests(unittest.TestCase):
    def test_hierarchy_deduplicates_fuas_and_retains_unlocated_members(self):
        rows = [institution('P', 'P', '1'), institution('A', 'A;P;P', '2'),
                institution('B', 'B;P', '2'), institution('C', 'C;P', '', 'coordinates_missing')]
        result = profile(rows)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['descendant_records'], 3)
        self.assertEqual(result[0]['hierarchy_directory_fua_count'], 2)
        self.assertEqual(result[0]['known_members_without_unique_fua'], 1)

    def test_absent_ancestor_does_not_acquire_descendant_location(self):
        result = profile([institution('A', 'A;missing', '2')])[0]
        self.assertFalse(result['parent_in_directory'])
        self.assertEqual(result['parent_efua_ids'], '')
        self.assertEqual(result['members_missing_from_directory'], 1)
        self.assertEqual(result['hierarchy_directory_fua_count'], 1)
        with self.assertRaisesRegex(ValueError, 'Duplicate'):
            profile([institution('A', 'A', '1')] * 2)


if __name__ == '__main__':
    unittest.main()
