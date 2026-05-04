import Phaser from 'phaser';
import {
  TinySwordsAtlases,
  TinySwordsBuildingFrames,
  TinySwordsUIFrames,
  TinySwordsResourceFrames,
  TinySwordsPortraitFrames,
  TinySwordsUIPanelFrames,
} from '../../content/tinySwordsAssetKeys';
import { TinySwordsPawnToolAnimations } from '../../content/tinySwordsAnimations';

interface GalleryItem {
  type: 'image' | 'sprite';
  key: string;
  frame?: string | number;
  anim?: string;
  label: string;
  scale: number;
}

interface PageConfig {
  title: string;
  mode: 'grid' | 'table';
  cols?: number;
  cellW?: number;
  cellH?: number;
  items?: GalleryItem[];
  factionColors?: string[];
  unitTypes?: { key: string; label: string; scale: number }[];
  factionAnims?: Record<string, Record<string, string>>;
  factionSheets?: Record<string, Record<string, string>>;
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
        title: 'Environment',
        mode: 'grid',
        cols: 4,
        cellW: 140,
        cellH: 140,
        items: [
          { type: 'image', key: 'env-tree-01', frame: 0, label: 'Tree 1', scale: 0.15 },
          { type: 'image', key: 'env-tree-02', frame: 0, label: 'Tree 2', scale: 0.15 },
          { type: 'image', key: 'env-bush-01', frame: 0, label: 'Bush 1', scale: 0.25 },
          { type: 'image', key: 'env-bush-02', frame: 0, label: 'Bush 2', scale: 0.25 },
          { type: 'image', key: 'env-water-foam', frame: 0, label: 'Foam', scale: 0.2 },
          { type: 'image', key: 'env-water-rocks-01', frame: 0, label: 'W Rocks', scale: 1.5 },
        ],
      },
    ];
  }
}
