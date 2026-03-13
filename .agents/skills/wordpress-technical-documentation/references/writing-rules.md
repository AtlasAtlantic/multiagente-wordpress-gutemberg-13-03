# Writing Rules

These rules adapt the reusable parts of the legacy documentation standards.

## Naming

- Use lowercase kebab-case for new Markdown file names.
- Keep file names descriptive and stable.
- Prefer repository-local identifiers or descriptive names over external tracker IDs when portability matters.

## Update flow

- If a document already exists for the same topic, update it instead of creating another one.
- Reflect code changes in the corresponding technical document when behavior, interfaces, or operational expectations changed.
- Keep documentation aligned with the current repository structure, not with paths inherited from an older project.

## Content rules

- Write in English unless canonical repository policy says otherwise.
- Explain what the system does, why it exists, and how it should be verified.
- Keep scope explicit with clear exclusions.
- Prefer concise examples over long narrative prose.
- When documenting implementation details, reference the relevant WordPress patterns, hooks, or components.

## Anti-patterns

- Duplicating documents for the same topic
- Depending on Trello, HITO/CHILD, Venus, or external board structure
- Mixing feature, bug, and improvement semantics in one document
- Leaving verification undefined
- Using vague titles such as `update`, `changes`, or `fixes`
