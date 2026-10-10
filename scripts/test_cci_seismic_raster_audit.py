import hashlib
import tempfile
import unittest
import zipfile
from pathlib import Path

from cci_seismic_raster_audit import verify_archive


class SeismicArchiveTest(unittest.TestCase):
    def test_publisher_checksum_and_unambiguous_raster_required(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "source.zip"
            with zipfile.ZipFile(path, "w") as archive:
                archive.writestr("pga.tif", b"fixture")
            source = {"size": path.stat().st_size,
                      "checksum": "md5:" + hashlib.md5(path.read_bytes()).hexdigest()}
            self.assertEqual(verify_archive(path, source), "pga.tif")
            with self.assertRaises(ValueError):
                verify_archive(path, {**source, "checksum": "md5:wrong"})
            with self.assertRaises(ValueError):
                verify_archive(path, {**source, "size": source["size"] - 1})
            with zipfile.ZipFile(path, "a") as archive:
                archive.writestr("second.tif", b"fixture")
            source = {"size": path.stat().st_size,
                      "checksum": "md5:" + hashlib.md5(path.read_bytes()).hexdigest()}
            with self.assertRaises(ValueError):
                verify_archive(path, source)


if __name__ == "__main__":
    unittest.main()
