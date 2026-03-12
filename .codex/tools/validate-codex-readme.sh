#!/bin/sh
set -eu

README_FILE=".codex/README.md"

if [ ! -f "$README_FILE" ]; then
  echo "ERROR: no existe $README_FILE"
  exit 1
fi

for pattern in \
  '.codex/tools/update-codex-rules-index.sh' \
  '.codex/tools/validate-codex-rules.sh' \
  '.codex/tools/validate-codex-readme.sh' \
  '.codex/tools/validate-codex-skills.sh' \
  '.codex/skills/codex-doctor/scripts/run.sh'
do
  if ! rg -Fq "$pattern" "$README_FILE"; then
    echo "ERROR: falta referencia '$pattern' en $README_FILE"
    exit 1
  fi
done

echo "OK: $README_FILE validado"
echo "RESULTADO: OK"
