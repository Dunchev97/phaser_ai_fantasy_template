import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'tools', 'asset-sheets.config.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error(`${filePath} is not a PNG file. The grid atlas builder currently supports PNG only.`);
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function toPascalCase(value) {
  return value
    .replace(/\.[^.]+$/, '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function normalizeFrame(frame, index) {
  if (typeof frame === 'string') {
    return {
      name: frame,
      category: frame.includes('/') ? frame.split('/')[0] : 'misc',
      description: '',
    };
  }

  if (!frame || typeof frame.name !== 'string') {
    throw new Error(`Frame at index ${index} must be a string or an object with a name.`);
  }

  return {
    name: frame.name,
    category: frame.category ?? (frame.name.includes('/') ? frame.name.split('/')[0] : 'misc'),
    description: frame.description ?? '',
  };
}

function makeFrameName(index) {
  const n = String(index + 1).padStart(3, '0');
  return `misc/frame_${n}.png`;
}

function browserAssetPath(publicPath) {
  const normalized = publicPath.replaceAll('\\\\', '/').replaceAll('\\', '/');
  return normalized.startsWith('public/') ? normalized.slice('public/'.length) : normalized;
}

function buildSheet(sheet) {
  const required = ['id', 'source', 'outputImage', 'outputJson', 'outputManifest', 'columns', 'rows'];
  for (const key of required) {
    if (sheet[key] === undefined || sheet[key] === null || sheet[key] === '') {
      throw new Error(`Sheet is missing required field: ${key}`);
    }
  }

  const sourcePath = path.join(ROOT, sheet.source);
  const outputImagePath = path.join(ROOT, sheet.outputImage);
  const outputJsonPath = path.join(ROOT, sheet.outputJson);
  const outputManifestPath = path.join(ROOT, sheet.outputManifest);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source sprite sheet not found: ${sheet.source}`);
  }

  const { width, height } = readPngSize(sourcePath);
  const columns = Number(sheet.columns);
  const rows = Number(sheet.rows);
  const total = columns * rows;

  const inputFrames = Array.isArray(sheet.frames) ? sheet.frames : [];
  const normalizedFrames = [];

  for (let i = 0; i < total; i += 1) {
    if (inputFrames[i]) {
      normalizedFrames.push(normalizeFrame(inputFrames[i], i));
    } else {
      normalizedFrames.push({
        name: makeFrameName(i),
        category: 'misc',
        description: 'Auto-generated placeholder frame name. Rename this in tools/asset-sheets.config.json.',
      });
    }
  }

  const atlasFrames = {};
  const manifestIcons = {};

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const index = row * columns + col;
      const frameInfo = normalizedFrames[index];

      const x0 = Math.round((width * col) / columns);
      const x1 = Math.round((width * (col + 1)) / columns);
      const y0 = Math.round((height * row) / rows);
      const y1 = Math.round((height * (row + 1)) / rows);
      const frameWidth = x1 - x0;
      const frameHeight = y1 - y0;

      atlasFrames[frameInfo.name] = {
        frame: { x: x0, y: y0, w: frameWidth, h: frameHeight },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w: frameWidth, h: frameHeight },
        sourceSize: { w: frameWidth, h: frameHeight },
      };

      manifestIcons[frameInfo.name] = {
        atlas: sheet.id,
        frame: frameInfo.name,
        category: frameInfo.category,
        description: frameInfo.description,
        grid: { row, column: col, index },
      };
    }
  }

  const atlasJson = {
    frames: atlasFrames,
    meta: {
      app: 'phaser-ai-fantasy-template',
      version: '1.0',
      image: path.basename(sheet.outputImage),
      format: 'RGBA8888',
      size: { w: width, h: height },
      scale: '1',
    },
  };

  const manifest = {
    atlasKey: sheet.id,
    source: sheet.source,
    image: sheet.outputImage,
    json: sheet.outputJson,
    columns,
    rows,
    width,
    height,
    cell: {
      approximateWidth: width / columns,
      approximateHeight: height / rows,
    },
    icons: manifestIcons,
  };

  ensureDir(outputImagePath);
  ensureDir(outputJsonPath);
  ensureDir(outputManifestPath);

  fs.copyFileSync(sourcePath, outputImagePath);
  fs.writeFileSync(outputJsonPath, `${JSON.stringify(atlasJson, null, 2)}\n`, 'utf8');
  fs.writeFileSync(outputManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return {
    id: sheet.id,
    imagePath: browserAssetPath(sheet.outputImage),
    atlasPath: browserAssetPath(sheet.outputJson),
    frames: normalizedFrames.map((frame) => frame.name),
  };
}

function buildGeneratedAssetKeys(assetPacks) {
  const atlasLines = [];
  const frameLines = [];
  const packLines = [];
  const usedAtlasKeys = new Set();
  const usedFrameKeys = new Set();

  for (const pack of assetPacks) {
    let atlasConst = toPascalCase(pack.id);
    if (!atlasConst) atlasConst = 'Atlas';
    while (usedAtlasKeys.has(atlasConst)) atlasConst += 'Atlas';
    usedAtlasKeys.add(atlasConst);

    atlasLines.push(`  ${atlasConst}: '${pack.id}',`);
    packLines.push(
      `  { key: GeneratedAtlases.${atlasConst}, imagePath: '${pack.imagePath}', atlasPath: '${pack.atlasPath}' },`,
    );

    for (const frame of pack.frames) {
      let frameConst = toPascalCase(frame);
      if (!frameConst) frameConst = 'Frame';
      while (usedFrameKeys.has(frameConst)) frameConst += 'Frame';
      usedFrameKeys.add(frameConst);
      frameLines.push(`  ${frameConst}: '${frame}',`);
    }
  }

  return `// This file is generated by \`npm run build:atlas\`.\n// Do not edit by hand. Edit tools/asset-sheets.config.json instead.\n\nexport const GeneratedAtlases = {\n${atlasLines.join('\n')}\n} as const;\n\nexport const GeneratedIconFrames = {\n${frameLines.join('\n')}\n} as const;\n\nexport const GeneratedAssetPacks = [\n${packLines.join('\n')}\n] as const;\n`;
}

function main() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Config not found: ${CONFIG_PATH}`);
  }

  const config = readJson(CONFIG_PATH);
  const sheets = Array.isArray(config.sheets) ? config.sheets : [];

  if (sheets.length === 0) {
    console.log('No sheets configured. Add entries to tools/asset-sheets.config.json.');
  }

  const builtPacks = sheets.map(buildSheet);

  const outputAssetKeys = config.outputAssetKeys ?? 'src/content/generatedAssetKeys.ts';
  const outputAssetKeysPath = path.join(ROOT, outputAssetKeys);
  ensureDir(outputAssetKeysPath);
  fs.writeFileSync(outputAssetKeysPath, buildGeneratedAssetKeys(builtPacks), 'utf8');

  console.log(`Built ${builtPacks.length} atlas pack(s).`);
  console.log(`Updated ${outputAssetKeys}.`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
