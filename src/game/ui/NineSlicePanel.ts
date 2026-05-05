import Phaser from 'phaser';

/**
 * NineSlicePanel — decorative panel/frame using Phaser NineSlice.
 *
 * Use this for: windows, tooltips, dialogue boxes, shop panels, menu backgrounds.
 * Do NOT use setScale on decorative UI panels — it distorts pixel-art corners and edges.
 *
 * How it works:
 * - Corners keep their original decorative pixels.
 * - Edges stretch horizontally (top/bottom) or vertically (left/right).
 * - Center stretches to fill the remaining area.
 *
 * This relies on Phaser.GameObjects.NineSlice which requires the texture
 * to have enough source size to cover the requested width/height.
 */

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
  /** Left decorative margin in source pixels. */
  left: number;
  /** Right decorative margin in source pixels. */
  right: number;
  /** Top decorative margin in source pixels. */
  top: number;
  /** Bottom decorative margin in source pixels. */
  bottom: number;
};

export type NineSlicePanelResult = {
  container: Phaser.GameObjects.Container;
  /** The actual NineSlice game object. */
  panel: Phaser.GameObjects.NineSlice;
};

export function createNineSlicePanel(
  scene: Phaser.Scene,
  options: NineSlicePanelOptions,
): NineSlicePanelResult {
  const { x, y, width, height, atlasKey, frame, left, right, top, bottom } = options;

  const container = scene.add.container(x, y);

  const panel = scene.add.nineslice(
    0,
    0,
    atlasKey,
    frame,
    width,
    height,
    left,
    right,
    top,
    bottom,
  );
  panel.setOrigin(0.5, 0.5);
  container.add(panel);

  scene.add.existing(container);

  return { container, panel };
}
