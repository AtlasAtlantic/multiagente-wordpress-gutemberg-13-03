#!/bin/sh
set -eu
umask 022

ROOT="${1:-.agents}"
REVISION="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
status=0

python3 - "$ROOT" "$REVISION" <<'PY' | while IFS="$(printf '\t')" read -r runtime out template_dir source_of_truth adapter_role inputs_csv platform_version spec_version active_profiles; do
import sys
from pathlib import Path

import yaml

root = Path(sys.argv[1])
revision = sys.argv[2]

version_data = yaml.safe_load((root / "version.yaml").read_text(encoding="utf-8"))
project_data = yaml.safe_load((root / "project" / "project.yaml").read_text(encoding="utf-8"))

platform_version = str(version_data.get("platform_version", "unknown"))
spec_version = str(version_data.get("spec_version", "unknown"))
active_profiles = ",".join(project_data.get("active_profiles", [])) or "unknown"

for mapping_path in sorted((root / "runtime").glob("*/mapping.yaml")):
    mapping = yaml.safe_load(mapping_path.read_text(encoding="utf-8"))
    runtime = mapping.get("runtime", mapping_path.parent.name)
    output_dir = (mapping_path.parent / mapping.get("output_dir", "./output")).resolve()
    template_dir = (mapping_path.parent / mapping.get("template_dir", "./templates")).resolve()
    inputs = mapping.get("inputs", [])
    print(
        "\t".join(
            [
                runtime,
                str(output_dir / "manifest.txt"),
                str(template_dir),
                str(mapping.get("source_of_truth", "")),
                str(mapping.get("adapter_role", "")),
                ",".join(inputs),
                platform_version,
                spec_version,
                active_profiles,
            ]
        )
    )
PY
  output_dir="$(dirname "$out")"
  mkdir -p "$output_dir"
  find "$output_dir" -mindepth 1 ! -name '.gitkeep' -exec rm -rf {} +
  chmod 755 "$output_dir"
  touch "$output_dir/.gitkeep"
  chmod 644 "$output_dir/.gitkeep"
  tmp="$(mktemp "$(dirname "$out")/.manifest.XXXXXX")"
  {
    echo "runtime=$runtime"
    echo "adapter_role=$adapter_role"
    echo "source=$source_of_truth"
    echo "revision=$REVISION"
    echo "platform_version=$platform_version"
    echo "spec=$spec_version"
    echo "template_dir=$template_dir"
    echo "inputs=$inputs_csv"
    echo "active_profiles=$active_profiles"
  } > "$tmp"
  chmod 644 "$tmp"
  rm -f "$out"
  if ! cp "$tmp" "$out"; then
    rm -f "$tmp"
    echo "Failed to write runtime manifest: $out" >&2
    status=1
  fi
  rm -f "$tmp"
  chmod 644 "$out"
  if [ ! -f "$out" ]; then
    echo "Failed to write runtime manifest: $out" >&2
    status=1
  fi
done

if [ $status -eq 0 ]; then
  echo "Runtime sync OK: manifests generated"
fi

exit $status
