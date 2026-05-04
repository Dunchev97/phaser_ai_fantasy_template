export interface UnitAnimationConfig {
  key: string;
  sheetKey: string;
  startFrame: number;
  endFrame: number;
  frameRate: number;
  repeat: number;
}

export const TinySwordsAnimations: UnitAnimationConfig[] = [
  // === Blue Allies (Player) ===
  { key: 'blue-warrior-idle', sheetKey: 'unit-blue-warrior-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'blue-warrior-run', sheetKey: 'unit-blue-warrior-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'blue-warrior-attack1', sheetKey: 'unit-blue-warrior-attack1', startFrame: 0, endFrame: 10, frameRate: 14, repeat: 0 },
  { key: 'blue-archer-idle', sheetKey: 'unit-blue-archer-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'blue-archer-run', sheetKey: 'unit-blue-archer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'blue-archer-shoot', sheetKey: 'unit-blue-archer-shoot', startFrame: 0, endFrame: 12, frameRate: 14, repeat: 0 },
  { key: 'blue-lancer-idle', sheetKey: 'unit-blue-lancer-idle', startFrame: 0, endFrame: 11, frameRate: 10, repeat: -1 },
  { key: 'blue-lancer-run', sheetKey: 'unit-blue-lancer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'blue-lancer-right-attack', sheetKey: 'unit-blue-lancer-right-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'blue-lancer-down-attack', sheetKey: 'unit-blue-lancer-down-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'blue-lancer-up-attack', sheetKey: 'unit-blue-lancer-up-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'blue-monk-idle', sheetKey: 'unit-blue-monk-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'blue-monk-run', sheetKey: 'unit-blue-monk-run', startFrame: 0, endFrame: 3, frameRate: 12, repeat: -1 },
  { key: 'blue-monk-heal', sheetKey: 'unit-blue-monk-heal', startFrame: 0, endFrame: 10, frameRate: 12, repeat: 0 },
  { key: 'blue-pawn-idle', sheetKey: 'unit-blue-pawn-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'blue-pawn-run', sheetKey: 'unit-blue-pawn-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },

  // === Red Enemies ===
  { key: 'red-warrior-idle', sheetKey: 'unit-red-warrior-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'red-warrior-run', sheetKey: 'unit-red-warrior-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'red-warrior-attack1', sheetKey: 'unit-red-warrior-attack1', startFrame: 0, endFrame: 10, frameRate: 14, repeat: 0 },
  { key: 'red-archer-idle', sheetKey: 'unit-red-archer-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'red-archer-run', sheetKey: 'unit-red-archer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'red-archer-shoot', sheetKey: 'unit-red-archer-shoot', startFrame: 0, endFrame: 12, frameRate: 14, repeat: 0 },
  { key: 'red-lancer-idle', sheetKey: 'unit-red-lancer-idle', startFrame: 0, endFrame: 11, frameRate: 10, repeat: -1 },
  { key: 'red-lancer-run', sheetKey: 'unit-red-lancer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'red-lancer-right-attack', sheetKey: 'unit-red-lancer-right-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'red-lancer-down-attack', sheetKey: 'unit-red-lancer-down-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'red-lancer-up-attack', sheetKey: 'unit-red-lancer-up-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'red-monk-idle', sheetKey: 'unit-red-monk-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'red-monk-run', sheetKey: 'unit-red-monk-run', startFrame: 0, endFrame: 3, frameRate: 12, repeat: -1 },
  { key: 'red-monk-heal', sheetKey: 'unit-red-monk-heal', startFrame: 0, endFrame: 10, frameRate: 12, repeat: 0 },
  { key: 'red-pawn-idle', sheetKey: 'unit-red-pawn-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'red-pawn-run', sheetKey: 'unit-red-pawn-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },

  // === Black ===
  { key: 'black-warrior-idle', sheetKey: 'unit-black-warrior-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'black-warrior-run', sheetKey: 'unit-black-warrior-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'black-warrior-attack1', sheetKey: 'unit-black-warrior-attack1', startFrame: 0, endFrame: 10, frameRate: 14, repeat: 0 },
  { key: 'black-archer-idle', sheetKey: 'unit-black-archer-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'black-archer-run', sheetKey: 'unit-black-archer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'black-archer-shoot', sheetKey: 'unit-black-archer-shoot', startFrame: 0, endFrame: 12, frameRate: 14, repeat: 0 },
  { key: 'black-lancer-idle', sheetKey: 'unit-black-lancer-idle', startFrame: 0, endFrame: 11, frameRate: 10, repeat: -1 },
  { key: 'black-lancer-run', sheetKey: 'unit-black-lancer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'black-lancer-right-attack', sheetKey: 'unit-black-lancer-right-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'black-lancer-down-attack', sheetKey: 'unit-black-lancer-down-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'black-lancer-up-attack', sheetKey: 'unit-black-lancer-up-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'black-monk-idle', sheetKey: 'unit-black-monk-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'black-monk-run', sheetKey: 'unit-black-monk-run', startFrame: 0, endFrame: 3, frameRate: 12, repeat: -1 },
  { key: 'black-monk-heal', sheetKey: 'unit-black-monk-heal', startFrame: 0, endFrame: 10, frameRate: 12, repeat: 0 },
  { key: 'black-pawn-idle', sheetKey: 'unit-black-pawn-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'black-pawn-run', sheetKey: 'unit-black-pawn-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },

  // === Purple ===
  { key: 'purple-warrior-idle', sheetKey: 'unit-purple-warrior-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'purple-warrior-run', sheetKey: 'unit-purple-warrior-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'purple-warrior-attack1', sheetKey: 'unit-purple-warrior-attack1', startFrame: 0, endFrame: 10, frameRate: 14, repeat: 0 },
  { key: 'purple-archer-idle', sheetKey: 'unit-purple-archer-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'purple-archer-run', sheetKey: 'unit-purple-archer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'purple-archer-shoot', sheetKey: 'unit-purple-archer-shoot', startFrame: 0, endFrame: 12, frameRate: 14, repeat: 0 },
  { key: 'purple-lancer-idle', sheetKey: 'unit-purple-lancer-idle', startFrame: 0, endFrame: 11, frameRate: 10, repeat: -1 },
  { key: 'purple-lancer-run', sheetKey: 'unit-purple-lancer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'purple-lancer-right-attack', sheetKey: 'unit-purple-lancer-right-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'purple-lancer-down-attack', sheetKey: 'unit-purple-lancer-down-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'purple-lancer-up-attack', sheetKey: 'unit-purple-lancer-up-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'purple-monk-idle', sheetKey: 'unit-purple-monk-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'purple-monk-run', sheetKey: 'unit-purple-monk-run', startFrame: 0, endFrame: 3, frameRate: 12, repeat: -1 },
  { key: 'purple-monk-heal', sheetKey: 'unit-purple-monk-heal', startFrame: 0, endFrame: 10, frameRate: 12, repeat: 0 },
  { key: 'purple-pawn-idle', sheetKey: 'unit-purple-pawn-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'purple-pawn-run', sheetKey: 'unit-purple-pawn-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },

  // === Yellow ===
  { key: 'yellow-warrior-idle', sheetKey: 'unit-yellow-warrior-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'yellow-warrior-run', sheetKey: 'unit-yellow-warrior-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'yellow-warrior-attack1', sheetKey: 'unit-yellow-warrior-attack1', startFrame: 0, endFrame: 10, frameRate: 14, repeat: 0 },
  { key: 'yellow-archer-idle', sheetKey: 'unit-yellow-archer-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'yellow-archer-run', sheetKey: 'unit-yellow-archer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'yellow-archer-shoot', sheetKey: 'unit-yellow-archer-shoot', startFrame: 0, endFrame: 12, frameRate: 14, repeat: 0 },
  { key: 'yellow-lancer-idle', sheetKey: 'unit-yellow-lancer-idle', startFrame: 0, endFrame: 11, frameRate: 10, repeat: -1 },
  { key: 'yellow-lancer-run', sheetKey: 'unit-yellow-lancer-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'yellow-lancer-right-attack', sheetKey: 'unit-yellow-lancer-right-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'yellow-lancer-down-attack', sheetKey: 'unit-yellow-lancer-down-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'yellow-lancer-up-attack', sheetKey: 'unit-yellow-lancer-up-attack', startFrame: 0, endFrame: 2, frameRate: 8, repeat: 0 },
  { key: 'yellow-monk-idle', sheetKey: 'unit-yellow-monk-idle', startFrame: 0, endFrame: 5, frameRate: 10, repeat: -1 },
  { key: 'yellow-monk-run', sheetKey: 'unit-yellow-monk-run', startFrame: 0, endFrame: 3, frameRate: 12, repeat: -1 },
  { key: 'yellow-monk-heal', sheetKey: 'unit-yellow-monk-heal', startFrame: 0, endFrame: 10, frameRate: 12, repeat: 0 },
  { key: 'yellow-pawn-idle', sheetKey: 'unit-yellow-pawn-idle', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'yellow-pawn-run', sheetKey: 'unit-yellow-pawn-run', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },

  // === Particles ===
  { key: 'fire-01', sheetKey: 'particle-fire-01', startFrame: 0, endFrame: 3, frameRate: 10, repeat: -1 },
  { key: 'dust-01', sheetKey: 'particle-dust-01', startFrame: 0, endFrame: 3, frameRate: 12, repeat: 0 },
  { key: 'explosion-01', sheetKey: 'particle-explosion-01', startFrame: 0, endFrame: 3, frameRate: 12, repeat: 0 },
];

export const TinySwordsPawnToolAnimations: UnitAnimationConfig[] = [
  // idle + run variants
  { key: 'blue-pawn-idle-axe', sheetKey: 'unit-blue-pawn-idle-axe', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'blue-pawn-run-axe', sheetKey: 'unit-blue-pawn-run-axe', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'blue-pawn-idle-hammer', sheetKey: 'unit-blue-pawn-idle-hammer', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'blue-pawn-run-hammer', sheetKey: 'unit-blue-pawn-run-hammer', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'blue-pawn-idle-pickaxe', sheetKey: 'unit-blue-pawn-idle-pickaxe', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'blue-pawn-run-pickaxe', sheetKey: 'unit-blue-pawn-run-pickaxe', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'blue-pawn-idle-gold', sheetKey: 'unit-blue-pawn-idle-gold', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'blue-pawn-run-gold', sheetKey: 'unit-blue-pawn-run-gold', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'blue-pawn-idle-wood', sheetKey: 'unit-blue-pawn-idle-wood', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'blue-pawn-run-wood', sheetKey: 'unit-blue-pawn-run-wood', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'blue-pawn-idle-meat', sheetKey: 'unit-blue-pawn-idle-meat', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'blue-pawn-run-meat', sheetKey: 'unit-blue-pawn-run-meat', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  { key: 'blue-pawn-idle-knife', sheetKey: 'unit-blue-pawn-idle-knife', startFrame: 0, endFrame: 6, frameRate: 10, repeat: -1 },
  { key: 'blue-pawn-run-knife', sheetKey: 'unit-blue-pawn-run-knife', startFrame: 0, endFrame: 5, frameRate: 12, repeat: -1 },
  // interact (work/attack) animations
  { key: 'blue-pawn-interact-axe', sheetKey: 'unit-blue-pawn-interact-axe', startFrame: 0, endFrame: 5, frameRate: 12, repeat: 0 },
  { key: 'blue-pawn-interact-hammer', sheetKey: 'unit-blue-pawn-interact-hammer', startFrame: 0, endFrame: 2, frameRate: 12, repeat: 0 },
  { key: 'blue-pawn-interact-knife', sheetKey: 'unit-blue-pawn-interact-knife', startFrame: 0, endFrame: 3, frameRate: 12, repeat: 0 },
  { key: 'blue-pawn-interact-pickaxe', sheetKey: 'unit-blue-pawn-interact-pickaxe', startFrame: 0, endFrame: 5, frameRate: 12, repeat: 0 },
];
