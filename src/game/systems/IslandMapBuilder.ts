import Phaser from 'phaser';
import {
  createCliffBlock,
  createRampPatch,
  createTransparentBrush,
  createWaterPatch,
  type TerrainBrush,
} from '../../content/tinySwordsTerrainBrushes';
import { TinySwordsTerrainTiles } from '../../content/tinySwordsTerrainTiles';
import {
  TinySwordsAtlases,
  TinySwordsResourceFrames,
} from '../../content/tinySwordsAssetKeys';
import { TinySwordsWorldScale } from '../../content/tinySwordsScale';
import { createTileLayerFromPreset } from './TerrainBuilder';

type BoolGrid = boolean[][];
type TileGrid = Array<Array<number | null>>;

export type IslandRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  elevation?: number;
  seed?: number;
  edgeMode?: 'shore' | 'none' | 'cliffTop';
  cliffHeight?: number;
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
    cliffs: Phaser.Tilemaps.TilemapLayer;
    land: Phaser.Tilemaps.TilemapLayer;
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

function emptyTiles(width: number, height: number): TileGrid {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null));
}

function boolGrid(width: number, height: number, value: boolean): BoolGrid {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => value));
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

function pasteMask(mask: BoolGrid, x: number, y: number, width: number, height: number, value: boolean): void {
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const targetY = y + row;
      const targetX = x + col;
      if (inBounds(mask[0]?.length ?? 0, mask.length, targetX, targetY)) mask[targetY][targetX] = value;
    }
  }
}

