# Principles

## Core rules

1. `.agents/` is the only canonical source for the multi-agent layer.
2. The canonical model is separated into platform, profiles, project context, and derived runtime adapters.
3. Runtime adapters consume canonical definitions and must not redefine them.
4. Deterministic tools execute critical operations whenever possible.
5. Agent outputs must be structured enough to support validation.
6. WordPress + Docker is a first-class reusable target, not a one-off bootstrap detail.

## Operational rules

- Prefer canonical changes before runtime-specific changes.
- Keep v1 minimal and extensible.
- Avoid role overlap unless justified by pipeline needs.
- Keep generated runtime output out of canonical logic.
- Keep repository-specific paths, services, and conventions in `project/`.
- Keep reusable WordPress assumptions in `profiles/`.
- Record every meaningful change in `docs/agents-change-record.md`.

## Validation rules

- Contracts should be machine-readable where possible.
- Cross-references between agents, pipelines and profiles must be valid.
- Cross-references between profiles and project context must be valid.
- Runtime outputs should be reproducible from canonical inputs.
