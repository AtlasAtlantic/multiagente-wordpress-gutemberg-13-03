#!/bin/sh
set -eu

ROOT="${1:-.agents}"

required_dirs="
$ROOT
$ROOT/architecture
$ROOT/agents
$ROOT/pipelines
$ROOT/profiles
$ROOT/project
$ROOT/skills
$ROOT/tools
$ROOT/runtime
$ROOT/schemas
"

required_files="
$ROOT/AGENTS.md
$ROOT/version.yaml
$ROOT/catalog.yaml
$ROOT/compatibility.yaml
$ROOT/project/project.yaml
"

status=0

for dir in $required_dirs; do
  if [ ! -d "$dir" ]; then
    echo "Missing directory: $dir" >&2
    status=1
  fi
done

for file in $required_files; do
  if [ ! -f "$file" ]; then
    echo "Missing required file: $file" >&2
    status=1
  fi
done

if [ $status -eq 0 ]; then
  echo "Doctor OK: base structure present"
fi

exit $status
