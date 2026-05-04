import Phaser from 'phaser';

type PanelOptions = {
  fillColor?: number;
  strokeColor?: number;
  alpha?: number;
  radius?: number;
};

export class Panel extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    options: PanelOptions = {},
  ) {
    super(scene, x, y);

    const fillColor = options.fillColor ?? 0x241233;
    const strokeColor = options.strokeColor ?? 0x7b45c9;
    const alpha = options.alpha ?? 0.9;
    const radius = options.radius ?? 14;

    this.background = scene.add.graphics();
    this.background.fillStyle(fillColor, alpha);
    this.background.lineStyle(2, strokeColor, 1);
    this.background.fillRoundedRect(0, 0, width, height, radius);
    this.background.strokeRoundedRect(0, 0, width, height, radius);

    this.add(this.background);
    scene.add.existing(this);
  }
}
