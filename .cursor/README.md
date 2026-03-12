# Cursor Runtime Adapter

`.cursor/` contiene reglas de proyecto para Cursor.

## Fuente de verdad

Cursor debe consumir `.agents/` como contrato comun:

1. `AGENTS.md`
2. `.agents/README.md`
3. `.agents/RUNTIMES.md`
4. `.agents/GUARDRAILS.md`
5. `.agents/multiagent.yaml`
6. `.agents/profiles/*.yaml`
7. `.agents/skills/`

## Politica

- `.cursor/rules` solo adapta el comportamiento de Cursor.
- No debe redefinir perfiles, routing, tiers ni quality gates.
- Si hay conflicto, manda `.agents/`.
