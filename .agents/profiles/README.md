# Profiles

This directory contains reusable profiles that adapt the agent layer to WordPress project types and infrastructure patterns.

Reusable profiles:

- `wordpress.yaml` (legacy umbrella compatibility profile)
- `wordpress-plugin.yaml`
- `wordpress-theme.yaml`
- `wordpress-block-theme.yaml`
- `wordpress-hybrid.yaml`
- `docker-wordpress-standard.yaml`
- `generic-web.yaml`

Rules:

- reusable assumptions only
- no repository-specific paths or service names
- project activation happens in `.agents/project/project.yaml`
