import Phaser from 'phaser';
import {
  createCliffFace,
  createRampPatch,
  createTransparentBrush,
  createWaterPatch,
  type TerrainBrush,
} from '../../content/tinySwordsTerrainBrushes';
import {
  tileIndex,
  TINY_SWORDS_TILEMAP_COLUMNS,
  TinySwordsTerrainTiles,
} from '../../content/tinySwordsTerrainTiles';
import {
  TinySwordsAtlases,
  TinySwordsResourceFrames,
} from '../../content/tinySwordsAssetKeys';
import { TinySwordsWorldScale } from '../../content/tinySwordsScale';
import { createTileLayerFromPreset } from './TerrainBuilder';

type BoolGrid = boolean[][];
type TileGrid = Array<Array<number | null>>;
type GrassDetailPatch = ReadonlyArray<ReadonlyArray<number | null>>;

export type IslandRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  elevation?: number;
  seed?: number;
  edgeMode?: 'shore' | 'none' | 'cliffTop';
  cliffHeight?: number;
  cliffType?: 'dry' | 'water';
};

export type IslandRamp = {
  x: number;
  y: number;
  direction: 'left' | 'right';
};

export type IslandMapConfig = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  tileScale?: number;
  terrainTilesetKey?: string;
  islands: IslandRect[];
  ramps?: IslandRamp[];
};

export type IslandMapMasks = {
  water: BoolGrid;
  land: BoolGrid;
  cliff: BoolGrid;
  ramp: BoolGrid;
  occupied: BoolGrid;
  shorelineWater: BoolGrid;
  decorAllowed: BoolGrid;
};

export type IslandMapResult = {
  x: number;
  y: number;
  width: number;
  height: number;
  tileSize: number;
  layers: {
    water: Phaser.Tilemaps.TilemapLayer;
    land: Phaser.Tilemaps.TilemapLayer;
    grassDetails: Phaser.Tilemaps.TilemapLayer;
    raisedEdges: Phaser.Tilemaps.TilemapLayer;
    cliffs: Phaser.Tilemaps.TilemapLayer;
    ramps: Phaser.Tilemaps.TilemapLayer;
  };
  masks: IslandMapMasks;
};

type DecorationOptions = {
  seed?: number;
  trees?: number;
  bushes?: number;
  rocks?: number;
  waterFoam?: number;
  waterRocks?: number;
};

const TERRAIN_TILESET = 'terrain-tilemap-color1';
const NEIGHBORS_4 = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;
const DECOR_SAFE_RADIUS = 2;
const GRASS_DETAIL_SAFE_RADIUS = 2;
const GRASS_DETAIL_CELL_RATIO = 42;
const GRASS_DETAIL_PADDING = 2;
const QUIET_GRASS_CENTER_TILE = tileIndex(5, 5);
const SMALL_DECOR_DEPTH = 8;

function emptyTiles(width: number, height: number): TileGrid {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null));
}

function boolGrid(width: number, height: number, value: boolean): BoolGrid {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => value));
}

function cloneBoolGrid(grid: BoolGrid): BoolGrid {
  return grid.map((row) => [...row]);
}

function hash2d(row: number, col: number, seed: number): number {
  let value = (row + 1) * 374761393 + (col + 1) * 668265263 + seed * 1442695041;
  value = (value ^ (value >>> 13)) * 1274126177;
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function inBounds(width: number, height: number, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < width && y < height;
}

function paste(target: TileGrid, brush: TerrainBrush, x: number, y: number): void {
  for (let row = 0; row < brush.height; row += 1) {
    for (let col = 0; col < brush.width; col += 1) {
      const targetY = y + row;
      const targetX = x + col;
      if (!inBounds(target[0]?.length ?? 0, target.length, targetX, targetY)) continue;
      const tile = brush.tiles[row]?.[col];
      if (tile != null) target[targetY][targetX] = tile;
    }
  }
}

function clearTilesFromBrush(target: TileGrid, brush: TerrainBrush, x: number, y: number): void {
  for (let row = 0; row < brush.height; row += 1) {
    for (let col = 0; col < brush.width; col += 1) {
      if (brush.tiles[row]?.[col] == null) continue;
      const targetY = y + row;
      const targetX = x + col;
      if (inBounds(target[0]?.length ?? 0, target.length, targetX, targetY)) target[targetY][targetX] = null;
    }
  }
}

function pasteMask(mask: BoolGrid, x: number, y: number, width: number, height: number, value: boolean): void {
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const targetY = y + row;
      const targetX = x + col;
      if (inBounds(mask[0]?.length ?? 0, mask.length, targetX, targetY)) mask[targetY][targetX] = value;
    }
  }
}

