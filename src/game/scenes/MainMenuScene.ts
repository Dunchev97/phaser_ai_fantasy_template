import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, 170, 'Fantasy Prototype Template', {
        fontSize: '48px',
        color: '#f4e9ff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        240,
        'A clean starter for AI-assisted Phaser prototypes',
        {
          fontSize: '22px',
          color: '#c8a6ff',
        },
      )
      .setOrigin(0.5);

    const start = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Start Prototype', {
        fontSize: '30px',
        color: '#ffffff',
        backgroundColor: '#6b2fbf',
        padding: { x: 28, y: 16 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    start.on('pointerover', () => start.setStyle({ backgroundColor: '#7f3fe0' }));
    start.on('pointerout', () => start.setStyle({ backgroundColor: '#6b2fbf' }));
    start.on('pointerdown', () => this.scene.start('GameScene'));

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 90,
        'Add sprite sheets to public/assets/source/spritesheets, run npm run build:atlas, then ask an agent to build an MVP.',
        {
          fontSize: '18px',
          color: '#9b86b8',
          align: 'center',
          wordWrap: { width: 900 },
        },
      )
      .setOrigin(0.5);
  }
}
