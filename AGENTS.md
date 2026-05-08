# AGENTS.md

## Mission

This repository is a Phaser + TypeScript + Vite template for fast AI-assisted 2D fantasy browser prototypes.

The user may describe a vague or oversized idea. Turn it into a small playable prototype with one clear loop, immediate feedback, and a minimal implementation. This is not a production architecture; prefer simple working gameplay over broad systems.

## First Principles

1. Read this file before making changes.
2. Keep the prototype playable at all times.
3. Keep scope small and state simplifications clearly.
4. Use Phaser, TypeScript, and Vite.
5. Use existing assets, generated constants, and existing scene flow.
6. Do not invent asset keys, frame names, or atlas paths.
7. Do not make the user manually wire Phaser scenes, atlases, or animation metadata.
8. Do not add large dependencies unless they clearly solve the core problem.
9. Avoid unrelated refactors and generated-file churn.
10. After implementation, run `npm run typecheck` and `npm run build` when possible.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
npm run build:atlas
npm run build:packed
npm run validate:assets
```

Use `npm run build:packed` only when packed atlas inputs/config changed. Use `npm run build:atlas` only for grid atlas work. Use `npm run validate:assets` whenever asset wiring or generated asset data changes.

If dependencies are missing, say that `npm install` is required.

## Project Map

```text
src/
  main.ts
  content/
    assetKeys.ts
    generatedAssetKeys.ts
    sodaIconAssetKeys.ts
    tinySwordsAssetKeys.ts
    tinySwordsAnimations.ts
    tinySwordsEnvironment.ts
    tinySwordsScale.ts
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
    systems/
    ui/
public/
  assets/
    source/
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

Default scene flow:

```text
BootScene -> PreloadScene -> MainMenuScene -> GameScene
```

`BootScene` should stay minimal. `PreloadScene` loads generated atlases, spritesheets, tilesets, and creates animations. `MainMenuScene` can stay simple. `GameScene` is the normal home for MVP gameplay; extract to `src/game/systems` only when it reduces real complexity.

## Before Editing

For prototype or gameplay changes:

1. Inspect `package.json`.
2. Inspect relevant scenes, usually `PreloadScene.ts`, `MainMenuScene.ts`, and `GameScene.ts`.
3. Inspect generated keys in `src/content/*AssetKeys.ts`.
4. Inspect manifests in `public/assets/catalog/` when asset availability matters.
5. Check existing helpers in `src/game/systems` and `src/game/ui` before adding new ones.

For planning-only requests, do not edit files.

## Prototype Workflow

When building a new prototype:

1. Reduce the idea to one core loop.
2. Choose the smallest useful asset set.
3. If the request is broad, state the MVP simplification before or while building.
4. Implement the MVP, usually in `GameScene`.
5. Put reusable gameplay data in `src/content` when it is more than one-off scene state.
6. Reuse UI helpers when practical.
7. Run `npm run typecheck` and `npm run build`.
8. Report what changed, how to play, which assets were used, and which checks passed.

Good MVP loops:

- Survive waves.
- Defend a village.
- Gather resources and spend them on upgrades.
- Escort workers.
- Capture a point.
- Resolve a small event choice.
- Buy a unit/building/upgrade and see immediate effect.

Do not attempt complete RPGs, quest systems, full inventories, save systems, large world maps, or full production architecture in the first pass unless explicitly requested.

## Planning Output

When the user asks for a plan, return this structure and do not edit files:

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

## Asset System

Runtime-ready generated atlases live in `public/assets/atlases/`. Human/agent-readable manifests live in `public/assets/catalog/`. Raw source assets live in `public/assets/source/`.

Do not manually edit generated atlas JSON. Do not manually place raw downloaded files into `public/assets/atlases/` or `public/assets/catalog/`.

Generated asset constants are the source of truth:

- `src/content/generatedAssetKeys.ts`
- `src/content/sodaIconAssetKeys.ts`
- `src/content/tinySwordsAssetKeys.ts`
- `src/content/tinySwordsAnimations.ts`
- `src/content/tinySwordsEnvironment.ts`
- `src/content/tinySwordsTilesets.ts`

`PreloadScene` loads packs from `GeneratedAssetPacks`, `SodaIconAssetPacks`, and `TinySwordsAssetPacks`. Gameplay scenes should not hardcode atlas paths.

Prefer constants:

```ts
this.add.image(x, y, SodaIconAtlases.SodaIcons, SodaIconFrames.MaterialsCoins);
```

