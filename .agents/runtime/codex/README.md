# Codex Runtime Adapter

Codex is a derived adapter for the canonical platform stored in `.agents/`.

Rules:

- `.agents/` remains the source of truth
- `.codex/` must not introduce canonical architecture decisions
- Codex-specific templates and mappings may project canonical content, but not replace it
- generated output under `output/` is disposable and reproducible

Canonical inputs:

- `../../version.yaml`
- `../../catalog.yaml`
- `../../compatibility.yaml`
- `../../architecture/`
- `../../agents/`
- `../../pipelines/`
- `../../profiles/`
- `../../project/project.yaml`

Directories:

- `templates/`: adapter templates
- `output/`: generated artifacts
