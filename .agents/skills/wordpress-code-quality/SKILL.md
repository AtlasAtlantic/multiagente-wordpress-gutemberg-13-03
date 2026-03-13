---
name: wordpress-code-quality
description: Apply reusable WordPress implementation standards for analysis, coding, validation, logging, and low-risk delivery. Use when changing WordPress PHP, hooks, templates, plugins, themes, or project-level quality checks.
---

# wordpress-code-quality

Use this skill for WordPress implementation work that must stay portable across projects.

## Use when

- adding or changing WordPress PHP code
- introducing hooks, filters, templates, theme setup, or plugin logic
- planning verification for WordPress changes
- reviewing logging, sanitization, escaping, nonces, capabilities, or DB access
- preparing a small, reviewable change set for delivery

## Workflow

1. Before coding, inspect similar code already present in the repository.
2. Prefer WordPress APIs and established project patterns over custom abstractions.
3. Apply the security and error-handling rules in `references/implementation-standards.md`.
4. Choose a verification strategy from `references/verification-and-delivery.md`.
5. Close with explicit validation evidence and residual risk notes when full verification is not possible.

## Rules

- Treat existing repository patterns as the first implementation reference.
- Use one focused change set at a time; do not mix unrelated refactors.
- Follow WPCS-compatible structure and WordPress naming conventions.
- Sanitize on input, validate before use, and escape on output.
- Use nonces and capability checks for privileged actions.
- Prefer `get_posts()`, `WP_Query`, metadata APIs, and core helpers before raw SQL.
- If `$wpdb` is necessary, require prepared statements.
- Avoid ad-hoc debugging committed to the codebase.
- Log unexpected failures with stable, non-sensitive context.
- Do not swallow exceptions; either let them bubble, or log and rethrow with purpose.

## References

- Read `references/implementation-standards.md` for coding, security, and logging rules.
- Read `references/verification-and-delivery.md` for pre-implementation analysis, manual verification, and PR sizing.
- Pair with `wordpress-technical-documentation` when the change needs durable feature, bug, or improvement documentation.

## Expected output

- WordPress code aligned with existing repository patterns
- explicit verification strategy and evidence
- safe error handling and security posture
- a reviewable, low-risk change set
