#!/bin/sh
set -eu

ROOT="${1:-.agents}"
TYPE="${2:-}"
NAME="${3:-}"

if [ -z "$TYPE" ] || [ -z "$NAME" ]; then
  echo "Usage: $0 [root] <agent|pipeline|profile|skill> <name>" >&2
  exit 1
fi

case "$TYPE" in
  agent)
    target="$ROOT/agents/$NAME.md"
    ;;
  pipeline)
    target="$ROOT/pipelines/$NAME.yaml"
    ;;
  profile)
    target="$ROOT/profiles/$NAME.yaml"
    ;;
  skill)
    target="$ROOT/skills/$NAME/SKILL.md"
    mkdir -p "$ROOT/skills/$NAME"
    ;;
  *)
    echo "Unsupported type: $TYPE" >&2
    exit 1
    ;;
esac

if [ -e "$target" ]; then
  echo "Target already exists: $target" >&2
  exit 1
fi

mkdir -p "$(dirname "$target")"
printf "Placeholder for %s %s\n" "$TYPE" "$NAME" > "$target"
echo "Scaffold OK: created $target"
