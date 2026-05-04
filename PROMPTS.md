# Useful prompts

## Plan a new prototype

```text
Read AGENTS.md. Work in planning mode only. Do not edit files.

Prepare a plan for a small fantasy game prototype.
The result must be suitable for another agent to implement in Build mode.

Return:
- concept
- core loop
- MVP scope
- scenes
- systems
- resources/state
- asset usage
- implementation order
- what not to do in MVP
- risks and simplifications
```

## Build an MVP from a plan

```text
Read AGENTS.md and the plan below.
Implement only the MVP.
Use the existing Phaser structure.
Use generated asset keys when available.
Keep the prototype small and playable.
Run typecheck and build if possible.
```

## Debug

```text
Read AGENTS.md. Inspect the error and relevant files.
Fix the smallest possible cause.
Do not rewrite unrelated systems.
After the fix, run typecheck/build if possible.
```

## Cleanup after several feature iterations

```text
Read AGENTS.md. Do not add new gameplay.
Review the current prototype structure and propose a cleanup plan.
Focus on duplicated UI, oversized scenes, scattered state, and asset misuse.
After the plan, make only low-risk refactors that preserve behavior.
```

## Asset catalog task

```text
Read AGENTS.md and tools/ASSET_PIPELINE.md.
Inspect the sprite sheets in public/assets/source/spritesheets/.
For each sheet, identify whether it has a strict grid.
Propose columns, rows, frame names, categories, and output atlas names.
Do not invent frame names when visual identification is uncertain.
```
