export const TINY_SWORDS_TILE_WIDTH = 16;
export const TINY_SWORDS_TILE_HEIGHT = 16;

// Backwards-compatible aliases for the previous misspelled exports.
export const TINY_SWOWRDS_TILE_WIDTH = TINY_SWORDS_TILE_WIDTH;
export const TINY_SWOWRDS_TILE_HEIGHT = TINY_SWORDS_TILE_HEIGHT;

export const TINY_SWORDS_TILEMAP_COLUMNS = 36;
export const TINY_SWORDS_TILEMAP_ROWS = 24;
export const TINY_SWORDS_TILEMAP_TILE_COUNT = TINY_SWORDS_TILEMAP_COLUMNS * TINY_SWORDS_TILEMAP_ROWS; // 864

export const TINY_SWORDS_WATER_COLUMNS = 4;
export const TINY_SWORDS_WATER_ROWS = 4;

export const TINY_SWORDS_SHADOW_COLUMNS = 12;
export const TINY_SWORDS_SHADOW_ROWS = 12;
export const TINY_SWORDS_SHADOW_TILE_COUNT = TINY_SWORDS_SHADOW_COLUMNS * TINY_SWORDS_SHADOW_ROWS; // 144

/**
 * Compute the 0-based tile index for tilemap-color images.
 * row and col are 0-based in the 36x24 Tiny Swords terrain sheet.
 */
export function tileIndex(row: number, col: number): number {
  return row * TINY_SWORDS_TILEMAP_COLUMNS + col;
}

export function waterTileIndex(row: number, col: number): number {
  return row * TINY_SWORDS_WATER_COLUMNS + col;
}

export function shadowTileIndex(row: number, col: number): number {
  return row * TINY_SWORDS_SHADOW_COLUMNS + col;
}

function rowRange(row: number, startCol: number, endCol: number): number[] {
  const tiles: number[] = [];
  for (let col = startCol; col <= endCol; col += 1) {
    tiles.push(tileIndex(row, col));
  }
  return tiles;
}

function colRange(col: number, startRow: number, endRow: number): number[] {
  const tiles: number[] = [];
  for (let row = startRow; row <= endRow; row += 1) {
    tiles.push(tileIndex(row, col));
  }
  return tiles;
}

function rectRange(startRow: number, endRow: number, startCol: number, endCol: number): number[] {
  const tiles: number[] = [];
  for (let row = startRow; row <= endRow; row += 1) {
    tiles.push(...rowRange(row, startCol, endCol));
  }
  return tiles;
}

function shadowRectRange(startRow: number, endRow: number, startCol: number, endCol: number): number[] {
  const tiles: number[] = [];
  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      tiles.push(shadowTileIndex(row, col));
    }
  }
  return tiles;
}

/**
 * Verified against public/assets/source/tiny-swords/terrain/tileset/tilemap-color1.png.
 * The color variants share the same 36x24 layout.
 */
export const TinySwordsTerrainTiles = {
  GrassCenter: rectRange(1, 10, 1, 10),
  GrassDecor: [
    tileIndex(1, 2), tileIndex(1, 6), tileIndex(2, 3), tileIndex(2, 8),
    tileIndex(3, 1), tileIndex(3, 5), tileIndex(4, 7), tileIndex(5, 2),
    tileIndex(6, 9), tileIndex(7, 4), tileIndex(8, 6), tileIndex(9, 3),
  ],
  GrassEdges: {
    top: rowRange(0, 1, 10),
    right: colRange(11, 1, 10),
    bottom: rowRange(11, 1, 10),
    left: colRange(0, 1, 10),
  },
  GrassCorners: {
    topLeft: tileIndex(0, 0),
    topRight: tileIndex(0, 11),
    bottomRight: tileIndex(11, 11),
    bottomLeft: tileIndex(11, 0),
  },

  /**
   * The runtime tileset has no separate dirt road sheet. Use these low-noise
   * grass center tiles for quick readable trails until a dedicated path asset
   * is connected.
   */
  Path: [
    tileIndex(4, 4), tileIndex(4, 5), tileIndex(5, 4), tileIndex(5, 5),
    tileIndex(6, 4), tileIndex(6, 5), tileIndex(7, 4), tileIndex(7, 5),
  ],

  CliffCenter: rectRange(13, 22, 25, 34),
  CliffEdges: {
    top: rowRange(12, 25, 34),
    right: colRange(35, 13, 22),
    bottom: rowRange(23, 25, 34),
    left: colRange(24, 13, 22),
  },
  CliffCorners: {
    topLeft: tileIndex(12, 24),
    topRight: tileIndex(12, 35),
    bottomRight: tileIndex(23, 35),
    bottomLeft: tileIndex(23, 24),
  },

  Water: [
    waterTileIndex(0, 0), waterTileIndex(0, 1), waterTileIndex(0, 2), waterTileIndex(0, 3),
    waterTileIndex(1, 0), waterTileIndex(1, 1), waterTileIndex(1, 2), waterTileIndex(1, 3),
    waterTileIndex(2, 0), waterTileIndex(2, 1), waterTileIndex(2, 2), waterTileIndex(2, 3),
    waterTileIndex(3, 0), waterTileIndex(3, 1), waterTileIndex(3, 2), waterTileIndex(3, 3),
  ],

  Shadow: shadowRectRange(0, 11, 0, 11),
} as const;

// Compatibility exports. Prefer TinySwordsTerrainTiles.* in new code.
export const GrassCandidates = TinySwordsTerrainTiles.GrassCenter;
export const WaterCandidates = TinySwordsTerrainTiles.Water;
export const CliffCandidates = TinySwordsTerrainTiles.CliffCenter;
export const PathCandidates = TinySwordsTerrainTiles.Path;
export const EdgeCandidates = [
  ...TinySwordsTerrainTiles.GrassEdges.top,
  ...TinySwordsTerrainTiles.GrassEdges.right,
  ...TinySwordsTerrainTiles.GrassEdges.bottom,
  ...TinySwordsTerrainTiles.GrassEdges.left,
];
export const DecorationCandidates = TinySwordsTerrainTiles.GrassDecor;
