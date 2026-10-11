import unittest
from datetime import date

from shapely import STRtree, box

from cci_ucdp_candidate_exposure import merge, needs_temporal_review
from cci_ucdp_exposure import locate


class PreliminaryEventTest(unittest.TestCase):
    def test_monthly_overlap_is_not_added_and_revision_keeps_later_record(self):
        first = {"id": "12", "best": "3", "code_status": "Clear"}
        revised = {**first, "best": "2", "code_status": "Check deaths"}
        events, versions, overlaps = merge([("quarter", [first]), ("July", [first]), ("August", [revised])])
        self.assertEqual(events, {12: revised})
        self.assertEqual(versions, {12: "August"})
        self.assertEqual(len(overlaps), 2)
        self.assertEqual(overlaps[0]["changed_fields"], "")
        self.assertEqual(overlaps[1]["changed_fields"], "best;code_status")

    def test_source_and_event_dates_are_not_interchanged(self):
        row = {"date_start": "2026-03-30", "source_date": "2026-02-13"}
        self.assertTrue(needs_temporal_review(row))
        row["source_date"] = "2026-02-13;2026-03-31"
        self.assertFalse(needs_temporal_review(row))
        row["source_date"] = "2026-03-31;2026-12-19"
        self.assertTrue(needs_temporal_review(row))
        row["source_date"] = ""
        self.assertTrue(needs_temporal_review(row))

    def test_within_release_duplicate_is_rejected(self):
        with self.assertRaises(ValueError):
            merge([("July", [{"id": "12"}, {"id": "12"}])])

    def test_current_window_does_not_squeeze_cross_month_event_into_august(self):
        tree = STRtree([box(0, 0, 2, 2)])
        row = {"date_start": "2026-08-31", "date_end": "2026-09-01", "where_prec": "1", "longitude": "1", "latitude": "1"}
        window = (date(2026, 1, 1), date(2026, 8, 31))
        self.assertEqual(locate(row, tree, lambda x, y: (x, y), window), ("crosses_window", []))
        row["date_end"] = "2026-08-31"
        self.assertEqual(locate(row, tree, lambda x, y: (x, y), window), ("assigned", [0]))
        self.assertEqual(locate(row, tree, lambda x, y: (x, y)), ("crosses_window", []))


if __name__ == "__main__":
    unittest.main()
