import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { Panel } from '../ui/Panel';
import { ResourceCounter } from '../ui/ResourceCounter';
import { createInitialPrototypeState } from '../../content/prototypeState';

export class GameScene extends Phaser.Scene {
  private state = createInitialPrototypeState();
  private goldCounter?: ResourceCounter;
  private essenceCounter?: ResourceCounter;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, 46, 'Prototype Sandbox', {
        fontSize: '34px',
        color: '#f4e9ff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    new Panel(this, 44, 100, 330, 190, {
      fillColor: 0x251139,
      strokeColor: 0x8a53d6,
      alpha: 0.88,
    });

    this.add.text(70, 124, 'Starter State', {
      fontSize: '24px',
      color: '#f4e9ff',
      fontStyle: 'bold',
    });

    this.goldCounter = new ResourceCounter(this, {
      x: 70,
      y: 172,
      label: 'Gold',
      value: this.state.resources.gold,
    });

    this.essenceCounter = new ResourceCounter(this, {
      x: 70,
      y: 224,
      label: 'Essence',
      value: this.state.resources.essence,
    });

    const actionButton = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Click: Gain Resources', {
        fontSize: '28px',
        color: '#ffffff',
        backgroundColor: '#5a249f',
        padding: { x: 28, y: 16 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    actionButton.on('pointerover', () => actionButton.setStyle({ backgroundColor: '#7432c8' }));
    actionButton.on('pointerout', () => actionButton.setStyle({ backgroundColor: '#5a249f' }));
    actionButton.on('pointerdown', () => this.gainStarterResources());

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 120,
        'This scene is intentionally simple. Ask an agent to replace it with a small playable MVP.',
        {
          fontSize: '20px',
          color: '#baa2d6',
          align: 'center',
          wordWrap: { width: 780 },
        },
      )
      .setOrigin(0.5);
  }

  private gainStarterResources(): void {
    this.state.resources.gold += 1;
    this.state.resources.essence += 1;
    this.goldCounter?.setValue(this.state.resources.gold);
    this.essenceCounter?.setValue(this.state.resources.essence);
  }
}
