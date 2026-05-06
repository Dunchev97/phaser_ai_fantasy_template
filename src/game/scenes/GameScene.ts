import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { ResourceCounter } from '../ui/ResourceCounter';
import { createNineSlicePanel } from '../ui/NineSlicePanel';
import { createStretchBar, type StretchBarResult } from '../ui/StretchBar';
import { createInitialPrototypeState } from '../../content/prototypeState';
import {
  TinySwordsAtlases,
  TinySwordsBuildingFrames,
  TinySwordsResourceFrames,
  TinySwordsUIFrames,
} from '../../content/tinySwordsAssetKeys';
import {
  SodaIconAtlases,
  SodaIconFrames,
} from '../../content/sodaIconAssetKeys';
import { TinySwordsWorldScale } from '../../content/tinySwordsScale';
import {
  createIslandMap,
  islandCellToWorld,
  type IslandMapResult,
  placeIslandMapDecorations,
  reserveIslandMapArea,
} from '../systems/IslandMapBuilder';

export class GameScene extends Phaser.Scene {
  private state = createInitialPrototypeState();
  private goldCounter?: ResourceCounter;
  private essenceCounter?: ResourceCounter;
  private progressBar?: StretchBarResult;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#16253a');
    this.createLocation();
    this.createHud();
  }

  private createLocation(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x16253a);

    const map = createIslandMap({
      scene: this,
      x: 44,
      y: 44,
      width: 37,
      height: 20,
      tileScale: TinySwordsWorldScale.Terrain,
      islands: [
        { x: 1, y: 3, width: 35, height: 16, seed: 11, edgeMode: 'shore' },
      ],
    });

    reserveIslandMapArea(map, { col: 6, row: 4, width: 6, height: 6 });
    reserveIslandMapArea(map, { col: 18, row: 5, width: 7, height: 6 });
    reserveIslandMapArea(map, { col: 27, row: 6, width: 5, height: 5 });
    reserveIslandMapArea(map, { col: 8, row: 10, width: 3, height: 3 });
    reserveIslandMapArea(map, { col: 17, row: 13, width: 3, height: 3 });
    reserveIslandMapArea(map, { col: 26, row: 14, width: 4, height: 3 });

    const treePlacements = [
      { col: 4, row: 5, key: 'env-tree-01' },
      { col: 13, row: 5, key: 'env-tree-03' },
      { col: 33, row: 6, key: 'env-tree-02' },
      { col: 5, row: 15, key: 'env-tree-04' },
      { col: 14, row: 16, key: 'env-tree-01' },
      { col: 34, row: 15, key: 'env-tree-03' },
    ] as const;

    for (const tree of treePlacements) {
      reserveIslandMapArea(map, { col: tree.col - 2, row: tree.row - 2, width: 5, height: 5 });
    }

    placeIslandMapDecorations(map, {
      seed: 77,
      trees: 0,
      bushes: 8,
      rocks: 7,
      waterFoam: 0,
      waterRocks: 2,
    });

    this.addScenicTrees(map, treePlacements);

    const housePos = islandCellToWorld(map, 8, 6);
    this.add.image(housePos.x, housePos.y, TinySwordsAtlases.Buildings, TinySwordsBuildingFrames.BlueHouse1)
      .setScale(TinySwordsWorldScale.SmallBuilding)
      .setDepth(14);
    const towerPos = islandCellToWorld(map, 21, 7);
    this.add.image(towerPos.x, towerPos.y, TinySwordsAtlases.Buildings, TinySwordsBuildingFrames.BlueTower)
      .setScale(TinySwordsWorldScale.TallBuilding)
      .setDepth(14);
    const barracksPos = islandCellToWorld(map, 29, 8);
    this.add.image(barracksPos.x, barracksPos.y, TinySwordsAtlases.Buildings, TinySwordsBuildingFrames.BlueBarracks)
      .setScale(TinySwordsWorldScale.LargeBuilding)
      .setDepth(14);
    const woodPos = islandCellToWorld(map, 28, 15);
    this.add.image(woodPos.x, woodPos.y, TinySwordsAtlases.Resources, TinySwordsResourceFrames.Wood)
      .setScale(TinySwordsWorldScale.Resource)
      .setDepth(14);

    this.addUnits(map);
  }

  private addUnits(map: IslandMapResult): void {
    const units = [
      { col: 9, row: 11, sheet: 'unit-blue-pawn-idle', anim: 'blue-pawn-idle', scale: TinySwordsWorldScale.Unit },
      { col: 14, row: 11, sheet: 'unit-blue-warrior-idle', anim: 'blue-warrior-idle', scale: TinySwordsWorldScale.Unit },
      { col: 18, row: 14, sheet: 'unit-blue-lancer-idle', anim: 'blue-lancer-idle', scale: TinySwordsWorldScale.LargeUnit },
      { col: 22, row: 12, sheet: 'unit-blue-archer-idle', anim: 'blue-archer-idle', scale: TinySwordsWorldScale.Unit },
      { col: 25, row: 14, sheet: 'unit-blue-monk-idle', anim: 'blue-monk-idle', scale: TinySwordsWorldScale.Unit },
    ];

    for (const unit of units) {
      const pos = islandCellToWorld(map, unit.col, unit.row);
      const sprite = this.add.sprite(pos.x, pos.y, unit.sheet);
      if (this.anims.exists(unit.anim)) sprite.play(unit.anim);
      sprite.setScale(unit.scale).setDepth(22);
    }

    const sheepPos = islandCellToWorld(map, 27, 16);
    const sheep = this.add.sprite(sheepPos.x, sheepPos.y, 'sheep-grass');
    if (this.anims.exists('sheep-grass')) sheep.play('sheep-grass');
    sheep.setScale(TinySwordsWorldScale.Animal).setDepth(22);
  }

  private addScenicTrees(
    map: IslandMapResult,
    placements: readonly { col: number; row: number; key: string }[],
  ): void {
    for (const tree of placements) {
      const pos = islandCellToWorld(map, tree.col, tree.row);
      const sprite = this.add.sprite(pos.x, pos.y, tree.key);
      if (this.anims.exists(tree.key)) sprite.play(tree.key);
      sprite.setScale(TinySwordsWorldScale.TreeLarge).setDepth(18);
    }
  }

  private createHud(): void {
    createNineSlicePanel(this, {
      x: 214,
      y: 104,
      width: 340,
      height: 136,
      atlasKey: TinySwordsAtlases.UICore,
      frame: TinySwordsUIFrames.PaperRegular,
      left: 52,
      right: 52,
      top: 44,
      bottom: 45,
    }).container.setDepth(40);

    this.add.text(70, 44, 'Island Location Test', {
      fontSize: '20px',
      color: '#3d2b1f',
      fontStyle: 'bold',
    }).setDepth(41);

    this.goldCounter = new ResourceCounter(this, {
      x: 70,
      y: 84,
      label: 'Gold',
      value: this.state.resources.gold,
      labelColor: '#4e3828',
      valueColor: '#2f2118',
      atlas: SodaIconAtlases.SodaIcons,
      frame: SodaIconFrames.MaterialsCoins,
    });
    this.goldCounter.setDepth(41);

    this.essenceCounter = new ResourceCounter(this, {
      x: 70,
      y: 126,
      label: 'Essence',
      value: this.state.resources.essence,
      labelColor: '#4e3828',
      valueColor: '#2f2118',
      atlas: SodaIconAtlases.SodaIcons,
      frame: SodaIconFrames.MaterialsGem3,
    });
    this.essenceCounter.setDepth(41);

    this.progressBar = createStretchBar(this, {
      x: 214,
      y: 166,
      width: 250,
      atlasKey: TinySwordsAtlases.UICore,
      baseFrame: TinySwordsUIFrames.BigBarBase,
      fillFrame: TinySwordsUIFrames.BigBarFill,
      value: this.state.resources.gold,
      maxValue: 20,
      leftWidth: 24,
      rightWidth: 24,
      height: 64,
    });
    this.progressBar.container.setDepth(41);
  }

  private gainStarterResources(): void {
    this.state.resources.gold += 1;
    this.state.resources.essence += 1;
    this.goldCounter?.setValue(this.state.resources.gold);
    this.essenceCounter?.setValue(this.state.resources.essence);
    this.progressBar?.setFillRatio(Math.min(1, this.state.resources.gold / 20));
  }
}
