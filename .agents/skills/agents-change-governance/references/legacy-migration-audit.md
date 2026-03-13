# Legacy Migration Audit

Use this reference when reviewing old skills, rules, or playbooks before integrating them into `.agents/`.

## Audit questions

Answer these explicitly for each legacy artifact or content block:

1. What is the real purpose?
2. Is that purpose still useful in the current platform?
3. Does it have a single responsibility?
4. Is it coupled to the old repository, toolchain, or workflow?
5. Is it reusable across WordPress + Docker projects?
6. Does it duplicate a current skill, tool, profile, or architectural rule?
7. Is the structure clear enough to keep?
8. Does it need refactor before reuse?
9. Should it remain one skill or be split?
10. Does it belong in a skill, tooling, architecture docs, or nowhere?

## Classification rules

Classify each legacy block into one of these outcomes:

- `migrar-sin-cambios`: only if it is already canonical, reusable, and aligned with current naming and scope
- `migrar-con-refactor`: reusable idea, but content or structure must change before landing in `.agents/`
- `dividir-en-varias-skills`: one legacy skill mixes independent responsibilities
- `fusionar-con-skill-existente`: the capability already exists and only needs to be strengthened
- `descartar`: repository-specific, obsolete, or incompatible with current platform rules
- `mover-a-documentacion`: useful rationale or reference, but not operational enough for a skill
- `mover-a-tooling`: deterministic execution belongs in `.agents/tools/`, not in prose

## Keep vs reject

Keep only content that is:

- canonical to `.agents/`
- reusable across repositories
- compatible with the current platform vocabulary
- specific enough to guide action
- small enough to remain maintainable

Reject or rewrite content that:

- treats `.codex/`, `CLAUDE.md`, `.cursor/`, or runtime outputs as source of truth
- hardcodes Trello, GitLab, Venus, or other project-local workflow decisions
- points to missing skills or repo-specific paths
- mixes WordPress business implementation rules with platform governance
- duplicates checks already covered by `doctor`, `validate-config`, or `sync-runtime`

## Migration heuristics

- Prefer extracting principles over copying documents.
- Replace repo-local paths with canonical `.agents/` paths.
- Replace runtime-specific governance with platform-first governance.
- Move detailed, optional guidance into `references/` instead of bloating `SKILL.md`.
- If the legacy material contains executable steps that must be reliable, move them into `.agents/tools/`.

## Decision pattern for old monolithic skills

If a legacy skill is a mixed index of standards:

1. Identify the smallest reusable capability it actually provides.
2. Separate reusable guidance from local operating procedure.
3. Keep the reusable core as one skill only if the purpose remains singular.
4. Drop the rest, or relocate it to documentation/tooling when that is the correct layer.
