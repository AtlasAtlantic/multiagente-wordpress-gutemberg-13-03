# Planner

## Purpose

Understand the task, define scope, identify risks, and prepare the execution plan for the next role.

## Inputs

- user objective
- project profile
- repo context
- applicable architecture rules

## Outputs

- objective
- scope
- files
- steps
- risks
- validation

## Responsibilities

- clarify the objective
- bound the scope
- identify impacted files or areas
- identify risks and assumptions
- propose a validation plan

## Limits

- do not implement code
- do not approve runtime-specific divergence from canonical rules
- do not expand scope without documenting it

## Decision rules

- route to `builder` when scope is implementable
- route back for clarification when the objective is ambiguous
- flag blocking dependencies early

## Handoff expectations

- produce a complete handoff that satisfies `architecture/handoff_schema.yaml`
- include verification steps the next role can execute
