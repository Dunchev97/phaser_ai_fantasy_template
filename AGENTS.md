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

Production build output goes to `dist/`. You can upload `dist/` to a static host such as Netlify Drop.

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
      tinySwordsEnvironment.ts
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
BootScene -> PreloadScene -> MainMenuScene -> GameScene
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

Do not manually put raw downloaded files into:

```text
public/assets/atlases/
public/assets/catalog/
```

Those folders are for generated, game-ready atlas files and manifests.

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

## Current Tiny Swords runtime coverage

The Tiny Swords pack is almost fully connected in runtime. You do not need to manually wire source assets for normal prototype tasks.

### Fully connected groups

- **Buildings** — all 5 factions, 8 buildings each.
- **UI Core** — buttons, bars, cursors, icons, papers, swords, tables.
- **UI Panels** — ribbons, store banners, decorative panels.
- **Portraits** — 25 human avatars.
- **Resources** — gold, gold stones, meat, wood, tools, rocks, stumps.
- **Gold Highlights** — animated highlight strips for gold resource and gold stones (7 spritesheets, 6 frames each).
- **Terrain** — color1, color2, color3, color4, color5, shadow, water background.
- **Environment** — animated trees (4 types), bushes (4 types), water foam, water rocks 01–04.
- **Particles** — fire-01/02/03, dust-01/02, explosion-01/02, water-splash.
- **Sheep** — idle, grass, move.
- **Archer arrows** — static projectile images for all 5 factions.

### Fully connected unit animation groups (all 5 factions)

Factions: **Blue, Red, Black, Purple, Yellow**.

- **Warrior** — idle, run, attack1, attack2, guard.
- **Archer** — idle, run, shoot.
- **Lancer** — idle, run, right attack, down attack, up attack, directional defence (down, down-right, right, up-right, up).
- **Monk** — idle, run, heal, heal-effect.
- **Pawn** — idle, run.
- **Pawn tool variants** — idle, run, interact for axe, hammer, pickaxe, knife (all 5 factions).
- **Pawn carrying variants** — idle, run for gold, wood, meat (all 5 factions).

### Source-only groups

These exist in source but are not connected in runtime:

- **Clouds** — source-only because frame layout is uncertain.
- **Rubber Duck** — source-only because it is an off-theme easter egg.
- **Aseprite files** — source-only editing files, not runtime assets.

## How to build prototypes from these pieces

### Combat prototypes

Use:
- Blue units as player / allies.
- Red units as basic enemies.
- Black units as dark enemies, undead, bandits, bosses.
- Purple units as magic / cursed faction.
- Yellow units as neutral, royal, merchant, villager faction.
- Warriors for melee combat.
- Archers + arrow images for ranged combat.
- Lancers for charge / defence units.
- Monks for healing / support.
- Particles for impact, death, fire, dust, water effects.

Good loops:
- Survive waves.
- Defend a village.
- Escort workers.
- Capture a point.
- Defeat a boss.

### Worker / resource prototypes

Use:
- Pawns and pawn tool variants (all factions).
- Resources atlas.
- Buildings atlas.
- Gold highlights.
- Trees, bushes, rocks, stumps.
- Sheep for food / farm / economy prototypes.

Good loops:
- Gather resource.
- Bring resource to building.
- Spend resource on upgrade.
- Build or repair structure.
- Produce food / gold / wood over time.

### Dialogue / event prototypes

Use:
- Portraits.
- UI Panels.
- UI Core buttons.
- Resources for costs and rewards.
- Faction colors for character roles.

Good loops:
- Random event appears.
- Player chooses one of 2–3 options.
- Choice gives resources, removes resources, buffs, debuffs, or changes future events.

### Map / terrain prototypes

Use:
- Terrain color1–color5.
- Trees and bushes.
- Water background and optional water rocks.
- Buildings.
- Units.

Good loops:
- Move units across a small map.
- Defend a base.
- Gather from nodes.
- Control zones.
- Explore a small area.

### Shop / upgrade prototypes

Use:
- UI Panels.
- UI Core buttons.
- Resources.
- Buildings.
- Portraits if there is a merchant.
- Gold highlights for feedback.

Good loops:
- Earn resource.
- Open shop.
- Buy unit / building / upgrade.
- See immediate effect.

## Tiny Swords asset usage

When building a fantasy prototype, reuse existing Tiny Swords assets before inventing new ones:

