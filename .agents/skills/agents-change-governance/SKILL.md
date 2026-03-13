---
name: agents-change-governance
description: Govern canonical `.agents/` changes and legacy migrations. Use when auditing old skills, classifying reusable content, applying minimal platform-safe refactors, and closing with traceable validation.
---

# agents-change-governance

Use this skill to evolve `.agents/` without importing legacy material blindly.

## Use when

- auditing skills or rules from legacy repositories
- migrating reusable guidance into the current `.agents/` platform
- changing canonical architecture, skills, tools, or validation flows
- deciding whether legacy content should be refactored, merged, moved, or discarded

## Workflow

1. Read the current canonical context first:
   - `.agents/AGENTS.md`
   - relevant files in `.agents/architecture/`
   - current skills in `.agents/skills/`
   - `docs/agents-change-log.md`
   - `docs/agents-change-record.md`
2. Audit the legacy material against the current platform before editing anything.
3. Keep only reusable content that belongs inside canonical `.agents/`.
4. Prefer improving an existing skill before creating a new one.
5. When a new skill is justified, keep it single-purpose and move detailed guidance into `references/`.
6. Close with explicit validation evidence and mandatory traceability updates.

## References

- For classification rules and migration decisions, read `references/legacy-migration-audit.md`.
- For execution guardrails, validation, and change recording, read `references/platform-change-checklist.md`.

## Expected output

- a justified migration decision
- minimal canonical edits in `.agents/`
- updated change traceability in `docs/agents-change-record.md`
- validation evidence or a precise explanation of why a check could not run
