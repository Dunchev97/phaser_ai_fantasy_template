import Phaser from 'phaser';

type IconButtonOptions = {
  x: number;
  y: number;
  label?: string;
  atlas?: string;
  frame?: string;
  size?: number;
  onClick: () => void;
};

export class IconButton extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, options: IconButtonOptions) {
    super(scene, options.x, options.y);

    const size = options.size ?? 72;

    const bg = scene.add.graphics();
    bg.fillStyle(0x2a143f, 0.95);
    bg.lineStyle(2, 0x8a53d6, 1);
    bg.fillRoundedRect(-size / 2, -size / 2, size, size, 12);
    bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 12);
    this.add(bg);

    if (options.atlas && options.frame) {
      const icon = scene.add.image(0, -6, options.atlas, options.frame);
      icon.setDisplaySize(size * 0.56, size * 0.56);
      this.add(icon);
    } else {
      const placeholder = scene.add.circle(0, -6, size * 0.22, 0x8a53d6, 1);
      this.add(placeholder);
    }

    if (options.label) {
      const label = scene.add
        .text(0, size / 2 + 10, options.label, {
          fontSize: '14px',
          color: '#f4e9ff',
        })
        .setOrigin(0.5);
      this.add(label);
    }

    this.setSize(size, size);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size),
      Phaser.Geom.Rectangle.Contains,
    );
    this.on('pointerdown', options.onClick);

    scene.add.existing(this);
  }
}
