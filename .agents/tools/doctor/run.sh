#!/bin/sh
set -eu

ROOT="${1:-.agents}"

required_dirs="
$ROOT
$ROOT/architecture
$ROOT/agents
$ROOT/pipelines
$ROOT/profiles
$ROOT/skills
$ROOT/tools
$ROOT/runtime
$ROOT/schemas
"

status=0

for dir in $required_dirs; do
  if [ ! -d "$dir" ]; then
    echo "Missing directory: $dir" >&2
    status=1
  fi
done

if [ $status -eq 0 ]; then
  echo "Doctor OK: base structure present"
fi

exit $status
