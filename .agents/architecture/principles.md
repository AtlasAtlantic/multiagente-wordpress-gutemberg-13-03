# Principles

## Core rules

1. `.agents/` is the only canonical source for the multi-agent layer.
2. Runtime adapters consume canonical definitions and must not redefine them.
3. Deterministic tools execute critical operations whenever possible.
4. Agent outputs must be structured enough to support validation.
5. WordPress + Docker is a first-class target for this bootstrap.

## Operational rules

- Prefer canonical changes before runtime-specific changes.
- Keep v1 minimal and extensible.
- Avoid role overlap unless justified by pipeline needs.
- Keep generated runtime output out of canonical logic.
- Record every meaningful change in `docs/agents-change-record.md`.

## Validation rules

- Contracts should be machine-readable where possible.
- Cross-references between agents, pipelines and profiles must be valid.
- Runtime outputs should be reproducible from canonical inputs.
