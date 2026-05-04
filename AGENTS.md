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
    systems/
    ui/

public/
  assets/
    source/
      spritesheets/
      icons/
    atlases/
    catalog/

tools/
  asset-sheets.config.json
  build-grid-atlas.mjs
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
3. Fix obvious issues.
4. Summarize changes and test results.

## Definition of Done

A task is done when:

1. The prototype runs locally.
2. The production build passes or the reason is explained.
3. The user does not need to manually wire Phaser assets.
4. Asset frame names are valid.
5. The game has a clear playable loop.
6. No unrelated files were changed.

## Optional MCP usage

Use MCP tools only when they clearly help.

Recommended:

- Context7: check current docs for Phaser, Vite, TypeScript, Playwright.
- Playwright: verify the prototype in a real browser.
- GitHub: only for repository, issue, or pull request tasks.

Do not use MCP tools unnecessarily. They can slow down the agent and add context noise.
