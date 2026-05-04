import type { ResourceId } from './resources';

export type PrototypeState = {
  resources: Record<ResourceId, number>;
  inventory: string[];
  flags: Record<string, boolean>;
};

export function createInitialPrototypeState(): PrototypeState {
  return {
    resources: {
      gold: 0,
      essence: 0,
    },
    inventory: [],
    flags: {},
  };
}
