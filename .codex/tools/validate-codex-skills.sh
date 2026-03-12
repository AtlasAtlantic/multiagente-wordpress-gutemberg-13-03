#!/bin/sh
set -eu

SKILLS_FILE=".codex/skills.yaml"

if [ ! -f "$SKILLS_FILE" ]; then
  echo "ERROR: no existe $SKILLS_FILE"
  exit 1
fi

paths=$(awk '/^[[:space:]]*path:[[:space:]]*/{sub(/^[[:space:]]*path:[[:space:]]*/,""); print}' "$SKILLS_FILE")

if [ -z "$paths" ]; then
  echo "ERROR: no se encontraron paths en $SKILLS_FILE"
  exit 1
fi

failed=0

for path in $paths; do
  if [ ! -d "$path" ]; then
    echo "ERROR: skill path no existe: $path"
    failed=1
  fi
done

if [ ! -f ".codex/skills/codex-doctor/SKILL.md" ]; then
  echo "ERROR: falta .codex/skills/codex-doctor/SKILL.md"
  failed=1
fi

if [ ! -x ".codex/skills/codex-doctor/scripts/run.sh" ]; then
  echo "ERROR: falta ejecutable .codex/skills/codex-doctor/scripts/run.sh"
  failed=1
fi

if [ "$failed" -ne 0 ]; then
  echo "RESULTADO: FAIL"
  exit 1
fi

echo "OK: skills de codex validadas"
echo "RESULTADO: OK"
