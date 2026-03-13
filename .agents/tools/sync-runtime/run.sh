#!/bin/sh
set -eu

ROOT="${1:-.agents}"
REVISION="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
status=0

for runtime in codex claude cursor chatgpt; do
  out="$ROOT/runtime/$runtime/output/manifest.txt"
  tmp="$(mktemp /tmp/agents-runtime.XXXXXX)"
  {
    echo "runtime=$runtime"
    echo "source=$ROOT"
    echo "revision=$REVISION"
    echo "spec=v1.0"
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
