# AGENTS.md

## Purpose

This repository is a universal Phaser + TypeScript + Vite template for fast AI-assisted 2D fantasy game prototypes.

The human user may provide vague game ideas. Agents must turn those ideas into small playable browser prototypes.

This is not a production game architecture. Prefer simple working prototypes over complex abstractions.

## Core rules

1. Read this file before making changes.
2. Keep the prototype playable.
3. Keep the scope small.
4. Use Phaser, TypeScript, and Vite.
5. Use existing assets and generated asset keys when available.
6. Do not invent asset names.
7. Do not ask the human to manually wire Phaser scenes or atlases.
8. Do not add large dependencies unless there is a clear reason.
9. After implementation, run `npm run typecheck` and `npm run build` when possible.
10. Report what changed and which assets were used.

## Tech stack

- Phaser
- TypeScript
- Vite
- Static assets in `public/assets`
- Production output in `dist`

## Commands

Install:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Type check:

```bash
npm run typecheck
```

Build production version:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Build grid-based atlases:

  ```bash
  npm run build:atlas
  ```

  Build packed atlases:

  ```bash
  npm run build:packed
  ```

  Validate generated atlas files:

```bash
npm run validate:assets
```

If a command fails because dependencies are not installed, ask the user to run `npm install` or explain that the command requires installed dependencies.

## Project structure

  ```text
  src/
    main.ts
    content/
      assetKeys.ts
      generatedAssetKeys.ts
      tinySwordsAssetKeys.ts
      tinySwordsAnimations.ts
      tinySwordsTilesets.ts
      items.ts
      prototypeState.ts
      resources.ts
    game/
      config.ts
      scenes/
        BootScene.ts
        PreloadScene.ts
        MainMenuScene.ts
        GameScene.ts
        AssetGalleryScene.ts
      systems/
      ui/

  public/
    assets/
      source/
        spritesheets/
        icons/
        tiny-swords/
      atlases/
      catalog/

  tools/
    asset-sheets.config.json
    packed-atlases.config.json
    build-grid-atlas.mjs
    build-packed-atlas.mjs
    validate-assets.mjs
    ASSET_PIPELINE.md
  ```

## Scene flow

Default scene flow:

```text
BootScene → PreloadScene → MainMenuScene → GameScene
```

Use this unless a task clearly requires a different flow.

### BootScene

Minimal startup scene. It should normally transition directly to `PreloadScene`.

### PreloadScene

Load generated asset packs from `src/content/generatedAssetKeys.ts`.

Do not hardcode atlas paths in gameplay scenes.

### MainMenuScene

Small prototype menu. It can be very simple.

### GameScene

Main playable prototype scene.

For early MVPs, it is acceptable to keep most gameplay in `GameScene`. If the scene grows too large, extract systems into `src/game/systems`.

## Asset rules

Raw downloaded sprite sheets go here:

```text
public/assets/source/spritesheets/
```

Separate raw PNG icons go here:

```text
public/assets/source/icons/
```

Generated game-ready atlases go here:

```text
public/assets/atlases/
```

Generated human/agent-readable manifests go here:

```text
public/assets/catalog/
```

Do not manually edit generated atlas JSON unless specifically instructed.

## Using generated atlases

Generated atlases are described in:

```text
src/content/generatedAssetKeys.ts
```

`PreloadScene` automatically loads asset packs listed in `GeneratedAssetPacks`.

When using an icon, prefer constants:

```ts
this.add.image(x, y, GeneratedAtlases.FantasyIcons, GeneratedIconFrames.WeaponSword);
```

Avoid raw strings unless constants are missing:

```ts
this.add.image(x, y, 'fantasy_icons', 'weapon/sword.png');
```

If the required icon does not exist, choose the closest existing icon and mention the substitution.

## Tiny Swords asset usage

The project includes a fully imported Tiny Swords asset pack with several runtime layers.

When building a fantasy prototype, reuse existing Tiny Swords assets before inventing new ones:

- **Blue units = player / allies**
  - `TinySwordsSpritesheets.UnitBlueWarriorIdle`
  - `TinySwordsSpritesheets.UnitBlueArcherIdle`
  - `TinySwordsSpritesheets.UnitBluePawnIdle`
  - Use `blue-warrior-idle`, `blue-archer-run`, `blue-archer-shoot` animation keys.

- **Red units = enemies**
  - `TinySwordsSpritesheets.UnitRedWarriorIdle`
  - `TinySwordsSpritesheets.UnitRedArcherIdle`
  - `TinySwordsSpritesheets.UnitRedPawnIdle`
  - Use `red-warrior-idle`, `red-archer-run`, `red-archer-shoot` animation keys.

