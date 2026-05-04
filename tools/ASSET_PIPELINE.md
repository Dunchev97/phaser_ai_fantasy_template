# Asset pipeline

## Goal

Make assets understandable for Phaser and AI agents.

Phaser needs:

```text
atlas image + atlas JSON with coordinates
```

Agents need:

```text
manifest + generated TypeScript constants
```

## Raw asset locations

Downloaded sprite sheets:

```text
public/assets/source/spritesheets/
```

Separate PNG icons:

```text
public/assets/source/icons/
```

## Generated locations

Game-ready atlas images:

```text
public/assets/atlases/
```

Game-ready atlas JSON files:

```text
public/assets/atlases/
```

Agent-readable manifests:

```text
public/assets/catalog/
```

Generated TypeScript asset keys:

```text
src/content/generatedAssetKeys.ts
```

## Grid sprite sheet flow

Use this when a sprite sheet has a strict grid.

1. Put the image into:

```text
public/assets/source/spritesheets/
```

2. Edit:

```text
tools/asset-sheets.config.json
```

3. Add a sheet entry:

```json
{
  "id": "fantasy_icons",
  "source": "public/assets/source/spritesheets/fantasy-icons.png",
  "outputImage": "public/assets/atlases/fantasy_icons.png",
  "outputJson": "public/assets/atlases/fantasy_icons.atlas.json",
  "outputManifest": "public/assets/catalog/fantasy_icons.manifest.json",
  "columns": 8,
  "rows": 8,
  "frames": [
    { "name": "currency/gold_coin.png", "category": "currency", "description": "Gold coin icon." }
  ]
}
```

4. Run:

```bash
npm run build:atlas
```

5. Validate:

```bash
npm run validate:assets
```

## Important rules

- Do not guess frame names.
- Use clear category prefixes: `currency/`, `resource/`, `weapon/`, `armor/`, `consumable/`, `ui/`.
- Prefer lowercase names with underscores.
- Keep `.png` in frame names for compatibility with common atlas conventions.
- If a sheet is not a strict grid, do not use the grid builder. First split it into separate icons or manually define frame coordinates.

## Good frame names

```text
currency/gold_coin.png
resource/wood_log.png
weapon/sword.png
armor/shield.png
consumable/health_potion.png
container/treasure_chest.png
ui/star_emblem.png
```

## Bad frame names

```text
icon1.png
thing.png
new asset.png
gold
sword-final-copy-2.png
```
