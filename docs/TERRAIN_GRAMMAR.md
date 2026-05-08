# Terrain Grammar

This document teaches agents how to build Tiny Swords terrain as a playable top-down location, not as a flat decorative picture.

Use it when a request involves terrain, islands, cliffs, ramps, height differences, blocked paths, camera movement, exploration, or top-down navigation.

Do not create a multi-level location by default. Use this grammar for multi-level construction only when the user explicitly asks for height differences, cliffs, ramps, stairs, upper/lower levels, or terrain/camera/collision learning around those features. Normal prototype maps should remain one large readable flat island.

## Core Model

Terrain has two layers of meaning:

1. Visual terrain: tiles, cliffs, ramps, water, shadows, decorations.
2. Gameplay terrain: walkable cells, blocked cells, elevation, ramp transitions, camera bounds.

Never build multi-level terrain from visuals alone. Every visible height difference needs gameplay rules that stop units from walking across cliffs as if the map were flat.

## Existing Runtime Pieces

Use these files first:

- `src/content/tinySwordsTerrainTiles.ts`: verified tile indexes.
- `src/content/tinySwordsTerrainBrushes.ts`: reusable terrain brushes.
- `src/game/systems/TerrainBuilder.ts`: creates Phaser tile layers from brushes or arrays.
- `src/game/systems/IslandMapBuilder.ts`: creates layered island maps with masks.
- `src/content/tinySwordsTilesets.ts`: loaded tileset keys.

Runtime terrain tilesets:

- `terrain-tilemap-color1` through `terrain-tilemap-color5`: 576x384, 36 columns x 24 rows, 16x16 tiles.
- `terrain-water-background`: 64x64, 4 columns x 4 rows, 16x16 tiles.
- `terrain-shadow`: 192x192, 12 columns x 12 rows, 16x16 tiles.

## Tileset Vocabulary

The color terrain sheet uses a fixed 36x24 layout:

- Grass blob: rows 0-11, cols 0-11.
- Grass center: rows 1-10, cols 1-10.
- Grass edges/corners: the perimeter of the grass blob.
- Ramp graphics: lower-left sheet area, currently exposed as `Ramps.leftWide` and `Ramps.rightWide`.
- Cliff-top grass lip: row 15, cols 24-29. Use this for the bottom grass edge above a dry cliff.
- Dry cliff face: rows 16-19, cols 24-29. Use on land.
- Water cliff face: rows 20-23, cols 24-29. Use only when the cliff drops into water; the bottom row has a bright water outline.
- The wider source area has a black separator at col 30. Do not include it in generated cliff faces.
- Water is not in the color terrain sheet. Use `terrain-water-background`.

Do not guess tile indexes outside `TinySwordsTerrainTiles` until they are verified and named.

Cliff tiles are sliced pieces of a larger drawing, not interchangeable rock decorations. Use sequential cliff helpers such as `createCliffFace()` / `createCliffBlock()` so source rows and columns stay aligned.

## Layer Order

A readable top-down map should be built in layers:

1. Water base: covers the full map to avoid black voids.
2. Ground land: walkable grass at elevation 0, including lower grass underneath dry cliff overlays.
3. Raised land: walkable grass at elevation 1 or higher.
4. Cliff faces: visible vertical faces between elevations, drawn as an overlay; not walkable.
5. Ramps: deliberate connectors between elevations.
6. World objects: buildings, resources, trees, rocks, units.
7. HUD: fixed camera UI.

Current `createIslandMap()` already returns `water`, `land`, `cliffs`, `ramps`, and masks. Extend that pattern instead of replacing it with ad hoc sprites.

## Flat Island Grammar

Use this for baseline prototypes:

1. Fill the whole tilemap with `terrain-water-background`.
2. Create one large land mask.
3. Auto-tile grass edges from the combined land mask.
4. Use a quiet grass-center base inside the mask. Do not repeat the whole 10x10 source grass blob across large fields; it reads as visible chunks. Add variety mostly with props, not random grass noise.
5. Reserve cells for buildings, units, resources, paths, and scripted objects.
6. Place decorations only on safe interior land.

Forbidden in flat maps:

- Placing grass corner/edge tiles inside fields.
- Using `tileIndex(0, 0)` as generic grass.
- Leaving map background visible around land.
- Putting trees, rocks, buildings, or units on shore borders unless intentionally staged.

## Multi-Level Grammar

A multi-level top-down location must start from a height plan:

```text
0 = water or ground level
1 = raised plateau
2 = higher plateau, only if explicitly useful
```

For small prototypes, use at most two walkable elevations: ground and one raised plateau.

Recommended process:

1. Draw a base water mask.
2. Draw a ground-level land mask.
3. Draw raised plateau masks separately.
4. Derive cliff faces from places where raised land drops to lower level.
5. Place ramps only where the player should transition between levels.
6. Derive walkable and blocked masks after ramps are placed.
7. Place gameplay objects only on valid walkable cells at their intended elevation.

Do not build many small height islands unless the gameplay depends on them. One large raised area with one or two ramp connections is usually enough for an MVP.

## Cliff Rules

Cliffs are visual blockers and gameplay blockers.

Use cliffs when a higher platform drops to a lower level. A cliff face is not a path, not decoration, and not a valid unit position.

Rules:

- A cliff face must have raised walkable land visually above it.
- A dry cliff face must sit on top of lower ground, usually grass. It should not reveal water through transparent pixels unless the cliff actually borders water.
- A cliff face should occupy blocked cells.
- Units cannot cross from one elevation to another through a cliff.
- Buildings and decorations should not overlap cliff faces.
- Do not sprinkle cliff tiles as random rocks.
- Do not put grass shoreline edges in the middle of a cliff face.
- Do not use water cliff tiles on dry land. Water cliff tiles have a bright bottom outline for water contact.
- Do not random-pick cliff center tiles. Preserve source row/column sequence.
- Do not erase the lower land mask under dry cliffs. Treat dry cliffs as an overlay and block them with the cliff mask.
- After a ramp or notch cuts through a cliff face, recalculate exposed left/right cliff edges. A new cliff boundary should use the cliff edge columns, not center rock columns.

In top-down Tiny Swords maps, the clearest baseline is a plateau with cliff faces along its lower/south edge. Side cliffs and complex silhouettes require extra verification.

## Ramp Rules

Ramps are the only normal transition between elevations.

Rules:

- A ramp must connect lower walkable cells to upper walkable cells.
- A ramp must have free entry and exit cells.
- A ramp should be reserved so decoration cannot block it.
- A ramp should be wide and visible enough for the player to read.
- A ramp must own a clean gap or edge placement. Do not draw a continuous cliff wall behind it.
- Prefer placing first ramps at a plateau shoulder, corner, or intentionally carved notch. Avoid dropping a ramp into the middle of an unbroken cliff face.
- A ramp must contain at least one lower entry cell on the side the player can actually approach and at least one upper exit cell touching the raised platform.
- Mirror the ramp art to match the approach side. A left-side approach should use the left-facing ramp variant; a right-side approach should use the right-facing variant.
- Use the full Tiny Swords side-ramp pattern. Do not crop it down to a narrow 2-tile strip, or it will look half-height next to cliffs.
- Derive the ramp gameplay mask from non-empty ramp tiles, not from the whole rectangular brush bounds.
- Reserve ramp approaches for decoration only. Do not write ramp approach cells into the blocker/occupied mask unless the route is intentionally closed.
- Do not place ramps as decoration.
- Do not place a ramp if there is no raised level to reach.

For MVPs, use one ramp first. Add a second only if the loop benefits from alternate routing.

## Invisible Walls and Collision

Top-down collision must be driven by gameplay masks, not by how pretty the tiles look.

Maintain at least these masks for terrain-heavy prototypes:

- `walkable`: cells where actors may stand.
- `blocked`: water, cliff faces, map void, dense decor, buildings, reserved blockers.
- `elevation`: numeric level per walkable cell.
- `ramp`: cells where elevation transition is allowed.
- `occupied`: runtime reservations for actual blockers such as buildings, dense tree trunks, resources when they should block, and scripted collision props.

Movement rule:

```text
An actor may move from cell A to adjacent cell B only if:
1. B is walkable.
2. B is not blocked or occupied by a blocking object.
3. elevation(A) === elevation(B), or A/B are connected by a ramp transition.
```

Invisible walls can be implemented in two acceptable ways:

- Grid movement: reject movement into blocked cells before moving the actor.
- Arcade movement: create invisible static bodies from blocked rectangles and collide the player with them.

Prefer grid/mask rejection for click-to-move, tile-by-tile movement, or simple prototypes. Prefer Arcade static bodies when the player moves freely with velocity.

For Arcade bodies:

- Merge adjacent blocked cells into rectangles when practical.
- Keep bodies invisible by default.
- Add a debug toggle only during development.
- Keep the player collision body small around the feet, not the full 192x192 sprite.
- Treat cliffs, water, buildings, dense tree trunks, and map edges as blockers.

Do not rely on sprite depth or visual overlap to block movement. Depth only affects drawing order.

## Camera Rules for Top-Down Terrain

Camera behavior should help the player understand height and boundaries.

Baseline camera rules:

- Set camera bounds to the playable map bounds, not just the canvas size.
- Follow the player or selected unit with gentle lerp.
- Keep HUD fixed with `setScrollFactor(0)`.
- Do not let the camera show large black voids outside the terrain.
- If the map is smaller than the viewport, keep a fixed camera and center the map.

