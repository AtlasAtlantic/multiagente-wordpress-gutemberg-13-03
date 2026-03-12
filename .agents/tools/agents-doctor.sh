#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)
cd "$repo_root"

python3 - <<'PY'
import json
import pathlib
import re
import sys

try:
    import yaml
except Exception as exc:
    print(f"ERROR: PyYAML no disponible: {exc}")
    sys.exit(1)

root = pathlib.Path('.')
agents_dir = root / '.agents'
skills_dir = agents_dir / 'skills'
profiles_dir = agents_dir / 'profiles'
prompts_dir = agents_dir / 'prompts'
skills_alias = root / 'skills'
skill_index_spec = agents_dir / 'skill-discovery-index-v1.md'
skill_discovery_index = agents_dir / 'generated' / 'skill-discovery-index.json'

errors = []
warnings = []

def ensure_skills_alias():
    expected = pathlib.Path('.agents/skills')
    try:
        if not skills_alias.exists() and not skills_alias.is_symlink():
            skills_alias.symlink_to(expected)
            warnings.append('skills recreado automaticamente como symlink a .agents/skills')
            return
        if skills_alias.is_symlink():
            target = pathlib.Path(str(skills_alias.readlink()))
            if target != expected:
                skills_alias.unlink()
                skills_alias.symlink_to(expected)
                warnings.append('skills reapuntado automaticamente a .agents/skills')
            return
        errors.append('skills existe pero no es un symlink; no se corrige automaticamente')
    except Exception as exc:
        errors.append(f'no se pudo asegurar el alias skills: {exc}')

skill_dirs = sorted(p.name for p in skills_dir.iterdir() if p.is_dir())
skill_set = set(skill_dirs)
for skill in skill_dirs:
    if not (skills_dir / skill / 'SKILL.md').exists():
        errors.append(f'skill sin SKILL.md: {skill}')

required_common_files = [
    agents_dir / 'README.md',
    agents_dir / 'RUNTIMES.md',
    agents_dir / 'GUARDRAILS.md',
    agents_dir / 'multiagent.yaml',
    agents_dir / 'skills-tier.yaml',
    skill_index_spec,
]
for file_path in required_common_files:
    if not file_path.exists():
        errors.append(f'archivo comun requerido no existe: {file_path}')

ensure_skills_alias()

lock = json.loads((root / 'skills-lock.json').read_text())
lock_set = set(lock.get('skills', {}).keys())
missing_in_lock = sorted(skill_set - lock_set)
extra_in_lock = sorted(lock_set - skill_set)
for skill in missing_in_lock:
    warnings.append(f'skill local no presente en skills-lock.json: {skill}')
for skill in extra_in_lock:
    errors.append(f'skills-lock.json referencia una skill inexistente: {skill}')

multiagent = yaml.safe_load((agents_dir / 'multiagent.yaml').read_text())
quality_contract = multiagent.get('quality_contract', {}) or {}
gate_ids = {item['id'] for item in quality_contract.get('gates_catalog', []) or [] if isinstance(item, dict) and item.get('id')}
check_ids = {item['id'] for item in quality_contract.get('checks_catalog', []) or [] if isinstance(item, dict) and item.get('id')}
common_required_gates = set(quality_contract.get('common_required_gates', []) or [])
for gate in sorted(common_required_gates - gate_ids):
    errors.append(f'quality_contract.common_required_gates referencia un gate inexistente: {gate}')

def collect_skills(node):
    found = []
    if isinstance(node, dict):
        for key, value in node.items():
            if key in {'required_skills_by_domain', 'profile_registry'} and isinstance(value, dict):
                for v in value.values():
                    if isinstance(v, list):
                        found.extend(v)
                    elif isinstance(v, str):
                        found.append(v)
            else:
                found.extend(collect_skills(value))
    elif isinstance(node, list):
        for item in node:
            found.extend(collect_skills(item))
    return found

referenced_skills = set(collect_skills(multiagent))
for skill in sorted(referenced_skills):
    if skill not in skill_set:
        errors.append(f'.agents/multiagent.yaml referencia una skill inexistente: {skill}')