- **Buildings** — `TinySwordsBuildingFrames` from `tiny-swords-buildings` atlas.

- **Resources** — `TinySwordsResourceFrames` from `tiny-swords-resources` atlas.
  - Gold, wood, meat, tools, rocks, stumps.

- **UI core** — `TinySwordsUIFrames` from `tiny-swords-ui-core` atlas.
  - Buttons, bars, icons, cursors, papers.

- **Portraits** — `TinySwordsPortraitFrames` from `tiny-swords-portraits` atlas.
  - Use for dialogue, events, or character selection prototypes.

- **UI panels** — `TinySwordsUIPanelFrames` from `tiny-swords-ui-panels` atlas.
  - Big ribbons, store banners, decorative panels.

- **Tilesets** — `TinySwordsTilesets` from `src/content/tinySwordsTilesets.ts`.
  - `terrain-tilemap-color1`, `terrain-tilemap-color2`, `terrain-shadow`, `terrain-water-background`.

Do not invent frame names. Use constants from `src/content/tinySwordsAssetKeys.ts`.

If an asset you need does not exist in the runtime layer, check `public/assets/catalog/tiny-swords.runtime-manifest.json` first for what is already wired, then check `public/assets/catalog/tiny-swords.source-manifest.json` for what is available but not yet connected. If you add new assets:

1. Update `tools/packed-atlases.config.json` or the relevant builder config.
2. Run `npm run build:packed`.
3. Update `src/content/tinySwordsAssetKeys.ts` with new frame names.
4. Update `src/game/scenes/AssetGalleryScene.ts` if the new assets should be visible.
5. Run `npm run validate:assets` and `npm run build`.

### Asset gallery scene

`AssetGalleryScene` is available for debug / asset previews. It shows:

- Buildings, resources, UI core, UI panels
- Blue idle units, red idle units
- Fire / dust / explosion particles
- Portraits, terrain sample

When you change or extend the asset layer, keep the gallery in sync so the new assets are visible.

## Data rules

Put reusable gameplay data in `src/content`.

Examples:

- resources
- items
- starting state
- prototype config
- event definitions
- shop definitions
- loot tables

Prefer serializable TypeScript objects.

## UI rules

Use reusable UI helpers from `src/game/ui` where practical:

- `Panel`
- `IconButton`
- `ResourceCounter`

Use simple, readable UI before visual polish.

## Prototype rules

For a new prototype, aim for:

1. One clear core loop.
2. A small number of resources or state values.
3. Immediate visual feedback.
4. A clear win, loss, progress, or replay reason.
5. Minimal scenes and systems.

Good MVP requests:

```text
Make a small prototype where the player gathers resources, spends them on upgrades, and sees immediate feedback.
```

Bad MVP requests:

```text
Make a complete RPG with inventory, quests, story, combat, crafting, world map, save system, and progression.
```

If the user gives a large request, reduce it to a small MVP and state the simplification.

## Planning mode output

When asked to plan, do not edit files. Return:

1. Game concept
2. Core loop
3. MVP scope
4. Scenes
5. Systems
6. State/resources
7. Asset usage
8. Implementation order
9. What not to do in MVP
10. Risks and simplifications

## Build mode checklist

Before editing:

1. Read `AGENTS.md`.
2. Inspect `package.json`.
3. Inspect existing scenes.
4. Inspect `src/content/generatedAssetKeys.ts`.
5. Inspect asset manifests if assets are involved.

During implementation:

1. Keep changes small.
2. Use existing scene flow.
3. Use generated asset constants when available.
4. Keep gameplay data in `src/content` when reasonable.
5. Keep UI reusable when reasonable.

After implementation:

1. Run `npm run typecheck` when possible.
2. Run `npm run build` when possible.
3. Run `npm run validate:assets` when assets changed.
4. Fix obvious issues.
5. Summarize changes and test results.

## Definition of Done

A task is done when:

1. The prototype runs locally.
2. The production build passes or the reason is explained.
3. The user does not need to manually wire Phaser assets.
4. Asset frame names are valid.
5. The game has a clear playable loop.
6. No unrelated files were changed.
7. **If assets changed**: `AssetGalleryScene` still works or was updated, `validate:assets` passes, and `build` passes.

## Optional MCP usage

Use MCP tools only when they clearly help.

Recommended:

- Context7: check current docs for Phaser, Vite, TypeScript, Playwright.
- Playwright: verify the prototype in a real browser.
- GitHub: only for repository, issue, or pull request tasks.

Do not use MCP tools unnecessarily. They can slow down the agent and add context noise.
