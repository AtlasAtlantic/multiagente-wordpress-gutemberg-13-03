# Overview

## Purpose

This architecture defines a portable multi-agent base for software projects, with an initial focus on WordPress running on Docker.

## Canonical model

The canonical model is composed of:

- agent roles
- pipelines
- profiles
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
- `profiles/` defines project adaptation
- `skills/` defines reusable capability
- `tools/` defines deterministic execution
- `runtime/` defines adapter projection
- `schemas/` defines formal validation