function markRamp(mask: BoolGrid, ramp: IslandRamp, value: boolean): void {
  const brush = createRampPatch(ramp.direction);
  pasteMask(mask, ramp.x, ramp.y, brush.width, brush.height, value);
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

function computeDecorAllowed(land: BoolGrid, cliff: BoolGrid, ramp: BoolGrid): BoolGrid {
  const height = land.length;
  const width = land[0]?.length ?? 0;
  const result = boolGrid(width, height, false);

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (!land[row][col] || cliff[row][col] || ramp[row][col]) continue;
      const nearUnsafe = NEIGHBORS_4.some(([dx, dy]) => {
        const x = col + dx;
        const y = row + dy;
        return !inBounds(width, height, x, y) || !land[y][x] || cliff[y][x] || ramp[y][x];
      });
      result[row][col] = !nearUnsafe;
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

function pick<T>(items: readonly T[], row: number, col: number, seed: number): T {
  const index = Math.floor(hash2d(row, col, seed) * items.length) % items.length;
  return items[index];
}

function isMaskCell(mask: BoolGrid, col: number, row: number): boolean {
  return inBounds(mask[0]?.length ?? 0, mask.length, col, row) && mask[row][col];
}

function grassTileFromMask(land: BoolGrid, col: number, row: number, seed: number): number {
  const up = isMaskCell(land, col, row - 1);
  const right = isMaskCell(land, col + 1, row);
  const down = isMaskCell(land, col, row + 1);
  const left = isMaskCell(land, col - 1, row);
  const { GrassCenter, GrassCorners, GrassDecor, GrassEdges } = TinySwordsTerrainTiles;

  if (!up && !left) return GrassCorners.topLeft;
  if (!up && !right) return GrassCorners.topRight;
  if (!down && !right) return GrassCorners.bottomRight;
  if (!down && !left) return GrassCorners.bottomLeft;
  if (!up) return pick(GrassEdges.top, row, col, seed);
  if (!right) return pick(GrassEdges.right, row, col, seed);
  if (!down) return pick(GrassEdges.bottom, row, col, seed);
  if (!left) return pick(GrassEdges.left, row, col, seed);

  if (hash2d(row, col, seed + 31) < 0.07) return pick(GrassDecor, row, col, seed + 101);
  return pick(GrassCenter, row, col, seed);
}

function createGrassTilesFromMask(land: BoolGrid, seed = 1): TileGrid {
  const height = land.length;
  const width = land[0]?.length ?? 0;
  const tiles = emptyTiles(width, height);

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (land[row][col]) tiles[row][col] = grassTileFromMask(land, col, row, seed);
    }
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

export function createIslandMap(config: IslandMapConfig): IslandMapResult {
  const tileScale = config.tileScale ?? TinySwordsWorldScale.Terrain;
  const terrainTilesetKey = config.terrainTilesetKey ?? TERRAIN_TILESET;
  const waterBrush = createWaterPatch(config.width, config.height, 90);
  const landTiles = emptyTiles(config.width, config.height);
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
      const cliffBrush = createCliffBlock(island.width, cliffHeight, {
        tilesetKey: terrainTilesetKey,
        seed: (island.seed ?? 1) + 300,
      });
      const cliffY = island.y + island.height;
      paste(cliffTiles, cliffBrush, island.x, cliffY);
      pasteMask(cliff, island.x, cliffY, island.width, cliffHeight, true);
      pasteMask(land, island.x, cliffY, island.width, cliffHeight, false);
      pasteMask(water, island.x, cliffY, island.width, cliffHeight, false);
    }
  }

  for (const r of config.ramps ?? []) {
    const rampBrush = createRampPatch(r.direction, { tilesetKey: terrainTilesetKey });
    paste(rampTiles, rampBrush, r.x, r.y);
    markRamp(ramp, r, true);
    pasteMask(land, r.x, r.y, rampBrush.width, rampBrush.height, true);
    pasteMask(water, r.x, r.y, rampBrush.width, rampBrush.height, false);
  }

  const autoLandTiles = createGrassTilesFromMask(land, 17);
  for (let row = 0; row < config.height; row += 1) {
    for (let col = 0; col < config.width; col += 1) {
      landTiles[row][col] = autoLandTiles[row][col];
    }
  }

  const shorelineWater = computeShorelineWater(water, land, cliff, ramp);
  const decorAllowed = computeDecorAllowed(land, cliff, ramp);
  const layers = {
    water: createLayer(config.scene, config.x, config.y, waterBrush.tilesetKey, 'waterBase', 'Full water base prevents black voids around islands.', waterBrush.tiles, 0, tileScale),
    land: createLayer(config.scene, config.x, config.y, terrainTilesetKey, 'land', 'Grass island layer.', landTiles, 4, tileScale),
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

export function reserveIslandMapArea(map: IslandMapResult, reservation: IslandMapReservation): void {
  pasteMask(map.masks.occupied, reservation.col, reservation.row, reservation.width, reservation.height, true);
  pasteMask(map.masks.decorAllowed, reservation.col, reservation.row, reservation.width, reservation.height, false);
}

export function placeIslandMapDecorations(map: IslandMapResult, options: DecorationOptions = {}): void {
  const scene = map.layers.land.scene;
  const seed = options.seed ?? 1;
  const toWorld = (cell: { col: number; row: number }) => islandCellToWorld(map, cell.col, cell.row);
  const treeFootprint: Footprint = { width: 5, height: 5, offsetX: -2, offsetY: -3 };
  const bushFootprint: Footprint = { width: 2, height: 2, offsetX: -1, offsetY: -1 };
  const rockFootprint: Footprint = { width: 2, height: 2, offsetX: -1, offsetY: -1 };

  for (const [index, cell] of pickFootprintCells(map.masks.decorAllowed, map.masks.occupied, options.trees ?? 5, seed + 10, 5, treeFootprint).entries()) {
    const { x, y } = toWorld(cell);
    const key = ['env-tree-01', 'env-tree-02', 'env-tree-03', 'env-tree-04'][index % 4];
    const tree = scene.add.sprite(x, y, key).setDepth(20);
    if (scene.anims.exists(key)) tree.play(key);
  }

  for (const [index, cell] of pickFootprintCells(map.masks.decorAllowed, map.masks.occupied, options.bushes ?? 5, seed + 20, 4, bushFootprint).entries()) {
    const { x, y } = toWorld(cell);
    const key = ['env-bush-01', 'env-bush-02', 'env-bush-03', 'env-bush-04'][index % 4];
    const bush = scene.add.sprite(x, y, key).setDepth(18);
    if (scene.anims.exists(key)) bush.play(key);
  }

  const rockFrames = [
    TinySwordsResourceFrames.Rock1,
    TinySwordsResourceFrames.Rock2,
    TinySwordsResourceFrames.Rock3,
    TinySwordsResourceFrames.Rock4,
  ];
  for (const [index, cell] of pickFootprintCells(map.masks.decorAllowed, map.masks.occupied, options.rocks ?? 5, seed + 30, 3, rockFootprint).entries()) {
    const { x, y } = toWorld(cell);
    scene.add.image(x, y, TinySwordsAtlases.Resources, rockFrames[index % rockFrames.length]).setDepth(19);
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
