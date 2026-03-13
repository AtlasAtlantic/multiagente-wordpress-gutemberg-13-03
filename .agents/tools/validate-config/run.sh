#!/bin/sh
set -eu

ROOT="${1:-.agents}"
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
python3 "$SCRIPT_DIR/run.py" "$ROOT"
