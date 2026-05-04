import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, filePath), 'utf8'));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function getMeta(filePath) {
  const meta = await sharp(filePath).metadata();
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
}

function nextPow2(n) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function isSafeSize(w, h) {
  if (w < 1024) return { ok: false, reason: `width ${w} < 1024` };
  if (h > 4096) return { ok: false, reason: `height ${h} > 4096` };
  if (w > 4096) return { ok: false, reason: `width ${w} > 4096` };
  const ratio = Math.max(w / h, h / w);
  if (ratio > 3) return { ok: false, reason: `aspect ratio ${ratio.toFixed(2)} > 3:1` };
  return { ok: true };
}

function packPage(candidates, targetWidth, padding, maxHeight) {
  const sorted = [...candidates].sort((a, b) => b.height - a.height);
  const shelves = [];
  const packed = [];
  const remaining = [];

  for (const img of sorted) {
    let placed = false;
    for (const shelf of shelves) {
      if (
        img.height + padding <= shelf.height &&
        shelf.currentX + img.width + padding <= targetWidth
      ) {
        packed.push({
          ...img,
          x: shelf.currentX,
          y: shelf.y,
        });
        shelf.currentX += img.width + padding;
        placed = true;
        break;
      }
    }

    if (!placed) {
      const newShelfY =
        shelves.length === 0
          ? padding
          : shelves[shelves.length - 1].y + shelves[shelves.length - 1].height + padding;
      const newShelfHeight = img.height + padding;
      if (newShelfY + newShelfHeight > maxHeight) {
        remaining.push(img);
        continue;
      }
      shelves.push({
        y: newShelfY,
        height: newShelfHeight,
        currentX: padding + img.width + padding,
      });
      packed.push({
        ...img,
        x: padding,
        y: newShelfY,
      });
    }
  }

  const maxX = packed.reduce((mx, it) => Math.max(mx, it.x + it.width + padding), 0);
  const maxY = packed.reduce((my, it) => Math.max(my, it.y + it.height + padding), 0);

  let pageWidth = nextPow2(maxX);
  let pageHeight = nextPow2(maxY);
  if (pageWidth < 1024) pageWidth = 1024;
  if (pageWidth > 4096) pageWidth = 4096;
  if (pageHeight > 4096) pageHeight = 4096;

  return { packed, remaining, width: pageWidth, height: pageHeight };
}

async function buildPages(configEntry) {
  const {
    id,
    outputImage,
    outputJson,
    padding = 4,
    targetWidth = 2048,
    frames,
  } = configEntry;

  console.log(`\nBuilding ${id}...`);

  const images = [];
  for (const frame of frames) {
    const srcPath = path.join(ROOT, frame.source);
    if (!fs.existsSync(srcPath)) {
      console.error(`  ✗ Missing source: ${frame.source}`);
      continue;
    }
    const meta = await getMeta(srcPath);
    if (meta.width === 0 || meta.height === 0) {
      console.error(`  ✗ Bad image dimensions: ${frame.source}`);
      continue;
    }
    images.push({
      source: srcPath,
      name: frame.name,
      width: meta.width,
      height: meta.height,
    });
  }

  if (images.length === 0) {
    console.error(`  ✗ No images for ${id}`);
    return [];
  }

  const pages = [];
  let remaining = images;
  let pageIndex = 0;

  while (remaining.length > 0) {
    const page = packPage(remaining, targetWidth, padding, 4096);
    if (page.packed.length === 0) {
      console.error(`  ✗ ${id}: Cannot pack even a single frame. Aborted.`);
      return [];
    }
    remaining = page.remaining;
    pages.push({ ...page, index: pageIndex });
    pageIndex++;
  }

  // Validate sizes
  for (const page of pages) {
    const safe = isSafeSize(page.width, page.height);
    if (!safe.ok) {
      console.error(`  ✗ ${id} page ${page.index}: ${safe.reason}`);
      return [];
    }
  }

  const pageInfos = [];

  for (const page of pages) {
    const suffix = pages.length > 1 ? `-${page.index}` : '';
    const outImg = outputImage.replace(/\.png$/, `${suffix}.png`);
    const outJson = outputJson.replace(/\.atlas\.json$/, `${suffix}.atlas.json`);

    const atlasJson = {
      frames: {},
      meta: {
        app: 'tiny-swords-packed-atlas',
        version: '1.0',
        image: path.basename(outImg),
        format: 'RGBA8888',
        size: { w: page.width, h: page.height },
        scale: 1,
      },
    };

    const composite = [];
    for (const item of page.packed) {
      atlasJson.frames[item.name] = {
        frame: { x: item.x, y: item.y, w: item.width, h: item.height },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w: item.width, h: item.height },
        sourceSize: { w: item.width, h: item.height },
      };
      composite.push({ input: item.source, left: item.x, top: item.y });
    }

    ensureDir(path.dirname(path.join(ROOT, outImg)));
    ensureDir(path.dirname(path.join(ROOT, outJson)));

    await sharp({
      create: {
        width: page.width,
        height: page.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(composite)
      .png()
      .toFile(path.join(ROOT, outImg));

    fs.writeFileSync(path.join(ROOT, outJson), JSON.stringify(atlasJson, null, 2));

    pageInfos.push({
      image: outImg,
      json: outJson,
      frameCount: page.packed.length,
      width: page.width,
      height: page.height,
    });

    console.log(
      `  ✓ ${id}${suffix}: ${page.packed.length} frames, atlas ${page.width}x${page.height}`
    );
  }

  return pageInfos;
}

async function main() {
  const configPath = process.argv[2] || 'tools/packed-atlases.config.json';
  if (!fs.existsSync(path.join(ROOT, configPath))) {
    console.error(`Config not found: ${configPath}`);
    process.exit(1);
  }

  const config = readJson(configPath);
  const atlases = Array.isArray(config.atlases) ? config.atlases : [];

  if (atlases.length === 0) {
    console.log('No packed atlases configured.');
    return;
  }

  for (const entry of atlases) {
    await buildPages(entry);
  }

  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
