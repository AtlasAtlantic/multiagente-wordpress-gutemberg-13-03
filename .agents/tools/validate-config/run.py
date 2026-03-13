#!/usr/bin/env python3
import json
import sys
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator


def load_yaml(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def iter_yaml_files(directory: Path):
    return sorted(path for path in directory.glob("*.yaml") if path.is_file())


def print_error(message: str):
    print(message, file=sys.stderr)


def validate_with_schema(validator, data, label, status):
    errors = sorted(validator.iter_errors(data), key=lambda e: list(e.path))
    for error in errors:
        print_error(f"{label}: {error.message}")
        status = 1
    return status


def resolve_runtime_path(mapping_path: Path, declared_path: str) -> Path:
    return (mapping_path.parent / declared_path).resolve()


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".agents")
    status = 0

    required_files = [
        root / "version.yaml",
        root / "catalog.yaml",
        root / "compatibility.yaml",
        root / "architecture" / "routing.yaml",
        root / "architecture" / "handoff_schema.yaml",
        root / "project" / "project.yaml",
    ]

    for path in required_files:
        if not path.is_file():
            print_error(f"Missing required file: {path}")
            status = 1

    roles = ["planner", "builder", "reviewer", "fixer", "qa"]
    for role in roles:
        path = root / "agents" / f"{role}.md"
        if not path.is_file():
            print_error(f"Missing agent role: {path}")
            status = 1

    pipelines = ["feature", "bugfix", "refactor", "audit"]
    for pipeline in pipelines:
        path = root / "pipelines" / f"{pipeline}.yaml"
        if not path.is_file():
            print_error(f"Missing pipeline: {path}")
            status = 1

    profile_paths = iter_yaml_files(root / "profiles")
    if not profile_paths:
        print_error("No profile definitions found in profiles/")
        status = 1

    if status:
        return status

    schemas = {
        "profile": load_json(root / "schemas" / "profile.schema.json"),
        "pipeline": load_json(root / "schemas" / "pipeline.schema.json"),
        "routing": load_json(root / "schemas" / "routing.schema.json"),
        "version": load_json(root / "schemas" / "version.schema.json"),
        "catalog": load_json(root / "schemas" / "catalog.schema.json"),
        "compatibility": load_json(root / "schemas" / "compatibility.schema.json"),
        "project": load_json(root / "schemas" / "project.schema.json"),
    }
    validators = {name: Draft202012Validator(schema) for name, schema in schemas.items()}

    version_data = load_yaml(root / "version.yaml")
    status = validate_with_schema(validators["version"], version_data, "Version schema error", status)
    if version_data.get("source_of_truth") != ".agents":
        print_error("version.yaml must declare `.agents` as source_of_truth")
        status = 1

    catalog_data = load_yaml(root / "catalog.yaml")
    status = validate_with_schema(validators["catalog"], catalog_data, "Catalog schema error", status)

    compatibility_data = load_yaml(root / "compatibility.yaml")
    status = validate_with_schema(
        validators["compatibility"],
        compatibility_data,
        "Compatibility schema error",
        status,
    )

    project_data = load_yaml(root / "project" / "project.yaml")
    status = validate_with_schema(validators["project"], project_data, "Project schema error", status)

    profile_names = set()
    for path in profile_paths:
        data = load_yaml(path)
        status = validate_with_schema(validators["profile"], data, f"Profile schema error in {path}", status)
        profile_name = data.get("profile")
        if not profile_name:
            print_error(f"Profile missing name in {path}")
            status = 1
            continue
        profile_names.add(profile_name)
        for pipeline in data.get("applicable_pipelines", []):
            if not (root / "pipelines" / f"{pipeline}.yaml").is_file():
                print_error(f"Profile references missing pipeline: {pipeline} in {path}")
                status = 1
        for skill in data.get("recommended_skills", []):
            if not (root / "skills" / skill / "SKILL.md").is_file():
                print_error(f"Profile references missing skill: {skill} in {path}")
                status = 1

    for pipeline in pipelines:
        path = root / "pipelines" / f"{pipeline}.yaml"
        data = load_yaml(path)
        status = validate_with_schema(validators["pipeline"], data, f"Pipeline schema error in {path}", status)
        if data.get("pipeline") != pipeline:
            print_error(f"Pipeline name mismatch in {path}")
            status = 1
        for step in data.get("steps", []):
            role = step.get("role")
            if role not in roles:
                print_error(f"Unknown role '{role}' in {path}")
                status = 1

    routing = load_yaml(root / "architecture" / "routing.yaml")
    status = validate_with_schema(validators["routing"], routing, "Routing schema error", status)
    routing_roles = set(routing.get("roles", {}).keys())
    for role in roles:
        if role not in routing_roles:
            print_error(f"Routing missing role: {role}")
            status = 1

    if set(catalog_data.get("agents", [])) != set(roles):
        print_error("catalog.yaml agents must match canonical agent roles")
        status = 1

    if set(catalog_data.get("pipelines", [])) != set(pipelines):
        print_error("catalog.yaml pipelines must match canonical pipeline files")
        status = 1

    catalog_profiles = catalog_data.get("profiles", {})
    reusable_profiles = set(catalog_profiles.get("reusable", []))
    compatibility_profiles = set(catalog_profiles.get("compatibility", []))
    if reusable_profiles | compatibility_profiles != profile_names:
        print_error("catalog.yaml profiles must match profile files")
        status = 1
    if reusable_profiles & compatibility_profiles:
        print_error("catalog.yaml profile groups must not overlap")
        status = 1

    active_profiles = project_data.get("active_profiles", [])
    for profile in active_profiles:
        if profile not in profile_names:
            print_error(f"project.yaml references missing active profile: {profile}")
            status = 1

    compatibility_project_types = compatibility_data.get("project_types", {})
    project_type = project_data.get("project_type")
    if project_type not in compatibility_project_types:
        print_error(f"project.yaml project_type not declared in compatibility.yaml: {project_type}")
        status = 1

    infrastructure_profiles = set(compatibility_data.get("infrastructure_profiles", []))
    declared_compat_profiles = set(compatibility_data.get("compatibility_profiles", []))
    if not infrastructure_profiles.issubset(profile_names):
        print_error("compatibility.yaml infrastructure_profiles must reference existing profiles")
        status = 1
    if not declared_compat_profiles.issubset(profile_names):
        print_error("compatibility.yaml compatibility_profiles must reference existing profiles")
        status = 1
    if infrastructure_profiles & declared_compat_profiles:
        print_error("compatibility.yaml profile groups must not overlap")
        status = 1

    runtime_mappings = sorted((root / "runtime").glob("*/mapping.yaml"))
    if not runtime_mappings:
        print_error("No runtime mappings found in runtime/")
        status = 1

    supported_runtimes = compatibility_data.get("runtimes", {})
    discovered_runtimes = set()
    sync_required_inputs = {
        "../../version.yaml",
        "../../catalog.yaml",
        "../../compatibility.yaml",
        "../../project/project.yaml",
    }

    for mapping_path in runtime_mappings:
        runtime = mapping_path.parent.name
        discovered_runtimes.add(runtime)
        if not mapping_path.is_file():
            print_error(f"Missing runtime mapping: {mapping_path}")
            status = 1
            continue
        mapping = load_yaml(mapping_path)
        if mapping.get("runtime") != runtime:
            print_error(f"Runtime mapping name mismatch in {mapping_path}")
            status = 1
        if mapping.get("source_of_truth") != ".agents":
            print_error(f"Runtime mapping must keep `.agents` as source_of_truth: {mapping_path}")
            status = 1
        if mapping.get("adapter_role") != "derived-runtime":
            print_error(f"Runtime mapping must declare adapter_role=derived-runtime: {mapping_path}")
            status = 1
        inputs = set(mapping.get("inputs", []))
        for required_input in sync_required_inputs:
            if required_input not in inputs:
                print_error(f"Runtime mapping missing canonical input {required_input}: {mapping_path}")
                status = 1
        for declared_input in mapping.get("inputs", []):
            resolved_input = resolve_runtime_path(mapping_path, declared_input)
            if not resolved_input.exists():
                print_error(f"Runtime mapping input path does not exist: {declared_input} in {mapping_path}")
                status = 1
        template_dir = resolve_runtime_path(mapping_path, mapping.get("template_dir", "./templates"))
        if not template_dir.is_dir():
            print_error(f"Runtime mapping template_dir does not exist: {template_dir}")
            status = 1
        output_dir = resolve_runtime_path(mapping_path, mapping.get("output_dir", "./output"))
        if not output_dir.is_dir():
            print_error(f"Runtime mapping output_dir does not exist: {output_dir}")
            status = 1
        runtime_compat = supported_runtimes.get(runtime)
        if not runtime_compat:
            print_error(f"compatibility.yaml is missing runtime {runtime}")
            status = 1
        elif runtime_compat.get("role") != "derived-adapter":
            print_error(f"compatibility.yaml must declare {runtime} as derived-adapter")
            status = 1

    if set(supported_runtimes.keys()) != discovered_runtimes:
        print_error("compatibility.yaml runtimes must match discovered runtime mappings")
        status = 1

    if status == 0:
        print("Validate OK: canonical metadata, profiles, project context, schemas, and runtime mappings are coherent")

    return status


if __name__ == "__main__":
    raise SystemExit(main())
