# Instrucciones obligatorias para el registro de cambios de `.agents/`

## Propósito

Este documento define las instrucciones obligatorias para registrar todos los cambios realizados durante la definición, creación, implantación, validación y evolución de la arquitectura `.agents/` en este repositorio.

El historial cronológico de cambios no se guarda aquí.

El registro operativo se mantiene de forma separada en:

- `docs/agents-change-record.md`

## Carácter obligatorio

Todo cambio realizado en el repositorio dentro del alcance de la implantación y evolución de `.agents/` debe quedar registrado.

Esto incluye, sin excepción:

- cambios en documentación
- cambios en `.agents/`
- cambios en tooling
- cambios en validaciones
- cambios en runtime adapters
- decisiones de arquitectura que alteren el sistema
- correcciones, reversiones o eliminaciones

## Reglas de uso

- Registrar todos los cambios, sin excepción.
- Añadir una entrada por cada cambio relevante ejecutado en el repositorio.
- Si un cambio afecta a varios archivos dentro de una misma acción coherente, registrarlo como una sola entrada.
- Si un cambio corrige o revierte otro anterior, debe indicarse explícitamente.
- Indicar siempre si el cambio afecta a la fuente canónica `.agents/`, a `docs/`, a tooling, a runtime adapters o a validación.
- Incluir validación ejecutada o indicar explícitamente que no se validó.
- Mantener orden cronológico ascendente en el archivo de registro.
- No usar `AGENTS.md` como changelog.
- No usar este archivo de instrucciones como changelog.

## Archivo oficial del registro

El archivo oficial del historial de cambios es:

- `docs/agents-change-record.md`

Ese archivo debe contener:

- un índice rápido al inicio
- enlaces internos desde el índice a cada entrada
- entradas cronológicas
- identificadores incrementales
- archivos afectados
- motivo del cambio
- detalle del cambio
- impacto
- validación

## Formato obligatorio de entrada

Usar esta plantilla en `docs/agents-change-record.md`:

```md
## YYYY-MM-DD HH:MM TZ | ID

- Tipo: `create` | `update` | `delete` | `move` | `validation` | `decision`
- Área: `docs` | `.agents` | `architecture` | `agents` | `pipelines` | `profiles` | `skills` | `tools` | `runtime` | `schemas` | `repo`
- Resumen: descripción breve y concreta del cambio
- Motivo: por qué se realizó
- Archivos afectados:
  - `ruta/archivo-1`
  - `ruta/archivo-2`
- Detalle:
  - punto concreto 1
  - punto concreto 2
- Impacto:
  - qué habilita, corrige o modifica
- Validación:
  - `No ejecutada`
  - o comando/check realizado
- Fuente de verdad afectada:
  - `Sí`
  - `No`
- Artefactos derivados afectados:
  - `Sí`
  - `No`
- Observaciones:
  - riesgos, follow-up o notas
```

## Convenciones

- `ID` debe seguir un formato incremental simple: `LOG-0001`, `LOG-0002`, `LOG-0003`, etc.
- La hora debe anotarse en zona `Europe/Madrid`.
- El índice del archivo de registro debe estar compuesto por enlaces internos a cada entrada.
- Si el cambio es exclusivamente documental, debe registrarse igualmente.
- Si el cambio modifica el propio archivo `docs/agents-change-record.md`, también debe registrarse.
- Si un cambio planeado no llega a materializarse, no se registra como cambio.

## Relación con `AGENTS.md`

`AGENTS.md` debe referenciar este documento como instrucción obligatoria.

`AGENTS.md` no debe duplicar el historial de cambios.

El historial debe mantenerse exclusivamente en `docs/agents-change-record.md`.
