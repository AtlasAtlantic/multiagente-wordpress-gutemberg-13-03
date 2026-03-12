---
name: e2e-testing-patterns
description: Deterministic WordPress end-to-end testing guidance for Playwright-first projects, with Gutenberg-specific rules for editor and frontend validation.
---

# SKILL: wordpress-e2e-tests

## Propósito

Crear, actualizar o validar **tests E2E deterministas** para proyectos WordPress
(plugins, themes o bloques Gutenberg).

La skill garantiza que los cambios visibles en frontend o editor
se validen mediante **tests reproducibles basados en Playwright**.

El objetivo es detectar:

- regresiones visuales
- errores de registro de bloques
- fallos de render dinámico
- errores en flujos críticos del editor

---

# Framework estándar

Framework por defecto: **Playwright**

Cypress solo debe usarse si:

- el repositorio ya tiene Cypress configurado
- existe una suite E2E heredada en Cypress

Nunca crear nuevas suites en Cypress si el proyecto usa Playwright.

---

# Cuándo usar esta skill

Aplicar la skill si el cambio afecta a:

- bloques Gutenberg
- render frontend
- comportamiento visible de plugin
- flujo del editor
- endpoints usados por UI
- scripts frontend críticos

No aplicar si:

- cambios puramente internos PHP
- refactors sin impacto en UI
- cambios solo de build tooling

---

# Contrato de entrada

La skill espera los siguientes inputs:

repo_path  
Ruta del repositorio.

change_scope  
Tipo de cambio:

- new_block
- block_update
- plugin_feature
- regression_fix
- infra_setup

target_type  

- plugin
- theme
- block

e2e_framework  

- playwright
- cypress
- auto

requires_editor_flow  

- true
- false

has_existing_e2e  

- true
- false

base_url  

URL del entorno de test.

---

# Contrato de salida

La skill debe producir:

generated_tests

Lista de tests creados o modificados.

test_strategy

Tipo de test aplicado:

- editor_smoke
- frontend_render
- dynamic_block_render
- feature_flow
- regression_test

run_command

Comando para ejecutar la suite.

environment_requirements

Precondiciones necesarias.

risk_notes

Posibles puntos frágiles detectados.

---

# Precondiciones obligatorias

Antes de generar tests se debe verificar:

1. WordPress responde en `base_url`
2. usuario admin de test disponible
3. plugin o theme objetivo activo
4. assets del proyecto compilados
5. bloque Gutenberg registrado
6. REST API accesible

Si alguna condición falla:

return status: `environment_not_ready`

---

# Bootstrap del entorno

El entorno de test debe ser **determinista**.

Reglas:

- evitar datos generados con timestamp
- usar slugs predecibles
- crear contenido base mediante API o WP-CLI
- aislar datos de test con prefijo

Ejemplo:

test-post-e2e
test-user-e2e

---

# Estrategia de decisión

Determinar el tipo de test usando esta lógica.

## Cambio en bloque Gutenberg

Si el cambio afecta a registro o UI del bloque:

crear test:

editor_smoke

Validar:

- bloque aparece en inserter
- bloque se puede insertar
- atributos se guardan correctamente

---

## Cambio en render frontend

crear test:

frontend_render

Validar:

- contenido visible
- HTML esperado
- estilos aplicados

---

## Bloques dinámicos (render_callback)

crear test:

dynamic_block_render

Validar:

- render PHP correcto
- contenido frontend coincide con atributos

---

## Features de plugin

crear test:

feature_flow

Ejemplo:

- formulario
- navegación
- interacción JS

---

# Reglas para WordPress / Gutenberg

Evitar selectores frágiles.

Reglas obligatorias para Gutenberg:

- distinguir siempre entre `editor chrome` y `editor canvas`
- si el contenido editable vive dentro de `iframe`, los locators del bloque deben resolverse en ese `iframe`
- validar antes del test que:
  - el plugin o theme objetivo está activo
  - los assets del bloque están compilados
  - el bloque está registrado en cliente
  - el bloque está registrado en servidor cuando aplique render dinámico
- preferir setup determinista mediante API, WP-CLI, contenido serializado o helpers reutilizables
- usar interacción visual del inserter solo cuando el inserter forme parte real del criterio de aceptación

NO usar:

- selectores del chrome interno del editor
- clases internas de Gutenberg
- labels traducidas
- `nth()` como estrategia principal para encontrar campos del bloque
- permalinks bonitos como dependencia por defecto en entorno local

Preferir:

- data-testid
- atributos propios del bloque
- URLs estables como `?p=<id>` cuando el objetivo es validar render frontend y no la capa de permalinks
- validación del resultado final

Siempre priorizar:

estado final observable > interacción interna del editor.

Smells que obligan a replantear el test:

- una misma spec mezcla inserter, edición, publicación y frontend sin necesidad
- el test depende de texto de interfaz de WordPress que cambia con el idioma
- el test no comprueba el render frontend aunque el cambio sea visible para usuario final
- el test intenta demostrar render dinámico solo con evidencia del editor

---

# Ejemplo Playwright

```ts
import { test, expect } from '@playwright/test';

test('block renders on frontend', async ({ page }) => {

  await page.goto('/test-post-e2e');

  const block = page.locator('[data-testid="my-block"]');

  await expect(block).toBeVisible();

});
```

---

# Setup recomendado Playwright

tests/
e2e/
playwright.config.ts

Config básica:

- retries en CI
- screenshots en fallo
- trace activado

---

# Ejecución

Comando estándar:

npx playwright test

CI:

npx playwright test --reporter=dot

---

# Anti-flakiness

Evitar:

- waits arbitrarios
- sleeps
- selectores frágiles
- dependencia de orden de ejecución

Preferir:

- expect.poll
- waits explícitos
- asserts de estado final

---

# Definition of Done

La skill se considera completada cuando:

- existe al menos un test relevante
- el test es determinista
- se puede ejecutar en CI
- valida el comportamiento visible
- no usa selectores frágiles

---

# Errores comunes detectados

1. Tests dependientes de traducciones
2. Uso de clases internas de Gutenberg
3. Uso de `waitForTimeout`
4. Setup no determinista
5. Dependencia de estado previo de la DB

---

# Resultado esperado

La skill produce:

- tests E2E reproducibles
- cobertura mínima del cambio
- ejecución estable en CI
