#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/../../.." && pwd)
FAILED=0

run_check() {
  check_cmd=$1
  echo "==> $check_cmd"
  if sh "$check_cmd"; then
    echo "OK: $check_cmd"
  else
    echo "FAIL: $check_cmd"
    FAILED=1
  fi
  echo
}

run_check "$ROOT_DIR/tools/update-codex-rules-index.sh"
run_check "$ROOT_DIR/tools/validate-codex-rules.sh"
run_check "$ROOT_DIR/tools/validate-codex-readme.sh"
run_check "$ROOT_DIR/tools/validate-codex-skills.sh"

if [ "$FAILED" -ne 0 ]; then
  echo "RESULTADO: FAIL"
  exit 1
fi

echo "RESULTADO: OK"
