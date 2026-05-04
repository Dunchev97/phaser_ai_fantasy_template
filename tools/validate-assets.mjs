import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const GRID_CONFIG_PATH = path.join(ROOT, 'tools', 'asset-sheets.config.json');
const PACKED_CONFIG_PATH = path.join(ROOT, 'tools', 'packed-atlases.config.json');
const RUNTIME_MANIFEST = path.join(ROOT, 'public', 'assets', 'catalog', 'tiny-swords.runtime-manifest.json');

let exitCode = 0;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function existsRuntime(relPath) {
  // Runtime paths omit the 'public/' prefix; files live under public/
  const physical = relPath.startsWith('assets/') || relPath.startsWith('assets\\')
    ? path.join('public', relPath)
    : relPath;
  return fs.existsSync(path.join(ROOT, physical));
}

function fail(message) {
  console.error(`✗ ${message}`);
  exitCode = 1;
}

function ok(message) {
  console.log(`✓ ${message}`);
}

function assertSize(w, h, label) {
  if (w < 1024) {
    fail(`${label}: width ${w} < 1024`);
    return false;
  }
  if (h > 4096) {
    fail(`${label}: height ${h} > 4096`);
    return false;
  }
  if (w > 4096) {
    fail(`${label}: width ${w} > 4096`);
    return false;
  }
  const ratio = Math.max(w / h, h / w);
  if (ratio > 3) {
    fail(`${label}: aspect ratio ${ratio.toFixed(2)} worse than 3:1`);
    return false;
  }
  return true;
}

async function checkAtlasImage(filePath, label) {
  if (!exists(filePath)) {
    fail(`Missing atlas image: ${filePath}`);
    return false;
  }
  try {
    const meta = await sharp(path.join(ROOT, filePath)).metadata();
    if (!assertSize(meta.width, meta.height, label)) return false;
  } catch (e) {
    fail(`Cannot read atlas image ${filePath}: ${e.message}`);
    return false;
  }
  return true;
}

function checkAtlasJson(filePath, expectedFrames) {
  if (!exists(filePath)) {
    fail(`Missing atlas JSON: ${filePath}`);
    return false;
  }
  const atlas = readJson(path.join(ROOT, filePath));
  const frameCount = atlas.frames ? Object.keys(atlas.frames).length : 0;
  if (frameCount !== expectedFrames) {
    fail(`${filePath}: expected ${expectedFrames} frames, got ${frameCount}`);
    return false;
  }
  // Check bounds
  const size = atlas.meta?.size;
  if (!size) {
    fail(`${filePath}: missing meta.size`);
    return false;
  }
  if (atlas.frames) {
    for (const [name, rawFrame] of Object.entries(atlas.frames)) {
      const f = rawFrame;
      const fr = f.frame;
      if (!fr) continue;
      if (fr.x + fr.w > size.w) {
        fail(`${filePath} frame ${name} exceeds atlas width: ${fr.x + fr.w} > ${size.w}`);
        return false;
      }
      if (fr.y + fr.h > size.h) {
        fail(`${filePath} frame ${name} exceeds atlas height: ${fr.y + fr.h} > ${size.h}`);
        return false;
      }
    }
  }
  ok(`${filePath}: ${frameCount} frames, size ${size.w}x${size.h}`);
  return true;
}