Use raw strings only when no constant exists and you have verified the key/frame in generated files or manifests.

If a needed Tiny Swords asset is not wired:

1. Check `public/assets/catalog/tiny-swords.runtime-manifest.json`.
2. Check `public/assets/catalog/tiny-swords.source-manifest.json`.
3. Update `tools/packed-atlases.config.json` or the relevant source metadata.
4. Run `npm run build:packed`.
5. Update generated/runtime key files only as needed.
6. Run `npm run validate:assets`, `npm run typecheck`, and `npm run build`.

Do not create or maintain an in-project asset gallery scene. Inspect connected assets through generated key files, manifests, and the Tiny Swords reference page:

https://pixelfrog-assets.itch.io/tiny-swords

## Tiny Swords Runtime Coverage

The Tiny Swords pack is mostly wired for runtime use. Prefer it before adding new assets.

Fully connected groups:

- Buildings: all 5 factions, 8 buildings each.
- UI Core: buttons, bars, cursors, icons, papers, swords, tables.
- UI Panels: ribbons, store banners, decorative panels.
- Portraits: human avatars and faction portraits.
- Resources: gold, gold stones, meat, wood, tools, rocks, stumps.
- Gold highlights: animated highlight strips for gold resource and gold stones.
- Terrain: color1-color5, shadow, water background.
- Environment: animated trees, animated bushes, water foam, water rocks 01-04.
- Particles: fire-01/02/03, dust-01/02, explosion-01/02, water-splash.
- Sheep: `sheep-idle`, `sheep-grass`, `sheep-move`.
- Archer arrows: static projectile images for all 5 factions.

Connected unit animation groups for all factions:

- Factions: Blue, Red, Black, Purple, Yellow.
- Roles: warrior, archer, lancer, monk, pawn.
- Warrior: idle, run, attack1, attack2, guard.
- Archer: idle, run, shoot.
- Lancer: idle, run, attacks right/down/up/downright/upright, defences down/downright/right/upright/up.
- Monk: idle, run, heal, heal-effect.
- Pawn: idle, run.
- Pawn tool variants: idle, run, interact for axe, hammer, pickaxe, knife.
- Pawn carrying variants: idle, run for gold, wood, meat.

Faction usage:

- Blue = player/allies.
- Red = basic enemies.
- Black = dark enemies, undead, bandits, bosses.
- Purple = magic, cult, cursed.
- Yellow = neutral, merchants, royal, villagers.

Animation key pattern:

```text
<faction>-<role>-<action>
blue-warrior-idle
red-archer-shoot
black-lancer-downright-attack
purple-monk-heal
yellow-pawn-run
```

Source-only groups:

- Clouds: source-only because frame layout is uncertain.
- Rubber Duck: source-only off-theme easter egg.
- Aseprite files: source-only editing files.

## Tiny Swords Quick Reference

Use these constants and keys instead of inventing strings:

- Buildings: `TinySwordsAtlases.Buildings`, `TinySwordsBuildingFrames`.
- Resources: `TinySwordsAtlases.Resources`, `TinySwordsResourceFrames`.
- UI Core: `TinySwordsAtlases.UICore`, `TinySwordsUIFrames`.
- UI Panels: `TinySwordsAtlases.UIPanels`, `TinySwordsUIPanelFrames`.
- Portraits: `TinySwordsAtlases.Portraits`, `TinySwordsPortraitFrames`, `TinySwordsFactionPortraits`.
- Spritesheets: `TinySwordsSpritesheets`.
- Archer arrows: `TinySwordsArcherArrows`.
- Terrain tilesets: `TinySwordsTilesets`.
- Environment strips: `TinySwordsEnvironmentStrips`.
- World scale: `TinySwordsWorldScale`.

Important animation keys:

- Sheep: `sheep-idle`, `sheep-grass`, `sheep-move`.
- Trees: `env-tree-01`, `env-tree-02`, `env-tree-03`, `env-tree-04`.
- Bushes: `env-bush-01`, `env-bush-02`, `env-bush-03`, `env-bush-04`.
- Particles: `fire-01`, `fire-02`, `fire-03`, `dust-01`, `dust-02`, `explosion-01`, `explosion-02`, `water-splash`.
- Lancer attacks: `<faction>-lancer-right-attack`, `<faction>-lancer-down-attack`, `<faction>-lancer-up-attack`, `<faction>-lancer-downright-attack`, `<faction>-lancer-upright-attack`.
- Lancer defences: `<faction>-lancer-defend-down`, `<faction>-lancer-defend-downright`, `<faction>-lancer-defend-right`, `<faction>-lancer-defend-upright`, `<faction>-lancer-defend-up`.

