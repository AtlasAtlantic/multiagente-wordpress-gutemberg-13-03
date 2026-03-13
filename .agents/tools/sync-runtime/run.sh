#!/bin/sh
set -eu

ROOT="${1:-.agents}"
REVISION="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
PLATFORM_VERSION="$(sed -n 's/^platform_version:[[:space:]]*//p' "$ROOT/version.yaml" | head -n 1)"
SPEC_VERSION="$(sed -n 's/^spec_version:[[:space:]]*//p' "$ROOT/version.yaml" | head -n 1)"
ACTIVE_PROFILES="$(sed -n '/^active_profiles:/,/^[^ ]/p' "$ROOT/project/project.yaml" | sed -n 's/^  -[[:space:]]*//p' | paste -sd, -)"
status=0

for runtime in codex claude cursor chatgpt; do
  out="$ROOT/runtime/$runtime/output/manifest.txt"
  tmp="$(mktemp "$ROOT/runtime/$runtime/output/.manifest.XXXXXX")"
  {
    echo "runtime=$runtime"
    echo "adapter_role=derived-runtime"
    echo "source=$ROOT"
    echo "revision=$REVISION"
    echo "platform_version=${PLATFORM_VERSION:-unknown}"
    echo "spec=${SPEC_VERSION:-unknown}"
    echo "active_profiles=${ACTIVE_PROFILES:-unknown}"
  } > "$tmp"
  if ! mv "$tmp" "$out"; then
    rm -f "$tmp"
    echo "Failed to write runtime manifest: $out" >&2
    status=1
  fi
  if [ ! -f "$out" ]; then
    echo "Failed to write runtime manifest: $out" >&2
    status=1
  fi
done

if [ $status -eq 0 ]; then
  echo "Runtime sync OK: manifests generated"
fi

exit $status
