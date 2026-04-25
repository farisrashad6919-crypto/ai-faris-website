import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

const [, , outputPathArg] = process.argv;

if (!outputPathArg) {
  console.error("Usage: node scripts/export-latest-generated.mjs <output-path>");
  process.exit(1);
}

const generatedRoot = "C:/Users/facebook/.codex/generated_images";
const outputPath = path.resolve(outputPathArg);
const ext = path.extname(outputPath).toLowerCase();

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const latest = listFiles(generatedRoot)
  .map((filePath) => ({
    filePath,
    mtimeMs: fs.statSync(filePath).mtimeMs,
  }))
  .sort((a, b) => b.mtimeMs - a.mtimeMs)[0];

if (!latest) {
  console.error("No generated images found.");
  process.exit(1);
}

await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

let pipeline = sharp(latest.filePath);

if (ext === ".webp") {
  pipeline = pipeline.webp({ quality: 92 });
} else if (ext === ".jpg" || ext === ".jpeg") {
  pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true });
} else if (ext === ".png") {
  pipeline = pipeline.png({ compressionLevel: 9 });
} else {
  console.error(`Unsupported output extension: ${ext}`);
  process.exit(1);
}

await pipeline.toFile(outputPath);
console.log(`${latest.filePath} -> ${outputPath}`);
