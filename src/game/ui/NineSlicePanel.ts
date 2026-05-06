import Phaser from 'phaser';

/**
 * NineSlicePanel - decorative panel/frame built from Tiny Swords 3x3 frames.
 *
 * Tiny Swords paper/table frames already contain the nine pieces with
 * transparent gaps between them, so Phaser's native NineSlice cannot stretch
 * the full frame cleanly. This helper crops the pieces manually.
 */

type SourceSegment = {
  x: number;
  width: number;
};

type SourceRow = {
  y: number;
  height: number;
};

export type NineSlicePanelLayout = {
  columns: [SourceSegment, SourceSegment, SourceSegment];
  rows: [SourceRow, SourceRow, SourceRow];
};

export type NineSlicePanelOptions = {
  x: number;
  y: number;
  /** Target panel width in game pixels. */
  width: number;
  /** Target panel height in game pixels. */
  height: number;
  atlasKey: string;
  /** Frame name from the atlas (e.g. TinySwordsUIFrames.PaperRegular). */
  frame: string;
  /** Left decorative margin in destination pixels. */
  left: number;
  /** Right decorative margin in destination pixels. */
  right: number;
  /** Top decorative margin in destination pixels. */
  top: number;
  /** Bottom decorative margin in destination pixels. */
  bottom: number;
  /** Explicit 3x3 crop layout for frames that contain separated pieces. */
  layout?: NineSlicePanelLayout;
};

export type NineSlicePanelResult = {
  container: Phaser.GameObjects.Container;
  pieces: Phaser.GameObjects.Image[];
};

const SEAM_OVERLAP = 1;
const SOURCE_INSET = 1;

const TINY_SWORDS_PANEL_LAYOUTS: Record<string, NineSlicePanelLayout> = {
  'ui/paper-regular.png': {
    columns: [
      { x: 12, width: 52 },
      { x: 128, width: 64 },
      { x: 256, width: 52 },
    ],
    rows: [
      { y: 20, height: 44 },
      { y: 128, height: 64 },
      { y: 256, height: 45 },
    ],
  },
  'ui/paper-special.png': {
    columns: [
      { x: 9, width: 55 },
      { x: 128, width: 64 },
      { x: 256, width: 55 },
    ],
    rows: [
      { y: 20, height: 44 },
      { y: 128, height: 64 },
      { y: 256, height: 43 },
    ],
  },
  'ui/table-wood.png': {
    columns: [
      { x: 44, width: 84 },
      { x: 192, width: 64 },
      { x: 320, width: 84 },
    ],
    rows: [
      { y: 43, height: 85 },
      { y: 192, height: 64 },
      { y: 320, height: 103 },
    ],
  },
};

function fallbackLayout(
  scene: Phaser.Scene,
  atlasKey: string,
  frame: string,
  left: number,
  right: number,
  top: number,
  bottom: number,
): NineSlicePanelLayout {
  const textureFrame = scene.textures.getFrame(atlasKey, frame);
  const frameWidth = textureFrame?.width ?? left + right + 1;
  const frameHeight = textureFrame?.height ?? top + bottom + 1;

  return {
    columns: [
      { x: 0, width: left },
      { x: left, width: Math.max(1, frameWidth - left - right) },
      { x: Math.max(left, frameWidth - right), width: right },
    ],
    rows: [
      { y: 0, height: top },
      { y: top, height: Math.max(1, frameHeight - top - bottom) },
      { y: Math.max(top, frameHeight - bottom), height: bottom },
    ],
  };
}

function addCroppedPiece(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  atlasKey: string,
  frame: string,
  source: { x: number; y: number; width: number; height: number },
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

function insetSource(
  source: { x: number; y: number; width: number; height: number },
  inset: { left?: number; right?: number; top?: number; bottom?: number },
): { x: number; y: number; width: number; height: number } {
  const left = inset.left ?? 0;
  const right = inset.right ?? 0;
  const top = inset.top ?? 0;
  const bottom = inset.bottom ?? 0;

  return {
    x: source.x + left,
    y: source.y + top,
    width: Math.max(1, source.width - left - right),
    height: Math.max(1, source.height - top - bottom),
  };
}

function overlapDest(
  dest: { x: number; y: number; width: number; height: number },
  overlap: { left?: number; right?: number; top?: number; bottom?: number },
): { x: number; y: number; width: number; height: number } {
  const left = overlap.left ?? 0;
  const right = overlap.right ?? 0;
  const top = overlap.top ?? 0;
  const bottom = overlap.bottom ?? 0;

  return {
    x: Math.round(dest.x - left),
    y: Math.round(dest.y - top),
    width: Math.round(dest.width + left + right),
    height: Math.round(dest.height + top + bottom),
  };
}

export function createNineSlicePanel(
  scene: Phaser.Scene,
  options: NineSlicePanelOptions,
): NineSlicePanelResult {
  const { x, y, width, height, atlasKey, frame, left, right, top, bottom } = options;

  const container = scene.add.container(x, y);
  const layout =
    options.layout ?? TINY_SWORDS_PANEL_LAYOUTS[frame] ?? fallbackLayout(scene, atlasKey, frame, left, right, top, bottom);
  const destColumns = [left, Math.max(0, width - left - right), right];
  const destRows = [top, Math.max(0, height - top - bottom), bottom];
  const destX = [-width / 2, -width / 2 + left, width / 2 - right];
  const destY = [-height / 2, -height / 2 + top, height / 2 - bottom];
  const pieces: Phaser.GameObjects.Image[] = [];

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const sourceColumn = layout.columns[col];
      const sourceRow = layout.rows[row];
      const isCenterColumn = col === 1;
      const isCenterRow = row === 1;
      const source = insetSource(
        {
          x: sourceColumn.x,
          y: sourceRow.y,
          width: sourceColumn.width,
          height: sourceRow.height,
        },
        {
          left: isCenterColumn ? SOURCE_INSET : 0,
          right: isCenterColumn ? SOURCE_INSET : 0,
          top: isCenterRow ? SOURCE_INSET : 0,
          bottom: isCenterRow ? SOURCE_INSET : 0,
        },
      );
      const dest = overlapDest(
        {
          x: destX[col],
          y: destY[row],
          width: destColumns[col],
          height: destRows[row],
        },
        {
          left: col > 0 ? SEAM_OVERLAP : 0,
          right: col < 2 ? SEAM_OVERLAP : 0,
          top: row > 0 ? SEAM_OVERLAP : 0,
          bottom: row < 2 ? SEAM_OVERLAP : 0,
        },
      );
      const piece = addCroppedPiece(
        scene,
        container,
        atlasKey,
        frame,
        source,
        dest,
      );
      if (piece) pieces.push(piece);
    }
  }

  scene.add.existing(container);

  return { container, pieces };
}
