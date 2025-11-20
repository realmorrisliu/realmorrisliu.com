import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import exifr from "exifr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(PROJECT_ROOT, "src/assets/captured");
const CONTENT_DIR = path.join(PROJECT_ROOT, "src/content/captured");

const INBOX_DIR = path.join(PROJECT_ROOT, "photos-inbox");

async function processPhoto(photoPath: string) {
  try {
    const filename = path.basename(photoPath);
    
    // Skip hidden files (like .DS_Store)
    if (filename.startsWith('.')) return;

    const ext = path.extname(filename).toLowerCase();
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.heic'];
    
    if (!validExts.includes(ext)) {
      console.log(`⚠️  Skipping ${filename}: Unsupported file type`);
      return;
    }

    const nameWithoutExt = path.basename(filename, ext);
    
    // Slugify filename
    const slug = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const newFilename = `${slug}${ext}`;
    const targetAssetPath = path.join(ASSETS_DIR, newFilename);
    const targetContentPath = path.join(CONTENT_DIR, `${slug}.md`);

    // Ensure directories exist
    await fs.mkdir(ASSETS_DIR, { recursive: true });
    await fs.mkdir(CONTENT_DIR, { recursive: true });

    // Copy image
    console.log(`📦 Processing ${filename}...`);
    await fs.copyFile(photoPath, targetAssetPath);

    // Extract EXIF
    const exif = await exifr.parse(photoPath, {
      tiff: true,
      exif: true,
      gps: false,
    }).catch(() => ({})); // Handle cases with no EXIF gracefully

    // Format Metadata
    const date = exif?.DateTimeOriginal || new Date();
    const camera = exif?.Model || "Unknown Camera";
    const lens = exif?.LensModel || "Unknown Lens";
    const iso = exif?.ISO ? String(exif.ISO) : "Auto";
    const aperture = exif?.FNumber ? `f/${exif.FNumber}` : "Auto";
    
    let shutterSpeed = "Auto";
    if (exif?.ExposureTime) {
      if (exif.ExposureTime >= 1) {
        shutterSpeed = `${exif.ExposureTime}s`;
      } else {
        shutterSpeed = `1/${Math.round(1 / exif.ExposureTime)}s`;
      }
    }

    // Generate Markdown
    const content = `---
title: "${nameWithoutExt.replace(/-/g, " ")}"
image: "../../assets/captured/${newFilename}"
date: ${date instanceof Date ? date.toISOString().split('T')[0] : new Date(date).toISOString().split('T')[0]}
location: "Unknown Location"
camera: "${camera}"
lens: "${lens}"
iso: "${iso}"
aperture: "${aperture}"
shutterSpeed: "${shutterSpeed}"
---
`;

    await fs.writeFile(targetContentPath, content);
    console.log(`✅ Created: src/content/captured/${slug}.md`);

    // Optional: Remove from inbox if it was processed from there
    if (photoPath.includes("photos-inbox")) {
      await fs.unlink(photoPath);
      console.log(`🗑️  Removed from inbox: ${filename}`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${path.basename(photoPath)}:`, error);
  }
}

async function main() {
  const argPath = process.argv[2];

  if (argPath) {
    // Single file mode
    await processPhoto(argPath);
  } else {
    // Inbox mode
    try {
      await fs.access(INBOX_DIR);
      const files = await fs.readdir(INBOX_DIR);
      
      if (files.length === 0) {
        console.log("📭 Inbox is empty.");
        console.log(`👉 Drag photos into '${INBOX_DIR}' and run this command again.`);
        return;
      }

      console.log(`📂 Found ${files.length} files in inbox...`);
      for (const file of files) {
        await processPhoto(path.join(INBOX_DIR, file));
      }
    } catch (error) {
      console.log("📭 Inbox not found or empty.");
      console.log(`👉 Created '${INBOX_DIR}'. Drag photos here and run 'npm run new:photo'.`);
      await fs.mkdir(INBOX_DIR, { recursive: true });
    }
  }
}

main();
