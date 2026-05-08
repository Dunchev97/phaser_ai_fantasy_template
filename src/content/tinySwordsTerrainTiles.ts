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

function numberRange(start: number, end: number): number[] {
  const values: number[] = [];
  for (let value = start; value <= end; value += 1) {
    values.push(value);
  }
  return values;
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
  /**
   * Small interior grass motifs cut from the verified center area of the
   * 12x12 grass blob. Use them as sparse overlays on top of a quiet grass
   * base; do not tile the full source blob across the map.
   */
  GrassDetailPatches: [
    [
      [tileIndex(1, 1), tileIndex(1, 2), tileIndex(1, 3)],
      [tileIndex(2, 1), tileIndex(2, 2), tileIndex(2, 3)],
    ],
    [
      [tileIndex(2, 6), tileIndex(2, 7), tileIndex(2, 8)],
      [tileIndex(3, 6), tileIndex(3, 7), tileIndex(3, 8)],
      [tileIndex(4, 6), tileIndex(4, 7), tileIndex(4, 8)],
    ],
    [
      [tileIndex(5, 1), tileIndex(5, 2)],
      [tileIndex(6, 1), tileIndex(6, 2)],
      [tileIndex(7, 1), tileIndex(7, 2)],
    ],
    [
      [tileIndex(7, 5), tileIndex(7, 6), tileIndex(7, 7), tileIndex(7, 8)],
      [tileIndex(8, 5), tileIndex(8, 6), tileIndex(8, 7), tileIndex(8, 8)],
    ],
    [
      [tileIndex(8, 3), tileIndex(8, 4), tileIndex(8, 5)],
      [tileIndex(9, 3), tileIndex(9, 4), tileIndex(9, 5)],
      [tileIndex(10, 3), tileIndex(10, 4), tileIndex(10, 5)],
    ],
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
  RaisedGrassCenter: rectRange(1, 10, 21, 30),
  RaisedGrassEdges: {
    top: rowRange(0, 21, 30),
    right: colRange(31, 1, 10),
    bottom: rowRange(11, 21, 30),
    left: colRange(20, 1, 10),
  },
  RaisedGrassCorners: {
    topLeft: tileIndex(0, 20),
    topRight: tileIndex(0, 31),
    bottomRight: tileIndex(11, 31),
    bottomLeft: tileIndex(11, 20),
  },
  RaisedGrassBoundary: {
    topRow: 0,
    bottomRow: 11,
    leftCol: 20,
    rightCol: 31,
    horizontalStartCol: 21,
    horizontalCenterCols: numberRange(22, 29),
    horizontalEndCol: 30,
    verticalStartRow: 1,
    verticalCenterRows: numberRange(2, 9),
    verticalEndRow: 10,
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
  CliffFaceWithWater: {
    top: rowRange(15, 24, 34),
    center: rectRange(16, 22, 24, 34),
    bottom: rowRange(23, 24, 34),
  },
  CliffWaterCorners: {
    topLeft: tileIndex(15, 24),
    topRight: tileIndex(15, 35),
    bottomRight: tileIndex(23, 35),
    bottomLeft: tileIndex(23, 24),
  },
  CliffTopGrass: {
    bottomRow: 15,
    leftCol: 24,
    centerCols: numberRange(25, 28),
    rightCol: 35,
  },

  /**
   * Cliff faces are sliced pieces of a larger drawing. Do not random-pick these
   * tiles. Keep columns and rows in sequence so the rock face reassembles.
   *
   * Dry cliffs (rows 16-19) end on stone/ground. Water cliffs (rows 20-23)
   * include the bright water outline on the bottom row.
   */
  CliffFaces: {
    dry: {
      leftCol: 24,
      centerCols: numberRange(25, 28),
      rightCol: 35,
      topRow: 16,
      middleRows: [17, 18],
      bottomRow: 19,
    },
    water: {
      leftCol: 24,
      centerCols: numberRange(25, 28),
      rightCol: 35,
      topRow: 20,
      middleRows: [21, 22],
      bottomRow: 23,
    },
  },

  /**
   * Verified visible ramps/slopes in the lower-left section of tilemap-color.
   * These are not generic edge tiles; use them only as deliberate connectors
   * between elevation levels.
   */
  Ramps: {
    leftWide: [
      [null, null, null, tileIndex(16, 3)],
      [null, null, tileIndex(17, 2), tileIndex(17, 3)],
      [null, tileIndex(18, 1), tileIndex(18, 2), tileIndex(18, 3)],
      [tileIndex(19, 0), tileIndex(19, 1), tileIndex(19, 2), tileIndex(19, 3)],
      [tileIndex(20, 0), tileIndex(20, 1), tileIndex(20, 2), tileIndex(20, 3)],
      [tileIndex(21, 0), tileIndex(21, 1), tileIndex(21, 2), tileIndex(21, 3)],
      [tileIndex(22, 0), tileIndex(22, 1), tileIndex(22, 2), tileIndex(22, 3)],
      [tileIndex(23, 0), tileIndex(23, 1), tileIndex(23, 2), tileIndex(23, 3)],
    ],
    rightWide: [
      [tileIndex(16, 12), null, null, null],
      [tileIndex(17, 12), tileIndex(17, 13), null, null],
      [tileIndex(18, 12), tileIndex(18, 13), tileIndex(18, 14), null],
      [tileIndex(19, 12), tileIndex(19, 13), tileIndex(19, 14), tileIndex(19, 15)],
      [tileIndex(20, 12), tileIndex(20, 13), tileIndex(20, 14), tileIndex(20, 15)],
      [tileIndex(21, 12), tileIndex(21, 13), tileIndex(21, 14), tileIndex(21, 15)],
      [tileIndex(22, 12), tileIndex(22, 13), tileIndex(22, 14), tileIndex(22, 15)],
      [tileIndex(23, 12), tileIndex(23, 13), tileIndex(23, 14), tileIndex(23, 15)],
    ],
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