function pasteBrushMask(mask: BoolGrid, brush: TerrainBrush, x: number, y: number, value: boolean): void {
  for (let row = 0; row < brush.height; row += 1) {
    for (let col = 0; col < brush.width; col += 1) {
      if (brush.tiles[row]?.[col] == null) continue;
      const targetY = y + row;
      const targetX = x + col;
      if (inBounds(mask[0]?.length ?? 0, mask.length, targetX, targetY)) mask[targetY][targetX] = value;
    }
  }
}

function createLayer(
  scene: Phaser.Scene,
  x: number,
  y: number,
  tilesetKey: string,
  name: string,
  description: string,
  tiles: TileGrid,
  depth: number,
  scale: number,
): Phaser.Tilemaps.TilemapLayer {
  const brush = createTransparentBrush(name, description, tilesetKey, tiles);
  const layer = createTileLayerFromPreset({
    scene,
    x,
    y,
    tilesetKey,
    preset: brush,
  });
  layer.setScale(scale);
  layer.setDepth(depth);
  return layer;
}

function computeShorelineWater(water: BoolGrid, land: BoolGrid, cliff: BoolGrid, ramp: BoolGrid): BoolGrid {
  const height = water.length;
  const width = water[0]?.length ?? 0;
  const result = boolGrid(width, height, false);

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (!water[row][col]) continue;
      result[row][col] = NEIGHBORS_4.some(([dx, dy]) => {
        const x = col + dx;
        const y = row + dy;
        return inBounds(width, height, x, y) && (land[y][x] || cliff[y][x] || ramp[y][x]);
      });
    }
  }

  return result;
}

function isSafeDecorCell(land: BoolGrid, cliff: BoolGrid, ramp: BoolGrid, col: number, row: number): boolean {
  const height = land.length;
  const width = land[0]?.length ?? 0;
  for (let dy = -DECOR_SAFE_RADIUS; dy <= DECOR_SAFE_RADIUS; dy += 1) {
    for (let dx = -DECOR_SAFE_RADIUS; dx <= DECOR_SAFE_RADIUS; dx += 1) {
      const x = col + dx;
      const y = row + dy;
      if (!inBounds(width, height, x, y)) return false;
      if (!land[y][x] || cliff[y][x] || ramp[y][x]) return false;
    }
  }
  return true;
}

function computeDecorAllowed(land: BoolGrid, cliff: BoolGrid, ramp: BoolGrid): BoolGrid {
  const height = land.length;
  const width = land[0]?.length ?? 0;
  const result = boolGrid(width, height, false);

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (!land[row][col] || cliff[row][col] || ramp[row][col]) continue;
      result[row][col] = isSafeDecorCell(land, cliff, ramp, col, row);
    }
  }

  return result;
}

function sortedCells(mask: BoolGrid, seed: number): Array<{ col: number; row: number }> {
  const cells: Array<{ col: number; row: number; score: number }> = [];
  for (let row = 0; row < mask.length; row += 1) {
    for (let col = 0; col < (mask[row]?.length ?? 0); col += 1) {
      if (mask[row][col]) cells.push({ col, row, score: hash2d(row, col, seed) });
    }
  }
  return cells.sort((a, b) => a.score - b.score);
}

