/**
 * Baseline display scales for Tiny Swords world objects in the 1280x720 prototype scenes.
 *
 * Tiny Swords source sheets already include padding and relative sizing.
 * Default world sprites/images should normally render at scale 1. Adjust
 * per-object only for deliberate composition, camera zoom, or gameplay needs.
 */
export const TinySwordsWorldScale = {
  Terrain: 2,
  Sprite: 1,
  SmallBuilding: 1,
  TallBuilding: 1,
  LargeBuilding: 1,
  Resource: 1,
  TreeLarge: 1,
  TreeSmall: 1,
  Bush: 1,
  Unit: 1,
  LargeUnit: 1,
  Animal: 1,
  WaterFoam: 1,
  WaterRock: 2,
} as const;
