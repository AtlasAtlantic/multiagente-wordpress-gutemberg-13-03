# `.agents/` Source of Truth

## Purpose

This directory is the canonical source of truth for the multi-agent layer of this project and the reusable WordPress platform it carries.

It defines:

- platform architecture
- agent roles
- reusable pipelines
- reusable profiles
- project context
- skills
- agent tools
- runtime adapters
- validation schemas

## Rules

- Anything outside `.agents/` is derived, contextual, or runtime-specific.
- Runtime-specific outputs must not redefine canonical behavior.
- Changes to this directory must be reflected in `docs/agents-change-record.md`.
- Validation and sync flows must treat `.agents/` as the upstream source.
- The canonical model is layered as `platform`, `profiles`, `project`, and `runtime`.
- Repository-specific paths, services, and overrides belong in `project/`, not in reusable profiles.

## Initial scope

This platform targets reusable WordPress + Docker work across projects and prepares canonical projections for:

- Codex
- Claude
- Cursor
- ChatGPT

## Directory map

- `architecture/`: canonical principles and contracts
- `agents/`: role definitions
- `pipelines/`: standard workflows
- `profiles/`: reusable project-type and infrastructure behavior
- `project/`: repository-specific context and active profiles
- `skills/`: reusable capabilities
- `tools/`: deterministic tooling for the agent layer
- `runtime/`: runtime adapter definitions and generated outputs
- `schemas/`: formal validation rules