function farEnough(
  picked: Array<{ col: number; row: number }>,
  candidate: { col: number; row: number },
  minDistance: number,
): boolean {
  return picked.every((p) => Math.abs(p.col - candidate.col) + Math.abs(p.row - candidate.row) >= minDistance);
}

function pickCells(mask: BoolGrid, count: number, seed: number, minDistance: number): Array<{ col: number; row: number }> {
  const picked: Array<{ col: number; row: number }> = [];
  for (const cell of sortedCells(mask, seed)) {
    if (picked.length >= count) break;
    if (farEnough(picked, cell, minDistance)) picked.push(cell);
  }
  return picked;
}

function sequencePick<T>(items: readonly T[], offset: number): T {
  const index = ((offset % items.length) + items.length) % items.length;
  return items[index];
}

function isMaskCell(mask: BoolGrid, col: number, row: number): boolean {
  return inBounds(mask[0]?.length ?? 0, mask.length, col, row) && mask[row][col];
}

function grassCenterTile(): number {
  return QUIET_GRASS_CENTER_TILE;
}

function grassTileFromMask(land: BoolGrid, cliff: BoolGrid, col: number, row: number): number {
  const up = isMaskCell(land, col, row - 1);
  const right = isMaskCell(land, col + 1, row);
  const down = isMaskCell(land, col, row + 1);
  const left = isMaskCell(land, col - 1, row);
  const downIsCliff = isMaskCell(cliff, col, row + 1);
  const { GrassCorners, GrassEdges } = TinySwordsTerrainTiles;

  if (isMaskCell(cliff, col, row)) return grassCenterTile();

  if (downIsCliff) return grassCenterTile();

  if (!up && !left) return GrassCorners.topLeft;
  if (!up && !right) return GrassCorners.topRight;
  if (!down && !right) return GrassCorners.bottomRight;
  if (!down && !left) return GrassCorners.bottomLeft;
  if (!up) return sequencePick(GrassEdges.top, col - 1);
  if (!right) return sequencePick(GrassEdges.right, row - 1);
  if (!down) return sequencePick(GrassEdges.bottom, col - 1);
  if (!left) return sequencePick(GrassEdges.left, row - 1);

  return grassCenterTile();
}

function raisedEdgeTile(localCol: number, localRow: number, width: number, height: number): number {
  const lastCol = width - 1;
  const lastRow = height - 1;
  const { RaisedGrassBoundary, RaisedGrassCorners } = TinySwordsTerrainTiles;

  if (localRow === 0 && localCol === 0) return RaisedGrassCorners.topLeft;
  if (localRow === 0 && localCol === lastCol) return RaisedGrassCorners.topRight;
  if (localRow === lastRow && localCol === 0) return RaisedGrassCorners.bottomLeft;
  if (localRow === lastRow && localCol === lastCol) return RaisedGrassCorners.bottomRight;

  if (localRow === 0) {
    if (localCol === 1) return tileIndex(RaisedGrassBoundary.topRow, RaisedGrassBoundary.horizontalStartCol);
    if (localCol === lastCol - 1) return tileIndex(RaisedGrassBoundary.topRow, RaisedGrassBoundary.horizontalEndCol);
    return tileIndex(
      RaisedGrassBoundary.topRow,
      sequencePick(RaisedGrassBoundary.horizontalCenterCols, localCol - 2),
    );
  }

  if (localRow === lastRow) {
    if (localCol === 1) return tileIndex(RaisedGrassBoundary.bottomRow, RaisedGrassBoundary.horizontalStartCol);
    if (localCol === lastCol - 1) return tileIndex(RaisedGrassBoundary.bottomRow, RaisedGrassBoundary.horizontalEndCol);
    return tileIndex(
      RaisedGrassBoundary.bottomRow,
      sequencePick(RaisedGrassBoundary.horizontalCenterCols, localCol - 2),
    );
  }

  if (localCol === 0) {
    if (localRow === 1) return tileIndex(RaisedGrassBoundary.verticalStartRow, RaisedGrassBoundary.leftCol);
    if (localRow === lastRow - 1) return tileIndex(RaisedGrassBoundary.verticalEndRow, RaisedGrassBoundary.leftCol);
    return tileIndex(
      sequencePick(RaisedGrassBoundary.verticalCenterRows, localRow - 2),
      RaisedGrassBoundary.leftCol,
    );
  }

  if (localCol === lastCol) {
    if (localRow === 1) return tileIndex(RaisedGrassBoundary.verticalStartRow, RaisedGrassBoundary.rightCol);
    if (localRow === lastRow - 1) return tileIndex(RaisedGrassBoundary.verticalEndRow, RaisedGrassBoundary.rightCol);
    return tileIndex(
      sequencePick(RaisedGrassBoundary.verticalCenterRows, localRow - 2),
      RaisedGrassBoundary.rightCol,
    );
  }

  return grassCenterTile();
}

