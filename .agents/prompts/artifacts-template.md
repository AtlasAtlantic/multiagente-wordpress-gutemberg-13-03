# Required Artifacts Template

## 1) plan
```markdown
### Plan Title
<titulo>

### Summary
<resumen>

### Selected Profile
<plugin-development|theme-development|block-theme-development|full-site-wordpress>

### Loaded Skills
- <skill 1>
- <skill 2>

### Implementation Steps
1. <paso 1>
2. <paso 2>

### Acceptance Criteria
- <criterio 1>
- <criterio 2>

### Required Gates
- <gate 1>
- <gate 2>

### Required Checks
- <check 1>
- <check 2>

### Assumptions
- <supuesto 1>
```

## 2) patch_summary
```markdown
### Changed Files
- <ruta 1>
- <ruta 2>

### Main Changes
- <cambio 1>
- <cambio 2>

### Decisions
- <decision 1>
```

## 3) verification_report
```markdown
### Gate Results
- artifacts_present: passed|failed|not_applicable
- profile_selected: passed|failed|not_applicable
- <gate de perfil>: passed|failed|not_applicable

### Checks Evidence
- build: passed|failed|not_applicable
- lint: passed|failed|not_applicable
- tests: passed|failed|not_applicable
- static_analysis: passed|failed|not_applicable
- e2e: passed|failed|not_applicable

### QA Result
status: done|failed|blocked
decision: close|return_to_builder
```