Use `this.add.sprite(...).play(animationKey)` for animated spritesheets. Use `this.add.image(...)` for atlas frames and static images.

## Terrain Rules

For multi-level terrain, cliffs, ramps, invisible walls, or camera/pathing work, read `docs/TERRAIN_GRAMMAR.md` before editing terrain code.

Use terrain helpers instead of hand-placing raw tile indexes:

- `TinySwordsTerrainTiles`
- `TinySwordsTerrainBrushes`
- `TerrainBuilder`
- `createIslandMap()`
- `placeIslandMapDecorations()`
- `reserveIslandMapArea()`

Default map shape should be one large, flat grass island filling most of the playable viewport, with water around the outside and enough open land for gameplay. Build multi-level locations only when the user explicitly asks for height differences, cliffs, ramps, stairs, upper/lower levels, or a terrain test focused on those features.

Important constraints:

- Do not create multi-level terrain, cliffs, ramps, bridges, stairs, or sloped transitions unless explicitly requested. Do not "upgrade" a normal map into a multi-level location for visual interest.
- When multi-level terrain is explicitly requested, design visual tiles and gameplay masks together: walkable cells, blocked cells, elevation values, ramp transitions, and camera bounds.
- Cliffs, water, buildings, deliberate blockers, tree trunks, and map edges must block movement through masks or invisible collision bodies.
- Ramps are the only default transition between elevations; do not let actors cross cliff faces as if the map were flat.
- Do not random-pick Tiny Swords cliff tiles. Cliff faces are sliced artwork; use sequential cliff helpers so source rows and columns stay aligned.
- Draw dry cliff faces as an overlay above ordinary lower grass/ground. Do not erase the lower land mask under dry cliffs; otherwise transparent pixels show water.
- After cutting a ramp or opening through a cliff, recalculate exposed cliff left/right edges. A newly exposed cliff edge must use edge columns, not center rock tiles.
- Use water cliff faces only when the cliff actually drops into water.
- Do not fill terrain with `tileIndex(0, 0)`; that is a corner tile, not grass center.
- Interior land should use a quiet verified `GrassCenter` base tile. Do not repeat the whole 10x10 source grass blob across large fields; it reads as visible chunks. Add variety with props or sparse overlay details.
- Raised/elevated land must show its own grass boundary even when it sits above lower grass. Use the dry raised grass boundary from the right-side terrain block (`RaisedGrassEdges` / `RaisedGrassCorners` / `RaisedGrassBoundary`), not the white shore/water boundary. Draw raised edges on a separate overlay layer above normal land so transparent pixels reveal lower grass, not water or the camera background. Long raised borders must use a fixed sequence: corner, cap, repeatable center tiles, cap, corner. Do not repeat cap/corner-adjacent tiles through the middle of a horizontal or vertical border.
- Edges and corners belong only on the perimeter of the final land mask.
- Use the separate `terrain-water-background` tileset for water fill.
- Avoid black voids around terrain; put water under/around islands.
- Do not place the whole tileset image as a sprite.
- Tile size is 16x16; default display scale is 2.
- Avoid `env-water-foam` in generated maps by default because it reads noisy.
- Use `env-water-rocks-01` through `env-water-rocks-04` sparingly and only on water.

Reserve important cells before random decoration. Trees need a safe land footprint around the trunk, roughly 5x5 terrain cells at default scale. Bushes, rocks, and other small visual decor should not block movement by default; use a separate visual-overlap footprint for placement and reserve `occupied` only for actual blockers. Trees, bushes, rocks, buildings, resources, and units should not spawn on water, cliffs, ramps, shore borders, or reserved zones unless the prototype intentionally allows it.

Ramp placement must include a reachable lower entry and an upper exit. A side ramp should be horizontally oriented toward the side the player approaches from; for example, a left-shoulder entrance should use the mirrored left ramp and extend down into level 0 cells, not sit entirely inside level 1. Use the full Tiny Swords side-ramp pattern, not a cropped 2-tile slice. Build ramp masks from the non-empty ramp tiles so transparent cells do not become fake walkable steps. Reserve ramp approach areas for decoration only; do not mark them as `occupied` blockers unless you intentionally want a wall.