function applyRaisedLandBorder(tiles: TileGrid, island: IslandRect): void {
  if ((island.elevation ?? 0) <= 0) return;
  for (let row = 0; row < island.height; row += 1) {
    for (let col = 0; col < island.width; col += 1) {
      const isBorder = row === 0 || col === 0 || col === island.width - 1 || row === island.height - 1;
      if (!isBorder) continue;
      const targetX = island.x + col;
      const targetY = island.y + row;
      if (!inBounds(tiles[0]?.length ?? 0, tiles.length, targetX, targetY)) continue;
      tiles[targetY][targetX] = raisedEdgeTile(col, row, island.width, island.height);
    }
  }
}

function normalizeCliffEdges(tiles: TileGrid, cliff: BoolGrid): void {
  const { dry, water } = TinySwordsTerrainTiles.CliffFaces;
  const cliffRows = new Set<number>([
    dry.topRow,
    dry.bottomRow,
    ...dry.middleRows,
    water.topRow,
    water.bottomRow,
    ...water.middleRows,
  ]);

  for (let row = 0; row < tiles.length; row += 1) {
    for (let col = 0; col < (tiles[row]?.length ?? 0); col += 1) {
      const tile = tiles[row][col];
      if (tile == null || !cliff[row][col]) continue;
      const sourceRow = Math.floor(tile / TINY_SWORDS_TILEMAP_COLUMNS);
      if (!cliffRows.has(sourceRow)) continue;
      const leftConnected = isMaskCell(cliff, col - 1, row);
      const rightConnected = isMaskCell(cliff, col + 1, row);
      const face = sourceRow >= water.topRow ? water : dry;
      let sourceCol = face.centerCols[col % face.centerCols.length];
      if (!leftConnected) sourceCol = face.leftCol;
      else if (!rightConnected) sourceCol = face.rightCol;
      tiles[row][col] = tileIndex(sourceRow, sourceCol);
    }
  }
}

function createGrassTilesFromMask(land: BoolGrid, cliff: BoolGrid): TileGrid {
  const height = land.length;
  const width = land[0]?.length ?? 0;
  const tiles = emptyTiles(width, height);

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (land[row][col]) tiles[row][col] = grassTileFromMask(land, cliff, col, row);
    }
  }

  return tiles;
}

function isSafeGrassDetailCell(land: BoolGrid, cliff: BoolGrid, ramp: BoolGrid, col: number, row: number): boolean {
  const height = land.length;
  const width = land[0]?.length ?? 0;
  for (let dy = -GRASS_DETAIL_SAFE_RADIUS; dy <= GRASS_DETAIL_SAFE_RADIUS; dy += 1) {
    for (let dx = -GRASS_DETAIL_SAFE_RADIUS; dx <= GRASS_DETAIL_SAFE_RADIUS; dx += 1) {
      const x = col + dx;
      const y = row + dy;
      if (!inBounds(width, height, x, y)) return false;
      if (!land[y][x] || cliff[y][x] || ramp[y][x]) return false;
    }
  }
  return true;
}

