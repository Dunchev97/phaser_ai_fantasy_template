import Phaser from 'phaser';
import { GeneratedAssetPacks } from '../../content/generatedAssetKeys';

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
  }

  create(): void {
    this.scene.start('MainMenuScene');
  }
}
