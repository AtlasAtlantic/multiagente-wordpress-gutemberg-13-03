---
name: wp-block-development
description: "Use when developing WordPress (Gutenberg) blocks: block.json metadata, register_block_type(_from_metadata), attributes/serialization, supports, dynamic rendering (render.php/render_callback), deprecations/migrations, viewScript vs viewScriptModule, and @wordpress/scripts/@wordpress/create-block build and test workflows."
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+). Filesystem-based agent with bash + node. Some workflows require WP-CLI."
---

# WP Block Development

## When to use

Use this skill for block work such as:

- creating a new block, or updating an existing one
- changing `block.json` (scripts/styles/supports/attributes/render/viewScriptModule)
- fixing “block invalid / not saving / attributes not persisting”
- adding dynamic rendering (`render.php` / `render_callback`)
- block deprecations and migrations (`deprecated` versions)
- build tooling for blocks (`@wordpress/scripts`, `@wordpress/create-block`, `wp-env`)

## Inputs required

- Repo root and target (plugin vs theme vs full site).
- The block name/namespace and where it lives (path to `block.json` if known).
- Target WordPress version range (especially if using modules / `viewScriptModule`).

## Procedure

### 0) Triage and locate blocks

1. Run triage:
   - `node skills/wp-project-triage/scripts/detect_wp_project.mjs`
2. List blocks (deterministic scan):
   - `node skills/wp-block-development/scripts/list_blocks.mjs`
3. Identify the block root (directory containing `block.json`) you’re changing.

If this repo is a full site (`wp-content/` present), be explicit about *which* plugin/theme contains the block.

### 0.5) Decide the source/build contract before coding

Before creating or refactoring a block, decide whether the target uses direct source files or compiled assets.

Mandatory rules:

- if the target has a build step, treat source and runtime artifacts as different layers
- do not leave `block.json` pointing ambiguously to files that are sometimes source and sometimes build output
- do not overwrite source files with compiled output
- when a project uses build artifacts, keep runtime assets in a stable `build/` contract and make WordPress consume that contract consistently

Apply the VASS block standard as source of truth here:
- `./.agents/skills/vass-config/22-wordpress-blocks-standards.md`

Minimum decision to record before implementation:

- where source lives
- where compiled artifacts live
- which path WordPress registers from
- whether the block is static or dynamic

Preferred contract for block plugins that compile assets:

```text
my-plugin/
├── my-plugin.php
├── package.json
├── src/
│   └── blocks/
│       └── block-name/
│           ├── block.json
│           ├── index.js
│           ├── edit.js
│           ├── save.js
│           ├── editor.scss
│           └── style.scss
├── build/
│   └── blocks/
│       └── block-name/
│           ├── block.json
│           ├── index.js
│           ├── index.asset.php
│           ├── index.css
│           └── style-index.css
└── includes/
    └── blocks.php
```

Operational rules for that contract:

- `src/` is source only
- `build/` is runtime only
- WordPress registers blocks from `build/blocks/<block-name>`
- `block.json` consumed by WordPress lives in the runtime path
- do not place compiled artifacts outside the plugin/theme target
- do not compile into the same folder that contains block source files

### 1) Create a new block (if needed)

If you are creating a new block, prefer scaffolding rather than hand-rolling structure:

- Use `@wordpress/create-block` to scaffold a modern block/plugin setup.
- If you need Interactivity API from day 1, use the interactive template.

Read:
- `references/creating-new-blocks.md`

After scaffolding:

1. Re-run the block list script and confirm the new block root.
2. Continue with the remaining steps (model choice, metadata, registration, serialization).

If you scaffold or hand-roll a block, the initial implementation must include both halves of registration:

- server-side registration from metadata when the repo uses PHP registration
- client-side registration with `registerBlockType(...)` for the editor

Do not assume importing `edit.js` / `save.js` is enough; confirm that the entry file actually registers the block in JavaScript.

### 2) Ensure apiVersion 3 (WordPress 6.9+)

WordPress 6.9 enforces `apiVersion: 3` in the block.json schema. Blocks with apiVersion 2 or lower trigger console warnings when `SCRIPT_DEBUG` is enabled.

**Why this matters:**
- WordPress 7.0 will run the post editor in an iframe regardless of block apiVersion.
- apiVersion 3 ensures your block works correctly inside the iframed editor (style isolation, viewport units, media queries).