function grassDetailPatchSize(patch: GrassDetailPatch): { width: number; height: number } {
  return {
    width: Math.max(...patch.map((row) => row.length)),
    height: patch.length,
  };
}

function canPlaceGrassDetailPatch(
  land: BoolGrid,
  cliff: BoolGrid,
  ramp: BoolGrid,
  occupied: BoolGrid,
  patch: GrassDetailPatch,
  col: number,
  row: number,
): boolean {
  for (let dy = 0; dy < patch.length; dy += 1) {
    for (let dx = 0; dx < (patch[dy]?.length ?? 0); dx += 1) {
      if (patch[dy]?.[dx] == null) continue;
      const x = col + dx;
      const y = row + dy;
      if (!inBounds(land[0]?.length ?? 0, land.length, x, y)) return false;
      if (occupied[y][x] || !isSafeGrassDetailCell(land, cliff, ramp, x, y)) return false;
    }
  }
  return true;
}

function occupyGrassDetailPatch(occupied: BoolGrid, patch: GrassDetailPatch, col: number, row: number): void {
  const { width, height } = grassDetailPatchSize(patch);
  for (let dy = -GRASS_DETAIL_PADDING; dy < height + GRASS_DETAIL_PADDING; dy += 1) {
    for (let dx = -GRASS_DETAIL_PADDING; dx < width + GRASS_DETAIL_PADDING; dx += 1) {
      const x = col + dx;
      const y = row + dy;
      if (inBounds(occupied[0]?.length ?? 0, occupied.length, x, y)) occupied[y][x] = true;
    }
  }
}

function pasteGrassDetailPatch(tiles: TileGrid, patch: GrassDetailPatch, col: number, row: number): void {
  for (let dy = 0; dy < patch.length; dy += 1) {
    for (let dx = 0; dx < (patch[dy]?.length ?? 0); dx += 1) {
      const tile = patch[dy]?.[dx];
      if (tile == null) continue;
      const x = col + dx;
      const y = row + dy;
      if (inBounds(tiles[0]?.length ?? 0, tiles.length, x, y)) tiles[y][x] = tile;
    }
  }
}

function createGrassDetailTiles(land: BoolGrid, cliff: BoolGrid, ramp: BoolGrid, seed: number): TileGrid {
  const height = land.length;
  const width = land[0]?.length ?? 0;
  const tiles = emptyTiles(width, height);
  const safeInterior = boolGrid(width, height, false);
  const detailOccupied = boolGrid(width, height, false);
  const patches = TinySwordsTerrainTiles.GrassDetailPatches;
  let safeCells = 0;

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      safeInterior[row][col] = isSafeGrassDetailCell(land, cliff, ramp, col, row);
      if (safeInterior[row][col]) safeCells += 1;
    }
  }

  const maxPatches = Math.floor(safeCells / GRASS_DETAIL_CELL_RATIO);
  let placed = 0;

  for (const cell of sortedCells(safeInterior, seed)) {
    if (placed >= maxPatches) break;
    const patch = sequencePick(patches, Math.floor(hash2d(cell.row, cell.col, seed + 91) * patches.length));
    if (!canPlaceGrassDetailPatch(land, cliff, ramp, detailOccupied, patch, cell.col, cell.row)) continue;
    pasteGrassDetailPatch(tiles, patch, cell.col, cell.row);
    occupyGrassDetailPatch(detailOccupied, patch, cell.col, cell.row);
    placed += 1;
  }

  return tiles;
}

function canPlaceFootprint(mask: BoolGrid, occupied: BoolGrid, col: number, row: number, footprint: Footprint): boolean {
  for (let dy = 0; dy < footprint.height; dy += 1) {
    for (let dx = 0; dx < footprint.width; dx += 1) {
      const x = col + footprint.offsetX + dx;
      const y = row + footprint.offsetY + dy;
      if (!inBounds(mask[0]?.length ?? 0, mask.length, x, y) || !mask[y][x] || occupied[y][x]) return false;
    }
  }
  return true;
}

