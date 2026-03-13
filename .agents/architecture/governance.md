# Governance

## Change flow

1. Modify canonical artifacts in `.agents/`.
2. Record the change in `docs/agents-change-record.md`.
3. Run structural and config validation.
4. Regenerate runtime-derived output when the environment allows it.
5. Review diffs between canonical changes and derived output.

## Validation flow

- run `sh .agents/tools/doctor/run.sh`
- run `sh .agents/tools/validate-config/run.sh`
- run schema validation tooling when available

## Runtime sync flow

- runtime output must be treated as derived
- runtime output must be regenerated from `.agents/`
- runtime output should include revision and spec traceability

## Spec evolution

- additive compatible changes stay within v1
- breaking structural changes require a new major version
- runtime adapters should declare the spec version they consume

## Drift prevention

- never edit runtime output as if it were canonical
- never store canonical decisions only in runtime-specific files
- review change log and runtime mappings when architecture changes
