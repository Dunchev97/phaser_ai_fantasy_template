import Phaser from 'phaser';
import {
  createStretchBar,
} from '../ui/StretchBar';
import {
  createNineSlicePanel,
} from '../ui/NineSlicePanel';
import {
  TinySwordsAtlases,
  TinySwordsBuildingFrames,
  TinySwordsUIFrames,
  TinySwordsResourceFrames,
  TinySwordsPortraitFrames,
  TinySwordsUIPanelFrames,
  TinySwordsFactionPortraits,
} from '../../content/tinySwordsAssetKeys';
import { TinySwordsPawnToolAnimations } from '../../content/tinySwordsAnimations';
import {
  type TerrainBrush,
  simpleGrassRect,
  simpleCliffBlock,
  simpleWaterPatch,
  simplePathPatch,
} from '../../content/tinySwordsTerrainBrushes';
import { createTileLayerFromPreset } from '../../game/systems/TerrainBuilder';

interface GalleryItem {
  type: 'image' | 'sprite';
  key: string;
  frame?: string | number;
  anim?: string;
  label: string;
  scale: number;
}

interface PresetDef {
  brush: TerrainBrush;
  label: string;
  x: number;
  y: number;
}

interface PageConfig {
  title: string;
  mode: 'grid' | 'table' | 'preset' | 'terrain' | 'debug';
  cols?: number;
  cellW?: number;
  cellH?: number;
  items?: GalleryItem[];
  factionColors?: string[];
  unitTypes?: { key: string; label: string; scale: number }[];
  factionAnims?: Record<string, Record<string, string>>;
  factionSheets?: Record<string, Record<string, string>>;
  presets?: PresetDef[];
}

export class AssetGalleryScene extends Phaser.Scene {
  private currentPage = 0;
  private pages: PageConfig[] = [];
  private pageObjects: Phaser.GameObjects.GameObject[] = [];
  private titleText!: Phaser.GameObjects.Text;
  private pageCounter!: Phaser.GameObjects.Text;
  private prevBtn!: Phaser.GameObjects.Text;
  private nextBtn!: Phaser.GameObjects.Text;
  private backBtn!: Phaser.GameObjects.Text;

  constructor() {
    super('AssetGalleryScene');
  }

