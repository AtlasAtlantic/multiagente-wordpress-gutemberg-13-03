#!/bin/sh
set -eu

ROOT="${1:-.agents}"
status=0

for file in \
  "$ROOT/architecture/routing.yaml" \
  "$ROOT/architecture/handoff_schema.yaml" \
  "$ROOT/profiles/wordpress.yaml" \
  "$ROOT/profiles/generic-web.yaml"; do
  if [ ! -f "$file" ]; then
    echo "Missing required file: $file" >&2
    status=1
  fi
done

for role in planner builder reviewer fixer qa; do
  if [ ! -f "$ROOT/agents/$role.md" ]; then
    echo "Missing agent role: $ROOT/agents/$role.md" >&2
    status=1
  fi
done

for pipeline in feature bugfix refactor audit; do
  if [ ! -f "$ROOT/pipelines/$pipeline.yaml" ]; then
    echo "Missing pipeline: $ROOT/pipelines/$pipeline.yaml" >&2
    status=1
  fi
done

for pipeline in feature bugfix refactor audit; do
  if ! rg -q "pipeline: $pipeline" "$ROOT/pipelines/$pipeline.yaml"; then
    echo "Pipeline name mismatch in: $ROOT/pipelines/$pipeline.yaml" >&2
    status=1
  fi
done

for role in planner builder reviewer fixer qa; do
  if ! rg -q "^[[:space:]]*$role:" "$ROOT/architecture/routing.yaml"; then
    echo "Routing missing role: $role" >&2
    status=1
  fi
done

for pipeline in $(awk '
  /^applicable_pipelines:/ { in_block=1; next }
  in_block && /^[^[:space:]-]/ { in_block=0 }
  in_block && /^[[:space:]]+-[[:space:]]+/ {
    sub(/^[[:space:]]+-[[:space:]]+/, "", $0)
    print
  }
' "$ROOT/profiles/wordpress.yaml"); do
  if [ ! -f "$ROOT/pipelines/$pipeline.yaml" ]; then
    echo "Profile references missing pipeline: $pipeline" >&2
    status=1
  fi
done

for skill in $(awk '
  /^recommended_skills:/ { in_block=1; next }
  in_block && /^[^[:space:]-]/ { in_block=0 }
  in_block && /^[[:space:]]+-[[:space:]]+/ {
    sub(/^[[:space:]]+-[[:space:]]+/, "", $0)
    print
  }
' "$ROOT/profiles/wordpress.yaml"); do
  if [ ! -d "$ROOT/skills/$skill" ]; then
    echo "Profile references missing skill: $skill" >&2
    status=1
  fi
done

if [ $status -eq 0 ]; then
  echo "Validate OK: required canonical files present"
fi

exit $status
