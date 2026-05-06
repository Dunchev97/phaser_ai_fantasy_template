import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { ResourceCounter } from '../ui/ResourceCounter';
import { createNineSlicePanel } from '../ui/NineSlicePanel';
import { createStretchBar, type StretchBarResult } from '../ui/StretchBar';
import {
  createCliffBlock,
  createGrassPatch,
  createGrassPath,
  createWaterPatch,
  type TerrainBrush,
} from '../../content/tinySwordsTerrainBrushes';
import { createInitialPrototypeState } from '../../content/prototypeState';
import {
  TinySwordsAtlases,
  TinySwordsBuildingFrames,
  TinySwordsResourceFrames,
  TinySwordsUIFrames,
} from '../../content/tinySwordsAssetKeys';
import { TinySwordsWorldScale } from '../../content/tinySwordsScale';
import { createTileLayerFromPreset } from '../systems/TerrainBuilder';

const TILE_SCALE = TinySwordsWorldScale.Terrain;

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

    this.addBrush(createWaterPatch(14, 9, 62), 820, 338, 0);
    this.addBrush(createWaterPatch(7, 4, 88), 940, 548, 0);

    this.addBrush(createCliffBlock(28, 7, { seed: 7 }), 196, 220, 1);
    this.addBrush(createGrassPatch(29, 10, { seed: 11, decorationChance: 0.08 }), 168, 118, 2);

    this.addBrush(createCliffBlock(21, 6, { seed: 19 }), 420, 386, 1);
    this.addBrush(createGrassPatch(22, 9, { seed: 23, decorationChance: 0.1 }), 392, 302, 2);

    this.addBrush(createCliffBlock(15, 5, { seed: 31 }), 758, 446, 1);
    this.addBrush(createGrassPatch(16, 7, { seed: 37, decorationChance: 0.08 }), 730, 374, 2);

    this.addBrush(createGrassPatch(18, 7, { seed: 43, decorationChance: 0.12 }), 86, 464, 2);
    this.addBrush(createGrassPatch(11, 5, { seed: 51, decorationChance: 0.09 }), 606, 528, 2);

    this.addBrush(createGrassPath(4, 7, { seed: 100 }), 516, 236, 3);
    this.addBrush(createGrassPath(7, 3, { seed: 101 }), 548, 396, 3);
    this.addBrush(createGrassPath(4, 5, { seed: 102 }), 780, 506, 3);
    this.addBrush(createGrassPath(8, 3, { seed: 103 }), 262, 472, 3);

    this.add.image(342, 210, TinySwordsAtlases.Buildings, TinySwordsBuildingFrames.BlueHouse1)
      .setScale(TinySwordsWorldScale.SmallBuilding)
      .setDepth(14);
    this.add.image(500, 360, TinySwordsAtlases.Buildings, TinySwordsBuildingFrames.BlueTower)
      .setScale(TinySwordsWorldScale.TallBuilding)
      .setDepth(14);
    this.add.image(668, 572, TinySwordsAtlases.Resources, TinySwordsResourceFrames.Wood)
      .setScale(TinySwordsWorldScale.Resource)
      .setDepth(14);

    this.addWaterDetails();
    this.addForest();
    this.addUnits();
  }

  private addBrush(brush: TerrainBrush, x: number, y: number, depth: number): Phaser.Tilemaps.TilemapLayer {
    const layer = createTileLayerFromPreset({
      scene: this,
      x,
      y,
      tilesetKey: brush.tilesetKey,
      preset: brush,
    });
    layer.setScale(TILE_SCALE);
    layer.setDepth(depth);
    return layer;
  }

  private addForest(): void {
    const trees: Array<[number, number, string, number]> = [
      [72, 122, 'env-tree-01', TinySwordsWorldScale.TreeLarge],
      [102, 342, 'env-tree-02', TinySwordsWorldScale.TreeLarge],
      [258, 88, 'env-tree-03', TinySwordsWorldScale.TreeSmall],
      [704, 260, 'env-tree-04', TinySwordsWorldScale.TreeSmall],
      [1086, 260, 'env-tree-01', TinySwordsWorldScale.TreeLarge],
      [1160, 456, 'env-tree-02', TinySwordsWorldScale.TreeLarge],
      [906, 650, 'env-tree-03', TinySwordsWorldScale.TreeSmall],
      [132, 636, 'env-tree-04', TinySwordsWorldScale.TreeSmall],
    ];

    for (const [x, y, key, scale] of trees) {
      const tree = this.add.sprite(x, y, key).setScale(scale).setDepth(20);
      if (this.anims.exists(key)) tree.play(key);
    }

    const bushes: Array<[number, number, string, number]> = [
      [336, 142, 'env-bush-01', TinySwordsWorldScale.Bush],
      [620, 332, 'env-bush-02', TinySwordsWorldScale.Bush],
      [204, 522, 'env-bush-03', TinySwordsWorldScale.Bush],
      [724, 414, 'env-bush-04', TinySwordsWorldScale.Bush],
      [1012, 532, 'env-bush-01', TinySwordsWorldScale.Bush],
      [590, 612, 'env-bush-02', TinySwordsWorldScale.Bush],
    ];

    for (const [x, y, key, scale] of bushes) {
      const bush = this.add.sprite(x, y, key).setScale(scale).setDepth(18);
      if (this.anims.exists(key)) bush.play(key);
    }
  }

  private addWaterDetails(): void {
    this.add.sprite(996, 410, 'env-water-foam', 0).setScale(TinySwordsWorldScale.WaterFoam).setAlpha(0.7).setDepth(5);
    this.add.sprite(874, 510, 'env-water-foam', 3).setScale(TinySwordsWorldScale.WaterFoam * 0.78).setAlpha(0.55).setDepth(5);
    this.add.image(878, 386, 'env-water-rocks-02', 48).setScale(TinySwordsWorldScale.WaterRock).setDepth(6);
    this.add.image(1068, 554, 'env-water-rocks-03', 84).setScale(TinySwordsWorldScale.WaterRock).setDepth(6);
  }

  private addUnits(): void {
    const pawn = this.add.sprite(318, 284, 'unit-blue-pawn-idle');
    if (this.anims.exists('blue-pawn-idle')) pawn.play('blue-pawn-idle');
    pawn.setScale(TinySwordsWorldScale.Unit).setDepth(22);

    const lancer = this.add.sprite(616, 452, 'unit-blue-lancer-idle');
    if (this.anims.exists('blue-lancer-idle')) lancer.play('blue-lancer-idle');
    lancer.setScale(TinySwordsWorldScale.LargeUnit).setDepth(22);

    const sheep = this.add.sprite(742, 560, 'sheep-grass');
    if (this.anims.exists('sheep-grass')) sheep.play('sheep-grass');
    sheep.setScale(TinySwordsWorldScale.Animal).setDepth(22);
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

    this.add.text(70, 44, 'Layered Location Test', {
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
    });
    this.goldCounter.setDepth(41);

    this.essenceCounter = new ResourceCounter(this, {
      x: 70,
      y: 126,
      label: 'Essence',
      value: this.state.resources.essence,
      labelColor: '#4e3828',
      valueColor: '#2f2118',
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
