# `.agents/` Source of Truth

## Purpose

This directory is the canonical source of truth for the multi-agent layer of this project.

It defines:

- architecture
- agent roles
- pipelines
- project profiles
- skills
- agent tools
- runtime adapters
- validation schemas

## Rules

- Anything outside `.agents/` is derived, contextual, or runtime-specific.
- Runtime-specific outputs must not redefine canonical behavior.
- Changes to this directory must be reflected in `docs/agents-change-record.md`.
- Validation and sync flows must treat `.agents/` as the upstream source.

## Initial scope

This v1 bootstrap targets a WordPress + Docker project and prepares the base for:

- Codex
- Claude
- Cursor
- ChatGPT

## Directory map

- `architecture/`: canonical principles and contracts
- `agents/`: role definitions
- `pipelines/`: standard workflows
- `profiles/`: project-specific behavior
- `skills/`: reusable capabilities
- `tools/`: deterministic tooling for the agent layer
- `runtime/`: runtime adapter definitions and generated outputs
- `schemas/`: formal validation rules