function occupyFootprint(occupied: BoolGrid, col: number, row: number, footprint: Footprint): void {
  for (let dy = 0; dy < footprint.height; dy += 1) {
    for (let dx = 0; dx < footprint.width; dx += 1) {
      const x = col + footprint.offsetX + dx;
      const y = row + footprint.offsetY + dy;
      if (inBounds(occupied[0]?.length ?? 0, occupied.length, x, y)) occupied[y][x] = true;
    }
  }
}

function pickFootprintCells(
  mask: BoolGrid,
  occupied: BoolGrid,
  count: number,
  seed: number,
  minDistance: number,
  footprint: Footprint,
): Array<{ col: number; row: number }> {
  const picked: Array<{ col: number; row: number }> = [];
  for (const cell of sortedCells(mask, seed)) {
    if (picked.length >= count) break;
    if (!farEnough(picked, cell, minDistance)) continue;
    if (!canPlaceFootprint(mask, occupied, cell.col, cell.row, footprint)) continue;
    occupyFootprint(occupied, cell.col, cell.row, footprint);
    picked.push(cell);
  }
  return picked;
}

function shoreDirection(map: IslandMapResult, cell: { col: number; row: number }): { dx: number; dy: number } {
  for (const [dx, dy] of NEIGHBORS_4) {
    const col = cell.col + dx;
    const row = cell.row + dy;
    if (!inBounds(map.width, map.height, col, row)) continue;
    if (map.masks.land[row][col] || map.masks.cliff[row][col] || map.masks.ramp[row][col]) {
      return { dx, dy };
    }
  }
  return { dx: 0, dy: 0 };
}

type Footprint = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

export type IslandMapReservation = {
  col: number;
  row: number;
  width: number;
  height: number;
};

type IslandMapReservationOptions = {
  block?: boolean;
};

