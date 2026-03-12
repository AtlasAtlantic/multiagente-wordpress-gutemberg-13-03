#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)
cd "$repo_root"

python3 - <<'PY'
import json
import pathlib
from datetime import datetime, timezone

try:
    import yaml
except Exception as exc:
    raise SystemExit(f"ERROR: PyYAML no disponible: {exc}")

root = pathlib.Path('.')
agents_dir = root / '.agents'
skills_dir = agents_dir / 'skills'
tiers_path = agents_dir / 'skills-tier.yaml'
output_dir = agents_dir / 'generated'
output_path = output_dir / 'skill-discovery-index.json'

tiers = yaml.safe_load(tiers_path.read_text()) or {}
tier_map = {}
for tier_name, values in (tiers.get('tiers', {}) or {}).items():
    for skill_name in values or []:
        tier_map[skill_name] = tier_name

def load_frontmatter(skill_md_path):
    text = skill_md_path.read_text()
    if not text.startswith('---\n'):
        return {}
    parts = text.split('---\n', 2)
    if len(parts) < 3:
        return {}
    data = yaml.safe_load(parts[1]) or {}
    return data if isinstance(data, dict) else {}

def normalize_tags(frontmatter):
    metadata = frontmatter.get('metadata')
    if not isinstance(metadata, dict):
        return []

    raw_tags = metadata.get('tags')
    if isinstance(raw_tags, list):
        return [tag.strip() for tag in raw_tags if isinstance(tag, str) and tag.strip()]
    if isinstance(raw_tags, str):
        return [tag.strip() for tag in raw_tags.split(',') if tag.strip()]
    return []

skills = []
for skill_dir in sorted(path for path in skills_dir.iterdir() if path.is_dir()):
    skill_md = skill_dir / 'SKILL.md'
    if not skill_md.exists():
        continue

    name = skill_dir.name
    frontmatter = load_frontmatter(skill_md)
    skills.append({
        "name": name,
        "path": f".agents/skills/{name}",
        "tier": tier_map.get(name),
        "source_files": [
            f".agents/skills/{name}/SKILL.md",
            ".agents/skills-tier.yaml",
        ],
        "summary": frontmatter.get('description'),
        "tags": normalize_tags(frontmatter),
        "inputs": [],
        "outputs": [],
        "capabilities": [],
    })

document = {
    "version": 1,
    "generated_at": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
    "source_of_truth": ".agents",
    "skills": skills,
}

output_dir.mkdir(parents=True, exist_ok=True)
output_path.write_text(json.dumps(document, indent=2, ensure_ascii=True) + "\n")
print(output_path)
PY