**Migration:** Changing from version 2 to 3 is usually as simple as updating the `apiVersion` field in `block.json`. However:
- Test in a local environment with the iframe editor enabled.
- Ensure any style handles are included in `block.json` (styles missing from the iframe won't apply).
- Third-party scripts attached to a specific `window` may have scoping issues.

Read:
- `references/block-json.md` (apiVersion and schema details)

### 3) Pick the right block model

- **Static block** (markup saved into post content): implement `save()`; keep attributes serialization stable.
- **Dynamic block** (server-rendered): use `render` in `block.json` (or `render_callback` in PHP) and keep `save()` minimal or `null`.
- **Interactive frontend behavior**:
  - Prefer `viewScriptModule` for modern module-based view scripts where supported.
  - If you're working primarily on `data-wp-*` directives or stores, also use `wp-interactivity-api`.

### 4) Update `block.json` safely

Make changes in the block’s `block.json`, then confirm registration matches metadata.

For field-by-field guidance, read:
- `references/block-json.md`

Common pitfalls:

- changing `name` breaks compatibility (treat it as stable API)
- changing saved markup without adding `deprecated` causes “Invalid block”
- adding attributes without defining source/serialization correctly causes “attribute not saving”
- pointing `editorScript`, `editorStyle`, or `style` at source files when the runtime really depends on compiled artifacts
- using a build step but leaving no stable `build/` contract for WordPress to consume

### 5) Register the block (server-side preferred)

Prefer PHP registration using metadata, especially when:

- you need dynamic rendering
- you need translations (`wp_set_script_translations`)
- you need conditional asset loading

Read and apply:
- `references/registration.md`

Hard rules:

- if the repo uses build artifacts, register from the runtime-ready path, not from ambiguous source files
- for dynamic blocks, confirm the PHP render path or `render_callback` is actually reachable at runtime
- for plugin/theme block setups that rely on metadata registration, verify the files referenced by `block.json` exist after build
- for block plugins with build, keep the full runtime path inside the plugin target; never emit build artifacts to the repo root or another external location

### 6) Implement edit/save/render patterns

Follow wrapper attribute best practices:

- Editor: `useBlockProps()`
- Static save: `useBlockProps.save()`
- Dynamic render (PHP): `get_block_wrapper_attributes()`

Read:
- `references/supports-and-wrappers.md`
- `references/dynamic-rendering.md` (if dynamic)

### 7) Inner blocks (block composition)

If your block is a “container” that nests other blocks, treat Inner Blocks as a first-class feature:

- Use `useInnerBlocksProps()` to integrate inner blocks with wrapper props.
- Keep migrations in mind if you change inner markup.

Read:
- `references/inner-blocks.md`

### 8) Attributes and serialization

Before changing attributes:

- confirm where the attribute value lives (comment delimiter vs HTML vs context)
- avoid the deprecated `meta` attribute source

Read:
- `references/attributes-and-serialization.md`

### 9) Migrations and deprecations (avoid "Invalid block")

If you change saved markup or attributes:

1. Add a `deprecated` entry (newest → oldest).
2. Provide `save` for old versions and an optional `migrate` to normalize attributes.

Read:
- `references/deprecations.md`

### 10) Tooling and verification commands

Prefer whatever the repo already uses:

- `@wordpress/scripts` (common) → run existing npm scripts
- `wp-env` (common) → use for local WP + E2E

Read:
- `references/tooling-and-testing.md`

### 11) Block preflight before closing

Before closing block work, verify the block contract end-to-end:

1. `block.json` points to files that really exist in the runtime layout
2. if the repo uses build:
   - build output is generated in the expected location
   - source files were not overwritten by the build
3. the block is registered in the editor client
4. if the block is dynamic, the block is also registered server-side and its frontend render path is active
5. if the task includes E2E, the chosen test strategy is explicit:
   - `frontend-render-smoke`
   - `editor-registration-smoke`
   - `dynamic-block-render-smoke`

## Verification

- Block appears in inserter and inserts successfully.
- Saving + reloading does not create “Invalid block”.
- Frontend output matches expectations (static: saved markup; dynamic: server output).
- Assets load where expected (editor vs frontend).
- Client registration exists: `window.wp.blocks.getBlockType( '<namespace/block>' )` or equivalent evidence.
- If dynamic, server-side registration exists and the render path is wired.
- If reusable E2E infrastructure exists in the target plugin/theme and the block is new or its visible behavior changed, create or update the block's associated E2E test.
- Run the repo’s lint/build/tests that triage recommends.

## Failure modes / debugging

If something fails, start here:

- `references/debugging.md` (common failures + fastest checks)
- `references/attributes-and-serialization.md` (attributes not saving)
- `references/deprecations.md` (invalid block after change)

Pay special attention to these failures:

- block available in PHP but missing in editor: usually missing `registerBlockType(...)` or broken editor asset loading
- block available in editor but missing in frontend: usually build/path mismatch or server-side registration gap
- dynamic block comment saved but no frontend output: usually block not registered server-side at runtime
- build succeeds but WordPress still cannot load the block: usually `block.json` points to the wrong layer (`src/` vs `build/`)

## Escalation

If you’re uncertain about upstream behavior/version support, consult canonical docs first:

- WordPress Developer Resources (Block Editor Handbook, Theme Handbook, Plugin Handbook)
- Gutenberg repo docs for bleeding-edge behaviors
