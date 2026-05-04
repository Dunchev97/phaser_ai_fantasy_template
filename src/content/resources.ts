export type ResourceId = 'gold' | 'essence';

export type ResourceDefinition = {
  id: ResourceId;
  name: string;
  description: string;
};

export const ResourceDefinitions: Record<ResourceId, ResourceDefinition> = {
  gold: {
    id: 'gold',
    name: 'Gold',
    description: 'Generic currency for fantasy prototypes.',
  },
  essence: {
    id: 'essence',
    name: 'Essence',
    description: 'Generic magical resource for fantasy prototypes.',
  },
};
