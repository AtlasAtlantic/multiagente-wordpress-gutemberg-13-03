#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
RULES_DIR="$ROOT_DIR/rules"
OUT_FILE="$RULES_DIR/README.md"
TMP_FILE=$(mktemp)

{
  echo "# Indice de reglas Codex"
  echo
  echo "| Archivo | Titulo | alwaysApply | category |"
  echo "|---|---|---|---|"
  for file in "$RULES_DIR"/*.md; do
    base=$(basename "$file")
    if [ "$base" = "README.md" ] || [ "$base" = "README.min.md" ]; then
      continue
    fi
    title=$(awk '/^title:/{sub(/^title:[ ]*/,""); print; exit}' "$file")
    always_apply=$(awk '/^alwaysApply:/{sub(/^alwaysApply:[ ]*/,""); print; exit}' "$file")
    category=$(awk '/^category:/{sub(/^category:[ ]*/,""); print; exit}' "$file")
    [ -n "$title" ] || title="n/a"
    [ -n "$always_apply" ] || always_apply="n/a"
    [ -n "$category" ] || category="n/a"
    printf '| `%s` | %s | %s | %s |\n' "$base" "$title" "$always_apply" "$category"
  done | sort
} > "$TMP_FILE"

mv "$TMP_FILE" "$OUT_FILE"
echo "OK: $OUT_FILE"
