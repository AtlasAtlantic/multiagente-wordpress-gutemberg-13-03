# Project Context

This directory contains repository-specific canonical context.

Rules:

- use it for active profiles, local paths, service names, and overrides
- do not duplicate reusable WordPress assumptions that already live in `profiles/`
- do not duplicate reusable tool preferences or stack defaults unless a local override is required
- runtime adapters may consume this context, but must not redefine it
