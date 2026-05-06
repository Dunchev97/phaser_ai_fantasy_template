import { TinySwordsTerrainTiles } from './tinySwordsTerrainTiles';

export interface TerrainBrush {
  name: string;
  description: string;
  tilesetKey: string;
  width: number;
  height: number;
  tiles: Array<Array<number | null>>; // 2D array of tile indexes; null leaves a transparent cell
}

type PatchOptions = {
  tilesetKey?: string;
  seed?: number;
  edgeMode?: 'none' | 'shore' | 'cliffTop';
  bordered?: boolean;
  decorationChance?: number;
};

const DEFAULT_TERRAIN_TILESET = 'terrain-tilemap-color1';
const WATER_TILESET = 'terrain-water-background';

function hash2d(row: number, col: number, seed: number): number {
  let value = (row + 1) * 374761393 + (col + 1) * 668265263 + seed * 1442695041;
  value = (value ^ (value >>> 13)) * 1274126177;
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function pick<T>(items: readonly T[], row: number, col: number, seed: number): T {
  const index = Math.floor(hash2d(row, col, seed) * items.length) % items.length;
  return items[index];
}

function makeBrush(
  name: string,
  description: string,
  tilesetKey: string,
  tiles: Array<Array<number | null>>,
): TerrainBrush {
  return {
    name,
    description,
    tilesetKey,
    width: tiles[0]?.length ?? 0,
    height: tiles.length,
    tiles,
  };
}

function makeTransparentBrush(name: string, description: string, tilesetKey: string, tiles: Array<Array<number | null>>): TerrainBrush {
  return {
    name,
    description,
    tilesetKey,
    width: tiles[0]?.length ?? 0,
    height: tiles.length,
    tiles,
  };
}

function grassTileFor(row: number, col: number, width: number, height: number, options: Required<PatchOptions>): number {
  const lastRow = height - 1;
  const lastCol = width - 1;
  const { GrassCorners, GrassEdges, GrassCenter, GrassDecor } = TinySwordsTerrainTiles;

  if (options.edgeMode !== 'none' && width >= 3 && height >= 3) {
    if (row === 0 && col === 0) return GrassCorners.topLeft;
    if (row === 0 && col === lastCol) return GrassCorners.topRight;
    if (row === lastRow && col === lastCol) return GrassCorners.bottomRight;
    if (row === lastRow && col === 0) return GrassCorners.bottomLeft;
    if (row === 0) return pick(GrassEdges.top, row, col, options.seed);
    if (col === lastCol) return pick(GrassEdges.right, row, col, options.seed);
    if (row === lastRow) return pick(GrassEdges.bottom, row, col, options.seed);
    if (col === 0) return pick(GrassEdges.left, row, col, options.seed);
  }

  if (hash2d(row, col, options.seed + 31) < options.decorationChance) {
    return pick(GrassDecor, row, col, options.seed + 101);
  }

  return pick(GrassCenter, row, col, options.seed);
}

function cliffTileFor(row: number, col: number, width: number, height: number, seed: number): number {
  const lastRow = height - 1;
  const lastCol = width - 1;
  const { CliffCorners, CliffEdges, CliffCenter } = TinySwordsTerrainTiles;

  if (width >= 3 && height >= 3) {
    if (row === 0 && col === 0) return CliffCorners.topLeft;
    if (row === 0 && col === lastCol) return CliffCorners.topRight;
    if (row === lastRow && col === lastCol) return CliffCorners.bottomRight;
    if (row === lastRow && col === 0) return CliffCorners.bottomLeft;
    if (row === 0) return pick(CliffEdges.top, row, col, seed);
    if (col === lastCol) return pick(CliffEdges.right, row, col, seed);
    if (row === lastRow) return pick(CliffEdges.bottom, row, col, seed);
    if (col === 0) return pick(CliffEdges.left, row, col, seed);
  }

  return pick(CliffCenter, row, col, seed);
}

export function createGrassPatch(width: number, height: number, options: PatchOptions = {}): TerrainBrush {
  const resolved: Required<PatchOptions> = {
    tilesetKey: options.tilesetKey ?? DEFAULT_TERRAIN_TILESET,
    seed: options.seed ?? 1,
    edgeMode: options.edgeMode ?? (options.bordered === false ? 'none' : 'shore'),
    bordered: options.bordered ?? true,
    decorationChance: options.decorationChance ?? 0.08,
  };
  const tiles = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => grassTileFor(row, col, width, height, resolved)),
  );

  return makeBrush(
    'grassPatch',
    `Auto-tiled grass patch (${resolved.edgeMode} edges): varied center grass with perimeter edges only when requested.`,
    resolved.tilesetKey,
    tiles,
  );
}

export function createRampPatch(direction: 'left' | 'right', options: PatchOptions = {}): TerrainBrush {
  const tilesetKey = options.tilesetKey ?? DEFAULT_TERRAIN_TILESET;
  const rampTiles = direction === 'left'
    ? TinySwordsTerrainTiles.Ramps.leftWide
    : TinySwordsTerrainTiles.Ramps.rightWide;
  const tiles = rampTiles.map((row) => [...row]);

  return makeBrush(
    direction === 'left' ? 'leftRamp' : 'rightRamp',
    'Verified Tiny Swords grassy cliff ramp used as a deliberate connector between elevation levels.',
    tilesetKey,
    tiles,
  );
}

export function createTransparentBrush(
  name: string,
  description: string,
  tilesetKey: string,
  tiles: Array<Array<number | null>>,
): TerrainBrush {
  return makeTransparentBrush(name, description, tilesetKey, tiles);
}

export function createWaterPatch(width: number, height: number, seed = 1): TerrainBrush {
  const tiles = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => pick(TinySwordsTerrainTiles.Water, row, col, seed)),
  );

  return makeBrush(
    'waterPatch',
    'Water patch using the dedicated Tiny Swords water-background tileset.',
    WATER_TILESET,
    tiles,
  );
}

export function createCliffBlock(width: number, height: number, options: PatchOptions = {}): TerrainBrush {
  const tilesetKey = options.tilesetKey ?? DEFAULT_TERRAIN_TILESET;
  const seed = options.seed ?? 1;
  const tiles = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => cliffTileFor(row, col, width, height, seed)),
  );

  return makeBrush(
    'cliffBlock',
    'Auto-tiled cliff block: cliff corners/edges on the perimeter and varied rock faces inside.',
    tilesetKey,
    tiles,
  );
}

export function createGrassPath(width: number, height: number, options: PatchOptions = {}): TerrainBrush {
  const tilesetKey = options.tilesetKey ?? DEFAULT_TERRAIN_TILESET;
  const seed = options.seed ?? 1;
  const tiles = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => pick(TinySwordsTerrainTiles.Path, row, col, seed)),
  );

  return makeBrush(
    'grassPath',
    'Low-noise grassy trail fallback; the runtime Tiny Swords tileset has no dedicated dirt path sheet.',
    tilesetKey,
    tiles,
  );
}

export const simpleGrassRect = createGrassPatch(12, 8, {
  seed: 12,
  edgeMode: 'shore',
  decorationChance: 0.06,
});

export const simpleCliffBlock = createCliffBlock(8, 6, {
  seed: 34,
});

export const simpleWaterPatch = createWaterPatch(8, 5, 56);

export const simplePathPatch = createGrassPath(10, 3, {
  seed: 78,
});

export const simpleRampPatch = createRampPatch('right');

export const TinySwordsTerrainBrushes: TerrainBrush[] = [
  simpleGrassRect,
  simpleWaterPatch,
  simpleCliffBlock,
  simplePathPatch,
  simpleRampPatch,
];