auto_routing = multiagent.get('activation', {}).get('auto_routing', []) or []
seen_keywords = {}
for route_index, route in enumerate(auto_routing, start=1):
    route_skills = set(collect_skills(route))
    if not route_skills:
        errors.append(f'auto_routing route {route_index} no referencia skills')
    for skill in sorted(route_skills - skill_set):
        errors.append(f'auto_routing route {route_index} referencia una skill inexistente: {skill}')
    keywords = route.get('when_request_matches_any', []) or []
    if not keywords:
        errors.append(f'auto_routing route {route_index} no define keywords')
    for keyword in keywords:
        normalized = keyword.strip().lower()
        if normalized in seen_keywords:
            errors.append(f'keyword duplicada en auto_routing: {keyword} (routes {seen_keywords[normalized]} y {route_index})')
        else:
            seen_keywords[normalized] = route_index

profiles = sorted(profiles_dir.glob('*.yaml'))
if not profiles:
    errors.append('no hay perfiles en .agents/profiles')

profile_ids = set()
profile_referenced_skills = set()
for profile_path in profiles:
    profile = yaml.safe_load(profile_path.read_text())
    profile_id = profile.get('id')
    if not profile_id:
        errors.append(f'perfil sin id: {profile_path}')
        continue
    profile_ids.add(profile_id)
    if not profile.get('required_gates'):
        errors.append(f'{profile_path} no define required_gates')

    required_gates = set(profile.get('required_gates', []) or [])
    optional_gates = set(profile.get('optional_gates', []) or [])
    required_checks = set(profile.get('required_checks', []) or [])
    optional_checks = set(profile.get('optional_checks', []) or [])
    gate_expectations = set((profile.get('gate_expectations') or {}).keys())
    check_expectations = set((profile.get('check_expectations') or {}).keys())

    for gate in sorted((required_gates | optional_gates) - gate_ids):
        errors.append(f'{profile_path} referencia gate inexistente: {gate}')
    for check in sorted((required_checks | optional_checks) - check_ids):
        errors.append(f'{profile_path} referencia check inexistente: {check}')
    for gate in sorted(gate_expectations - (required_gates | optional_gates)):
        errors.append(f'{profile_path} define gate_expectation fuera de required/optional_gates: {gate}')
    for check in sorted(check_expectations - (required_checks | optional_checks)):
        errors.append(f'{profile_path} define check_expectation fuera de required/optional_checks: {check}')
    for check, cfg in (profile.get('check_expectations') or {}).items():
        if not isinstance(cfg, dict):
            errors.append(f'{profile_path} define check_expectation invalida para {check}')
            continue
        if 'expected_when' not in cfg:
            errors.append(f'{profile_path} no define expected_when para check_expectation {check}')
        if 'include_when' not in cfg:
            errors.append(f'{profile_path} no define include_when para check_expectation {check}')

    for key in ('primary_skills', 'secondary_skills', 'reference_skills'):
        for skill in profile.get(key, []) or []:
            profile_referenced_skills.add(skill)
            if skill not in skill_set:
                errors.append(f'{profile_path} referencia una skill inexistente en {key}: {skill}')

profile_registry = set(multiagent.get('profiles', {}).get('registry', {}).keys())
for profile in sorted(profile_ids - profile_registry):
    errors.append(f'perfil no registrado en .agents/multiagent.yaml: {profile}')
for profile in sorted(profile_registry - profile_ids):
    errors.append(f'.agents/multiagent.yaml registra un perfil inexistente: {profile}')

tiers = yaml.safe_load((agents_dir / 'skills-tier.yaml').read_text())
tier_map = {}
tier_skills = []
for tier_name, values in (tiers.get('tiers', {}) or {}).items():
    for skill in values or []:
        tier_skills.append(skill)
        if skill in tier_map:
            errors.append(f'skill duplicada en skills-tier.yaml: {skill}')
        tier_map[skill] = tier_name
