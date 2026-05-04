# Quickstart

This is a universal Phaser + TypeScript template for AI-assisted fantasy game prototypes.

## 1. Install

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Open the local URL shown in the terminal.

## 3. Build for sharing

```bash
npm run build
```

The final browser build appears in:

```text
dist/
```

You can upload `dist/` to a static host such as Netlify Drop.

## 4. Where to put downloaded sprite sheets

Put raw downloaded sprite sheets here:

```text
public/assets/source/spritesheets/
```

Examples:

```text
public/assets/source/spritesheets/fantasy-items.png
public/assets/source/spritesheets/weapons.png
public/assets/source/spritesheets/resources.png
```

Put separate PNG icons here:

```text
public/assets/source/icons/
```

Examples:

```text
public/assets/source/icons/weapons/sword.png
public/assets/source/icons/resources/wood.png
```

Do not manually put raw downloaded files into:

```text
public/assets/atlases/
public/assets/catalog/
```

Those folders are for generated, game-ready atlas files and manifests.

## 5. Atlas workflow

For a clean grid sprite sheet:

1. Put the source image into `public/assets/source/spritesheets/`.
2. Edit `tools/asset-sheets.config.json`.
3. Run:

```bash
npm run build:atlas
```

This generates:

```text
public/assets/atlases/*.png
public/assets/atlases/*.atlas.json
public/assets/catalog/*.manifest.json
src/content/generatedAssetKeys.ts
```

Then run:

```bash
npm run validate:assets
npm run build
```

## 6. Agent workflow

Use planning first:

```text
Read AGENTS.md. Work in planning mode only. Do not edit files.
Create an MVP plan for a small fantasy game prototype.
Return concept, core loop, systems, scenes, asset usage, implementation order, and what not to do in the MVP.
```

Then build:

```text
Read AGENTS.md and the plan. Implement only the MVP. Use existing project structure and generated asset keys. Keep it small and playable. Run typecheck/build if possible.
```