async function main() {
  // Grid atlases
  if (fs.existsSync(GRID_CONFIG_PATH)) {
    const config = readJson(GRID_CONFIG_PATH);
    const sheets = Array.isArray(config.sheets) ? config.sheets : [];

    if (sheets.length === 0) {
      ok('No grid sheets configured yet.');
    } else {
      for (const sheet of sheets) {
        console.log(`\n[Grid] Checking ${sheet.id}...`);
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
    }
  }

  // Packed atlases
  if (fs.existsSync(PACKED_CONFIG_PATH)) {
    const packedConfig = readJson(PACKED_CONFIG_PATH);
    const atlases = Array.isArray(packedConfig.atlases) ? packedConfig.atlases : [];

    if (atlases.length === 0) {
      ok('No packed atlases configured yet.');
    } else {
      for (const atlasEntry of atlases) {
        console.log(`\n[Packed] Checking ${atlasEntry.id}...`);
        if (!exists(atlasEntry.outputImage)) {
          fail(`Missing packed atlas image: ${atlasEntry.outputImage}`);
          continue;
        }
        if (!exists(atlasEntry.outputJson)) {
          fail(`Missing packed atlas JSON: ${atlasEntry.outputJson}`);
          continue;
        }
        const imgOK = await checkAtlasImage(atlasEntry.outputImage, atlasEntry.id);
        const jsonOK = checkAtlasJson(atlasEntry.outputJson, atlasEntry.frames.length);
        if (imgOK && jsonOK) ok(`Atlas quality passed for ${atlasEntry.id}`);

        if (exists(atlasEntry.outputImage)) {
          const meta = await sharp(path.join(ROOT, atlasEntry.outputImage)).metadata();
          if (meta.width) assertSize(meta.width, meta.height, `${atlasEntry.id} dimensions`);
        }
      }
    }
  }

  // Runtime manifest
  if (fs.existsSync(RUNTIME_MANIFEST)) {
    console.log('\n[Runtime] Checking tiny-swords.runtime-manifest.json...');
    const runtime = readJson(RUNTIME_MANIFEST);

    for (const atlas of runtime.atlases || []) {
      if (!existsRuntime(atlas.image)) fail(`Missing runtime atlas image: ${atlas.image}`);
      else ok(`Atlas image exists: ${atlas.image}`);
      if (!existsRuntime(atlas.json)) fail(`Missing runtime atlas JSON: ${atlas.json}`);
      else ok(`Atlas JSON exists: ${atlas.json}`);
      if (atlas.image.startsWith('public/')) {
        fail(`Runtime atlas image path must not start with public/: ${atlas.image}`);
      }
      if (atlas.json.startsWith('public/')) {
        fail(`Runtime atlas JSON path must not start with public/: ${atlas.json}`);
      }
    }

    for (const sheet of runtime.spritesheets || []) {
      if (!existsRuntime(sheet.path)) fail(`Missing spritesheet: ${sheet.path}`);
      else ok(`Spritesheet exists: ${sheet.key}`);
      if (sheet.path.startsWith('public/')) {
        fail(`Spritesheet path must not start with public/: ${sheet.path}`);
      }
    }

    for (const tileset of runtime.tilesets || []) {
      if (!existsRuntime(tileset.path)) fail(`Missing tileset: ${tileset.path}`);
      else ok(`Tileset exists: ${tileset.key}`);
      if (tileset.path.startsWith('public/')) {
        fail(`Tileset path must not start with public/: ${tileset.path}`);
      }
    }
  }

  // Extended asset path checks
  const extendedPaths = [
    'assets/source/tiny-swords/units/black-units/warrior/warrior-idle.png',
    'assets/source/tiny-swords/units/black-units/warrior/warrior-run.png',
    'assets/source/tiny-swords/units/black-units/warrior/warrior-attack1.png',
    'assets/source/tiny-swords/units/black-units/archer/archer-idle.png',
    'assets/source/tiny-swords/units/black-units/archer/archer-run.png',
    'assets/source/tiny-swords/units/black-units/archer/archer-shoot.png',
    'assets/source/tiny-swords/units/black-units/lancer/lancer-down-defence.png',
    'assets/source/tiny-swords/units/black-units/lancer/lancer-downright-defence.png',
    'assets/source/tiny-swords/units/black-units/lancer/lancer-right-defence.png',
    'assets/source/tiny-swords/units/black-units/lancer/lancer-upright-defence.png',
    'assets/source/tiny-swords/units/black-units/lancer/lancer-up-defence.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-idle.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-run.png',
    'assets/source/tiny-swords/units/purple-units/warrior/warrior-idle.png',
    'assets/source/tiny-swords/units/purple-units/warrior/warrior-run.png',
    'assets/source/tiny-swords/units/purple-units/warrior/warrior-attack1.png',
    'assets/source/tiny-swords/units/purple-units/archer/archer-idle.png',
    'assets/source/tiny-swords/units/purple-units/archer/archer-run.png',
    'assets/source/tiny-swords/units/purple-units/archer/archer-shoot.png',
    'assets/source/tiny-swords/units/purple-units/lancer/lancer-down-defence.png',
    'assets/source/tiny-swords/units/purple-units/lancer/lancer-downright-defence.png',
    'assets/source/tiny-swords/units/purple-units/lancer/lancer-right-defence.png',
    'assets/source/tiny-swords/units/purple-units/lancer/lancer-upright-defence.png',
    'assets/source/tiny-swords/units/purple-units/lancer/lancer-up-defence.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-run.png',
    'assets/source/tiny-swords/units/yellow-units/warrior/warrior-idle.png',
    'assets/source/tiny-swords/units/yellow-units/warrior/warrior-run.png',
    'assets/source/tiny-swords/units/yellow-units/warrior/warrior-attack1.png',
    'assets/source/tiny-swords/units/yellow-units/archer/archer-idle.png',
    'assets/source/tiny-swords/units/yellow-units/archer/archer-run.png',
    'assets/source/tiny-swords/units/yellow-units/archer/archer-shoot.png',
    'assets/source/tiny-swords/units/yellow-units/lancer/lancer-down-defence.png',
    'assets/source/tiny-swords/units/yellow-units/lancer/lancer-downright-defence.png',
    'assets/source/tiny-swords/units/yellow-units/lancer/lancer-right-defence.png',
    'assets/source/tiny-swords/units/yellow-units/lancer/lancer-upright-defence.png',
    'assets/source/tiny-swords/units/yellow-units/lancer/lancer-up-defence.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-axe.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-axe.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-hammer.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-hammer.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-pickaxe.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-pickaxe.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-gold.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-gold.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-wood.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-wood.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-meat.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-meat.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-knife.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-knife.png',
    'assets/source/tiny-swords/units/blue-units/lancer/lancer-down-defence.png',
    'assets/source/tiny-swords/units/blue-units/lancer/lancer-downright-defence.png',
    'assets/source/tiny-swords/units/blue-units/lancer/lancer-right-defence.png',
    'assets/source/tiny-swords/units/blue-units/lancer/lancer-upright-defence.png',
    'assets/source/tiny-swords/units/blue-units/lancer/lancer-up-defence.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-interact-axe.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-interact-hammer.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-interact-pickaxe.png',
    'assets/source/tiny-swords/units/blue-units/pawn/pawn-interact-knife.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-axe.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-run-axe.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-hammer.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-run-hammer.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-pickaxe.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-run-pickaxe.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-gold.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-run-gold.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-wood.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-run-wood.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-meat.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-run-meat.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-knife.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-run-knife.png',
    'assets/source/tiny-swords/units/red-units/lancer/lancer-down-defence.png',
    'assets/source/tiny-swords/units/red-units/lancer/lancer-downright-defence.png',
    'assets/source/tiny-swords/units/red-units/lancer/lancer-right-defence.png',
    'assets/source/tiny-swords/units/red-units/lancer/lancer-upright-defence.png',
    'assets/source/tiny-swords/units/red-units/lancer/lancer-up-defence.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-interact-axe.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-interact-hammer.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-interact-pickaxe.png',
    'assets/source/tiny-swords/units/red-units/pawn/pawn-interact-knife.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-axe.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-run-axe.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-hammer.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-run-hammer.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-pickaxe.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-run-pickaxe.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-gold.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-run-gold.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-wood.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-run-wood.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-meat.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-run-meat.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-knife.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-run-knife.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-interact-axe.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-interact-hammer.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-interact-pickaxe.png',
    'assets/source/tiny-swords/units/black-units/pawn/pawn-interact-knife.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-axe.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-axe.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-hammer.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-hammer.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-pickaxe.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-pickaxe.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-gold.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-gold.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-wood.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-wood.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-meat.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-meat.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-knife.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-knife.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-interact-axe.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-interact-hammer.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-interact-pickaxe.png',
    'assets/source/tiny-swords/units/purple-units/pawn/pawn-interact-knife.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-axe.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-axe.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-hammer.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-hammer.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-pickaxe.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-pickaxe.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-gold.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-gold.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-wood.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-wood.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-meat.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-meat.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-knife.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-knife.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-interact-axe.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-interact-hammer.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-interact-pickaxe.png',
    'assets/source/tiny-swords/units/yellow-units/pawn/pawn-interact-knife.png',
  ];
  console.log('\n[Extended] Checking faction + pawn tool paths...');
  for (const p of extendedPaths) {
    if (!existsRuntime(p)) fail(`Missing path: ${p}`);
    else ok(`Path OK: ${p}`);
    if (p.startsWith('public/')) fail(`Path must not start with public/: ${p}`);
  }

  const terrainPaths = [
    'assets/source/tiny-swords/terrain/tileset/tilemap-color3.png',
    'assets/source/tiny-swords/terrain/tileset/tilemap-color4.png',
    'assets/source/tiny-swords/terrain/tileset/tilemap-color5.png',
  ];
  console.log('\n[Terrain] Checking extended tilesets...');
  for (const p of terrainPaths) {
    if (!existsRuntime(p)) fail(`Missing path: ${p}`);
    else ok(`Path OK: ${p}`);
    if (p.startsWith('public/')) fail(`Path must not start with public/: ${p}`);
  }

  const envPaths = [
    'assets/source/tiny-swords/terrain/resources/wood/trees/tree1.png',
    'assets/source/tiny-swords/terrain/resources/wood/trees/tree2.png',
    'assets/source/tiny-swords/terrain/resources/wood/trees/tree3.png',
    'assets/source/tiny-swords/terrain/resources/wood/trees/tree4.png',
    'assets/source/tiny-swords/terrain/decorations/bushes/bushe1.png',
    'assets/source/tiny-swords/terrain/decorations/bushes/bushe2.png',
    'assets/source/tiny-swords/terrain/decorations/bushes/bushe3.png',
    'assets/source/tiny-swords/terrain/decorations/bushes/bushe4.png',
    'assets/source/tiny-swords/terrain/decorations/clouds/clouds-01.png',
    'assets/source/tiny-swords/terrain/decorations/clouds/clouds-02.png',
    'assets/source/tiny-swords/terrain/decorations/clouds/clouds-03.png',
    'assets/source/tiny-swords/terrain/decorations/clouds/clouds-04.png',
    'assets/source/tiny-swords/terrain/tileset/water-foam.png',
    'assets/source/tiny-swords/terrain/decorations/rocks-in-the-water/water-rocks-01.png',
    'assets/source/tiny-swords/terrain/decorations/rocks-in-the-water/water-rocks-02.png',
    'assets/source/tiny-swords/terrain/decorations/rocks-in-the-water/water-rocks-03.png',
    'assets/source/tiny-swords/terrain/decorations/rocks-in-the-water/water-rocks-04.png',
    'assets/source/tiny-swords/terrain/resources/meat/sheep/sheep-idle.png',
    'assets/source/tiny-swords/terrain/resources/meat/sheep/sheep-grass.png',
    'assets/source/tiny-swords/terrain/resources/meat/sheep/sheep-move.png',
  ];
  console.log('\n[Environment] Checking environment strip paths...');
  for (const p of envPaths) {
    if (!existsRuntime(p)) fail(`Missing path: ${p}`);
    else ok(`Path OK: ${p}`);
    if (p.startsWith('public/')) fail(`Path must not start with public/: ${p}`);
  }

  const particlePaths = [
    'assets/source/tiny-swords/particle-fx/fire-01.png',
    'assets/source/tiny-swords/particle-fx/fire-02.png',
    'assets/source/tiny-swords/particle-fx/fire-03.png',
    'assets/source/tiny-swords/particle-fx/dust-01.png',
    'assets/source/tiny-swords/particle-fx/dust-02.png',
    'assets/source/tiny-swords/particle-fx/explosion-01.png',
    'assets/source/tiny-swords/particle-fx/explosion-02.png',
    'assets/source/tiny-swords/particle-fx/water-splash.png',
  ];
  console.log('\n[Particle FX] Checking particle spritesheet paths...');
  for (const p of particlePaths) {
    if (!existsRuntime(p)) fail(`Missing path: ${p}`);
    else ok(`Path OK: ${p}`);
    if (p.startsWith('public/')) fail(`Path must not start with public/: ${p}`);
  }

  const arrowPaths = [
    'assets/source/tiny-swords/units/blue-units/archer/arrow.png',
    'assets/source/tiny-swords/units/red-units/archer/arrow.png',
    'assets/source/tiny-swords/units/black-units/archer/arrow.png',
    'assets/source/tiny-swords/units/purple-units/archer/arrow.png',
    'assets/source/tiny-swords/units/yellow-units/archer/arrow.png',
  ];
  console.log('\n[Archer Arrows] Checking arrow projectile paths...');
  for (const p of arrowPaths) {
    if (!existsRuntime(p)) fail(`Missing path: ${p}`);
    else ok(`Path OK: ${p}`);
    if (p.startsWith('public/')) fail(`Path must not start with public/: ${p}`);
  }

  const goldHighlightPaths = [
    'assets/source/tiny-swords/terrain/resources/gold/gold-resource/gold-resource-highlight.png',
    'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-1-highlight.png',
    'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-2-highlight.png',
    'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-3-highlight.png',
    'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-4-highlight.png',
    'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-5-highlight.png',
    'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-6-highlight.png',
  ];
  console.log('\n[Gold Highlights] Checking gold highlight paths...');
  for (const p of goldHighlightPaths) {
    if (!existsRuntime(p)) fail(`Missing path: ${p}`);
    else ok(`Path OK: ${p}`);
    if (p.startsWith('public/')) fail(`Path must not start with public/: ${p}`);
  }

  // Key files
  const keyFiles = [
    'src/content/tinySwordsAssetKeys.ts',
    'src/content/tinySwordsAnimations.ts',
    'src/content/tinySwordsTilesets.ts',
    'src/content/tinySwordsEnvironment.ts',
    'src/game/scenes/PreloadScene.ts',
    'src/game/scenes/AssetGalleryScene.ts',
  ];
  console.log('\n[Key files] Checking source references...');
  for (const keyFile of keyFiles) {
    if (exists(keyFile)) ok(`Key file exists: ${keyFile}`);
    else fail(`Missing key file: ${keyFile}`);
  }

  if (exitCode) {
    console.log('\nValidation completed with errors.');
    process.exit(1);
  } else {
    console.log('\nAll assets validated successfully.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