seen = set()
for skill in tier_skills:
    if skill in seen:
        errors.append(f'skill duplicada en skills-tier.yaml: {skill}')
    seen.add(skill)
    if skill not in skill_set:
        errors.append(f'skills-tier.yaml referencia una skill inexistente: {skill}')
for skill in sorted(skill_set - set(tier_skills)):
    warnings.append(f'skill sin tier asignado: {skill}')
for skill in sorted(skill_set - profile_referenced_skills - {'wordpress-router', 'wp-project-triage', 'vass-config', 'agents-config'}):
    warnings.append(f'skill huerfana: no aparece en ningun perfil: {skill}')

def load_frontmatter(skill_md_path):
    text = skill_md_path.read_text()
    if not text.startswith('---\n'):
        return {}
    parts = text.split('---\n', 2)
    if len(parts) < 3:
        return {}
    try:
        data = yaml.safe_load(parts[1]) or {}
    except Exception:
        return {}
    return data if isinstance(data, dict) else {}

if not skill_discovery_index.exists():
    warnings.append(f'indice derivado no existe todavia: {skill_discovery_index}')
else:
    try:
        index_data = json.loads(skill_discovery_index.read_text())
    except Exception as exc:
        errors.append(f'no se pudo leer skill-discovery-index.json: {exc}')
        index_data = None

    if isinstance(index_data, dict):
        if index_data.get('version') != 1:
            errors.append('skill-discovery-index.json tiene version no soportada')
        if index_data.get('source_of_truth') != '.agents':
            errors.append('skill-discovery-index.json no declara source_of_truth=.agents')

        skills_entries = index_data.get('skills')
        if not isinstance(skills_entries, list):
            errors.append('skill-discovery-index.json no define skills como array')
            skills_entries = []

        indexed_names = {}
        indexed_paths = {}
        for entry in skills_entries:
            if not isinstance(entry, dict):
                errors.append('skill-discovery-index.json contiene una entrada de skill invalida')
                continue

            name = entry.get('name')
            path = entry.get('path')
            tier = entry.get('tier')
            source_files = entry.get('source_files')

            if not name or not isinstance(name, str):
                errors.append('skill-discovery-index.json contiene una skill sin name valido')
                continue
            if not path or not isinstance(path, str):
                errors.append(f'skill-discovery-index.json contiene una skill sin path valido: {name}')
                continue
            if not tier or not isinstance(tier, str):
                errors.append(f'skill-discovery-index.json contiene una skill sin tier valido: {name}')
            if not isinstance(source_files, list) or not source_files:
                errors.append(f'skill-discovery-index.json contiene una skill con source_files vacio: {name}')
                source_files = []

            if name in indexed_names:
                errors.append(f'skill-discovery-index.json contiene name duplicado: {name}')
            indexed_names[name] = entry

            if path in indexed_paths:
                errors.append(f'skill-discovery-index.json contiene path duplicado: {path}')
            indexed_paths[path] = entry

            entry_path = root / path
            if not entry_path.exists():
                errors.append(f'skill-discovery-index.json referencia un path inexistente: {path}')
            if (entry_path / 'SKILL.md').exists() is False:
                errors.append(f'skill-discovery-index.json referencia una skill sin SKILL.md: {path}')

            for source_file in source_files:
                if not isinstance(source_file, str) or not (root / source_file).exists():
                    errors.append(f'skill-discovery-index.json referencia source_file inexistente en {name}: {source_file}')

            expected_path = f'.agents/skills/{name}'
            if path != expected_path:
                errors.append(f'skill-discovery-index.json path no canonical para {name}: {path}')

            canonical_tier = tier_map.get(name)
            if canonical_tier is None:
                errors.append(f'skill-discovery-index.json referencia una skill sin tier canonico: {name}')
            elif tier != canonical_tier:
                errors.append(f'skill-discovery-index.json tier inconsistente para {name}: {tier} != {canonical_tier}')

            required_sources = {
                f'.agents/skills/{name}/SKILL.md',
                '.agents/skills-tier.yaml',
            }
            missing_sources = sorted(required_sources - set(source_files))
            for missing_source in missing_sources:
                errors.append(f'skill-discovery-index.json no referencia source_file requerido para {name}: {missing_source}')

            frontmatter = load_frontmatter(root / f'.agents/skills/{name}/SKILL.md')
            frontmatter_name = frontmatter.get('name')
            if frontmatter_name and frontmatter_name != name:
                warnings.append(f'skill-discovery-index.json usa un nombre distinto al frontmatter para {name}: {frontmatter_name}')

            if entry.get('summary') is None:
                warnings.append(f'skill-discovery-index.json no define summary para {name}')
            if not entry.get('tags'):
                warnings.append(f'skill-discovery-index.json no define tags para {name}')
            if not entry.get('inputs'):
                warnings.append(f'skill-discovery-index.json no define inputs para {name}')
            if not entry.get('outputs'):
                warnings.append(f'skill-discovery-index.json no define outputs para {name}')
            if not entry.get('capabilities'):
                warnings.append(f'skill-discovery-index.json no define capabilities para {name}')

        missing_index_entries = sorted(skill_set - set(indexed_names.keys()))
        extra_index_entries = sorted(set(indexed_names.keys()) - skill_set)
        for skill in missing_index_entries:
            errors.append(f'skill real sin entrada en skill-discovery-index.json: {skill}')
        for skill in extra_index_entries:
            errors.append(f'skill-discovery-index.json referencia una skill inexistente: {skill}')

