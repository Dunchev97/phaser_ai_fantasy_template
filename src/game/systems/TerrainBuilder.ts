import Phaser from 'phaser';
import {
  createCliffBlock,
  createGrassPatch,
  createWaterPatch,
  type TerrainBrush,
} from '../../content/tinySwordsTerrainBrushes';

export interface TileLayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  tilesetKey: string;
  preset: TerrainBrush;
  tileWidth?: number;
  tileHeight?: number;
}

export interface AutoPatchLayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  tilesetKey?: string;
  seed?: number;
  tileWidth?: number;
  tileHeight?: number;
}

/**
 * Create a Phaser Tilemap layer from a 2D tile-index preset.
 *
 * Example:
 *   createTileLayerFromPreset(scene, {
 *     x: 0, y: 0,
 *     tilesetKey: 'terrain-tilemap-color1',
 *     preset: simpleGrassRect,
 *   })
 */
export function createTileLayerFromPreset(config: TileLayerConfig): Phaser.Tilemaps.TilemapLayer {
  const {
    scene,
    x,
    y,
    tilesetKey,
    preset,
    tileWidth = 16,
    tileHeight = 16,
  } = config;

  const map = scene.make.tilemap({
    tileWidth,
    tileHeight,
    width: preset.width,
    height: preset.height,
  });

  const ts = map.addTilesetImage(tilesetKey, tilesetKey, tileWidth, tileHeight);
  if (!ts) {
    throw new Error(`TerrainBuilder: could not add tileset image ${tilesetKey}`);
  }

  const layer = map.createBlankLayer('layer', ts, x, y);
  if (!layer) {
    throw new Error('TerrainBuilder: could not create blank layer');
  }

  for (let row = 0; row < preset.height; row++) {
    for (let col = 0; col < preset.width; col++) {
      const index = preset.tiles[row]?.[col];
      if (index != null) {
        layer.putTileAt(index, col, row);
      }
    }
  }

  return layer;
}

export function createGrassPatchLayer(config: AutoPatchLayerConfig): Phaser.Tilemaps.TilemapLayer {
  const brush = createGrassPatch(config.width, config.height, {
    tilesetKey: config.tilesetKey,
    seed: config.seed,
    bordered: true,
  });

  return createTileLayerFromPreset({
    scene: config.scene,
    x: config.x,
    y: config.y,
    tilesetKey: brush.tilesetKey,
    preset: brush,
    tileWidth: config.tileWidth,
    tileHeight: config.tileHeight,
  });
}

export function createWaterPatchLayer(config: AutoPatchLayerConfig): Phaser.Tilemaps.TilemapLayer {
  const brush = createWaterPatch(config.width, config.height, config.seed);

  return createTileLayerFromPreset({
    scene: config.scene,
    x: config.x,
    y: config.y,
    tilesetKey: brush.tilesetKey,
    preset: brush,
    tileWidth: config.tileWidth,
    tileHeight: config.tileHeight,
  });
}

export function createCliffBlockLayer(config: AutoPatchLayerConfig): Phaser.Tilemaps.TilemapLayer {
  const brush = createCliffBlock(config.width, config.height, {
    tilesetKey: config.tilesetKey,
    seed: config.seed,
  });

  return createTileLayerFromPreset({
    scene: config.scene,
    x: config.x,
    y: config.y,
    tilesetKey: brush.tilesetKey,
    preset: brush,
    tileWidth: config.tileWidth,
    tileHeight: config.tileHeight,
  });
}

/**
 * Create a tile layer from a raw 2D array of tile indexes.
 */
export function createTileLayerFromArray(
  scene: Phaser.Scene,
  tilesetKey: string,
  tiles: number[][],
  x = 0,
  y = 0,
  tileWidth = 16,
  tileHeight = 16
): Phaser.Tilemaps.TilemapLayer {
  const height = tiles.length;
  const width = height > 0 ? tiles[0].length : 0;

  const map = scene.make.tilemap({
    tileWidth,
    tileHeight,
    width,
    height,
  });

  const ts = map.addTilesetImage(tilesetKey, tilesetKey, tileWidth, tileHeight);
  if (!ts) {
    throw new Error(`TerrainBuilder: could not add tileset image ${tilesetKey}`);
  }

  const layer = map.createBlankLayer('layer', ts, x, y);
  if (!layer) {
    throw new Error('TerrainBuilder: could not create blank layer');
  }

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const index = tiles[row]?.[col];
      if (index != null) {
        layer.putTileAt(index, col, row);
      }
    }
  }

  return layer;
}
