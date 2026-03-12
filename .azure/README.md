# Azure Runtime Adapter

Esta carpeta reserva la capa de adaptacion futura para Azure.

## Fuente de verdad

Azure debe consumir `.agents/` como fuente comun de workflow:

1. `AGENTS.md`
2. `.agents/README.md`
3. `.agents/RUNTIMES.md`
4. `.agents/GUARDRAILS.md`
5. `.agents/multiagent.yaml`
6. `.agents/profiles/*.yaml`
7. `.agents/skills/`

## Objetivo de esta capa

Cuando Azure se integre, esta carpeta debe contener solo:

- instrucciones especificas del runtime Azure
- mapeo entre capacidades de Azure y el workflow comun
- adaptadores para prompts, handoffs o artefactos si Azure los necesita

## No debe contener

- duplicados de perfiles
- duplicados de skills
- reglas nuevas de dominio que contradigan `.agents`
- una segunda fuente de verdad para quality gates

## Validacion esperada

Cuando exista integracion Azure real, esta carpeta debera incluir su propio validador o checks de consistencia, sin invadir `.codex`.