For multi-level maps:

- The camera may move over visual cliffs, but player movement may not.
- Do not use camera scroll to fake elevation unless the gameplay is actually changing level.
- Keep ramp entrances readable; avoid placing HUD or tall sprites over them.
- Use depth sorting by `y` for units/props when objects can overlap visually.

## Decoration and Footprints

Decoration must respect gameplay masks:

- Trees need a large safe visual footprint around the trunk; only the trunk area should normally block movement.
- Tree sprites should use a ground/base origin when possible, so trunk collision appears at the foot of the tree rather than in the crown.
- Bushes and rocks need smaller visual footprints and should not block movement by default.
- Bushes and small rocks should draw below actors by default. Keep y-depth sorting for tall props such as trees and buildings.
- Keep visual-overlap masks separate from blocker masks. A prop can avoid overlapping other props without becoming an invisible wall.
- Water rocks belong only on water.
- Buildings reserve both visual space and collision space.
- Building collision should cover the lower/base half, not the whole sprite. Let actors pass behind roofs when depth sorting makes that visually correct.
- Debug collision rendering should show only true blocking footprints: building bases, tree trunks, cliffs, water, map edges, and intentional blockers. Visual reservation footprints for spacing/decor avoidance should not appear as collision.
- Resources should spawn on walkable or intentionally harvestable cells.

Reserve important cells before random decoration:

- Player start.
- Enemy spawn.
- Ramp entrance and exit.
- Buildings.
- Resource nodes.
- Scripted paths.
- Camera focus areas.

## Construction Recipes

### One-Level Island

Use for most first prototypes:

1. Full water base.
2. One large flat grass mask.
3. Shore edges from the combined mask.
4. Decorations only on safe interior cells.
5. Player/camera bounded to land area or full island area.

### Raised Village Plateau

Use when the prototype needs height:

1. Ground-level island as base.
2. One raised rectangular or soft-edged plateau.
3. Dry raised grass edges on the top/left/right of the plateau, even when lower grass exists underneath. Use the right-side terrain block with shadowed edges, not the white shore/water edge block.
4. Raised edges should be an overlay layer above normal grass. Do not replace the base grass tile with a transparent edge tile.
5. Long raised borders use a fixed tile sequence: corner, cap, repeatable center, cap, corner. Never repeat cap or corner-adjacent tiles through the middle of a border.
6. Cliff face along the lower edge of the plateau.
7. One visible ramp connecting ground to plateau.
8. Village buildings placed on plateau.
9. Invisible walls block cliff face and plateau edges.

### Two-Level Combat Arena

Use for archers, chokepoints, or defense:

1. Ground-level arena with open movement.
2. Raised platform for archers or objective.
3. One or two ramps as chokepoints.
4. Enemies cannot cross cliffs except through ramps.
5. Camera follows player but keeps ramps/objective visible when possible.

### Resource Hill

Use for worker/resource loops:

1. Ground-level base and work area.
2. Raised hill with gold/wood/meat resource.
3. One ramp path to the resource.
4. Worker pathing uses walkable/ramp masks.
5. Decoration does not block the route.

## Forbidden Patterns

Do not:

- Treat a multi-level map as one flat walkable plane.
- Let actors walk across cliff faces.
- Let actors walk on water unless the prototype explicitly supports it.
- Use cliffs, ramps, or water foam as random filler.
- Erase lower grass under dry cliff overlays.
- Let small visual decor like bushes or rocks create invisible walls by default.
- Place ramps without lower and upper walkable endpoints.
- Mix grass edge tiles into field interiors.
- Repeat a whole source grass patch over a large area when a quiet base tile would read cleaner.
- Use the color terrain sheet as water.
- Depend on visual depth to enforce collisions.
- Spawn the player, enemies, or resources on blocked cells.
- Add complex elevation before the core loop works.

## Implementation Checklist

Before building:

1. Decide whether the user explicitly requested a flat or multi-level map. If not explicit, build flat.
2. If multi-level was requested, sketch elevations and ramp connections first.
3. Choose one terrain color variant.
4. Decide camera mode: fixed, follow player, or bounded follow.

While building:

1. Create visual tile layers from masks.
2. Create gameplay masks from the same source data.
3. Reserve ramps, starts, buildings, and routes before decoration.
4. Add invisible blockers or movement rejection.
5. Set camera bounds and HUD scroll factors.

Before finishing:

1. Confirm every cliff is blocked.
2. Confirm every ramp connects two elevations.
3. Confirm player cannot walk through water, cliff faces, buildings, or dense decor.
4. Confirm camera does not reveal black voids.
5. Confirm the route to each objective is still open.
6. Run `npm run typecheck` and `npm run build`.
