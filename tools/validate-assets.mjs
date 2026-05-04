import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'tools', 'asset-sheets.config.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`✓ ${message}`);
}

function main() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fail('tools/asset-sheets.config.json is missing.');
    return;
  }

  const config = readJson(CONFIG_PATH);
  const sheets = Array.isArray(config.sheets) ? config.sheets : [];

  if (sheets.length === 0) {
    ok('No sheets configured yet. This is fine for a fresh template.');
    return;
  }

  for (const sheet of sheets) {
    console.log(`\nChecking ${sheet.id}...`);

    if (!exists(sheet.source)) fail(`Missing source: ${sheet.source}`);
    else ok(`Source exists: ${sheet.source}`);

    if (!exists(sheet.outputImage)) fail(`Missing generated atlas image: ${sheet.outputImage}`);
    else ok(`Atlas image exists: ${sheet.outputImage}`);

    if (!exists(sheet.outputJson)) {
      fail(`Missing generated atlas JSON: ${sheet.outputJson}`);
    } else {
      const atlas = readJson(path.join(ROOT, sheet.outputJson));
      const frameCount = atlas.frames ? Object.keys(atlas.frames).length : 0;
      const expected = Number(sheet.columns) * Number(sheet.rows);
      if (frameCount !== expected) {
        fail(`Atlas frame count mismatch for ${sheet.id}: expected ${expected}, got ${frameCount}`);
      } else {
        ok(`Atlas JSON has ${frameCount} frames.`);
      }
    }

    if (!exists(sheet.outputManifest)) fail(`Missing manifest: ${sheet.outputManifest}`);
    else ok(`Manifest exists: ${sheet.outputManifest}`);
  }

  if (exists(config.outputAssetKeys ?? 'src/content/generatedAssetKeys.ts')) {
    ok(`Generated asset keys exist: ${config.outputAssetKeys ?? 'src/content/generatedAssetKeys.ts'}`);
  } else {
    fail(`Generated asset keys missing: ${config.outputAssetKeys ?? 'src/content/generatedAssetKeys.ts'}`);
  }
}

main();
