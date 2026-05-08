import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import {
  TinySwordsAtlases,
  TinySwordsBuildingFrames,
  TinySwordsResourceFrames,
} from '../../content/tinySwordsAssetKeys';
import { TinySwordsWorldScale } from '../../content/tinySwordsScale';
import {
  createIslandMap,
  islandCellToWorld,
  type IslandMapResult,
  placeIslandMapDecorations,
  reserveIslandMapArea,
} from '../systems/IslandMapBuilder';

type TerrainCell = {
  walkable: boolean;
  blocked: boolean;
  elevation: number;
  ramp: boolean;
};

type TerrainNavigation = {
  cells: TerrainCell[][];
  debugGraphics: Phaser.GameObjects.Graphics;
  debugVisible: boolean;
};

type CellRect = {
  col: number;
  row: number;
  width: number;
  height: number;
};

const MAP_CONFIG = {
  base: { x: 2, y: 4, width: 50, height: 24 },
  plateau: { x: 16, y: 6, width: 23, height: 8, cliffHeight: 4 },
  ramp: { x: 13, y: 10, width: 4, height: 8, direction: 'left' },
} as const;

export class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<'up' | 'left' | 'down' | 'right', Phaser.Input.Keyboard.Key>;
  private player?: Phaser.GameObjects.Sprite;
  private map?: IslandMapResult;
  private navigation?: TerrainNavigation;
  private statusText?: Phaser.GameObjects.Text;
  private readonly playerSpeed = 185;
  private readonly playerFootOffsetY = 26;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#16253a');
    this.createLocation();
    this.createHud();
    this.createInput();
  }

  update(_time: number, delta: number): void {
    this.updatePlayer(delta / 1000);
  }

  private createLocation(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x16253a)
      .setScrollFactor(0)
      .setDepth(-10);

    const map = createIslandMap({
      scene: this,
      x: 48,
      y: 48,
      width: 55,
      height: 31,
      tileScale: TinySwordsWorldScale.Terrain,
      islands: [
        { ...MAP_CONFIG.base, seed: 11, edgeMode: 'shore' },
        {
          x: MAP_CONFIG.plateau.x,
          y: MAP_CONFIG.plateau.y,
          width: MAP_CONFIG.plateau.width,
          height: MAP_CONFIG.plateau.height,
          elevation: 1,
          cliffHeight: MAP_CONFIG.plateau.cliffHeight,
          seed: 44,
          edgeMode: 'none',
        },
      ],
      ramps: [
        { x: MAP_CONFIG.ramp.x, y: MAP_CONFIG.ramp.y, direction: MAP_CONFIG.ramp.direction },
      ],
    });
    this.map = map;

    this.reserveGameplayAreas(map);
    placeIslandMapDecorations(map, {
      seed: 202,
      trees: 4,
      bushes: 8,
      rocks: 6,
      waterFoam: 0,
      waterRocks: 4,
    });

    this.addLandmarks(map);
    this.navigation = this.createTerrainNavigation(map);
    this.createPlayer(map);

    this.cameras.main.setBounds(
      map.x,
      map.y,
      map.width * map.tileSize,
      map.height * map.tileSize,
    );
  }

  private reserveGameplayAreas(map: IslandMapResult): void {
    reserveIslandMapArea(map, { col: MAP_CONFIG.ramp.x - 1, row: MAP_CONFIG.ramp.y - 1, width: MAP_CONFIG.ramp.width + 2, height: MAP_CONFIG.ramp.height + 2 }, { block: false });
    this.reserveStructureFootprint(
      map,
      { col: 28, row: 7, width: 8, height: 6 },
      { col: 29, row: 10, width: 7, height: 3 },
    );
    this.reserveStructureFootprint(
      map,
      { col: 7, row: 18, width: 6, height: 5 },
      { col: 8, row: 21, width: 4, height: 2 },
    );
    this.reserveStructureFootprint(
      map,
      { col: 41, row: 18, width: 5, height: 4 },
      { col: 42, row: 20, width: 3, height: 2 },
    );
  }

  private reserveStructureFootprint(map: IslandMapResult, visual: CellRect, blocker: CellRect): void {
    reserveIslandMapArea(map, visual, { block: false });
    reserveIslandMapArea(map, blocker);
  }

  private addLandmarks(map: IslandMapResult): void {
    const castlePos = islandCellToWorld(map, 32, 10);
    this.add.image(castlePos.x, castlePos.y, TinySwordsAtlases.Buildings, TinySwordsBuildingFrames.BlueCastle)
      .setScale(TinySwordsWorldScale.LargeBuilding)
      .setDepth(castlePos.y);

    const housePos = islandCellToWorld(map, 9, 20);
    this.add.image(housePos.x, housePos.y, TinySwordsAtlases.Buildings, TinySwordsBuildingFrames.YellowHouse1)
      .setScale(TinySwordsWorldScale.SmallBuilding)
      .setDepth(housePos.y);

    const towerPos = islandCellToWorld(map, 44, 20);
    this.add.image(towerPos.x, towerPos.y, TinySwordsAtlases.Buildings, TinySwordsBuildingFrames.BlueTower)
      .setScale(TinySwordsWorldScale.TallBuilding)
      .setDepth(towerPos.y);

    const goldPos = islandCellToWorld(map, 24, 9);
    this.add.image(goldPos.x, goldPos.y, TinySwordsAtlases.Resources, TinySwordsResourceFrames.GoldStone3)
      .setScale(TinySwordsWorldScale.Resource)
      .setDepth(8);

    const guardPos = islandCellToWorld(map, 36, 11);
    const guard = this.add.sprite(guardPos.x, guardPos.y, 'unit-blue-lancer-idle');
    if (this.anims.exists('blue-lancer-idle')) guard.play('blue-lancer-idle');
    guard.setScale(TinySwordsWorldScale.LargeUnit).setDepth(guardPos.y);
  }

  private createTerrainNavigation(map: IslandMapResult): TerrainNavigation {
    const cells = Array.from({ length: map.height }, () =>
      Array.from({ length: map.width }, (): TerrainCell => ({
        walkable: false,
        blocked: true,
        elevation: -1,
        ramp: false,
      })),
    );

    this.markRect(cells, MAP_CONFIG.base.x, MAP_CONFIG.base.y, MAP_CONFIG.base.width, MAP_CONFIG.base.height, 0);
    this.markRect(cells, MAP_CONFIG.plateau.x, MAP_CONFIG.plateau.y, MAP_CONFIG.plateau.width, MAP_CONFIG.plateau.height, 1);
    this.blockRect(
      cells,
      MAP_CONFIG.plateau.x,
      MAP_CONFIG.plateau.y + MAP_CONFIG.plateau.height,
      MAP_CONFIG.plateau.width,
      MAP_CONFIG.plateau.cliffHeight,
    );
    this.markRampFromMap(cells, map);

    for (let row = 0; row < map.height; row += 1) {
      for (let col = 0; col < map.width; col += 1) {
        if (map.masks.water[row][col]) this.blockCell(cells[row][col]);
        if (map.masks.cliff[row][col] && !map.masks.ramp[row][col]) this.blockCell(cells[row][col]);
        if (map.masks.occupied[row][col] && !map.masks.ramp[row][col]) this.blockCell(cells[row][col]);
      }
    }

    const debugGraphics = this.add.graphics().setDepth(200);
    const navigation = { cells, debugGraphics, debugVisible: false };
    this.drawNavigationDebug(navigation);
    debugGraphics.setVisible(false);
    return navigation;
  }

  private markRect(cells: TerrainCell[][], x: number, y: number, width: number, height: number, elevation: number): void {
    for (let row = y; row < y + height; row += 1) {
      for (let col = x; col < x + width; col += 1) {
        const cell = cells[row]?.[col];
        if (!cell) continue;
        cell.walkable = true;
        cell.blocked = false;
        cell.elevation = elevation;
      }
    }
  }

  private blockRect(cells: TerrainCell[][], x: number, y: number, width: number, height: number): void {
    for (let row = y; row < y + height; row += 1) {
      for (let col = x; col < x + width; col += 1) {
        const cell = cells[row]?.[col];
        if (cell) this.blockCell(cell);
      }
    }
  }

  private markRampFromMap(cells: TerrainCell[][], map: IslandMapResult): void {
    for (let row = 0; row < map.height; row += 1) {
      for (let col = 0; col < map.width; col += 1) {
        if (!map.masks.ramp[row][col]) continue;
        const cell = cells[row]?.[col];
        if (!cell) continue;
        cell.walkable = true;
        cell.blocked = false;
        cell.ramp = true;
        cell.elevation = row < MAP_CONFIG.plateau.y + MAP_CONFIG.plateau.height ? 1 : 0;
      }
    }
  }

  private blockCell(cell: TerrainCell): void {
    cell.walkable = false;
    cell.blocked = true;
    cell.ramp = false;
    cell.elevation = -1;
  }

  private createPlayer(map: IslandMapResult): void {
    const startCell = this.findNearestWalkableCell(8, 17);
    const start = this.actorPositionForFootCell(map, startCell.col, startCell.row);
    const player = this.add.sprite(start.x, start.y, 'unit-blue-warrior-idle');
    if (this.anims.exists('blue-warrior-idle')) player.play('blue-warrior-idle');
    player.setScale(TinySwordsWorldScale.Unit).setDepth(start.y);
    this.player = player;

    this.cameras.main.startFollow(player, true, 0.12, 0.12);
    this.cameras.main.centerOn(player.x, player.y);
  }

  private createHud(): void {
    this.add.rectangle(14, 14, 464, 112, 0x101827, 0.82)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(500);

    this.add.text(30, 26, 'Terrain Lab: cliffs block movement, ramp changes elevation', {
      fontSize: '18px',
      color: '#f5e8c8',
      fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(501);

    this.add.text(30, 58, 'Move: WASD / arrows   Toggle masks: H   Goal: reach the castle only through the ramp', {
      fontSize: '14px',
      color: '#d8c7a1',
    }).setScrollFactor(0).setDepth(501);

    this.statusText = this.add.text(30, 86, '', {
      fontSize: '14px',
      color: '#9ee6a7',
    }).setScrollFactor(0).setDepth(501);
  }

  private createInput(): void {
    if (!this.input.keyboard) return;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<'up' | 'left' | 'down' | 'right', Phaser.Input.Keyboard.Key>;

    this.input.keyboard.on('keydown-H', () => {
      if (!this.navigation) return;
      this.navigation.debugVisible = !this.navigation.debugVisible;
      this.navigation.debugGraphics.setVisible(this.navigation.debugVisible);
    });
  }

  private updatePlayer(deltaSeconds: number): void {
    if (!this.player || !this.map || !this.navigation) return;

    const input = this.readMovementInput();
    const moving = input.lengthSq() > 0;
    if (moving) input.normalize();

    const distance = this.playerSpeed * deltaSeconds;
    const nextX = this.player.x + input.x * distance;
    const nextY = this.player.y + input.y * distance;

    if (this.canStandAt(nextX, this.player.y)) this.player.x = nextX;
    if (this.canStandAt(this.player.x, nextY)) this.player.y = nextY;

    if (moving) {
      if (this.anims.exists('blue-warrior-run') && this.player.anims.currentAnim?.key !== 'blue-warrior-run') {
        this.player.play('blue-warrior-run');
      }
      if (Math.abs(input.x) > 0.05) this.player.setFlipX(input.x < 0);
    } else if (this.anims.exists('blue-warrior-idle') && this.player.anims.currentAnim?.key !== 'blue-warrior-idle') {
      this.player.play('blue-warrior-idle');
    }

    this.player.setDepth(this.player.y);
    this.updateStatus();
  }

  private readMovementInput(): Phaser.Math.Vector2 {
    const x =
      (this.cursors?.left.isDown || this.wasd?.left.isDown ? -1 : 0) +
      (this.cursors?.right.isDown || this.wasd?.right.isDown ? 1 : 0);
    const y =
      (this.cursors?.up.isDown || this.wasd?.up.isDown ? -1 : 0) +
      (this.cursors?.down.isDown || this.wasd?.down.isDown ? 1 : 0);
    return new Phaser.Math.Vector2(x, y);
  }

  private canStandAt(worldX: number, worldY: number): boolean {
    if (!this.player || !this.map || !this.navigation) return false;

    const current = this.worldToCell(this.player.x, this.player.y + this.playerFootOffsetY);
    const target = this.worldToCell(worldX, worldY + this.playerFootOffsetY);
    const currentCell = this.cellAt(current.col, current.row);
    const targetCell = this.cellAt(target.col, target.row);
    if (!targetCell?.walkable || targetCell.blocked) return false;
    if (!currentCell) return true;
    if (currentCell.elevation === targetCell.elevation) return true;
    return currentCell.ramp || targetCell.ramp;
  }

  private worldToCell(worldX: number, worldY: number): { col: number; row: number } {
    const map = this.map;
    if (!map) return { col: -1, row: -1 };
    return {
      col: Math.floor((worldX - map.x) / map.tileSize),
      row: Math.floor((worldY - map.y) / map.tileSize),
    };
  }

  private cellAt(col: number, row: number): TerrainCell | undefined {
    return this.navigation?.cells[row]?.[col];
  }

  private updateStatus(): void {
    if (!this.player || !this.statusText) return;
    const cellPos = this.worldToCell(this.player.x, this.player.y + this.playerFootOffsetY);
    const cell = this.cellAt(cellPos.col, cellPos.row);
    const level = cell?.ramp ? 'ramp' : `level ${cell?.elevation ?? '?'}`;
    this.statusText.setText(`Cell ${cellPos.col},${cellPos.row} | ${level}`);
  }

  private actorPositionForFootCell(map: IslandMapResult, col: number, row: number): { x: number; y: number } {
    const foot = islandCellToWorld(map, col, row);
    return { x: foot.x, y: foot.y - this.playerFootOffsetY };
  }

  private findNearestWalkableCell(preferredCol: number, preferredRow: number): { col: number; row: number } {
    if (!this.navigation) return { col: preferredCol, row: preferredRow };
    const candidates: Array<{ col: number; row: number; distance: number }> = [];
    for (let row = 0; row < this.navigation.cells.length; row += 1) {
      for (let col = 0; col < (this.navigation.cells[row]?.length ?? 0); col += 1) {
        const cell = this.navigation.cells[row][col];
        if (!cell.walkable || cell.blocked || cell.ramp) continue;
        candidates.push({
          col,
          row,
          distance: Math.abs(col - preferredCol) + Math.abs(row - preferredRow),
        });
      }
    }
    candidates.sort((a, b) => a.distance - b.distance);
    return candidates[0] ?? { col: preferredCol, row: preferredRow };
  }

  private drawNavigationDebug(navigation: TerrainNavigation): void {
    if (!this.map) return;
    const graphics = navigation.debugGraphics;
    graphics.clear();

    for (let row = 0; row < navigation.cells.length; row += 1) {
      for (let col = 0; col < (navigation.cells[row]?.length ?? 0); col += 1) {
        const cell = navigation.cells[row][col];
        const x = this.map.x + col * this.map.tileSize;
        const y = this.map.y + row * this.map.tileSize;

        if (cell.blocked) {
          graphics.fillStyle(0xff3654, 0.38);
          graphics.fillRect(x, y, this.map.tileSize, this.map.tileSize);
        } else if (cell.ramp) {
          graphics.fillStyle(0x45e0ff, 0.42);
          graphics.fillRect(x, y, this.map.tileSize, this.map.tileSize);
        } else if (cell.elevation > 0) {
          graphics.fillStyle(0xa855f7, 0.38);
          graphics.fillRect(x, y, this.map.tileSize, this.map.tileSize);
        }
      }
    }
  }
}
