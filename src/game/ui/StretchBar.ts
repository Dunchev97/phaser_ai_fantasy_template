import Phaser from 'phaser';

/**
 * StretchBar - horizontal 3-slice bar for pixel-art UI assets.
 *
 * Tiny Swords bar base frames contain separated left/center/right pieces in
 * one frame. The fill frames are short horizontal fill segments. This helper
 * crops those source pieces and stretches only the center/fill area.
 */

type BarSegment = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type BarLayout = {
  left: BarSegment;
  center: BarSegment;
  right: BarSegment;
  fill?: BarSegment;
};

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
  /** Width of the left decorative cap in destination pixels. */
  leftWidth: number;
  /** Width of the right decorative cap in destination pixels. */
  rightWidth: number;
  /** Full reserved bar height in game pixels. Defaults to 64 for Tiny Swords bars. */
  height?: number;
  /** Kept for compatibility. Tiny Swords center pieces are stretched. */
  centerMode?: 'repeat' | 'stretch';
  /** Explicit crop layout for separated bar pieces. */
  layout?: BarLayout;
};

export type StretchBarResult = {
  container: Phaser.GameObjects.Container;
  base: Phaser.GameObjects.Image[];
  fill?: Phaser.GameObjects.Image;
  /** Update fill width to a new ratio 0..1. */
  setFillRatio: (ratio: number) => void;
};

const SEAM_OVERLAP = 1;
const SOURCE_INSET = 1;

const TINY_SWORDS_BAR_LAYOUTS: Record<string, BarLayout> = {
  'ui/bigbar-base.png': {
    left: { x: 40, y: 9, width: 24, height: 51 },
    center: { x: 128, y: 9, width: 64, height: 51 },
    right: { x: 256, y: 9, width: 24, height: 51 },
    fill: { x: 0, y: 20, width: 64, height: 24 },
  },
  'ui/smallbar-base.png': {
    left: { x: 49, y: 22, width: 15, height: 19 },
    center: { x: 128, y: 22, width: 64, height: 19 },
    right: { x: 256, y: 22, width: 15, height: 19 },
    fill: { x: 0, y: 30, width: 64, height: 3 },
  },
};

const TINY_SWORDS_FILL_LAYOUTS: Record<string, BarSegment> = {
  'ui/bigbar-fill.png': { x: 0, y: 20, width: 64, height: 24 },
  'ui/smallbar-fill.png': { x: 0, y: 30, width: 64, height: 3 },
};

function fallbackLayout(
  scene: Phaser.Scene,
  atlasKey: string,
  frame: string,
  leftWidth: number,
  rightWidth: number,
  height: number,
): BarLayout {
  const textureFrame = scene.textures.getFrame(atlasKey, frame);
  const frameWidth = textureFrame?.width ?? leftWidth + rightWidth + 1;
  const frameHeight = textureFrame?.height ?? height;
  const centerWidth = Math.max(1, frameWidth - leftWidth - rightWidth);

  return {
    left: { x: 0, y: 0, width: leftWidth, height: frameHeight },
    center: { x: leftWidth, y: 0, width: centerWidth, height: frameHeight },
    right: { x: Math.max(leftWidth, frameWidth - rightWidth), y: 0, width: rightWidth, height: frameHeight },
  };
}

function addCroppedImage(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  atlasKey: string,
  frame: string,
  source: BarSegment,
  dest: { x: number; y: number; width: number; height: number },
): Phaser.GameObjects.Image | undefined {
  if (source.width <= 0 || source.height <= 0 || dest.width <= 0 || dest.height <= 0) {
    return undefined;
  }

  const scaleX = dest.width / source.width;
  const scaleY = dest.height / source.height;
  const image = scene.add.image(dest.x - source.x * scaleX, dest.y - source.y * scaleY, atlasKey, frame);
  image.setOrigin(0, 0);
  image.setCrop(source.x, source.y, source.width, source.height);
  image.setScale(scaleX, scaleY);
  container.add(image);
  return image;
}

function insetSegment(segment: BarSegment, inset: { left?: number; right?: number }): BarSegment {
  const left = inset.left ?? 0;
  const right = inset.right ?? 0;

  return {
    ...segment,
    x: segment.x + left,
    width: Math.max(1, segment.width - left - right),
  };
}

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
  const layout =
    options.layout ?? TINY_SWORDS_BAR_LAYOUTS[baseFrame] ?? fallbackLayout(scene, atlasKey, baseFrame, leftWidth, rightWidth, height);
  const visibleHeight = layout.center.height;
  const visibleY = -height / 2 + layout.center.y;
  const centerWidth = Math.max(0, width - leftWidth - rightWidth);
  const base: Phaser.GameObjects.Image[] = [];
  const leftDestWidth = leftWidth + SEAM_OVERLAP;
  const centerDestWidth = Math.max(0, centerWidth + SEAM_OVERLAP * 2);
  const rightDestWidth = rightWidth + SEAM_OVERLAP;

  const left = addCroppedImage(scene, container, atlasKey, baseFrame, layout.left, {
    x: -width / 2,
    y: visibleY,
    width: leftDestWidth,
    height: visibleHeight,
  });
  const center = addCroppedImage(scene, container, atlasKey, baseFrame, insetSegment(layout.center, { left: SOURCE_INSET, right: SOURCE_INSET }), {
    x: -width / 2 + leftWidth - SEAM_OVERLAP,
    y: visibleY,
    width: centerDestWidth,
    height: visibleHeight,
  });
  const right = addCroppedImage(scene, container, atlasKey, baseFrame, layout.right, {
    x: width / 2 - rightWidth - SEAM_OVERLAP,
    y: visibleY,
    width: rightDestWidth,
    height: visibleHeight,
  });
  if (left) base.push(left);
  if (center) base.push(center);
  if (right) base.push(right);

  let fill: Phaser.GameObjects.Image | undefined;
  const fillSource = fillFrame ? TINY_SWORDS_FILL_LAYOUTS[fillFrame] ?? layout.fill : undefined;
  const fillX = -width / 2 + leftWidth;
  const fillMaxWidth = Math.max(0, width - leftWidth - rightWidth);
  const fillScale = fillSource ? visibleHeight / layout.center.height : 1;
  const fillHeight = fillSource ? fillSource.height * fillScale : 0;
  const fillY = fillSource ? visibleY + (visibleHeight - fillHeight) / 2 : visibleY;

  const setFillRatio = (ratio: number) => {
    if (!fill) return;
    const clamped = Math.max(0, Math.min(1, ratio));
    const fillWidth = fillMaxWidth * clamped;
    const scaleX = fillSource ? fillWidth / fillSource.width : 1;
    const scaleY = fillSource ? fillHeight / fillSource.height : 1;
    fill.setVisible(clamped > 0);
    fill.setScale(scaleX, scaleY);
    if (fillSource) {
      fill.setPosition(fillX - fillSource.x * scaleX, fillY - fillSource.y * scaleY);
    }
  };

  if (fillFrame && fillSource) {
    fill = addCroppedImage(scene, container, atlasKey, fillFrame, fillSource, {
      x: fillX,
      y: fillY,
      width: fillMaxWidth,
      height: fillHeight,
    });

    const initialRatio =
      maxValue && maxValue > 0 ? Math.max(0, Math.min(1, (value ?? maxValue) / maxValue)) : 1;
    setFillRatio(initialRatio);
  }

  scene.add.existing(container);

  return { container, base, fill, setFillRatio };
}
