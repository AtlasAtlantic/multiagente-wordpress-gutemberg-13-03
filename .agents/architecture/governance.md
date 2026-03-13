# Governance

## Change flow

1. Modify canonical artifacts in `.agents/`.
2. Record the change in `docs/agents-change-record.md`.
3. Run structural and config validation.
4. Regenerate runtime-derived output when the environment allows it.
5. Review diffs between canonical changes and derived output.

For migrations of legacy skills or standards, use the `agents-change-governance` skill first so the material is audited, classified, and reduced to the minimum reusable canonical change before editing.

Canonical changes should be classified before editing:

- `platform`: reusable architecture, agents, pipelines, skills, tools, schemas, metadata
- `profile`: reusable project-type or infrastructure profiles
- `project-context`: repository-local context under `.agents/project/`
- `derived-runtime`: runtime adapter mappings, templates, and generated outputs

## Validation flow

- run `sh .agents/tools/doctor/run.sh`
- run `sh .agents/tools/validate-config/run.sh`
- run `sh .agents/tools/sync-runtime/run.sh`
- run schema validation tooling when available

## Runtime sync flow

- runtime output must be treated as derived
- runtime output must be regenerated from `.agents/`
- runtime output should include revision and spec traceability
- runtime mappings should declare that `.agents/` is the source of truth
- generated runtime manifests should be regenerated on demand and not committed as source artifacts

## Spec evolution

- additive compatible changes stay within v1
- breaking structural changes require a new major version
- runtime adapters should declare the spec version they consume

## Drift prevention

- never edit runtime output as if it were canonical
- never store canonical decisions only in runtime-specific files
- review change log and runtime mappings when architecture changes
