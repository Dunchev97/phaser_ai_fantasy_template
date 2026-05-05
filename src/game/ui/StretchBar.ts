import Phaser from 'phaser';

/**
 * StretchBar — horizontal 3-slice bar for pixel-art UI assets.
 *
 * Use this for: health bars, stamina bars, progress bars, resource bars.
 * Do NOT use setScale on decorative bar frames — it distorts pixel-art edges.
 *
 * How it works:
 * - Left/right caps keep their original decorative edges.
 * - Center is stretched (or repeated) to fill the requested width.
 * - If fillFrame is provided, a second bar is drawn on top with fillRatio.
 */

export type StretchBarOptions = {
  x: number;
  y: number;
  /** Total bar width in game pixels. */
  width: number;
  atlasKey: string;
  /** Base frame (e.g. TinySwordsUIFrames.BigBarBase). */
  baseFrame: string;
  /** Optional fill frame drawn on top (e.g. TinySwordsUIFrames.BigBarFill). */
  fillFrame?: string;
  /** Current value (ignored if fillFrame not set). */
  value?: number;
  /** Max value (ignored if fillFrame not set). Defaults to 1. */
  maxValue?: number;
  /** Width of the left decorative cap in source pixels. */
  leftWidth: number;
  /** Width of the right decorative cap in source pixels. */
  rightWidth: number;
  /** Source frame height (default 64 for Tiny Swords bars). */
  height?: number;
  /** 'stretch' = scale center (acceptable for smooth gradients).
   *  'repeat'  = tile center (better for pixel-art patterns).
   *  Default: 'stretch' because Phaser NineSlice uses stretch internally. */
  centerMode?: 'repeat' | 'stretch';
};

export type StretchBarResult = {
  container: Phaser.GameObjects.Container;
  base: Phaser.GameObjects.NineSlice;
  fill?: Phaser.GameObjects.NineSlice;
  /** Update fill width to a new ratio 0..1. */
  setFillRatio: (ratio: number) => void;
};

export function createStretchBar(
  scene: Phaser.Scene,
  options: StretchBarOptions,
): StretchBarResult {
  const {
    x,
    y,
    width,
    atlasKey,
    baseFrame,
    fillFrame,
    value,
    maxValue,
    leftWidth,
    rightWidth,
    height = 64,
  } = options;

  const container = scene.add.container(x, y);

  // Base bar — horizontal 3-slice via NineSlice (top/bottom = 0)
  const base = scene.add.nineslice(
    0,
    0,
    atlasKey,
    baseFrame,
    width,
    height,
    leftWidth,
    rightWidth,
    0,
    0,
  );
  base.setOrigin(0.5, 0.5);
  container.add(base);

  let fill: Phaser.GameObjects.NineSlice | undefined;

  const setFillRatio = (ratio: number) => {
    if (!fill) return;
    const clamped = Math.max(0, Math.min(1, ratio));
    const minFillWidth = leftWidth + rightWidth;
    const newWidth = Math.max(minFillWidth, width * clamped);
    fill.setSize(newWidth, height);
    // Keep fill left-aligned inside the bar
    fill.setPosition(-width / 2 + newWidth / 2, 0);
  };

  if (fillFrame) {
    const initialRatio =
      maxValue && maxValue > 0 ? Math.max(0, Math.min(1, (value ?? maxValue) / maxValue)) : 1;
    const fillWidth = Math.max(leftWidth + rightWidth, width * initialRatio);

    fill = scene.add.nineslice(
      0,
      0,
      atlasKey,
      fillFrame,
      fillWidth,
      height,
      leftWidth,
      rightWidth,
      0,
      0,
    );
    fill.setOrigin(0.5, 0.5);
    fill.setPosition(-width / 2 + fillWidth / 2, 0);
    container.add(fill);
  }

  scene.add.existing(container);

  return { container, base, fill, setFillRatio };
}
