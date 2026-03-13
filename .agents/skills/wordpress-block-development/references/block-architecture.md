# Block Architecture

This reference condenses the reusable architecture rules from the legacy block standards.

## Core decisions

- Use the WordPress Block API as the baseline.
- Keep `block.json` as the metadata source of truth.
- If the repository compiles assets, register blocks from `build/`, not `src/`.
- Separate editor-only logic, frontend logic, and server rendering.

## Static vs SSR

Prefer SSR when:

- the block depends on posts, taxonomies, users, settings, or external data
- the rendered HTML should stay indexable and consistent
- permissions or server-side business rules affect rendering
- one canonical render path should be shared across contexts

Prefer static when:

- the block is editorial and self-contained
- markup does not depend on runtime data
- the block does not need server-side decisions

If unsure and runtime data is involved, prefer SSR.

## Expected structure

Typical source layout:

- `block.json`
- `index.js`
- `edit.js`
- `save.js` for static blocks
- `render.php` for SSR blocks
- `style.*`
- `editor.*`
- `view.js` only when frontend interaction exists

Related artifacts may also include:

- patterns
- templates
- template parts

## Registration rules

- Register blocks on `init`.
- Point `register_block_type()` at the directory containing `block.json`.
- In built projects, point registration to built artifacts.
- Use render callbacks for SSR blocks.
- Enqueue frontend scripts conditionally when interaction depends on attributes or context.

## Metadata guidance

- Keep `name` namespaced and kebab-case.
- Use only the `supports` flags the design actually allows.
- Disable HTML editing when editorial freedom is not intended.
- Keep attributes minimal, serializable, and forward-compatible.
- Avoid storing large objects or REST payloads in attributes.