Small ground decor such as rocks and bushes should draw below actors by default. Use y-depth sorting for trees, buildings, units, and tall overlap objects.

Blocking footprints should describe where an actor's feet cannot stand, not the full sprite rectangle. For buildings, reserve a visual footprint for decoration spacing, then block only the lower/base half so actors can visually pass behind roofs. For trees, block the trunk/base cells near the ground origin, not the crown. Keep a larger visual footprint only for decoration placement. Debug collision masks must draw only actual blocking footprints; do not draw visual reservations as red collision areas.

## Environment and Scale

Tiny Swords sprites already include padding and relative sizing. Start with `TinySwordsWorldScale` and change scale only for explicit gameplay, staging, camera, or UI thumbnail reasons.

Defaults:

- Terrain scale: `2`.
- Buildings: `SmallBuilding`, `TallBuilding`, `LargeBuilding`.
- Units: `Unit` for 192x192 humanoids.
- Lancers: `LargeUnit` for 320x320 sheets.
- Animals: `Animal` for sheep.
- Trees: `TreeLarge` / `TreeSmall`.
- Bushes: `Bush`.

Do not normalize lancers down just because their sheet is 320x320.

Environment details:

- `env-tree-01` and `env-tree-02`: 8 frames, 192x256.
- `env-tree-03` and `env-tree-04`: 8 frames, 192x192.
- `env-bush-01` through `env-bush-04`: 8 frames, 128x128.
- Sheep sheets: idle 6 frames, grass 12 frames, move 4 frames, each 128x128.

## Soda Icons

Place new icon PNGs under `public/assets/source/icons/{category}/`, then run `npm run build:packed` to regenerate `soda-icons`.

Frame names are generated as `{category}/{clean-name}.png`. Inspect `src/content/sodaIconAssetKeys.ts` or `public/assets/atlases/soda-icons.atlas.json` for exact names.

Current categories:

- `food`: apple, bread, cheese, egg, fish, grapes, mushroom, sausage, tomato, turnip, etc.
- `materials`: coins, gems, wood, rock, skull, leatherroll, feather, fur, coral, shell, tooth, string, wool, brick, gravel, antler, horn2, bar2.
- `potionherbs`: herbs and colored potions.
- `system_misc`: hearts, stars, shield, book, cog, elemental/status icons, arrows, music note.
- `instruments`: bell, drum, flute, harp, horn, lute, musicbox, ocarina.
- `weapons`: axe, bow, crossbow, hammer, spear, staff, whip, firearms, magic weapons, and related armory icons.

## UI Rules

Use simple readable UI before visual polish. Prefer helpers in `src/game/ui`:

- `Panel`: simple colored rounded rectangle.
- `IconButton`: clickable icon plus label.
- `ResourceCounter`: icon plus value text.
- `StretchBar`: Tiny Swords horizontal 3-slice bars such as `bigbar` and `smallbar`.
- `NineSlicePanel`: Tiny Swords paper/table-style 9-piece frames.

Do not use Phaser `NineSlice`, raw `setScale`, or ad hoc sprite stretching for Tiny Swords bars, papers, or tables when local helpers already solve seam artifacts.

## Data Rules

Put reusable serializable gameplay data in `src/content`:

- resources
- items
- starting state
- prototype config
- event definitions
- shop definitions
- loot tables

Keep one-off scene-only state inside the scene.

## Verification

After code changes:

1. Run `npm run typecheck` when possible.
2. Run `npm run build` when possible.
3. Run `npm run validate:assets` when asset wiring or generated assets changed.
4. Fix obvious failures.
5. Report checks and any skipped command with the reason.

For frontend/gameplay changes, run or suggest a browser check. If using a dev server, provide the local URL.

## Definition of Done

A task is done when:

1. The prototype runs locally or the blocker is explained.
2. Production build passes or the failure is explained.
3. The user does not need to manually wire assets or scenes.
4. Asset frame names and animation keys are valid.
5. The game has a clear playable loop when gameplay was requested.
6. No unrelated files were changed.
7. If assets changed, validation and build checks pass or failures are documented.

## Optional MCP and External Docs

Use extra tools only when they clearly help. Prefer local code and manifests first.

Useful cases:

- Phaser/Vite/TypeScript docs when current API behavior matters.
- Browser/Playwright checks for visual or interaction verification.
- GitHub tools only for repository, issue, pull request, or CI tasks.

Avoid tool use that adds context noise without improving the result.