agents_doc = (root / 'AGENTS.md').read_text().splitlines()
agents_doc_text = (root / 'AGENTS.md').read_text()
for line in agents_doc:
    if '.agents/skills/' not in line:
        continue
    for match in re.findall(r'`([a-z0-9-]+)`', line):
        if match not in skill_set:
            warnings.append(f'AGENTS.md menciona una skill no instalada o no canonical: {match}')

architecture_doc = root / 'docs' / 'architecture.md'
architecture_doc_text = architecture_doc.read_text() if architecture_doc.exists() else ''

def require_text(path, needle, label):
    if not path.exists():
        errors.append(f'{label} no existe: {path}')
        return
    text = path.read_text()
    if needle not in text:
        errors.append(f'{label} no referencia requerido: {needle}')

require_text(agents_dir / 'RUNTIMES.md', '.agents/GUARDRAILS.md', 'RUNTIMES.md')
require_text(root / 'AGENTS.md', './.agents/GUARDRAILS.md', 'AGENTS.md')
require_text(root / 'CLAUDE.md', '.agents/GUARDRAILS.md', 'CLAUDE.md')
require_text(root / '.azure' / 'README.md', '.agents/GUARDRAILS.md', '.azure/README.md')
require_text(root / '.cursor' / 'README.md', '.agents/GUARDRAILS.md', '.cursor/README.md')
require_text(architecture_doc, 'loaded_skills', 'docs/architecture.md')
require_text(architecture_doc, 'required_gates', 'docs/architecture.md')
require_text(architecture_doc, 'required_checks', 'docs/architecture.md')
require_text(architecture_doc, 'quality_contract', 'docs/architecture.md')

cursor_rules_dir = root / '.cursor' / 'rules'
if not cursor_rules_dir.exists():
    errors.append('.cursor/rules no existe')
else:
    cursor_rules = sorted(cursor_rules_dir.glob('*.mdc'))
    if not cursor_rules:
        errors.append('.cursor/rules no contiene reglas .mdc')
    for rule_path in cursor_rules:
        text = rule_path.read_text()
        if '.agents/' not in text and 'AGENTS.md' not in text:
            warnings.append(f'regla Cursor sin referencia a la fuente comun: {rule_path}')

