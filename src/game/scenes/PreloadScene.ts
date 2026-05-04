import Phaser from 'phaser';
import { GeneratedAssetPacks } from '../../content/generatedAssetKeys';
import { TinySwordsAssetPacks } from '../../content/tinySwordsAssetKeys';
import { TinySwordsAnimations, TinySwordsPawnToolAnimations } from '../../content/tinySwordsAnimations';
import { TinySwordsTilesets } from '../../content/tinySwordsTilesets';
import { TinySwordsEnvironmentStrips } from '../../content/tinySwordsEnvironment';
import { TinySwordsArcherArrows } from '../../content/tinySwordsAssetKeys';

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

    for (const arrow of TinySwordsArcherArrows) {
      this.load.image(arrow.key, arrow.path);
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
    'unit-blue-warrior-attack2': { key: 'unit-blue-warrior-attack2', path: 'assets/source/tiny-swords/units/blue-units/warrior/warrior-attack2.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-blue-warrior-guard': { key: 'unit-blue-warrior-guard', path: 'assets/source/tiny-swords/units/blue-units/warrior/warrior-guard.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-archer-idle': { key: 'unit-blue-archer-idle', path: 'assets/source/tiny-swords/units/blue-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-archer-run': { key: 'unit-blue-archer-run', path: 'assets/source/tiny-swords/units/blue-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-blue-archer-shoot': { key: 'unit-blue-archer-shoot', path: 'assets/source/tiny-swords/units/blue-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-lancer-idle': { key: 'unit-blue-lancer-idle', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-blue-lancer-run': { key: 'unit-blue-lancer-run', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-blue-lancer-right-attack': { key: 'unit-blue-lancer-right-attack', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-blue-lancer-down-attack': { key: 'unit-blue-lancer-down-attack', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-blue-lancer-up-attack': { key: 'unit-blue-lancer-up-attack', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-blue-lancer-defend-down': { key: 'unit-blue-lancer-defend-down', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-down-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-blue-lancer-defend-downright': { key: 'unit-blue-lancer-defend-downright', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-downright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-blue-lancer-defend-right': { key: 'unit-blue-lancer-defend-right', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-right-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-blue-lancer-defend-upright': { key: 'unit-blue-lancer-defend-upright', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-upright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-blue-lancer-defend-up': { key: 'unit-blue-lancer-defend-up', path: 'assets/source/tiny-swords/units/blue-units/lancer/lancer-up-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-blue-monk-idle': { key: 'unit-blue-monk-idle', path: 'assets/source/tiny-swords/units/blue-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-blue-monk-run': { key: 'unit-blue-monk-run', path: 'assets/source/tiny-swords/units/blue-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-blue-monk-heal': { key: 'unit-blue-monk-heal', path: 'assets/source/tiny-swords/units/blue-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-blue-monk-heal-effect': { key: 'unit-blue-monk-heal-effect', path: 'assets/source/tiny-swords/units/blue-units/monk/heal-effect.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-blue-pawn-idle': { key: 'unit-blue-pawn-idle', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-blue-pawn-run': { key: 'unit-blue-pawn-run', path: 'assets/source/tiny-swords/units/blue-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Red enemies
    'unit-red-warrior-idle': { key: 'unit-red-warrior-idle', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-warrior-run': { key: 'unit-red-warrior-run', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-warrior-attack1': { key: 'unit-red-warrior-attack1', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-red-warrior-attack2': { key: 'unit-red-warrior-attack2', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-attack2.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-red-warrior-guard': { key: 'unit-red-warrior-guard', path: 'assets/source/tiny-swords/units/red-units/warrior/warrior-guard.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-archer-idle': { key: 'unit-red-archer-idle', path: 'assets/source/tiny-swords/units/red-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-archer-run': { key: 'unit-red-archer-run', path: 'assets/source/tiny-swords/units/red-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-red-archer-shoot': { key: 'unit-red-archer-shoot', path: 'assets/source/tiny-swords/units/red-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-lancer-idle': { key: 'unit-red-lancer-idle', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-red-lancer-run': { key: 'unit-red-lancer-run', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-red-lancer-right-attack': { key: 'unit-red-lancer-right-attack', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-red-lancer-down-attack': { key: 'unit-red-lancer-down-attack', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-red-lancer-up-attack': { key: 'unit-red-lancer-up-attack', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-red-lancer-defend-down': { key: 'unit-red-lancer-defend-down', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-down-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-red-lancer-defend-downright': { key: 'unit-red-lancer-defend-downright', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-downright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-red-lancer-defend-right': { key: 'unit-red-lancer-defend-right', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-right-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-red-lancer-defend-upright': { key: 'unit-red-lancer-defend-upright', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-upright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-red-lancer-defend-up': { key: 'unit-red-lancer-defend-up', path: 'assets/source/tiny-swords/units/red-units/lancer/lancer-up-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-red-monk-idle': { key: 'unit-red-monk-idle', path: 'assets/source/tiny-swords/units/red-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-monk-run': { key: 'unit-red-monk-run', path: 'assets/source/tiny-swords/units/red-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-red-monk-heal': { key: 'unit-red-monk-heal', path: 'assets/source/tiny-swords/units/red-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-red-monk-heal-effect': { key: 'unit-red-monk-heal-effect', path: 'assets/source/tiny-swords/units/red-units/monk/heal-effect.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-red-pawn-idle': { key: 'unit-red-pawn-idle', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run': { key: 'unit-red-pawn-run', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Black
    'unit-black-warrior-idle': { key: 'unit-black-warrior-idle', path: 'assets/source/tiny-swords/units/black-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-warrior-run': { key: 'unit-black-warrior-run', path: 'assets/source/tiny-swords/units/black-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-warrior-attack1': { key: 'unit-black-warrior-attack1', path: 'assets/source/tiny-swords/units/black-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-black-warrior-attack2': { key: 'unit-black-warrior-attack2', path: 'assets/source/tiny-swords/units/black-units/warrior/warrior-attack2.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-black-warrior-guard': { key: 'unit-black-warrior-guard', path: 'assets/source/tiny-swords/units/black-units/warrior/warrior-guard.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-archer-idle': { key: 'unit-black-archer-idle', path: 'assets/source/tiny-swords/units/black-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-archer-run': { key: 'unit-black-archer-run', path: 'assets/source/tiny-swords/units/black-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-black-archer-shoot': { key: 'unit-black-archer-shoot', path: 'assets/source/tiny-swords/units/black-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-lancer-idle': { key: 'unit-black-lancer-idle', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-black-lancer-run': { key: 'unit-black-lancer-run', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-black-lancer-right-attack': { key: 'unit-black-lancer-right-attack', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-black-lancer-down-attack': { key: 'unit-black-lancer-down-attack', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-black-lancer-up-attack': { key: 'unit-black-lancer-up-attack', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-black-lancer-defend-down': { key: 'unit-black-lancer-defend-down', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-down-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-black-lancer-defend-downright': { key: 'unit-black-lancer-defend-downright', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-downright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-black-lancer-defend-right': { key: 'unit-black-lancer-defend-right', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-right-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-black-lancer-defend-upright': { key: 'unit-black-lancer-defend-upright', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-upright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-black-lancer-defend-up': { key: 'unit-black-lancer-defend-up', path: 'assets/source/tiny-swords/units/black-units/lancer/lancer-up-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-black-monk-idle': { key: 'unit-black-monk-idle', path: 'assets/source/tiny-swords/units/black-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-monk-run': { key: 'unit-black-monk-run', path: 'assets/source/tiny-swords/units/black-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-black-monk-heal': { key: 'unit-black-monk-heal', path: 'assets/source/tiny-swords/units/black-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-black-monk-heal-effect': { key: 'unit-black-monk-heal-effect', path: 'assets/source/tiny-swords/units/black-units/monk/heal-effect.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-black-pawn-idle': { key: 'unit-black-pawn-idle', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-pawn-run': { key: 'unit-black-pawn-run', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Purple
    'unit-purple-warrior-idle': { key: 'unit-purple-warrior-idle', path: 'assets/source/tiny-swords/units/purple-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-warrior-run': { key: 'unit-purple-warrior-run', path: 'assets/source/tiny-swords/units/purple-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-warrior-attack1': { key: 'unit-purple-warrior-attack1', path: 'assets/source/tiny-swords/units/purple-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-purple-warrior-attack2': { key: 'unit-purple-warrior-attack2', path: 'assets/source/tiny-swords/units/purple-units/warrior/warrior-attack2.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-purple-warrior-guard': { key: 'unit-purple-warrior-guard', path: 'assets/source/tiny-swords/units/purple-units/warrior/warrior-guard.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-archer-idle': { key: 'unit-purple-archer-idle', path: 'assets/source/tiny-swords/units/purple-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-archer-run': { key: 'unit-purple-archer-run', path: 'assets/source/tiny-swords/units/purple-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-purple-archer-shoot': { key: 'unit-purple-archer-shoot', path: 'assets/source/tiny-swords/units/purple-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-lancer-idle': { key: 'unit-purple-lancer-idle', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-purple-lancer-run': { key: 'unit-purple-lancer-run', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-purple-lancer-right-attack': { key: 'unit-purple-lancer-right-attack', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-purple-lancer-down-attack': { key: 'unit-purple-lancer-down-attack', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-purple-lancer-up-attack': { key: 'unit-purple-lancer-up-attack', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-purple-lancer-defend-down': { key: 'unit-purple-lancer-defend-down', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-down-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-purple-lancer-defend-downright': { key: 'unit-purple-lancer-defend-downright', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-downright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-purple-lancer-defend-right': { key: 'unit-purple-lancer-defend-right', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-right-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-purple-lancer-defend-upright': { key: 'unit-purple-lancer-defend-upright', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-upright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-purple-lancer-defend-up': { key: 'unit-purple-lancer-defend-up', path: 'assets/source/tiny-swords/units/purple-units/lancer/lancer-up-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-purple-monk-idle': { key: 'unit-purple-monk-idle', path: 'assets/source/tiny-swords/units/purple-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-monk-run': { key: 'unit-purple-monk-run', path: 'assets/source/tiny-swords/units/purple-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-purple-monk-heal': { key: 'unit-purple-monk-heal', path: 'assets/source/tiny-swords/units/purple-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-purple-monk-heal-effect': { key: 'unit-purple-monk-heal-effect', path: 'assets/source/tiny-swords/units/purple-units/monk/heal-effect.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-purple-pawn-idle': { key: 'unit-purple-pawn-idle', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-pawn-run': { key: 'unit-purple-pawn-run', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    // Yellow
    'unit-yellow-warrior-idle': { key: 'unit-yellow-warrior-idle', path: 'assets/source/tiny-swords/units/yellow-units/warrior/warrior-idle.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-warrior-run': { key: 'unit-yellow-warrior-run', path: 'assets/source/tiny-swords/units/yellow-units/warrior/warrior-run.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-warrior-attack1': { key: 'unit-yellow-warrior-attack1', path: 'assets/source/tiny-swords/units/yellow-units/warrior/warrior-attack1.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-yellow-warrior-attack2': { key: 'unit-yellow-warrior-attack2', path: 'assets/source/tiny-swords/units/yellow-units/warrior/warrior-attack2.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-yellow-warrior-guard': { key: 'unit-yellow-warrior-guard', path: 'assets/source/tiny-swords/units/yellow-units/warrior/warrior-guard.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-archer-idle': { key: 'unit-yellow-archer-idle', path: 'assets/source/tiny-swords/units/yellow-units/archer/archer-idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-archer-run': { key: 'unit-yellow-archer-run', path: 'assets/source/tiny-swords/units/yellow-units/archer/archer-run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-yellow-archer-shoot': { key: 'unit-yellow-archer-shoot', path: 'assets/source/tiny-swords/units/yellow-units/archer/archer-shoot.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-lancer-idle': { key: 'unit-yellow-lancer-idle', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-idle.png', frameWidth: 320, frameHeight: 320, frames: 12 },
    'unit-yellow-lancer-run': { key: 'unit-yellow-lancer-run', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-run.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-yellow-lancer-right-attack': { key: 'unit-yellow-lancer-right-attack', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-right-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-yellow-lancer-down-attack': { key: 'unit-yellow-lancer-down-attack', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-down-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-yellow-lancer-up-attack': { key: 'unit-yellow-lancer-up-attack', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-up-attack.png', frameWidth: 320, frameHeight: 320, frames: 3 },
    'unit-yellow-lancer-defend-down': { key: 'unit-yellow-lancer-defend-down', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-down-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-yellow-lancer-defend-downright': { key: 'unit-yellow-lancer-defend-downright', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-downright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-yellow-lancer-defend-right': { key: 'unit-yellow-lancer-defend-right', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-right-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-yellow-lancer-defend-upright': { key: 'unit-yellow-lancer-defend-upright', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-upright-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-yellow-lancer-defend-up': { key: 'unit-yellow-lancer-defend-up', path: 'assets/source/tiny-swords/units/yellow-units/lancer/lancer-up-defence.png', frameWidth: 320, frameHeight: 320, frames: 6 },
    'unit-yellow-monk-idle': { key: 'unit-yellow-monk-idle', path: 'assets/source/tiny-swords/units/yellow-units/monk/idle.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-monk-run': { key: 'unit-yellow-monk-run', path: 'assets/source/tiny-swords/units/yellow-units/monk/run.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    'unit-yellow-monk-heal': { key: 'unit-yellow-monk-heal', path: 'assets/source/tiny-swords/units/yellow-units/monk/heal.png', frameWidth: 192, frameHeight: 192, frames: 11 },
    'unit-yellow-monk-heal-effect': { key: 'unit-yellow-monk-heal-effect', path: 'assets/source/tiny-swords/units/yellow-units/monk/heal-effect.png', frameWidth: 192, frameHeight: 192, frames: 11 },
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
    // Red pawn tools
    'unit-red-pawn-idle-axe': { key: 'unit-red-pawn-idle-axe', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-axe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run-axe': { key: 'unit-red-pawn-run-axe', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-pawn-idle-hammer': { key: 'unit-red-pawn-idle-hammer', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-hammer.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run-hammer': { key: 'unit-red-pawn-run-hammer', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run-hammer.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-pawn-idle-pickaxe': { key: 'unit-red-pawn-idle-pickaxe', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run-pickaxe': { key: 'unit-red-pawn-run-pickaxe', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-pawn-idle-gold': { key: 'unit-red-pawn-idle-gold', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-gold.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run-gold': { key: 'unit-red-pawn-run-gold', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run-gold.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-pawn-idle-wood': { key: 'unit-red-pawn-idle-wood', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-wood.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run-wood': { key: 'unit-red-pawn-run-wood', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run-wood.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-pawn-idle-meat': { key: 'unit-red-pawn-idle-meat', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-meat.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run-meat': { key: 'unit-red-pawn-run-meat', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run-meat.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-pawn-idle-knife': { key: 'unit-red-pawn-idle-knife', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-idle-knife.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-red-pawn-run-knife': { key: 'unit-red-pawn-run-knife', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-run-knife.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-pawn-interact-axe': { key: 'unit-red-pawn-interact-axe', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-interact-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-pawn-interact-hammer': { key: 'unit-red-pawn-interact-hammer', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-interact-hammer.png', frameWidth: 192, frameHeight: 192, frames: 3 },
    'unit-red-pawn-interact-pickaxe': { key: 'unit-red-pawn-interact-pickaxe', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-interact-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-red-pawn-interact-knife': { key: 'unit-red-pawn-interact-knife', path: 'assets/source/tiny-swords/units/red-units/pawn/pawn-interact-knife.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    // Black pawn tools
    'unit-black-pawn-idle-axe': { key: 'unit-black-pawn-idle-axe', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-axe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-pawn-run-axe': { key: 'unit-black-pawn-run-axe', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-run-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-pawn-idle-hammer': { key: 'unit-black-pawn-idle-hammer', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-hammer.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-pawn-run-hammer': { key: 'unit-black-pawn-run-hammer', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-run-hammer.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-pawn-idle-pickaxe': { key: 'unit-black-pawn-idle-pickaxe', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-pawn-run-pickaxe': { key: 'unit-black-pawn-run-pickaxe', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-run-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-pawn-idle-gold': { key: 'unit-black-pawn-idle-gold', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-gold.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-pawn-run-gold': { key: 'unit-black-pawn-run-gold', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-run-gold.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-pawn-idle-wood': { key: 'unit-black-pawn-idle-wood', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-wood.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-pawn-run-wood': { key: 'unit-black-pawn-run-wood', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-run-wood.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-pawn-idle-meat': { key: 'unit-black-pawn-idle-meat', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-meat.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-pawn-run-meat': { key: 'unit-black-pawn-run-meat', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-run-meat.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-pawn-idle-knife': { key: 'unit-black-pawn-idle-knife', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-idle-knife.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-black-pawn-run-knife': { key: 'unit-black-pawn-run-knife', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-run-knife.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-pawn-interact-axe': { key: 'unit-black-pawn-interact-axe', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-interact-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-pawn-interact-hammer': { key: 'unit-black-pawn-interact-hammer', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-interact-hammer.png', frameWidth: 192, frameHeight: 192, frames: 3 },
    'unit-black-pawn-interact-pickaxe': { key: 'unit-black-pawn-interact-pickaxe', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-interact-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-black-pawn-interact-knife': { key: 'unit-black-pawn-interact-knife', path: 'assets/source/tiny-swords/units/black-units/pawn/pawn-interact-knife.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    // Purple pawn tools
    'unit-purple-pawn-idle-axe': { key: 'unit-purple-pawn-idle-axe', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-axe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-pawn-run-axe': { key: 'unit-purple-pawn-run-axe', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-pawn-idle-hammer': { key: 'unit-purple-pawn-idle-hammer', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-hammer.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-pawn-run-hammer': { key: 'unit-purple-pawn-run-hammer', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-hammer.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-pawn-idle-pickaxe': { key: 'unit-purple-pawn-idle-pickaxe', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-pawn-run-pickaxe': { key: 'unit-purple-pawn-run-pickaxe', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-pawn-idle-gold': { key: 'unit-purple-pawn-idle-gold', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-gold.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-pawn-run-gold': { key: 'unit-purple-pawn-run-gold', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-gold.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-pawn-idle-wood': { key: 'unit-purple-pawn-idle-wood', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-wood.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-pawn-run-wood': { key: 'unit-purple-pawn-run-wood', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-wood.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-pawn-idle-meat': { key: 'unit-purple-pawn-idle-meat', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-meat.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-pawn-run-meat': { key: 'unit-purple-pawn-run-meat', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-meat.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-pawn-idle-knife': { key: 'unit-purple-pawn-idle-knife', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-idle-knife.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-purple-pawn-run-knife': { key: 'unit-purple-pawn-run-knife', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-run-knife.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-pawn-interact-axe': { key: 'unit-purple-pawn-interact-axe', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-interact-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-pawn-interact-hammer': { key: 'unit-purple-pawn-interact-hammer', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-interact-hammer.png', frameWidth: 192, frameHeight: 192, frames: 3 },
    'unit-purple-pawn-interact-pickaxe': { key: 'unit-purple-pawn-interact-pickaxe', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-interact-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-purple-pawn-interact-knife': { key: 'unit-purple-pawn-interact-knife', path: 'assets/source/tiny-swords/units/purple-units/pawn/pawn-interact-knife.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    // Yellow pawn tools
    'unit-yellow-pawn-idle-axe': { key: 'unit-yellow-pawn-idle-axe', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-axe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-pawn-run-axe': { key: 'unit-yellow-pawn-run-axe', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-pawn-idle-hammer': { key: 'unit-yellow-pawn-idle-hammer', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-hammer.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-pawn-run-hammer': { key: 'unit-yellow-pawn-run-hammer', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-hammer.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-pawn-idle-pickaxe': { key: 'unit-yellow-pawn-idle-pickaxe', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-pawn-run-pickaxe': { key: 'unit-yellow-pawn-run-pickaxe', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-pawn-idle-gold': { key: 'unit-yellow-pawn-idle-gold', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-gold.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-pawn-run-gold': { key: 'unit-yellow-pawn-run-gold', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-gold.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-pawn-idle-wood': { key: 'unit-yellow-pawn-idle-wood', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-wood.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-pawn-run-wood': { key: 'unit-yellow-pawn-run-wood', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-wood.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-pawn-idle-meat': { key: 'unit-yellow-pawn-idle-meat', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-meat.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-pawn-run-meat': { key: 'unit-yellow-pawn-run-meat', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-meat.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-pawn-idle-knife': { key: 'unit-yellow-pawn-idle-knife', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-idle-knife.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'unit-yellow-pawn-run-knife': { key: 'unit-yellow-pawn-run-knife', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-run-knife.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-pawn-interact-axe': { key: 'unit-yellow-pawn-interact-axe', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-interact-axe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-pawn-interact-hammer': { key: 'unit-yellow-pawn-interact-hammer', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-interact-hammer.png', frameWidth: 192, frameHeight: 192, frames: 3 },
    'unit-yellow-pawn-interact-pickaxe': { key: 'unit-yellow-pawn-interact-pickaxe', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-interact-pickaxe.png', frameWidth: 192, frameHeight: 192, frames: 6 },
    'unit-yellow-pawn-interact-knife': { key: 'unit-yellow-pawn-interact-knife', path: 'assets/source/tiny-swords/units/yellow-units/pawn/pawn-interact-knife.png', frameWidth: 192, frameHeight: 192, frames: 4 },
    // Particles
    'particle-fire-01': { key: 'particle-fire-01', path: 'assets/source/tiny-swords/particle-fx/fire-01.png', frameWidth: 64, frameHeight: 64, frames: 8 },
    'particle-fire-02': { key: 'particle-fire-02', path: 'assets/source/tiny-swords/particle-fx/fire-02.png', frameWidth: 64, frameHeight: 64, frames: 10 },
    'particle-fire-03': { key: 'particle-fire-03', path: 'assets/source/tiny-swords/particle-fx/fire-03.png', frameWidth: 64, frameHeight: 64, frames: 12 },
    'particle-dust-01': { key: 'particle-dust-01', path: 'assets/source/tiny-swords/particle-fx/dust-01.png', frameWidth: 64, frameHeight: 64, frames: 8 },
    'particle-dust-02': { key: 'particle-dust-02', path: 'assets/source/tiny-swords/particle-fx/dust-02.png', frameWidth: 64, frameHeight: 64, frames: 10 },
    'particle-explosion-01': { key: 'particle-explosion-01', path: 'assets/source/tiny-swords/particle-fx/explosion-01.png', frameWidth: 192, frameHeight: 192, frames: 8 },
    'particle-explosion-02': { key: 'particle-explosion-02', path: 'assets/source/tiny-swords/particle-fx/explosion-02.png', frameWidth: 192, frameHeight: 192, frames: 10 },
    'particle-water-splash': { key: 'particle-water-splash', path: 'assets/source/tiny-swords/particle-fx/water-splash.png', frameWidth: 192, frameHeight: 192, frames: 9 },
    // Gold highlights
    'gold-resource-highlight': { key: 'gold-resource-highlight', path: 'assets/source/tiny-swords/terrain/resources/gold/gold-resource/gold-resource-highlight.png', frameWidth: 128, frameHeight: 128, frames: 6 },
    'gold-stone-1-highlight': { key: 'gold-stone-1-highlight', path: 'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-1-highlight.png', frameWidth: 128, frameHeight: 128, frames: 6 },
    'gold-stone-2-highlight': { key: 'gold-stone-2-highlight', path: 'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-2-highlight.png', frameWidth: 128, frameHeight: 128, frames: 6 },
    'gold-stone-3-highlight': { key: 'gold-stone-3-highlight', path: 'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-3-highlight.png', frameWidth: 128, frameHeight: 128, frames: 6 },
    'gold-stone-4-highlight': { key: 'gold-stone-4-highlight', path: 'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-4-highlight.png', frameWidth: 128, frameHeight: 128, frames: 6 },
    'gold-stone-5-highlight': { key: 'gold-stone-5-highlight', path: 'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-5-highlight.png', frameWidth: 128, frameHeight: 128, frames: 6 },
    'gold-stone-6-highlight': { key: 'gold-stone-6-highlight', path: 'assets/source/tiny-swords/terrain/resources/gold/gold-stones/gold-stone-6-highlight.png', frameWidth: 128, frameHeight: 128, frames: 6 },
  };
  return map[key] || null;
}