- **Faction roles** — All 5 factions have warrior, archer, lancer, monk, and pawn.
  - Blue = player / allies.
  - Red = basic enemies.
  - Black = dark faction / undead / bandits / bosses.
  - Purple = magic faction / cult / cursed.
  - Yellow = neutral / merchants / royal / villagers.
  - Naming pattern: `<faction>-<role>-<action>`.
  - Examples:
    - `blue-warrior-idle`
    - `red-archer-shoot`
    - `black-lancer-right-attack`
    - `purple-monk-heal`
    - `yellow-pawn-run`

- **Buildings** — `TinySwordsBuildingFrames` from `tiny-swords-buildings` atlas.

- **Resources** — `TinySwordsResourceFrames` from `tiny-swords-resources` atlas.
  - Gold, gold stones, wood, meat, tools, rocks, stumps.

- **UI core** — `TinySwordsUIFrames` from `tiny-swords-ui-core` atlas.
  - Buttons, bars, icons, cursors, papers.

- **Portraits** — `TinySwordsPortraitFrames` from `tiny-swords-portraits` atlas.
  - Use for dialogue, events, or character selection prototypes.

- **UI panels** — `TinySwordsUIPanelFrames` from `tiny-swords-ui-panels` atlas.
  - Big ribbons, store banners, decorative panels.

- **Tilesets** — `TinySwordsTilesets` from `src/content/tinySwordsTilesets.ts`.
  - `terrain-tilemap-color1`, `terrain-tilemap-color2`, `terrain-tilemap-color3`, `terrain-tilemap-color4`, `terrain-tilemap-color5`, `terrain-shadow`, `terrain-water-background`.

- **Terrain helpers** — `TinySwordsTerrainTiles`, `TinySwordsTerrainBrushes`, `TerrainBuilder`.
  - For terrain prototypes, use `TinySwordsTerrainTiles` for verified tile categories (`GrassCenter`, `GrassEdges`, `GrassCorners`, `GrassDecor`, `CliffCenter`, `Water`, etc.).
  - Use `TinySwordsTerrainBrushes.createGrassPatch(width, height, options)` or the presets `simpleGrassRect`, `simpleCliffBlock`, `simpleWaterPatch`, `simplePathPatch`.
  - For complete prototype maps, prefer `createIslandMap()` and `placeIslandMapDecorations()` from `src/game/systems/IslandMapBuilder.ts`. The default map shape should be one large, flat grass island that fills most of the playable viewport, with water only around the outside and enough open land for gameplay.
  - Do not make multi-level terrain, cliffs, ramps, bridges, or stair/sloped transitions by default. Use `elevation`, `createCliffBlock()`, and `createRampPatch()` only when the human explicitly asks for height differences or cliff gameplay.
  - `createIslandMap()` starts with a full water background, builds a shared land/cliff/ramp mask, auto-tiles grass edges from that shared mask, exposes masks, and places trees/bushes/rocks only on valid cells.
  - Reserve occupied cells with `reserveIslandMapArea()` before random decoration. Use it for buildings, units, resource nodes, paths, and scripted landmarks so random trees/bushes/rocks cannot overlap important objects.
  - Use `TerrainBuilder.createTileLayerFromPreset()` to render a brush onto a Phaser TilemapLayer, or `createGrassPatchLayer()`, `createWaterPatchLayer()`, `createCliffBlockLayer()` for direct auto-tiled patches.
  - Do not fill terrain with `tileIndex(0, 0)` or other corner/edge indexes. In `tilemap-color*.png`, `row 0, col 0` is the top-left grass corner; center grass lives inside the verified grass blob (`rows 1–10`, `cols 1–10`).
  - Corners and edges belong on the perimeter of the final combined land mask only. Interiors should use `GrassCenter` with sparse `GrassDecor` variation. Do not put grass-water edge tiles in the middle of a field unless there is actual water outside that border.
  - Avoid black voids around terrain. If a grass patch ends at map edge or forms an island, put water under/around it rather than leaving the camera background visible.
  - Avoid cliffs and ramps in baseline prototypes. When a prototype truly needs elevation, ramps/slopes are deliberate connectors between levels; do not sprinkle them as random decoration.
  - Place environment decorations through land masks and footprint checks when possible. Trees are large sprites; checking only their anchor cell is not enough. A tree needs a safe land footprint around its trunk, roughly 5×5 terrain cells at the default scale, so it does not spawn on shore/water while still appearing on normal islands. Trees, bushes, rocks, buildings, and units should not spawn on water, cliffs, ramps, one-tile shore borders, or reserved building zones unless the prototype intentionally allows it.
  - Do not use `env-water-foam` in generated prototype maps by default; it reads too noisy in this template. Use `env-water-rocks-01`..`04` sparingly as water-only decoration.
  - The runtime Tiny Swords terrain has a separate `terrain-water-background` tileset for water fill. Do not fake water by guessing bottom rows of `tilemap-color*.png`.
  - Do not place the entire tileset image as a normal sprite.
  - Tile size is 16×16. Tilemaps are 36 cols × 24 rows = 864 tiles per color variant.