export function createIslandMap(config: IslandMapConfig): IslandMapResult {
  const tileScale = config.tileScale ?? TinySwordsWorldScale.Terrain;
  const terrainTilesetKey = config.terrainTilesetKey ?? TERRAIN_TILESET;
  const waterBrush = createWaterPatch(config.width, config.height, 90);
  const landTiles = emptyTiles(config.width, config.height);
  const grassDetailTiles = emptyTiles(config.width, config.height);
  const raisedEdgeTiles = emptyTiles(config.width, config.height);
  const cliffTiles = emptyTiles(config.width, config.height);
  const rampTiles = emptyTiles(config.width, config.height);
  const water = boolGrid(config.width, config.height, true);
  const land = boolGrid(config.width, config.height, false);
  const cliff = boolGrid(config.width, config.height, false);
  const ramp = boolGrid(config.width, config.height, false);
  const occupied = boolGrid(config.width, config.height, false);

  for (const island of config.islands) {
    const elevation = island.elevation ?? 0;
    pasteMask(land, island.x, island.y, island.width, island.height, true);
    pasteMask(water, island.x, island.y, island.width, island.height, false);

    if (elevation > 0 || island.cliffHeight) {
      const cliffHeight = island.cliffHeight ?? Math.max(3, elevation * 3);
      const cliffY = island.y + island.height;
      let waterCells = 0;
      for (let row = cliffY; row < cliffY + cliffHeight; row += 1) {
        for (let col = island.x; col < island.x + island.width; col += 1) {
          if (inBounds(config.width, config.height, col, row) && water[row][col]) waterCells += 1;
        }
      }
      const sampledCells = island.width * cliffHeight;
      const cliffType = island.cliffType ?? (waterCells > sampledCells / 2 ? 'water' : 'dry');
      const cliffBrush = createCliffFace(island.width, cliffHeight, {
        tilesetKey: terrainTilesetKey,
        variant: cliffType,
        seed: (island.seed ?? 1) + 300,
      });
      paste(cliffTiles, cliffBrush, island.x, cliffY);
      pasteMask(cliff, island.x, cliffY, island.width, cliffHeight, true);
      if (cliffType === 'water') {
        pasteMask(land, island.x, cliffY, island.width, cliffHeight, false);
        pasteMask(water, island.x, cliffY, island.width, cliffHeight, true);
      } else {
        pasteMask(land, island.x, cliffY, island.width, cliffHeight, true);
        pasteMask(water, island.x, cliffY, island.width, cliffHeight, false);
      }
    }
  }

  for (const r of config.ramps ?? []) {
    const rampBrush = createRampPatch(r.direction, { tilesetKey: terrainTilesetKey });
    clearTilesFromBrush(cliffTiles, rampBrush, r.x, r.y);
    pasteBrushMask(cliff, rampBrush, r.x, r.y, false);
    paste(rampTiles, rampBrush, r.x, r.y);
    pasteBrushMask(ramp, rampBrush, r.x, r.y, true);
    pasteBrushMask(land, rampBrush, r.x, r.y, true);
    pasteBrushMask(water, rampBrush, r.x, r.y, false);
  }
  normalizeCliffEdges(cliffTiles, cliff);

  const autoLandTiles = createGrassTilesFromMask(land, cliff);
  for (let row = 0; row < config.height; row += 1) {
    for (let col = 0; col < config.width; col += 1) {
      landTiles[row][col] = autoLandTiles[row][col];
    }
  }
  const autoGrassDetailTiles = createGrassDetailTiles(land, cliff, ramp, 140);
  for (let row = 0; row < config.height; row += 1) {
    for (let col = 0; col < config.width; col += 1) {
      grassDetailTiles[row][col] = autoGrassDetailTiles[row][col];
    }
  }
  for (const island of config.islands) applyRaisedLandBorder(raisedEdgeTiles, island);

  const shorelineWater = computeShorelineWater(water, land, cliff, ramp);
  const decorAllowed = computeDecorAllowed(land, cliff, ramp);
  const layers = {
    water: createLayer(config.scene, config.x, config.y, waterBrush.tilesetKey, 'waterBase', 'Full water base prevents black voids around islands.', waterBrush.tiles, 0, tileScale),
    land: createLayer(config.scene, config.x, config.y, terrainTilesetKey, 'land', 'Grass island layer.', landTiles, 4, tileScale),
    grassDetails: createLayer(config.scene, config.x, config.y, terrainTilesetKey, 'grassDetails', 'Sparse interior grass motifs over the quiet base tile.', grassDetailTiles, 4.25, tileScale),
    raisedEdges: createLayer(config.scene, config.x, config.y, terrainTilesetKey, 'raisedEdges', 'Dry raised land boundary overlay. It preserves lower grass under transparent pixels.', raisedEdgeTiles, 4.5, tileScale),
    cliffs: createLayer(config.scene, config.x, config.y, terrainTilesetKey, 'cliffs', 'Cliff and elevation layer.', cliffTiles, 5, tileScale),
    ramps: createLayer(config.scene, config.x, config.y, terrainTilesetKey, 'ramps', 'Deliberate elevation connectors.', rampTiles, 6, tileScale),
  };

  return {
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
    tileSize: 16 * tileScale,
    layers,
    masks: { water, land, cliff, ramp, occupied, shorelineWater, decorAllowed },
  };
}

export function islandCellToWorld(map: IslandMapResult, col: number, row: number): { x: number; y: number } {
  return {
    x: map.x + col * map.tileSize + map.tileSize / 2,
    y: map.y + row * map.tileSize + map.tileSize / 2,
  };
}

export function reserveIslandMapArea(
  map: IslandMapResult,
  reservation: IslandMapReservation,
  options: IslandMapReservationOptions = {},
): void {
  if (options.block ?? true) {
    pasteMask(map.masks.occupied, reservation.col, reservation.row, reservation.width, reservation.height, true);
  }
  pasteMask(map.masks.decorAllowed, reservation.col, reservation.row, reservation.width, reservation.height, false);
}

