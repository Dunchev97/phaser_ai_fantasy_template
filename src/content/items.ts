export type ItemDefinition = {
  id: string;
  name: string;
  description: string;
  iconFrame?: string;
};

export const ItemDefinitions: Record<string, ItemDefinition> = {
  starterRelic: {
    id: 'starterRelic',
    name: 'Starter Relic',
    description: 'Placeholder item definition. Replace it during prototype planning.',
  },
};
