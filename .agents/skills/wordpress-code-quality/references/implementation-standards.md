# WordPress Implementation Standards

This reference distills the reusable parts of the legacy standards for WordPress themes and plugins.

## Pre-implementation analysis

Before writing code:

1. Find similar classes, hooks, blocks, templates, or helpers already present.
2. Inspect naming, hook registration, dependency style, return types, and error handling.
3. Reuse existing patterns unless there is a documented reason to diverge.
4. Check whether WordPress core already provides the behavior you need.

## Coding standards

- Use `declare(strict_types=1);` when the repository already follows typed PHP.
- Keep one responsibility per class or module.
- Prefer `final` classes when inheritance is not needed.
- Match class names to file names and keep structure PSR-4 compatible when the project uses autoloading.
- Use hooks and filters instead of direct execution where WordPress lifecycle integration is required.
- Register theme support in `after_setup_theme`.
- Register runtime behavior in the correct hook instead of eager execution.

## Security rules

- Sanitize at input with the narrowest appropriate helper.
- Escape at output with the narrowest appropriate helper.
- Use `wp_kses_post()` only when HTML is intentionally allowed.
- Require nonces for forms, AJAX, and privileged state changes.
- Require capability checks before edits, deletes, or configuration changes.
- Prefer WordPress APIs for posts, metadata, users, taxonomies, and options.
- Avoid raw SQL. If it is necessary, require `$wpdb->prepare()`.
- Validate file paths, existence, and readability before file operations.

## Error handling and logging

- Do not commit `var_dump`, `print_r`, `dd`, or equivalent debug code.
- Prefer structured `error_log()` messages gated by `WP_DEBUG_LOG` in development-oriented flows.
- Include stable context keys such as `post_id`, `user_id`, `hook_name`, or `file_path`.
- Never log secrets, tokens, passwords, or sensitive personal data.
- Do not catch exceptions just to continue silently.
- If you catch, either:
  - add meaningful context and rethrow, or
  - convert to a domain-appropriate error path with logging
- Use `is_wp_error()` checks on WordPress API results that can fail.
- Keep user-facing failure messages generic; keep internals in logs.

## Common WordPress preferences

- Use `WP_Query`, `get_posts()`, and core APIs before custom SQL.
- Use text domains consistently for translatable strings.
- Use `after_setup_theme`, `init`, `wp_enqueue_scripts`, `admin_enqueue_scripts`, and similar lifecycle hooks intentionally.
- Load assets only where needed.

## Anti-patterns

- Direct output without escaping
- Nonce-free privileged actions
- Capability-free admin actions
- Swallowed exceptions
- Raw SQL with interpolated values
- File includes without validation
- New patterns introduced without checking existing repository conventions
