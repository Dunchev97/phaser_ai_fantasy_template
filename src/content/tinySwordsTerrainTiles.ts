export const TINY_SWOWRDS_TILE_WIDTH = 16;
export const TINY_SWOWRDS_TILE_HEIGHT = 16;

export const TINY_SWORDS_TILEMAP_COLUMNS = 36;
export const TINY_SWORDS_TILEMAP_ROWS = 24;
export const TINY_SWORDS_TILEMAP_TILE_COUNT = TINY_SWORDS_TILEMAP_COLUMNS * TINY_SWORDS_TILEMAP_ROWS; // 864

export const TINY_SWORDS_SHADOW_COLUMNS = 12;
export const TINY_SWORDS_SHADOW_ROWS = 12;
export const TINY_SWORDS_SHADOW_TILE_COUNT = TINY_SWORDS_SHADOW_COLUMNS * TINY_SWORDS_SHADOW_ROWS; // 144

/**
 * Compute the 0-based tile index for a tilemap-color image.
 * row and col are 0-based.
 */
export function tileIndex(row: number, col: number): number {
  return row * TINY_SWORDS_TILEMAP_COLUMNS + col;
}

// --- Safe candidate groups (do not assume exact semantic meaning) ---

/**
 * Grass candidates — generally the first rows of a tilemap-color.
 * The top-left area (rows 0–3, cols 0–5) usually contains plain grass / ground variants.
 */
export const GrassCandidates = [
  tileIndex(0, 0), tileIndex(0, 1), tileIndex(0, 2), tileIndex(0, 3), tileIndex(0, 4), tileIndex(0, 5),
  tileIndex(1, 0), tileIndex(1, 1), tileIndex(1, 2), tileIndex(1, 3), tileIndex(1, 4), tileIndex(1, 5),
  tileIndex(2, 0), tileIndex(2, 1), tileIndex(2, 2), tileIndex(2, 3), tileIndex(2, 4), tileIndex(2, 5),
  tileIndex(3, 0), tileIndex(3, 1), tileIndex(3, 2), tileIndex(3, 3), tileIndex(3, 4), tileIndex(3, 5),
];

/**
 * Water candidates — usually bottom rows of a tilemap-color (rows 15–23, cols 0–11 and similar).
 * These are blue/water-looking tiles.
 */
export const WaterCandidates = [
  tileIndex(15, 0), tileIndex(15, 1), tileIndex(15, 2), tileIndex(15, 3),
  tileIndex(16, 0), tileIndex(16, 1), tileIndex(16, 2), tileIndex(16, 3),
  tileIndex(17, 0), tileIndex(17, 1), tileIndex(17, 2), tileIndex(17, 3),
  tileIndex(18, 0), tileIndex(18, 1), tileIndex(18, 2), tileIndex(18, 3),
  tileIndex(19, 0), tileIndex(19, 1), tileIndex(19, 2), tileIndex(19, 3),
  tileIndex(20, 0), tileIndex(20, 1), tileIndex(20, 2), tileIndex(20, 3),
  tileIndex(21, 0), tileIndex(21, 1), tileIndex(21, 2), tileIndex(21, 3),
  tileIndex(22, 0), tileIndex(22, 1), tileIndex(22, 2), tileIndex(22, 3),
  tileIndex(23, 0), tileIndex(23, 1), tileIndex(23, 2), tileIndex(23, 3),
];

/**
 * Cliff candidates — darker rocky tiles, usually in the middle rows (cols 12–23, rows 4–14).
 */
export const CliffCandidates = [
  tileIndex(4, 12), tileIndex(4, 13), tileIndex(4, 14), tileIndex(4, 15),
  tileIndex(5, 12), tileIndex(5, 13), tileIndex(5, 14), tileIndex(5, 15),
  tileIndex(6, 12), tileIndex(6, 13), tileIndex(6, 14), tileIndex(6, 15),
  tileIndex(7, 12), tileIndex(7, 13), tileIndex(7, 14), tileIndex(7, 15),
  tileIndex(8, 12), tileIndex(8, 13), tileIndex(8, 14), tileIndex(8, 15),
];

/**
 * Path candidates — dirt/road-like tiles, often near the top-middle (cols 6–11, rows 0–3).
 */
export const PathCandidates = [
  tileIndex(0, 6), tileIndex(0, 7), tileIndex(0, 8), tileIndex(0, 9),
  tileIndex(1, 6), tileIndex(1, 7), tileIndex(1, 8), tileIndex(1, 9),
  tileIndex(2, 6), tileIndex(2, 7), tileIndex(2, 8), tileIndex(2, 9),
];

/**
 * Edge candidates — transition tiles between grass/water or grass/cliff.
 * Usually appear around rows 10–14, cols 0–11.
 */
export const EdgeCandidates = [
  tileIndex(10, 0), tileIndex(10, 1), tileIndex(10, 2), tileIndex(10, 3), tileIndex(10, 4), tileIndex(10, 5),
  tileIndex(11, 0), tileIndex(11, 1), tileIndex(11, 2), tileIndex(11, 3), tileIndex(11, 4), tileIndex(11, 5),
  tileIndex(12, 0), tileIndex(12, 1), tileIndex(12, 2), tileIndex(12, 3), tileIndex(12, 4), tileIndex(12, 5),
  tileIndex(13, 0), tileIndex(13, 1), tileIndex(13, 2), tileIndex(13, 3), tileIndex(13, 4), tileIndex(13, 5),
  tileIndex(14, 0), tileIndex(14, 1), tileIndex(14, 2), tileIndex(14, 3), tileIndex(14, 4), tileIndex(14, 5),
];

/**
 * Decoration candidates — small flowers, rocks, patches.
 * Usually scattered in rows 4–9, cols 18–35.
 */
export const DecorationCandidates = [
  tileIndex(4, 18), tileIndex(4, 19), tileIndex(4, 20), tileIndex(4, 21),
  tileIndex(5, 18), tileIndex(5, 19), tileIndex(5, 20), tileIndex(5, 21),
  tileIndex(6, 18), tileIndex(6, 19), tileIndex(6, 20), tileIndex(6, 21),
  tileIndex(7, 18), tileIndex(7, 19), tileIndex(7, 20), tileIndex(7, 21),
];
