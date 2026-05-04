import Phaser from 'phaser';
import { GeneratedAssetPacks } from '../../content/generatedAssetKeys';
import { TinySwordsAssetPacks } from '../../content/tinySwordsAssetKeys';
import { TinySwordsAnimations } from '../../content/tinySwordsAnimations';
import { TinySwordsTilesets } from '../../content/tinySwordsTilesets';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, 'Loading...', {
        fontSize: '28px',
        color: '#f4e9ff',
      })
      .setOrigin(0.5);

    for (const pack of GeneratedAssetPacks) {
      this.load.atlas(pack.key, pack.imagePath, pack.atlasPath);
    }

    for (const pack of TinySwordsAssetPacks) {
      this.load.atlas(pack.key, pack.imagePath, pack.atlasPath);
    }

    for (const anim of TinySwordsAnimations) {
      const sheet = getSpritesheetMeta(anim.spritesheet);
      if (sheet) {
        this.load.spritesheet(sheet.key, sheet.path, {
          frameWidth: sheet.frameWidth,
          frameHeight: sheet.frameHeight,
        });
      }
    }

    for (const tile of TinySwordsTilesets) {
      this.load.image(tile.key, tile.imagePath);
    }
  }

  create(): void {
    for (const anim of TinySwordsAnimations) {
      const sheet = getSpritesheetMeta(anim.spritesheet);
      if (!sheet) continue;
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers(sheet.key, {
          start: 0,
          end: sheet.frames - 1,
        }),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    }

    this.scene.start('MainMenuScene');
  }
}

function getSpritesheetMeta(key: string) {
  const map: Record<string, { key: string; path: string; frameWidth: number; frameHeight: number; frames: number }> = {
    // Blue allies
    'unit-blue-warrior-idle': { key: 'unit-blue-warrior-idle', path: 'assets/source/tiny-swords/units/blue-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-warrior-run': { key: 'unit-blue-warrior-run', path: 'assets/source/tiny-swords/units/blue-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-warrior-attack1': { key: 'unit-blue-warrior-attack1', path: 'assets/source/tiny-swords/units/blue-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-blue-archer-idle': { key: 'unit-blue-archer-idle', path: 'assets/source/tiny-swords/units/blue-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-archer-run': { key: 'unit-blue-archer-run', path: 'assets/source/tiny-swords/units/blue-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-blue-archer-shoot': { key: 'unit-blue-archer-shoot', path: 'assets/source/tiny-swords/units/blue-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-idle': { key: 'unit-blue-pawn-idle', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run': { key: 'unit-blue-pawn-run', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Red enemies
    'unit-red-warrior-idle': { key: 'unit-red-warrior-idle', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-warrior-run': { key: 'unit-red-warrior-run', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-warrior-attack1': { key: 'unit-red-warrior-attack1', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-red-archer-idle': { key: 'unit-red-archer-idle', path: 'assets/source/tiny-swords/units/red-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-archer-run': { key: 'unit-red-archer-run', path: 'assets/source/tiny-swords/units/red-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-red-archer-shoot': { key: 'unit-red-archer-shoot', path: 'assets/source/tiny-swords/units/red-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-idle': { key: 'unit-red-pawn-idle', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run': { key: 'unit-red-pawn-run', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Particles
    'particle-fire-01': { key: 'particle-fire-01', path: 'assets/source/tiny-swords/particle-fx/fire-01.png', frameWidth: 64, frameHeight: 64, frames: 8 },
    'particle-dust-01': { key: 'particle-dust-01', path: 'assets/source/tiny-swords/particle-fx/dust-01.png', frameWidth: 64, frameHeight: 64, frames: 8 },
    'particle-explosion-01': { key: 'particle-explosion-01', path: 'assets/source/tiny-swords/particle-fx/explosion-01.png', frameWidth: 192, frameHeight: 192, frames: 8 },
  };
  return map[key] || null;
}
