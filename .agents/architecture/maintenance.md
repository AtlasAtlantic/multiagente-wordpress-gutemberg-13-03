# Platform Maintenance

## What Counts As Platform

Reusable platform artifacts are the canonical pieces that should work across repositories:

- `architecture/`
- `agents/`
- `pipelines/`
- `schemas/`
- `skills/`
- `tools/`
- `runtime/` adapters, mappings, and templates
- `version.yaml`
- `catalog.yaml`
- `compatibility.yaml`

Modify platform artifacts when the change is reusable across multiple projects. Do not move repository-local behavior here.

## What Counts As A Reusable Profile

Reusable profiles live under `profiles/`.

Create a new profile when:

- a WordPress project type has stable behavior that can be reused
- an infrastructure pattern is shared across projects
- the new behavior cannot be expressed as a local override in `project/project.yaml`

Modify an existing profile when:

- the behavior already belongs to that reusable type
- the change should affect every project that activates that profile

Do not add repository-specific paths, service names, or one-off checks to reusable profiles.

## What Counts As Project Context

Project context lives in `project/project.yaml`.

It may contain only:

- repository-local paths
- local service names
- active profiles
- project-only checks
- explicit local overrides

It must not contain reusable behavior that already belongs in platform metadata or reusable profiles.

## What Counts As Derived Runtime

Derived runtime artifacts live under `runtime/*`.

Rules:

- `mapping.yaml` and templates are adapter definitions, still canonical
- `output/` is always derived
- `output/` must be regenerated with `sh .agents/tools/sync-runtime/run.sh`
- generated runtime files must never be edited manually
- runtime adapters must never redefine platform behavior outside `.agents/`

## How To Evolve The Platform

When adding profiles:

- prefer extending an existing reusable profile if the behavior is already covered
- create a new profile only when the behavior is a stable reusable variant
- update `catalog.yaml`, `compatibility.yaml`, schemas, and validation if the taxonomy changes

When deprecating profiles:

- keep the file while compatibility is needed
- mark it explicitly with a status such as `compatibility-profile` or `deprecated`
- remove it from primary reusable profile lists before deleting it completely

When changing catalog or compatibility:

- keep taxonomy consistent between `project_types`, reusable profiles, compatibility profiles, and infrastructure profiles
- ensure `validate-config` still covers every declared category
- rerun `doctor`, `validate-config`, and `sync-runtime`
