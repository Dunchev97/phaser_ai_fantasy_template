import { tileIndex, TinySwordsTerrainTiles } from './tinySwordsTerrainTiles';

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

type CliffFaceOptions = PatchOptions & {
  variant?: 'dry' | 'water';
};

const DEFAULT_TERRAIN_TILESET = 'terrain-tilemap-color1';
const WATER_TILESET = 'terrain-water-background';
const QUIET_GRASS_CENTER_TILE = tileIndex(5, 5);

function hash2d(row: number, col: number, seed: number): number {
  let value = (row + 1) * 374761393 + (col + 1) * 668265263 + seed * 1442695041;
  value = (value ^ (value >>> 13)) * 1274126177;
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function pick<T>(items: readonly T[], row: number, col: number, seed: number): T {
  const index = Math.floor(hash2d(row, col, seed) * items.length) % items.length;
  return items[index];
}

function sequencePick<T>(items: readonly T[], offset: number): T {
  const index = ((offset % items.length) + items.length) % items.length;
  return items[index];
}

function grassCenterTile(): number {
  return QUIET_GRASS_CENTER_TILE;
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
  const { GrassCorners, GrassEdges, GrassDecor } = TinySwordsTerrainTiles;

  if (options.edgeMode !== 'none' && width >= 3 && height >= 3) {
    if (row === 0 && col === 0) return GrassCorners.topLeft;
    if (row === 0 && col === lastCol) return GrassCorners.topRight;
    if (row === lastRow && col === lastCol) return GrassCorners.bottomRight;
    if (row === lastRow && col === 0) return GrassCorners.bottomLeft;
    if (row === 0) return sequencePick(GrassEdges.top, col - 1);
    if (col === lastCol) return sequencePick(GrassEdges.right, row - 1);
    if (row === lastRow) return sequencePick(GrassEdges.bottom, col - 1);
    if (col === 0) return sequencePick(GrassEdges.left, row - 1);
  }

  if (hash2d(row, col, options.seed + 31) < options.decorationChance) {
    return pick(GrassDecor, row, col, options.seed + 101);
  }

  return grassCenterTile();
}

function cliffFaceSourceRow(row: number, height: number, variant: 'dry' | 'water'): number {
  const source = TinySwordsTerrainTiles.CliffFaces[variant];
  if (height <= 1) return source.bottomRow;
  if (row === 0) return source.topRow;
  if (row === height - 1) return source.bottomRow;
  return source.middleRows[(row - 1) % source.middleRows.length];
}

function cliffFaceSourceCol(col: number, width: number, variant: 'dry' | 'water'): number {
  const source = TinySwordsTerrainTiles.CliffFaces[variant];
  if (width <= 1) return source.leftCol;
  if (col === 0) return source.leftCol;
  if (col === width - 1) return source.rightCol;
  return source.centerCols[(col - 1) % source.centerCols.length];
}

export function createGrassPatch(width: number, height: number, options: PatchOptions = {}): TerrainBrush {
  const resolved: Required<PatchOptions> = {
    tilesetKey: options.tilesetKey ?? DEFAULT_TERRAIN_TILESET,
    seed: options.seed ?? 1,
    edgeMode: options.edgeMode ?? (options.bordered === false ? 'none' : 'shore'),
    bordered: options.bordered ?? true,
    decorationChance: options.decorationChance ?? 0,
  };
  const tiles = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => grassTileFor(row, col, width, height, resolved)),
  );

  return makeBrush(
    'grassPatch',
    `Auto-tiled grass patch (${resolved.edgeMode} edges): stable center sequence with perimeter edges only when requested.`,
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

export function createCliffFace(width: number, height: number, options: CliffFaceOptions = {}): TerrainBrush {
  const tilesetKey = options.tilesetKey ?? DEFAULT_TERRAIN_TILESET;
  const variant = options.variant ?? 'dry';
  const tiles = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) =>
      tileIndex(cliffFaceSourceRow(row, height, variant), cliffFaceSourceCol(col, width, variant)),
    ),
  );

  return makeBrush(
    variant === 'water' ? 'waterCliffFace' : 'dryCliffFace',
    'Sequential Tiny Swords cliff face. Columns and rows are preserved so rock fragments align.',
    tilesetKey,
    tiles,
  );
}

export function createCliffBlock(width: number, height: number, options: PatchOptions = {}): TerrainBrush {
  return createCliffFace(width, height, { ...options, variant: 'dry' });
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
