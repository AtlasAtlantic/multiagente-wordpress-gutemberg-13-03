# Platform Change Checklist

Use this reference when modifying canonical `.agents/` artifacts.

## Before editing

- Read the current architecture and the nearest existing skill/tool first.
- State the intended scope in terms of canonical areas: `architecture`, `skills`, `tools`, `profiles`, `runtime`, `schemas`, `docs`.
- Prefer minimal, localized edits.
- Avoid introducing a new skill if an existing one can absorb the change cleanly.

## Editing rules

- `.agents/` is the source of truth; runtime adapters are derived.
- Do not move canonical logic into runtime output.
- Do not import repository-specific workflow assumptions into reusable skills.
- Keep one clear purpose per skill.
- Use `references/` for detailed guidance and keep `SKILL.md` short.

## Validation closure

Run these checks after canonical changes whenever the environment allows it:

1. `sh .agents/tools/doctor/run.sh`
2. `sh .agents/tools/validate-config/run.sh`
3. `sh .agents/tools/sync-runtime/run.sh`

Also verify:

- cross-references still resolve
- no duplicate capability was introduced
- derived runtime output still reflects canonical inputs

## Traceability closure

Every meaningful change must be recorded in `docs/agents-change-record.md`.

Each entry should capture:

- why the change was made
- which canonical files changed
- whether derived runtime artifacts changed
- which validations ran
- any remaining risks or follow-up

## Recommended delivery pattern

1. Audit legacy material.
2. Classify each content block.
3. Define the minimal integration plan.
4. Edit canonical files.
5. Update change record.
6. Run validation.
7. Report residual gaps precisely if validation cannot complete.