export function placeIslandMapDecorations(map: IslandMapResult, options: DecorationOptions = {}): void {
  const scene = map.layers.land.scene;
  const seed = options.seed ?? 1;
  const toWorld = (cell: { col: number; row: number }) => islandCellToWorld(map, cell.col, cell.row);
  const treeFootprint: Footprint = { width: 7, height: 8, offsetX: -3, offsetY: -7 };
  const treeBlockingFootprint: Footprint = { width: 2, height: 2, offsetX: -1, offsetY: -1 };
  const bushFootprint: Footprint = { width: 3, height: 3, offsetX: -1, offsetY: -1 };
  const rockFootprint: Footprint = { width: 3, height: 3, offsetX: -1, offsetY: -1 };
  const visualOccupied = cloneBoolGrid(map.masks.occupied);

  for (const [index, cell] of pickFootprintCells(map.masks.decorAllowed, visualOccupied, options.trees ?? 5, seed + 10, 5, treeFootprint).entries()) {
    const { x, y } = toWorld(cell);
    const key = ['env-tree-01', 'env-tree-02', 'env-tree-03', 'env-tree-04'][index % 4];
    const tree = scene.add.sprite(x, y, key)
      .setOrigin(0.5, 0.88)
      .setScale(TinySwordsWorldScale.TreeLarge)
      .setDepth(y);
    if (scene.anims.exists(key)) tree.play(key);
    occupyFootprint(map.masks.occupied, cell.col, cell.row, treeBlockingFootprint);
  }

  for (const [index, cell] of pickFootprintCells(map.masks.decorAllowed, visualOccupied, options.bushes ?? 5, seed + 20, 4, bushFootprint).entries()) {
    const { x, y } = toWorld(cell);
    const key = ['env-bush-01', 'env-bush-02', 'env-bush-03', 'env-bush-04'][index % 4];
    const bush = scene.add.sprite(x, y, key).setScale(TinySwordsWorldScale.Bush).setDepth(SMALL_DECOR_DEPTH);
    if (scene.anims.exists(key)) bush.play(key);
  }

  const rockFrames = [
    TinySwordsResourceFrames.Rock1,
    TinySwordsResourceFrames.Rock2,
    TinySwordsResourceFrames.Rock3,
    TinySwordsResourceFrames.Rock4,
  ];
  for (const [index, cell] of pickFootprintCells(map.masks.decorAllowed, visualOccupied, options.rocks ?? 5, seed + 30, 3, rockFootprint).entries()) {
    const { x, y } = toWorld(cell);
    scene.add.image(x, y, TinySwordsAtlases.Resources, rockFrames[index % rockFrames.length]).setDepth(SMALL_DECOR_DEPTH);
  }

  for (const [index, cell] of pickCells(map.masks.shorelineWater, options.waterFoam ?? 0, seed + 40, 5).entries()) {
    const { x, y } = toWorld(cell);
    const { dx, dy } = shoreDirection(map, cell);
    const foam = scene.add.sprite(
      x + dx * map.tileSize * 0.35,
      y + dy * map.tileSize * 0.35,
      'env-water-foam',
    ).setScale(0.3).setAlpha(0.45).setDepth(1);
    if (scene.anims.exists('env-water-foam')) foam.play('env-water-foam');
    else foam.setFrame(index % 16);
  }

  for (const [index, cell] of pickCells(map.masks.shorelineWater, options.waterRocks ?? 4, seed + 50, 5).entries()) {
    const { x, y } = toWorld(cell);
    const key = ['env-water-rocks-01', 'env-water-rocks-02', 'env-water-rocks-03', 'env-water-rocks-04'][index % 4];
    scene.add.image(x, y, key, 48 + index * 7).setScale(TinySwordsWorldScale.WaterRock).setDepth(6);
  }
}
