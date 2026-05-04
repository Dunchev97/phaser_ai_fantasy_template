import Phaser from 'phaser';
import {
  TinySwordsAtlases,
  TinySwordsBuildingFrames,
  TinySwordsUIFrames,
  TinySwordsResourceFrames,
  TinySwordsPortraitFrames,
  TinySwordsUIPanelFrames,
} from '../../content/tinySwordsAssetKeys';

export class AssetGalleryScene extends Phaser.Scene {
  constructor() {
    super('AssetGalleryScene');
  }

  create(): void {
    const add = this.add;
    const w = this.scale.width;

    add.text(w / 2, 12, 'Tiny Swords Asset Gallery', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);

    let y = 40;
    add.text(20, y - 10, 'Buildings', { fontSize: '14px', color: '#aaccff' });
    const buildingFrames = [
      TinySwordsBuildingFrames.BlueCastle,
      TinySwordsBuildingFrames.BlueBarracks,
      TinySwordsBuildingFrames.RedCastle,
      TinySwordsBuildingFrames.YellowHouse1,
    ];
    let bx = 40;
    for (const frame of buildingFrames) {
      add.image(bx, y + 38, TinySwordsAtlases.Buildings, frame).setScale(0.5);
      bx += 90;
    }

    y = 120;
    add.text(20, y - 10, 'Resources', { fontSize: '14px', color: '#aaccff' });
    const resourceFrames = [
      TinySwordsResourceFrames.Gold,
      TinySwordsResourceFrames.Wood,
      TinySwordsResourceFrames.Meat,
      TinySwordsResourceFrames.Tool01,
    ];
    let rx = 50;
    for (const frame of resourceFrames) {
      add.image(rx, y + 30, TinySwordsAtlases.Resources, frame).setScale(1.0);
      rx += 70;
    }

    y = 200;
    add.text(20, y - 10, 'UI Core', { fontSize: '14px', color: '#aaccff' });
    add.image(40, y + 30, TinySwordsAtlases.UICore, TinySwordsUIFrames.ButtonBigBlueRegular).setScale(0.25);
    add.image(110, y + 30, TinySwordsAtlases.UICore, TinySwordsUIFrames.ButtonBigRedRegular).setScale(0.25);
    add.image(170, y + 30, TinySwordsAtlases.UICore, TinySwordsUIFrames.Icon01).setScale(0.8);
    add.image(230, y + 30, TinySwordsAtlases.UICore, TinySwordsUIFrames.PaperRegular).setScale(0.2);

    add.text(330, y - 10, 'UI Panels', { fontSize: '14px', color: '#aaccff' });
    add.image(360, y + 30, TinySwordsAtlases.UIPanels, TinySwordsUIPanelFrames.RibbonBlue).setScale(0.25);
    add.image(440, y + 30, TinySwordsAtlases.UIPanels, TinySwordsUIPanelFrames.RibbonRed).setScale(0.25);
    add.image(520, y + 30, TinySwordsAtlases.UIPanels, TinySwordsUIPanelFrames.StoreBanner).setScale(0.25);

    y = 280;
    add.text(20, y - 10, 'Blue Allies', { fontSize: '14px', color: '#aaccff' });
    const blueWarrior = add.sprite(60, y + 50, 'unit-blue-warrior-idle');
    blueWarrior.play('blue-warrior-idle');
    add.text(60, y + 90, 'Warrior', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    const blueArcher = add.sprite(150, y + 50, 'unit-blue-archer-run');
    blueArcher.play('blue-archer-run');
    add.text(150, y + 90, 'Archer', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    const bluePawn = add.sprite(240, y + 50, 'unit-blue-pawn-idle');
    bluePawn.play('blue-pawn-idle');
    add.text(240, y + 90, 'Pawn', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    add.text(360, y - 10, 'Red Enemies', { fontSize: '14px', color: '#ffaaaa' });
    const redWarrior = add.sprite(400, y + 50, 'unit-red-warrior-idle');
    redWarrior.play('red-warrior-idle');
    add.text(400, y + 90, 'Warrior', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    const redArcher = add.sprite(490, y + 50, 'unit-red-archer-run');
    redArcher.play('red-archer-run');
    add.text(490, y + 90, 'Archer', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    const redPawn = add.sprite(580, y + 50, 'unit-red-pawn-idle');
    redPawn.play('red-pawn-idle');
    add.text(580, y + 90, 'Pawn', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    y = 400;
    add.text(20, y - 10, 'Particles', { fontSize: '14px', color: '#aaccff' });
    const fire = add.sprite(60, y + 30, 'particle-fire-01');
    fire.play('fire-01');
    add.text(60, y + 60, 'Fire', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    const dust = add.sprite(140, y + 30, 'particle-dust-01');
    dust.play('dust-01');
    add.text(140, y + 60, 'Dust', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    const exp = add.sprite(230, y + 30, 'particle-explosion-01');
    exp.play('explosion-01');
    add.text(230, y + 60, 'Explosion', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    y = 480;
    add.text(20, y - 10, 'Portraits', { fontSize: '14px', color: '#aaccff' });
    const portraitFrames = [
      TinySwordsPortraitFrames.Avatar01,
      TinySwordsPortraitFrames.Avatar05,
      TinySwordsPortraitFrames.Avatar10,
      TinySwordsPortraitFrames.Avatar15,
      TinySwordsPortraitFrames.Avatar20,
      TinySwordsPortraitFrames.Avatar25,
    ];
    let px = 50;
    for (const frame of portraitFrames) {
      add.image(px, y + 30, TinySwordsAtlases.Portraits, frame).setScale(0.6);
      px += 90;
    }

    y = 560;
    add.text(20, y - 10, 'Terrain', { fontSize: '14px', color: '#aaccff' });
    add.image(60, y + 30, 'terrain-tilemap-color1').setScale(1.5);
    add.text(60, y + 60, 'Color1', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);
    add.image(160, y + 30, 'terrain-tilemap-color2').setScale(1.5);
    add.text(160, y + 60, 'Color2', { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5);

    const back = add.text(w / 2, this.scale.height - 24, '← Back to Menu', {
      fontSize: '20px',
      color: '#ffddaa',
      backgroundColor: '#332211',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerdown', () => this.scene.start('MainMenuScene'));
  }
}