  create(): void {
    this.pages = this.buildPages();

    this.titleText = this.add.text(this.scale.width / 2, 24, '', {
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.pageCounter = this.add.text(this.scale.width - 24, 24, '', {
      fontSize: '14px',
      color: '#aaaaaa',
    }).setOrigin(1, 0.5);

    this.prevBtn = this.add.text(60, this.scale.height - 40, '◀ Prev', {
      fontSize: '18px',
      color: '#ffddaa',
      backgroundColor: '#332211',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.nextBtn = this.add.text(this.scale.width - 60, this.scale.height - 40, 'Next ▶', {
      fontSize: '18px',
      color: '#ffddaa',
      backgroundColor: '#332211',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.backBtn = this.add.text(this.scale.width / 2, this.scale.height - 20, 'Back to Menu', {
      fontSize: '16px',
      color: '#cccccc',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.prevBtn.on('pointerdown', () => this.changePage(-1));
    this.nextBtn.on('pointerdown', () => this.changePage(1));
    this.backBtn.on('pointerdown', () => this.scene.start('MainMenuScene'));

    this.renderPage(0);
  }

  private changePage(dir: number): void {
    const next = this.currentPage + dir;
    if (next < 0 || next >= this.pages.length) return;
    this.renderPage(next);
  }

  private renderPage(index: number): void {
    this.currentPage = index;
    this.pageObjects.forEach((o) => o.destroy());
    this.pageObjects = [];

    const page = this.pages[index];
    this.titleText.setText(page.title);
    this.pageCounter.setText(`${index + 1} / ${this.pages.length}`);

    if (page.mode === 'table' && page.unitTypes && page.factionColors) {
      this.renderTablePage(page);
    } else if (page.mode === 'terrain' && page.presets) {
      this.renderPresetPage(page);
    } else if (page.mode === 'debug') {
      this.renderDebugPage(page);
    } else {
      this.renderGridPage(page);
    }

    this.prevBtn.setAlpha(this.currentPage === 0 ? 0.4 : 1);
    this.nextBtn.setAlpha(this.currentPage === this.pages.length - 1 ? 0.4 : 1);
  }

  private renderTablePage(page: PageConfig): void {
    const factions = page.factionColors!;
    const unitTypes = page.unitTypes!;
    const anims = page.factionAnims!;
    const sheets = page.factionSheets!;

    const labelW = 70;
    const startX = 80;
    const colW = (this.scale.width - startX - 40) / factions.length;
    const startY = 65;
    const rowH = 115;

    // Faction column headers
    factions.forEach((f, i) => {
      const t = this.add.text(startX + i * colW + colW / 2, startY - 16, f, {
        fontSize: '13px', color: '#aaccff'
      }).setOrigin(0.5, 0);
      this.pageObjects.push(t);
    });

    // Rows
    unitTypes.forEach((ut, r) => {
      const rowLabel = this.add.text(startX - 40, startY + r * rowH + rowH / 2, ut.label, {
        fontSize: '11px', color: '#cccccc'
      }).setOrigin(1, 0.5);
      this.pageObjects.push(rowLabel);

      factions.forEach((f, c) => {
        const animKey = anims[f]?.[ut.key];
        const sheetKey = sheets[f]?.[ut.key];
        if (!animKey || !sheetKey) return;
        const x = startX + c * colW + colW / 2;
        const y = startY + r * rowH + rowH / 2 - 10;
        const sp = this.add.sprite(x, y, sheetKey);
        if (this.anims.exists(animKey)) sp.play(animKey);
        sp.setScale(ut.scale);
        this.pageObjects.push(sp);
      });
    });
  }

  private renderPresetPage(page: PageConfig): void {
    if (!page.presets) return;
    const startX = 80;
    let x = startX;
    let y = 80;

    for (let i = 0; i < page.presets.length; i++) {
      const p = page.presets[i];
      try {
        const layer = createTileLayerFromPreset({
          scene: this,
          x: p.x,
          y: p.y,
          tilesetKey: p.brush.tilesetKey,
          preset: p.brush,
          tileWidth: 16,
          tileHeight: 16,
        });
        this.pageObjects.push(layer);
        const textX = p.x + (p.brush.width * 16) / 2;
        const textY = p.y + p.brush.height * 16 + 8;
        const lbl = this.add.text(textX, textY, p.label, {
          fontSize: '12px', color: '#cccccc',
        }).setOrigin(0.5, 0);
        this.pageObjects.push(lbl);
      } catch {
        const err = this.add.text(p.x + 20, p.y + 20, 'ERROR', {
          fontSize: '12px', color: '#ff4444',
        });
        this.pageObjects.push(err);
      }
    }
  }

  private renderDebugPage(_page: PageConfig): void {
    // Debug page: UI helper demos
    const startY = 80;
    const gap = 50;

    // 1. StretchBar demo — bigbar
    const bar1 = createStretchBar(this, {
      x: this.scale.width / 2,
      y: startY,
      width: 400,
      atlasKey: TinySwordsAtlases.UICore,
      baseFrame: TinySwordsUIFrames.BigBarBase,
      fillFrame: TinySwordsUIFrames.BigBarFill,
      value: 60,
      maxValue: 100,
      leftWidth: 24,
      rightWidth: 24,
      height: 64,
    });
    this.pageObjects.push(bar1.container);
    const lbl1 = this.add.text(this.scale.width / 2, startY - 20, 'StretchBar (bigbar 60/100)', {
      fontSize: '14px', color: '#ffddaa',
    }).setOrigin(0.5, 1);
    this.pageObjects.push(lbl1);

    // 2. StretchBar demo — smallbar at different widths
    const bar2 = createStretchBar(this, {
      x: this.scale.width / 2,
      y: startY + gap,
      width: 200,
      atlasKey: TinySwordsAtlases.UICore,
      baseFrame: TinySwordsUIFrames.SmallBarBase,
      fillFrame: TinySwordsUIFrames.SmallBarFill,
      value: 30,
      maxValue: 100,
      leftWidth: 15,
      rightWidth: 15,
      height: 64,
    });
    this.pageObjects.push(bar2.container);
    const lbl2 = this.add.text(this.scale.width / 2, startY + gap - 20, 'StretchBar (smallbar 30/100)', {
      fontSize: '14px', color: '#ffddaa',
    }).setOrigin(0.5, 1);
    this.pageObjects.push(lbl2);

    // 3. NineSlicePanel demo
    const panel1 = createNineSlicePanel(this, {
      x: this.scale.width / 2,
      y: startY + gap * 2.5,
      width: 360,
      height: 120,
      atlasKey: TinySwordsAtlases.UICore,
      frame: TinySwordsUIFrames.PaperRegular,
      left: 52,
      right: 52,
      top: 44,
      bottom: 45,
    });
    this.pageObjects.push(panel1.container);
    const lbl3 = this.add.text(this.scale.width / 2, startY + gap * 2.5 - 70, 'NineSlicePanel (paper 360x120)', {
      fontSize: '14px', color: '#ffddaa',
    }).setOrigin(0.5, 1);
    this.pageObjects.push(lbl3);

    // Add a text inside the panel to show it works
    const innerText = this.add.text(this.scale.width / 2, startY + gap * 2.5, 'Do not use setScale on decorative UI frames', {
      fontSize: '13px', color: '#3d2b1f',
    }).setOrigin(0.5, 0.5);
    this.pageObjects.push(innerText);
  }

  private renderGridPage(page: PageConfig): void {
    const cols = page.cols || 5;
    const cellW = page.cellW || 120;
    const cellH = page.cellH || 110;
    const items = page.items || [];
    const startX = (this.scale.width - (cols - 1) * cellW) / 2;
    const startY = 65;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * cellW;
      const y = startY + row * cellH;

      let obj: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

      if (item.type === 'image') {
        if (item.frame !== undefined) {
          obj = this.add.image(x, y, item.key, item.frame);
        } else {
          obj = this.add.image(x, y, item.key);
        }
      } else {
        obj = this.add.sprite(x, y, item.key);
        if (item.anim && this.anims.exists(item.anim)) {
          (obj as Phaser.GameObjects.Sprite).play(item.anim);
        }
      }

      obj.setScale(item.scale);
      obj.setOrigin(0.5);
      this.pageObjects.push(obj);

      const texture = this.textures.get(item.key);
      let fr = item.frame !== undefined ? texture.get(item.frame) : (texture.get(0) || texture.get());
      if (!fr) fr = texture.get();
      const displayH = (fr ? fr.height : 64) * item.scale;

      const label = this.add.text(x, y + displayH / 2 + 8, item.label, {
        fontSize: '10px', color: '#cccccc',
      }).setOrigin(0.5, 0);
      this.pageObjects.push(label);
    }
  }

  private buildPages(): PageConfig[] {
    const factions = ['Blue', 'Red', 'Black', 'Purple', 'Yellow'];
    const unitTypes = [
      { key: 'warrior', label: 'Warrior', scale: 0.45 },
      { key: 'archer', label: 'Archer', scale: 0.45 },
      { key: 'lancer', label: 'Lancer', scale: 0.28 },
      { key: 'monk', label: 'Monk', scale: 0.45 },
      { key: 'pawn', label: 'Pawn', scale: 0.45 },
    ];

    const factionAnims: Record<string, Record<string, string>> = {};
    const factionSheets: Record<string, Record<string, string>> = {};
    for (const fc of factions) {
      const lc = fc.toLowerCase();
      factionAnims[fc] = {
        warrior: `${lc}-warrior-idle`,
        archer: `${lc}-archer-idle`,
        lancer: `${lc}-lancer-idle`,
        monk: `${lc}-monk-idle`,
        pawn: `${lc}-pawn-idle`,
      };
      factionSheets[fc] = {
        warrior: `unit-${lc}-warrior-idle`,
        archer: `unit-${lc}-archer-idle`,
        lancer: `unit-${lc}-lancer-idle`,
        monk: `unit-${lc}-monk-idle`,
        pawn: `unit-${lc}-pawn-idle`,
      };
    }

    const allAnimations = [...TinySwordsPawnToolAnimations];

    const workerIdleItems: GalleryItem[] = allAnimations
      .filter((a) => a.key.includes('-idle-'))
      .map((a) => ({
        type: 'sprite',
        key: a.sheetKey,
        anim: a.key,
        label: 'idle',
        scale: 0.4,
      }));

    const workerRunItems: GalleryItem[] = allAnimations
      .filter((a) => a.key.includes('-run-'))
      .map((a) => ({
        type: 'sprite',
        key: a.sheetKey,
        anim: a.key,
        label: 'run',
        scale: 0.4,
      }));

    const workerInteractItems: GalleryItem[] = allAnimations
      .filter((a) => a.key.includes('-interact-'))
      .map((a) => ({
        type: 'sprite',
        key: a.sheetKey,
        anim: a.key,
        label: 'interact',
        scale: 0.4,
      }));

    // Build grouped workers page by tool
    const tools = ['axe', 'hammer', 'pickaxe', 'gold', 'wood', 'meat', 'knife'];
    const workerGroups: GalleryItem[] = [];
    for (const tool of tools) {
      // idle
      const idleAnim = allAnimations.find((a) => a.key === `blue-pawn-idle-${tool}`);
      if (idleAnim) {
        workerGroups.push({ type: 'sprite', key: idleAnim.sheetKey, anim: idleAnim.key, label: `${tool} idle`, scale: 0.4 });
      }
      // run
      const runAnim = allAnimations.find((a) => a.key === `blue-pawn-run-${tool}`);
      if (runAnim) {
        workerGroups.push({ type: 'sprite', key: runAnim.sheetKey, anim: runAnim.key, label: `${tool} run`, scale: 0.4 });
      }
      // interact
      const interactAnim = allAnimations.find((a) => a.key === `blue-pawn-interact-${tool}`);
      if (interactAnim) {
        workerGroups.push({ type: 'sprite', key: interactAnim.sheetKey, anim: interactAnim.key, label: `${tool} work`, scale: 0.4 });
      }
    }

    return [
      {
        title: 'Buildings',
        mode: 'grid',
        cols: 4,
        cellW: 140,
        cellH: 160,
        items: [
          { type: 'image', key: TinySwordsAtlases.Buildings, frame: TinySwordsBuildingFrames.BlueCastle, label: 'Blue Castle', scale: 0.3 },
          { type: 'image', key: TinySwordsAtlases.Buildings, frame: TinySwordsBuildingFrames.BlueBarracks, label: 'Blue Barracks', scale: 0.3 },
          { type: 'image', key: TinySwordsAtlases.Buildings, frame: TinySwordsBuildingFrames.BlueHouse1, label: 'Blue House', scale: 0.3 },
          { type: 'image', key: TinySwordsAtlases.Buildings, frame: TinySwordsBuildingFrames.RedCastle, label: 'Red Castle', scale: 0.3 },
          { type: 'image', key: TinySwordsAtlases.Buildings, frame: TinySwordsBuildingFrames.BlackCastle, label: 'Black Castle', scale: 0.3 },
          { type: 'image', key: TinySwordsAtlases.Buildings, frame: TinySwordsBuildingFrames.PurpleCastle, label: 'Purple Castle', scale: 0.3 },
          { type: 'image', key: TinySwordsAtlases.Buildings, frame: TinySwordsBuildingFrames.YellowHouse1, label: 'Yellow House', scale: 0.3 },
        ],
      },
      {
        title: 'Units / Factions',
        mode: 'table',
        factionColors: factions,
        unitTypes,
        factionAnims,
        factionSheets,
      },
      {
        title: 'Workers',
        mode: 'grid',
        cols: 7,
        cellW: 120,
        cellH: 150,
        items: workerGroups,
      },
      {
        title: 'Resources',
        mode: 'grid',
        cols: 5,
        cellW: 110,
        cellH: 100,
        items: [
          { type: 'image', key: TinySwordsAtlases.Resources, frame: TinySwordsResourceFrames.Gold, label: 'Gold', scale: 1.0 },
          { type: 'image', key: TinySwordsAtlases.Resources, frame: TinySwordsResourceFrames.Wood, label: 'Wood', scale: 1.0 },
          { type: 'image', key: TinySwordsAtlases.Resources, frame: TinySwordsResourceFrames.Meat, label: 'Meat', scale: 1.0 },
          { type: 'image', key: TinySwordsAtlases.Resources, frame: TinySwordsResourceFrames.Tool01, label: 'Tool', scale: 1.0 },
          { type: 'image', key: TinySwordsAtlases.Resources, frame: TinySwordsResourceFrames.Rock1, label: 'Rock', scale: 1.0 },
          { type: 'image', key: TinySwordsAtlases.Resources, frame: TinySwordsResourceFrames.Stump1, label: 'Stump', scale: 1.0 },
          { type: 'image', key: TinySwordsAtlases.Resources, frame: TinySwordsResourceFrames.GoldStone1, label: 'GStone', scale: 1.0 },
        ],
      },
      {
        title: 'UI Core',
        mode: 'grid',
        cols: 4,
        cellW: 120,
        cellH: 110,
        items: [
          { type: 'image', key: TinySwordsAtlases.UICore, frame: TinySwordsUIFrames.ButtonBigBlueRegular, label: 'Blue Btn', scale: 0.2 },
          { type: 'image', key: TinySwordsAtlases.UICore, frame: TinySwordsUIFrames.ButtonBigRedRegular, label: 'Red Btn', scale: 0.2 },
          { type: 'image', key: TinySwordsAtlases.UICore, frame: TinySwordsUIFrames.Icon01, label: 'Icon 01', scale: 0.8 },
          { type: 'image', key: TinySwordsAtlases.UICore, frame: TinySwordsUIFrames.Icon05, label: 'Icon 05', scale: 0.8 },
          { type: 'image', key: TinySwordsAtlases.UICore, frame: TinySwordsUIFrames.PaperRegular, label: 'Paper', scale: 0.2 },
          { type: 'image', key: TinySwordsAtlases.UICore, frame: TinySwordsUIFrames.Cursor01, label: 'Cursor', scale: 0.7 },
          { type: 'image', key: TinySwordsAtlases.UICore, frame: TinySwordsUIFrames.Banner, label: 'Banner', scale: 0.25 },
          { type: 'image', key: TinySwordsAtlases.UICore, frame: TinySwordsUIFrames.TableWood, label: 'Table', scale: 0.2 },
        ],
      },
      {
        title: 'Portraits',
        mode: 'grid',
        cols: 6,
        cellW: 110,
        cellH: 120,
        items: [
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsPortraitFrames.Avatar01, label: 'Avatar01', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsPortraitFrames.Avatar05, label: 'Avatar05', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsPortraitFrames.Avatar10, label: 'Avatar10', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsPortraitFrames.Avatar15, label: 'Avatar15', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsPortraitFrames.Avatar20, label: 'Avatar20', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsPortraitFrames.Avatar25, label: 'Avatar25', scale: 0.45 },
        ],
      },
      {
        title: 'Faction Portraits',
        mode: 'grid',
        cols: 5,
        cellW: 110,
        cellH: 120,
        items: [
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BlueKnight, label: 'Blue Knight', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BlueLancer, label: 'Blue Lancer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BlueArcher, label: 'Blue Archer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BlueMonk, label: 'Blue Monk', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BluePawn, label: 'Blue Pawn', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.RedKnight, label: 'Red Knight', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.RedLancer, label: 'Red Lancer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.RedArcher, label: 'Red Archer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.RedMonk, label: 'Red Monk', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.RedPawn, label: 'Red Pawn', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.YellowKnight, label: 'Yellow Knight', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.YellowLancer, label: 'Yellow Lancer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.YellowArcher, label: 'Yellow Archer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.YellowMonk, label: 'Yellow Monk', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.YellowPawn, label: 'Yellow Pawn', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.PurpleKnight, label: 'Purple Knight', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.PurpleLancer, label: 'Purple Lancer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.PurpleArcher, label: 'Purple Archer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.PurpleMonk, label: 'Purple Monk', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.PurplePawn, label: 'Purple Pawn', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BlackKnight, label: 'Black Knight', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BlackLancer, label: 'Black Lancer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BlackArcher, label: 'Black Archer', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BlackMonk, label: 'Black Monk', scale: 0.45 },
          { type: 'image', key: TinySwordsAtlases.Portraits, frame: TinySwordsFactionPortraits.BlackPawn, label: 'Black Pawn', scale: 0.45 },
        ],
      },
      {
        title: 'UI Panels',
        mode: 'grid',
        cols: 4,
        cellW: 140,
        cellH: 140,
        items: [
          { type: 'image', key: TinySwordsAtlases.UIPanels, frame: TinySwordsUIPanelFrames.RibbonBlue, label: 'Ribbon Blue', scale: 0.2 },
          { type: 'image', key: TinySwordsAtlases.UIPanels, frame: TinySwordsUIPanelFrames.RibbonRed, label: 'Ribbon Red', scale: 0.2 },
          { type: 'image', key: TinySwordsAtlases.UIPanels, frame: TinySwordsUIPanelFrames.RibbonBlack, label: 'Ribbon Black', scale: 0.2 },
          { type: 'image', key: TinySwordsAtlases.UIPanels, frame: TinySwordsUIPanelFrames.RibbonPurple, label: 'Ribbon Purple', scale: 0.2 },
          { type: 'image', key: TinySwordsAtlases.UIPanels, frame: TinySwordsUIPanelFrames.RibbonYellow, label: 'Ribbon Yellow', scale: 0.2 },
          { type: 'image', key: TinySwordsAtlases.UIPanels, frame: TinySwordsUIPanelFrames.StoreBanner, label: 'Store', scale: 0.15 },
          { type: 'image', key: TinySwordsAtlases.UIPanels, frame: TinySwordsUIPanelFrames.BigRibbons, label: 'Big Ribbons', scale: 0.2 },
        ],
      },
      {
        title: 'Terrain',
        mode: 'grid',
        cols: 5,
        cellW: 110,
        cellH: 100,
        items: [
          { type: 'image', key: 'terrain-tilemap-color1', label: 'Color 1', scale: 0.2 },
          { type: 'image', key: 'terrain-tilemap-color2', label: 'Color 2', scale: 0.2 },
          { type: 'image', key: 'terrain-tilemap-color3', label: 'Color 3', scale: 0.2 },
          { type: 'image', key: 'terrain-tilemap-color4', label: 'Color 4', scale: 0.2 },
          { type: 'image', key: 'terrain-tilemap-color5', label: 'Color 5', scale: 0.2 },
        ],
      },
      {
        title: 'Terrain Presets',
        mode: 'terrain',
        presets: [
          { brush: simpleGrassRect, label: 'Grass', x: 80, y: 80 },
          { brush: simpleWaterPatch, label: 'Water', x: 320, y: 80 },
          { brush: simpleCliffBlock, label: 'Cliff', x: 80, y: 260 },
          { brush: simplePathPatch, label: 'Grass path', x: 320, y: 280 },
        ],
      },
      {
        title: 'Environment',
        mode: 'grid',
        cols: 4,
        cellW: 140,
        cellH: 140,
        items: [
          { type: 'sprite', key: 'env-tree-01', anim: 'env-tree-01', label: 'Tree 1', scale: 0.15 },
          { type: 'sprite', key: 'env-tree-02', anim: 'env-tree-02', label: 'Tree 2', scale: 0.15 },
          { type: 'sprite', key: 'env-tree-03', anim: 'env-tree-03', label: 'Tree 3', scale: 0.2 },
          { type: 'sprite', key: 'env-tree-04', anim: 'env-tree-04', label: 'Tree 4', scale: 0.2 },
          { type: 'sprite', key: 'env-bush-01', anim: 'env-bush-01', label: 'Bush 1', scale: 0.25 },
          { type: 'sprite', key: 'env-bush-02', anim: 'env-bush-02', label: 'Bush 2', scale: 0.25 },
          { type: 'sprite', key: 'env-bush-03', anim: 'env-bush-03', label: 'Bush 3', scale: 0.25 },
          { type: 'sprite', key: 'env-bush-04', anim: 'env-bush-04', label: 'Bush 4', scale: 0.25 },
          { type: 'image', key: 'env-water-foam', frame: 0, label: 'Foam', scale: 0.2 },
          { type: 'image', key: 'env-water-rocks-01', frame: 0, label: 'W Rocks', scale: 1.5 },
        ],
      },
      {
        title: 'Debug: UI Helpers',
        mode: 'debug',
      },
    ];
  }
}
