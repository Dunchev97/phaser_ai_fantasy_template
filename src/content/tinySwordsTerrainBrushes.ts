import { tileIndex } from './tinySwordsTerrainTiles';

export interface TerrainBrush {
  name: string;
  description: string;
  tilesetKey: string;
  width: number;
  height: number;
  tiles: number[][]; // 2D array of tile indexes
}

/** Plain grass rectangle using top-left grass candidates (row 0–1, col 0–2) */
export const simpleGrassRect: TerrainBrush = {
  name: 'simpleGrassRect',
  description: 'A simple rectangle filled with basic grass tiles.',
  tilesetKey: 'terrain-tilemap-color1',
  width: 6,
  height: 4,
  tiles: [
    [tileIndex(0, 0), tileIndex(0, 1), tileIndex(0, 2), tileIndex(0, 0), tileIndex(0, 1), tileIndex(0, 2)],
    [tileIndex(1, 0), tileIndex(1, 1), tileIndex(1, 2), tileIndex(1, 0), tileIndex(1, 1), tileIndex(1, 2)],
    [tileIndex(0, 0), tileIndex(0, 1), tileIndex(0, 2), tileIndex(0, 0), tileIndex(0, 1), tileIndex(0, 2)],
    [tileIndex(1, 0), tileIndex(1, 1), tileIndex(1, 2), tileIndex(1, 0), tileIndex(1, 1), tileIndex(1, 2)],
  ],
};

/** Cliff block using cliff candidates (row 4–6, col 12–14) */
export const simpleCliffBlock: TerrainBrush = {
  name: 'simpleCliffBlock',
  description: 'A small block of cliff/rock tiles.',
  tilesetKey: 'terrain-tilemap-color1',
  width: 4,
  height: 3,
  tiles: [
    [tileIndex(4, 12), tileIndex(4, 13), tileIndex(4, 14), tileIndex(4, 12)],
    [tileIndex(5, 12), tileIndex(5, 13), tileIndex(5, 14), tileIndex(5, 12)],
    [tileIndex(6, 12), tileIndex(6, 13), tileIndex(6, 14), tileIndex(6, 12)],
  ],
};

/** Water patch using water candidates (row 15–18, col 0–2) */
export const simpleWaterPatch: TerrainBrush = {
  name: 'simpleWaterPatch',
  description: 'A small water area.',
  tilesetKey: 'terrain-tilemap-color1',
  width: 5,
  height: 4,
  tiles: [
    [tileIndex(15, 0), tileIndex(15, 1), tileIndex(15, 2), tileIndex(15, 0), tileIndex(15, 1)],
    [tileIndex(16, 0), tileIndex(16, 1), tileIndex(16, 2), tileIndex(16, 0), tileIndex(16, 1)],
    [tileIndex(17, 0), tileIndex(17, 1), tileIndex(17, 2), tileIndex(17, 0), tileIndex(17, 1)],
    [tileIndex(18, 0), tileIndex(18, 1), tileIndex(18, 2), tileIndex(18, 0), tileIndex(18, 1)],
  ],
};

export const TinySwordsTerrainBrushes: TerrainBrush[] = [
  simpleGrassRect,
  simpleCliffBlock,
  simpleWaterPatch,
];
