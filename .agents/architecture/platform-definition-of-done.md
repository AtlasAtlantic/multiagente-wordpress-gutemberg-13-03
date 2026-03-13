# Platform Definition Of Done

A change in `.agents/` is done only when all of the following are true:

- `sh .agents/tools/doctor/run.sh` passes
- `sh .agents/tools/validate-config/run.sh` passes
- `sh .agents/tools/sync-runtime/run.sh` passes
- no canonical logic has been moved outside `.agents/`
- runtime output remains derived from canonical inputs
- reusable profiles are not mixed with project-local context
- `project/project.yaml` contains only local context or explicit overrides
- catalog and compatibility remain consistent with the files on disk
- runtime mappings remain consistent with what `sync-runtime` consumes
- `docs/agents-change-record.md` is updated in the same line of work

If any item above fails, the change is not complete.