- **Pawn tool variants** — workers carrying tools for gather / build / crafting prototypes (all 5 factions).
  - `TinySwordsSpritesheets.UnitBluePawnIdleAxe` / `UnitBluePawnRunAxe`
  - `UnitBluePawnIdleHammer`, `UnitBluePawnIdlePickaxe`, `UnitBluePawnIdleKnife`
  - `UnitRedPawnIdleAxe`, `UnitBlackPawnIdleAxe`, `UnitPurplePawnIdleAxe`, `UnitYellowPawnIdleAxe`, etc.
  - Use `blue-pawn-idle-axe`, `blue-pawn-run-axe`, `red-pawn-idle-hammer`, etc. animation keys.

- **Pawn carrying variants** — workers carrying resources (all 5 factions).
  - `TinySwordsSpritesheets.UnitBluePawnIdleGold` / `UnitBluePawnRunGold`
  - `UnitBluePawnIdleWood`, `UnitBluePawnIdleMeat`, etc.
  - All 5 factions have gold, wood, meat carrying animations.

- **Lancer** — directional attack and defence animations (all 5 factions).
  - `TinySwordsSpritesheets.UnitBlueLancerDefendDown`, `UnitBlueLancerDefendDownright`, etc.
  - Use `blue-lancer-defend-down`, `blue-lancer-defend-right`, etc. animation keys.

- **Monk** — idle, run, heal, heal-effect (all 5 factions).
  - `TinySwordsSpritesheets.UnitBlueMonkIdle`, `UnitBlueMonkHeal`, etc.
  - Use `blue-monk-idle`, `blue-monk-heal`, `blue-monk-heal-effect` animation keys.

- **Environment assets** — Trees, bushes, water foam, water rocks for maps / atmosphere.
  - `TinySwordsEnvironmentStrips` from `src/content/tinySwordsEnvironment.ts`.
  - **Tree strips** (`env-tree-01`..`env-tree-04`) are **animated spritesheets**, not static variants.
    - `env-tree-01`, `env-tree-02`: 8 frames of 192x256. Do not cut them as 256x256; that includes neighboring frames and makes trees slide sideways during animation.
    - `env-tree-03`, `env-tree-04`: 8 frames of 192x192.
    - Animation keys are the same as sheet keys: `env-tree-01`, `env-tree-02`, `env-tree-03`, `env-tree-04`.
    - Use `this.add.sprite(x, y, 'env-tree-01').play('env-tree-01')` for animated trees.
  - **Bushes** (`env-bush-01`..`env-bush-04`) are **animated spritesheets** (8 frames of 128x128 each).
    - Animation keys are the same as sheet keys: `env-bush-01`, `env-bush-02`, `env-bush-03`, `env-bush-04`.
    - Use `this.add.sprite(x, y, 'env-bush-01').play('env-bush-01')` for animated bushes.
  - Use `env-water-foam`, `env-water-rocks-01`..`env-water-rocks-04`.
  - Clouds (`env-cloud-*`) are source-only because exact frame layout is uncertain.

- **World scale** — `TinySwordsWorldScale` from `src/content/tinySwordsScale.ts`.
  - Tiny Swords source sheets already include padding and relative sizing. Use scale `1` for world sprites/images by default.
  - Default terrain scale is `2` (16px tiles display as 32px tiles) for readable 1280×720 prototypes.
  - Use `SmallBuilding` / `TallBuilding` / `LargeBuilding` for building atlas frames; these currently default to `1`.
  - Use `Unit` for 192×192 humanoid units, `LargeUnit` for 320×320 lancers, `Animal` for sheep, `TreeLarge` / `TreeSmall` for trees, and `Bush` for bushes; these currently default to `1`.
  - Do not normalize units by frame size. For example, lancers use larger 320×320 sheets but should still start from scale `1`, not a smaller compensating scale.
  - Change scale only for explicit camera zoom, far-background staging, UI thumbnails, or a specific gameplay/mechanical reason.

