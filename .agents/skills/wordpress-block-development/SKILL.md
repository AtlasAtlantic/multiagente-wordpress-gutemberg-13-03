---
name: wordpress-block-development
description: Build or review modern WordPress blocks using portable standards for `block.json`, SSR vs static decisions, registration, data access, security, accessibility, and frontend behavior.
---

# wordpress-block-development

Use this skill for custom block work in themes or plugins.

## Use when

- creating or modifying a custom block
- deciding between static and server-rendered blocks
- reviewing `block.json`, block registration, or build output
- adding editor UI, block data access, frontend interactivity, patterns, or templates
- validating accessibility, security, and performance of a block implementation

## Workflow

1. Read the existing block or neighboring block implementations in the repository.
2. Decide static vs SSR before coding.
3. Treat `block.json` as the metadata source of truth.
4. Register from build artifacts when the project has a build step.
5. Keep editor, frontend, and server responsibilities separated.
6. Close with editor + frontend verification.

## Rules

- Default to WordPress Block API conventions and official packages.
- Prefer SSR when the block depends on runtime data, SEO, permissions, or shared rendering logic.
- Prefer static blocks for stable editorial markup.
- Keep attributes minimal and migration-safe.
- Use `@wordpress/data` and `@wordpress/core-data` before ad-hoc fetch logic.
- Load frontend JS only when the block actually needs interaction.
- Treat accessibility and escaping as required, not optional.

## References

- Read `references/block-architecture.md` for structure, registration, and rendering rules.
- Read `references/block-quality-checklist.md` for data, interactivity, accessibility, security, and validation.

## Expected output

- a block implementation aligned with WordPress block architecture
- a justified SSR vs static decision
- metadata and registration consistent with the repository build model
- explicit editor and frontend verification evidence
