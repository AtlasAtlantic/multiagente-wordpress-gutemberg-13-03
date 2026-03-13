# Runtime

This directory contains runtime adapters derived from the canonical model in `.agents/`.

Rules:

- runtime directories must not redefine canonical behavior
- `.agents/version.yaml`, `.agents/catalog.yaml`, `.agents/compatibility.yaml`, and `.agents/project/project.yaml` are canonical inputs when relevant
- generated output belongs under each runtime's `output/`
- templates and mappings are adapter-specific, but sourced from `.agents/`
- generated output is derived and should not be treated as canonical
- generated manifests are meant to be regenerated on demand and are not versioned

Planned runtimes:

- `codex/`
- `claude/`
- `cursor/`
- `chatgpt/`