- **Particles** — fire, dust, explosion, water splash.
  - `TinySwordsSpritesheets.ParticleFire01`, `ParticleFire02`, `ParticleFire03`
  - `ParticleDust01`, `ParticleDust02`
  - `ParticleExplosion01`, `ParticleExplosion02`
  - `ParticleWaterSplash`
  - Use `fire-01`, `dust-02`, `explosion-01`, `water-splash` animation keys.

- **Sheep** — idle, grass, move.
  - `TinySwordsSpritesheets.SheepIdle`, `SheepGrass`, `SheepMove`.
  - Use `sheep-idle`, `sheep-grass`, `sheep-move` animation keys.

- **Archer arrows** — static projectile images for all 5 factions.
  - `TinySwordsArcherArrows.UnitBlueArcherArrow`, `UnitRedArcherArrow`, etc.
  - Loaded as single images, not spritesheets.

Do not invent frame names. Use constants from `src/content/tinySwordsAssetKeys.ts`.

If an asset you need does not exist in the runtime layer, check `public/assets/catalog/tiny-swords.runtime-manifest.json` first for what is already wired, then check `public/assets/catalog/tiny-swords.source-manifest.json` for what is available but not yet connected. If you add new assets:

1. Update `tools/packed-atlases.config.json` or the relevant builder config.
2. Run `npm run build:packed`.
3. Update `src/content/tinySwordsAssetKeys.ts` with new frame names.
4. Run `npm run validate:assets` and `npm run build`.

### Connected assets reference

Do not maintain an in-project asset gallery scene. It costs context and distracts from playable prototypes.

For connected asset inspection, use generated key files and manifests:

- `src/content/generatedAssetKeys.ts`
- `src/content/tinySwordsAssetKeys.ts`
- `public/assets/catalog/`

For the Tiny Swords visual reference, use the author's page:

https://pixelfrog-assets.itch.io/tiny-swords

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

- `Panel` — simple colored rounded rectangle.
- `IconButton` — clickable icon with label.
- `ResourceCounter` — icon + label + value text.
- `StretchBar` — seam-safe horizontal 3-slice bar helper for Tiny Swords bars (left cap + center + right cap, plus left-aligned fill). Use it for decorative bars such as `bigbar` and `smallbar`. Do NOT use Phaser `NineSlice`, raw `setScale`, or ad hoc sprites for Tiny Swords bars.
- `NineSlicePanel` — seam-safe 9-piece helper for Tiny Swords paper/table frames. These assets already contain a separated 3x3 layout inside one atlas frame, so do NOT use Phaser `NineSlice` directly on `ui/paper-*`, `ui/table-*`, or similar Tiny Swords UI frames.

Tiny Swords UI helpers intentionally crop source pieces, overlap seams, and avoid edge pixels to prevent visible lines between assembled pieces. When building prototypes, reuse these helpers and adjust their destination margins/cap widths instead of covering artifacts with dark rectangles or rebuilding the UI manually.

Use simple, readable UI before visual polish.

## Asset selection rules

- Use the smallest asset set that supports the prototype.
- Do not load or display every asset just because it exists.
- Do not rebuild the asset pipeline during normal gameplay prototype tasks.
- Do not edit source assets during gameplay tasks.
- Do not rename asset files.
- Do not change manifests unless the task is explicitly about assets.
- Use existing runtime constants and animation keys.
- Do not recreate or maintain `AssetGalleryScene`; inspect assets through manifests, generated keys, and the Pixel Frog Tiny Swords page instead.

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

## Prototype creation workflow

When the user asks for a new prototype:

1. Reduce the idea to one core loop.
2. Choose the smallest useful asset groups.
3. Propose an MVP before building if the request is broad.
4. Implement only the MVP.
5. Use existing Tiny Swords keys and animation names.
6. Keep the first version in one main playable scene when possible.
7. Add reusable data to `src/content` only when useful.
8. Add reusable UI to `src/game/ui` only when it reduces duplication.
9. Run `validate:assets`, `typecheck`, and `build`.
10. Report what was built, how to play, and which assets were used.

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
7. **If assets changed**: `validate:assets` passes and `build` passes.

## Optional MCP usage

Use MCP tools only when they clearly help.

Recommended:

- Context7: check current docs for Phaser, Vite, TypeScript, Playwright.
- Playwright: verify the prototype in a real browser.
- GitHub: only for repository, issue, or pull request tasks.

Do not use MCP tools unnecessarily. They can slow down the agent and add context noise.
