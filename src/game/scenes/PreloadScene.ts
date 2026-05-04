import Phaser from 'phaser';
import { GeneratedAssetPacks } from '../../content/generatedAssetKeys';
import { TinySwordsAssetPacks } from '../../content/tinySwordsAssetKeys';
import { TinySwordsAnimations, TinySwordsPawnToolAnimations } from '../../content/tinySwordsAnimations';
import { TinySwordsTilesets } from '../../content/tinySwordsTilesets';
import { TinySwordsEnvironmentStrips } from '../../content/tinySwordsEnvironment';

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
      const sheet = getSpritesheetMeta(anim.sheetKey);
      if (sheet) {
        this.load.spritesheet(sheet.key, sheet.path, {
          frameWidth: sheet.frameWidth,
          frameHeight: sheet.frameHeight,
        });
      }
    }

    for (const anim of TinySwordsPawnToolAnimations) {
      const sheet = getSpritesheetMeta(anim.sheetKey);
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

    for (const env of TinySwordsEnvironmentStrips) {
      if (env.needsVerification || env.frames == null) continue;
      this.load.spritesheet(env.key, env.path, {
        frameWidth: env.frameWidth,
        frameHeight: env.frameHeight,
      });
    }
  }

  create(): void {
    for (const anim of TinySwordsAnimations) {
      const sheet = getSpritesheetMeta(anim.sheetKey);
      if (!sheet) continue;
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers(sheet.key, {
          start: anim.startFrame,
          end: anim.endFrame,
        }),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    }

    for (const anim of TinySwordsPawnToolAnimations) {
      const sheet = getSpritesheetMeta(anim.sheetKey);
      if (!sheet) continue;
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers(sheet.key, {
          start: anim.startFrame,
          end: anim.endFrame,
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
    'unit-blue-lancer-idle': { key: 'unit-blue-lancer-idle', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-blue-lancer-run': { key: 'unit-blue-lancer-run', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-blue-lancer-right-attack': { key: 'unit-blue-lancer-right-attack', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-blue-lancer-down-attack': { key: 'unit-blue-lancer-down-attack', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-blue-lancer-up-attack': { key: 'unit-blue-lancer-up-attack', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-blue-monk-idle': { key: 'unit-blue-monk-idle', path: 'assets/source/tiny-swords/units/blue-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-monk-run': { key: 'unit-blue-monk-run', path: 'assets/source/tiny-swords/units/blue-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-blue-monk-heal': { key: 'unit-blue-monk-heal', path: 'assets/source/tiny-swords/units/blue-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-blue-pawn-idle': { key: 'unit-blue-pawn-idle', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run': { key: 'unit-blue-pawn-run', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Red enemies
    'unit-red-warrior-idle': { key: 'unit-red-warrior-idle', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-warrior-run': { key: 'unit-red-warrior-run', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-warrior-attack1': { key: 'unit-red-warrior-attack1', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-red-archer-idle': { key: 'unit-red-archer-idle', path: 'assets/source/tiny-swords/units/red-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-archer-run': { key: 'unit-red-archer-run', path: 'assets/source/tiny-swords/units/red-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-red-archer-shoot': { key: 'unit-red-archer-shoot', path: 'assets/source/tiny-swords/units/red-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-lancer-idle': { key: 'unit-red-lancer-idle', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-red-lancer-run': { key: 'unit-red-lancer-run', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-red-lancer-right-attack': { key: 'unit-red-lancer-right-attack', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-red-lancer-down-attack': { key: 'unit-red-lancer-down-attack', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-red-lancer-up-attack': { key: 'unit-red-lancer-up-attack', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-red-monk-idle': { key: 'unit-red-monk-idle', path: 'assets/source/tiny-swords/units/red-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-monk-run': { key: 'unit-red-monk-run', path: 'assets/source/tiny-swords/units/red-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-red-monk-heal': { key: 'unit-red-monk-heal', path: 'assets/source/tiny-swords/units/red-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-red-pawn-idle': { key: 'unit-red-pawn-idle', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run': { key: 'unit-red-pawn-run', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Black
    'unit-black-warrior-idle': { key: 'unit-black-warrior-idle', path: 'assets/source/tiny-swords/units/black-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-warrior-run': { key: 'unit-black-warrior-run', path: 'assets/source/tiny-swords/units/black-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-warrior-attack1': { key: 'unit-black-warrior-attack1', path: 'assets/source/tiny-swords/units/black-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-black-archer-idle': { key: 'unit-black-archer-idle', path: 'assets/source/tiny-swords/units/black-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-archer-run': { key: 'unit-black-archer-run', path: 'assets/source/tiny-swords/units/black-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-black-archer-shoot': { key: 'unit-black-archer-shoot', path: 'assets/source/tiny-swords/units/black-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-lancer-idle': { key: 'unit-black-lancer-idle', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-black-lancer-run': { key: 'unit-black-lancer-run', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-black-lancer-right-attack': { key: 'unit-black-lancer-right-attack', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-black-lancer-down-attack': { key: 'unit-black-lancer-down-attack', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-black-lancer-up-attack': { key: 'unit-black-lancer-up-attack', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-black-monk-idle': { key: 'unit-black-monk-idle', path: 'assets/source/tiny-swords/units/black-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-monk-run': { key: 'unit-black-monk-run', path: 'assets/source/tiny-swords/units/black-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-black-monk-heal': { key: 'unit-black-monk-heal', path: 'assets/source/tiny-swords/units/black-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-black-pawn-idle': { key: 'unit-black-pawn-idle', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-pawn-run': { key: 'unit-black-pawn-run', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Purple
    'unit-purple-warrior-idle': { key: 'unit-purple-warrior-idle', path: 'assets/source/tiny-swords/units/purple-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-warrior-run': { key: 'unit-purple-warrior-run', path: 'assets/source/tiny-swords/units/purple-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-warrior-attack1': { key: 'unit-purple-warrior-attack1', path: 'assets/source/tiny-swords/units/purple-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-purple-archer-idle': { key: 'unit-purple-archer-idle', path: 'assets/source/tiny-swords/units/purple-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-archer-run': { key: 'unit-purple-archer-run', path: 'assets/source/tiny-swords/units/purple-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-purple-archer-shoot': { key: 'unit-purple-archer-shoot', path: 'assets/source/tiny-swords/units/purple-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-lancer-idle': { key: 'unit-purple-lancer-idle', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-purple-lancer-run': { key: 'unit-purple-lancer-run', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-purple-lancer-right-attack': { key: 'unit-purple-lancer-right-attack', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-purple-lancer-down-attack': { key: 'unit-purple-lancer-down-attack', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-purple-lancer-up-attack': { key: 'unit-purple-lancer-up-attack', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-purple-monk-idle': { key: 'unit-purple-monk-idle', path: 'assets/source/tiny-swords/units/purple-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-monk-run': { key: 'unit-purple-monk-run', path: 'assets/source/tiny-swords/units/purple-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-purple-monk-heal': { key: 'unit-purple-monk-heal', path: 'assets/source/tiny-swords/units/purple-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-purple-pawn-idle': { key: 'unit-purple-pawn-idle', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-pawn-run': { key: 'unit-purple-pawn-run', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Yellow
    'unit-yellow-warrior-idle': { key: 'unit-yellow-warrior-idle', path: 'assets/source/tiny-swords/units/yellow-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-warrior-run': { key: 'unit-yellow-warrior-run', path: 'assets/source/tiny-swords/units/yellow-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-warrior-attack1': { key: 'unit-yellow-warrior-attack1', path: 'assets/source/tiny-swords/units/yellow-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-yellow-archer-idle': { key: 'unit-yellow-archer-idle', path: 'assets/source/tiny-swords/units/yellow-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-archer-run': { key: 'unit-yellow-archer-run', path: 'assets/source/tiny-swords/units/yellow-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-yellow-archer-shoot': { key: 'unit-yellow-archer-shoot', path: 'assets/source/tiny-swords/units/yellow-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-lancer-idle': { key: 'unit-yellow-lancer-idle', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-yellow-lancer-run': { key: 'unit-yellow-lancer-run', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-yellow-lancer-right-attack': { key: 'unit-yellow-lancer-right-attack', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-yellow-lancer-down-attack': { key: 'unit-yellow-lancer-down-attack', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-yellow-lancer-up-attack': { key: 'unit-yellow-lancer-up-attack', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-yellow-monk-idle': { key: 'unit-yellow-monk-idle', path: 'assets/source/tiny-swords/units/yellow-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-monk-run': { key: 'unit-yellow-monk-run', path: 'assets/source/tiny-swords/units/yellow-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-yellow-monk-heal': { key: 'unit-yellow-monk-heal', path: 'assets/source/tiny-swords/units/yellow-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-yellow-pawn-idle': { key: 'unit-yellow-pawn-idle', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-pawn-run': { key: 'unit-yellow-pawn-run', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Pawn tools
    'unit-blue-pawn-idle-axe': { key: 'unit-blue-pawn-idle-axe', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-axe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run-axe': { key: 'unit-blue-pawn-run-axe', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-pawn-idle-hammer': { key: 'unit-blue-pawn-idle-hammer', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-hammer.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run-hammer': { key: 'unit-blue-pawn-run-hammer', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-hammer.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-pawn-idle-pickaxe': { key: 'unit-blue-pawn-idle-pickaxe', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run-pickaxe': { key: 'unit-blue-pawn-run-pickaxe', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-pawn-idle-gold': { key: 'unit-blue-pawn-idle-gold', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-gold.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run-gold': { key: 'unit-blue-pawn-run-gold', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-gold.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-pawn-idle-wood': { key: 'unit-blue-pawn-idle-wood', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-wood.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run-wood': { key: 'unit-blue-pawn-run-wood', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-wood.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-pawn-idle-meat': { key: 'unit-blue-pawn-idle-meat', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-meat.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run-meat': { key: 'unit-blue-pawn-run-meat', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-meat.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-pawn-idle-knife': { key: 'unit-blue-pawn-idle-knife', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle-knife.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run-knife': { key: 'unit-blue-pawn-run-knife', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run-knife.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-pawn-interact-axe': { key: 'unit-blue-pawn-interact-axe', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-interact-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-pawn-interact-hammer': { key: 'unit-blue-pawn-interact-hammer', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-interact-hammer.png', frameWidth: 192, frameHeight: 192, frames: 3 },
    'unit-blue-pawn-interact-knife': { key: 'unit-blue-pawn-interact-knife', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-interact-knife.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-blue-pawn-interact-pickaxe': { key: 'unit-blue-pawn-interact-pickaxe', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-interact-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Particles
    'particle-fire-01': { key: 'particle-fire-01', path: 'assets/source/tiny-swords/particle-fx/fire-01.png', frameWidth: 64, frameHeight: 64, frames: 8 },
    'particle-dust-01': { key: 'particle-dust-01', path: 'assets/source/tiny-swords/particle-fx/dust-01.png', frameWidth: 64, frameHeight: 64, frames: 8 },
    'particle-explosion-01': { key: 'particle-explosion-01', path: 'assets/source/tiny-swords/particle-fx/explosion-01.png', frameWidth: 192, frameHeight: 192, frames: 8 },
  };
  return map[key] || null;
}
