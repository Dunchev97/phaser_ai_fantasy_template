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
        GAME_HEIGHT - 118,
        'Подключенные Ассеты',
        {
          fontSize: '22px',
          color: '#f4e9ff',
          fontStyle: 'bold',
          align: 'center',
          wordWrap: { width: 900 },
        },
      )
      .setOrigin(0.5);

    const assetsLink = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 82,
        'Tiny Swords by Pixel Frog',
        {
          fontSize: '18px',
          color: '#8fc7ff',
          align: 'center',
        },
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    assetsLink.on('pointerover', () => assetsLink.setStyle({ color: '#b9dcff' }));
    assetsLink.on('pointerout', () => assetsLink.setStyle({ color: '#8fc7ff' }));
    assetsLink.on('pointerdown', () => {
      window.open('https://pixelfrog-assets.itch.io/tiny-swords', '_blank', 'noopener');
    });
  }
}
