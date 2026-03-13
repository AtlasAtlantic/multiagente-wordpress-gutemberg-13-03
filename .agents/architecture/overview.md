# Overview

## Purpose

This architecture defines a reusable multi-agent platform for WordPress projects, with Docker as a first-class operating context.

## Canonical model

The canonical model is composed of four explicit layers:

- `platform`: architecture, roles, pipelines, skills, tools, schemas, and platform metadata
- `profiles`: reusable WordPress and infrastructure variants
- `project`: repository-specific context that activates profiles and local overrides
- `runtime`: derived adapters that consume canonical inputs

The canonical artifacts stored in those layers are composed of:

- agent roles
- pipelines
- profiles
- project context
- skills
- tools
- runtime adapters
- validation schemas

## Base workflow

The default workflow is:

`planner -> builder -> reviewer -> fixer -> qa`

This sequence is the default for feature work and the reference pattern for the rest of the system.

## Separation of concerns

- `architecture/` defines the rules
- `agents/` defines the roles
- `pipelines/` defines execution flow
- `profiles/` defines reusable project adaptation
- `project/` defines repository-local context
- `skills/` defines reusable capability
- `tools/` defines deterministic execution
- `runtime/` defines derived adapter projection
- `schemas/` defines formal validation