required_prompt_refs = {
    'planner.md': ['GUARDRAILS.md', 'wordpress-router', 'selected_profile', 'required_gates', 'e2e'],
    'builder.md': ['GUARDRAILS.md', 'perfil', 'checks_run'],
    'reviewer.md': ['GUARDRAILS.md', 'findings'],
    'qa.md': ['GUARDRAILS.md', 'gate_results', 'checks_run'],
}
for prompt_name, needles in required_prompt_refs.items():
    prompt_path = prompts_dir / prompt_name
    if not prompt_path.exists():
        errors.append(f'prompt requerido no existe: {prompt_path}')
        continue
    text = prompt_path.read_text()
    for needle in needles:
        if needle not in text:
            errors.append(f'{prompt_name} no referencia requerido: {needle}')

planning_resolution = multiagent.get('planning_resolution', {}) or {}
if not planning_resolution.get('required_gates'):
    errors.append('multiagent.yaml no define planning_resolution.required_gates')
if not planning_resolution.get('required_checks'):
    errors.append('multiagent.yaml no define planning_resolution.required_checks')
if not planning_resolution.get('loaded_skills'):
    errors.append('multiagent.yaml no define planning_resolution.loaded_skills')

required_agents_doc_terms = [
    'quality_contract',
    'required_gates',
    'required_checks',
    'loaded_skills',
    'tooling exists',
    'e2e',
    'not_applicable',
]
for term in required_agents_doc_terms:
    if term not in agents_doc_text:
        errors.append(f'AGENTS.md no documenta el termino requerido: {term}')

for gate in sorted(common_required_gates):
    if gate not in agents_doc_text:
        errors.append(f'AGENTS.md no documenta el common_required_gate: {gate}')

loaded_skills_cfg = planning_resolution.get('loaded_skills', {}) or {}
for ordered_source in loaded_skills_cfg.get('order', []) or []:
    if ordered_source not in agents_doc_text:
        errors.append(f'AGENTS.md no documenta el origen de skill_resolution: {ordered_source}')

for rule in loaded_skills_cfg.get('rules', []) or []:
    fragments = {
        'deduplicate_loaded_skills_preserving_first_match': ['de-duplicate', 'highest-priority order'],
        'always_include_router_required_skill_for_wordpress_tasks': ['always include `wordpress-router`', 'always include `wordpress-router` for WordPress tasks'],
        'include_domain_skills_only_when_detected_domain_or_request_matches': ['skills de dominio', 'detected domain', 'request matches'],
        'include_secondary_skills_only_with_repo_evidence_tooling_or_explicit_requirement': ['secondary_skills', 'repo evidence', 'tooling', 'explicit requirement'],
        'never_include_reference_skills_by_default': ['do not include reference skills by default', 'reference skills by default'],
        'in_full_site_wordpress_require_target_selection_before_cross_domain_secondary_skills': ['full-site-wordpress', 'target is isolated', 'cross-domain secondary skills'],
        'in_full_site_wordpress_if_request_points_to_plugin_theme_block_theme_or_rest_isolate_target_before_expanding_domain_skills': ['plugin', 'theme', 'block theme', 'REST', 'isolate that target'],
        'after_unique_target_isolated_switch_to_target_domain_resolution_instead_of_staying_ambiguous': ['unique target', 'target domain', 'staying ambiguous'],
        'if_rest_request_resolves_to_plugin_target_require_wp_rest_api_and_wordpress_security_validation': ['wp-rest-api', 'wordpress-security-validation'],
        'if_same_skill_is_selected_by_multiple_sources_keep_highest_priority_position': ['highest-priority order', 'de-duplicate'],
    }.get(rule, [rule])
    if not any(fragment in agents_doc_text for fragment in fragments):
        errors.append(f'AGENTS.md no documenta la regla de skill_resolution: {rule}')

print('== AGENTS Doctor ==')
if warnings:
    print('Warnings:')
    for warning in warnings:
        print(f'- {warning}')
if errors:
    print('Errors:')
    for error in errors:
        print(f'- {error}')
    print('RESULTADO: FAIL')
    sys.exit(1)
print(f'Skills locales: {len(skill_set)}')
print(f'Perfiles: {len(profile_ids)}')
print('RESULTADO: OK')
PY
