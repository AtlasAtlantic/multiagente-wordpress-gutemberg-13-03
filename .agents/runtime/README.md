# Runtime

This directory contains runtime adapters derived from the canonical model in `.agents/`.

Rules:

- runtime directories must not redefine canonical behavior
- generated output belongs under each runtime's `output/`
- templates and mappings are adapter-specific, but sourced from `.agents/`

Planned runtimes:

- `codex/`
- `claude/`
- `cursor/`
- `chatgpt/`
