#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
RULES_DIR="$ROOT_DIR/rules"
ALLOWED_RULE="25-codex-configuration-change-standards.md"

if [ ! -d "$RULES_DIR" ]; then
  echo "ERROR: no existe $RULES_DIR"
  exit 1
fi

failed=0
count=0

for file in "$RULES_DIR"/*.md; do
  base=$(basename "$file")
  if [ "$base" = "README.md" ] || [ "$base" = "README.min.md" ]; then
    continue
  fi

  if [ "$base" != "$ALLOWED_RULE" ]; then
    echo "ERROR: regla fuera de alcance en .codex/rules: $base"
    failed=1
    continue
  fi

  count=$((count + 1))

  first_line=$(sed -n '1p' "$file")
  if [ "$first_line" != "---" ]; then
    echo "ERROR: frontmatter ausente en $base"
    failed=1
  fi

  if ! rg -q '^title:' "$file"; then
    echo "ERROR: title ausente en $base"
    failed=1
  fi

  if ! rg -q '^alwaysApply:' "$file" && ! rg -q '^status:' "$file"; then
    echo "ERROR: alwaysApply/status ausente en $base"
    failed=1
  fi

  if ! rg -q '^category:' "$file" && ! rg -q '^scope:' "$file"; then
    echo "ERROR: category/scope ausente en $base"
    failed=1
  fi
done

if [ "$count" -eq 0 ]; then
  echo "ERROR: no hay reglas en $RULES_DIR"
  exit 1
fi

if [ "$count" -ne 1 ]; then
  echo "ERROR: se esperaba exactamente 1 regla de configuracion Codex y se encontraron $count"
  exit 1
fi

if [ "$failed" -ne 0 ]; then
  echo "RESULTADO: FAIL"
  exit 1
fi

echo "OK: $count reglas validadas"
echo "RESULTADO: OK"
