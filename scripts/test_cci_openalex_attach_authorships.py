import unittest

import pyarrow as pa

from cci_openalex_attach_authorships import attach


def fixtures():
    group = pa.table({'id': ['W0', 'W1', 'W2', 'W3'], 'publication_year': [2024, 2025, 2025, 2025],
                      'authors_count': [1, 2, None, 0], 'authorships': [[{'author': {'id': 'A'}}], [{'author': {'id': 'B'}}], None, []]})
    filters = group.select(['id', 'publication_year', 'authors_count']).slice(1)
    for name, values in [('source_file_index', [19]*3), ('source_row_group', [2]*3), ('source_row_offset', [1, 2, 3])]:
        filters = filters.append_column(name, pa.array(values))
    return filters, group


class AttachAuthorshipTests(unittest.TestCase):
    def test_incomplete_lists_are_retained_with_statuses(self):
        filters, group = fixtures()
        joined = attach(filters, group, 19, 2)
        self.assertEqual(joined.num_rows, 3)
        self.assertEqual(joined['authorship_count_status'].to_pylist(), ['count_list_mismatch', 'missing_list', 'no_authors'])
        self.assertEqual(joined['authorships'].to_pylist(), group['authorships'].to_pylist()[1:])

    def test_missing_positions_and_changed_id_are_rejected(self):
        filters, group = fixtures()
        with self.assertRaisesRegex(ValueError, 'exactly'):
            attach(filters.slice(1), group, 19, 2)
        changed = group.set_column(0, 'id', pa.array(['W0', 'changed', 'W2', 'W3']))
        with self.assertRaisesRegex(ValueError, 'identity mismatch'):
            attach(filters, changed, 19, 2)


if __name__ == '__main__':
    unittest.main()
