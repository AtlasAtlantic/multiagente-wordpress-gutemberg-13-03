---
name: wordpress-technical-documentation
description: Create or update reusable technical documentation for WordPress features, bugs, and improvements. Use when documenting implementation intent, root cause, acceptance criteria, or verification without coupling docs to project-specific trackers.
---

# wordpress-technical-documentation

Use this skill when WordPress work needs durable technical documentation inside the repository.

## Use when

- writing or updating feature specifications
- documenting a bug and its fix
- defining an improvement plan without mixing it with bug documentation
- updating technical notes after implementation changes
- normalizing repository documentation structure and naming

## Workflow

1. Check whether the repository already has a document for the same issue or work item.
2. Reuse the same document when it already exists; avoid fragmentation.
3. Pick the correct template family from `references/document-types.md`.
4. Write in English unless a canonical repository rule explicitly says otherwise.
5. Close with verification notes, related files, and any remaining gaps.

## Rules

- Keep one document per feature, bug, or improvement topic.
- Use lowercase kebab-case file names for new Markdown files.
- Keep documents technical and repository-local; do not depend on Trello, Venus, or runtime-specific tooling.
- Distinguish clearly between:
  - feature documentation
  - bug documentation
  - improvement documentation
- Include scope boundaries and verification criteria.
- When the work changes existing behavior, explain current state before describing the target state.

## References

- Read `references/document-types.md` for mandatory sections by document type.
- Read `references/writing-rules.md` for naming, update flow, and anti-patterns.

## Expected output

- a single coherent technical document per topic
- documentation with explicit purpose, scope, and verification
- reduced ambiguity for future implementation and maintenance
