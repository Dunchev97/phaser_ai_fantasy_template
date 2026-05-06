import Phaser from 'phaser';

type ResourceCounterOptions = {
  x: number;
  y: number;
  label: string;
  value: number;
  atlas?: string;
  frame?: string;
  labelColor?: string;
  valueColor?: string;
};

export class ResourceCounter extends Phaser.GameObjects.Container {
  private readonly valueText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, options: ResourceCounterOptions) {
    super(scene, options.x, options.y);

    if (options.atlas && options.frame) {
      const icon = scene.add.image(0, 0, options.atlas, options.frame);
      icon.setDisplaySize(34, 34);
      icon.setOrigin(0, 0.5);
      this.add(icon);
    } else {
      const placeholder = scene.add.circle(16, 0, 13, 0x8a53d6, 1);
      this.add(placeholder);
    }

    const labelText = scene.add.text(48, -13, `${options.label}:`, {
      fontSize: '20px',
      color: options.labelColor ?? '#cdb5ec',
    });
    this.add(labelText);

    this.valueText = scene.add.text(150, -13, String(options.value), {
      fontSize: '20px',
      color: options.valueColor ?? '#ffffff',
      fontStyle: 'bold',
    });
    this.add(this.valueText);

    scene.add.existing(this);
  }

  setValue(value: number): void {
    this.valueText.setText(String(value));
  }
}
