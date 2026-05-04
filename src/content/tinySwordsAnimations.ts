import { TinySwordsSpritesheets } from './tinySwordsAssetKeys';

export interface AnimationConfig {
  key: string;
  spritesheet: string;
  frameRate: number;
  repeat: number;
}

export const TinySwordsAnimations: AnimationConfig[] = [
  // Blue allies
  { key: 'blue-warrior-idle', spritesheet: TinySwordsSpritesheets.UnitBlueWarriorIdle, frameRate: 8, repeat: -1 },
  { key: 'blue-warrior-run', spritesheet: TinySwordsSpritesheets.UnitBlueWarriorRun, frameRate: 8, repeat: -1 },
  { key: 'blue-warrior-attack1', spritesheet: TinySwordsSpritesheets.UnitBlueWarriorAttack1, frameRate: 8, repeat: 0 },
  { key: 'blue-archer-idle', spritesheet: TinySwordsSpritesheets.UnitBlueArcherIdle, frameRate: 8, repeat: -1 },
  { key: 'blue-archer-run', spritesheet: TinySwordsSpritesheets.UnitBlueArcherRun, frameRate: 8, repeat: -1 },
  { key: 'blue-archer-shoot', spritesheet: TinySwordsSpritesheets.UnitBlueArcherShoot, frameRate: 12, repeat: 0 },
  { key: 'blue-pawn-idle', spritesheet: TinySwordsSpritesheets.UnitBluePawnIdle, frameRate: 8, repeat: -1 },
  { key: 'blue-pawn-run', spritesheet: TinySwordsSpritesheets.UnitBluePawnRun, frameRate: 8, repeat: -1 },
  // Red enemies
  { key: 'red-warrior-idle', spritesheet: TinySwordsSpritesheets.UnitRedWarriorIdle, frameRate: 8, repeat: -1 },
  { key: 'red-warrior-run', spritesheet: TinySwordsSpritesheets.UnitRedWarriorRun, frameRate: 8, repeat: -1 },
  { key: 'red-warrior-attack1', spritesheet: TinySwordsSpritesheets.UnitRedWarriorAttack1, frameRate: 8, repeat: 0 },
  { key: 'red-archer-idle', spritesheet: TinySwordsSpritesheets.UnitRedArcherIdle, frameRate: 8, repeat: -1 },
  { key: 'red-archer-run', spritesheet: TinySwordsSpritesheets.UnitRedArcherRun, frameRate: 8, repeat: -1 },
  { key: 'red-archer-shoot', spritesheet: TinySwordsSpritesheets.UnitRedArcherShoot, frameRate: 12, repeat: 0 },
  { key: 'red-pawn-idle', spritesheet: TinySwordsSpritesheets.UnitRedPawnIdle, frameRate: 8, repeat: -1 },
  { key: 'red-pawn-run', spritesheet: TinySwordsSpritesheets.UnitRedPawnRun, frameRate: 8, repeat: -1 },
  // Particles
  { key: 'fire-01', spritesheet: TinySwordsSpritesheets.ParticleFire01, frameRate: 10, repeat: -1 },
  { key: 'dust-01', spritesheet: TinySwordsSpritesheets.ParticleDust01, frameRate: 10, repeat: 0 },
  { key: 'explosion-01', spritesheet: TinySwordsSpritesheets.ParticleExplosion01, frameRate: 12, repeat: 0 },
];
