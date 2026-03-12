---
title: Estándares de flujo Venus
alwaysApply: false
category: workflow
---
# Estándares de flujo Venus

## TL;DR

- **Trello API Key**: Obtener en https://trello.com/1/appKey/generate
- **Trello Token**: Generado desde la API de Trello
- **Trello Member ID**: Añade `.json` a la URL de cualquier tablero Trello para obtener tu ID de miembro
- **GitLab Personal Access Token**: Generar en `https://YOUR_GITLAB_DOMAIN/profile/personal_access_tokens` con scope `api`
- Copiar `user.ini.tpl` a `user.ini`



## Propósito

Este documento define estándares y buenas prácticas para usar Venus, una herramienta de automatización de flujo que integra Trello y GitLab para gestionar proyectos, releases, sprints, tags y ramas.

## Cuando aplica

- alwaysApply: false
- category: workflow

## Reglas

## Introducción

Venus es una herramienta de línea de comandos en PHP que automatiza flujos del equipo integrando tableros Trello y repositorios GitLab. Gestiona el ciclo de vida del proyecto, releases, sprints y creación de ramas con etiquetado automático y generación de changelog.

## Idioma para contenido en Trello

**IMPORTANTE**: Al usar Venus con Trello, todo el contenido escrito en Trello (títulos, descripciones, comentarios) debe estar en **español** según las preferencias de comunicación del proyecto. Los comandos de Venus y el contenido de GitLab permanecen en inglés, pero el contenido de Trello debe estar en español.

Ver `02-language-standards.md` y `21-trello-workflow-standards.md` para reglas completas de idioma.

## Prerrequisitos

### Accesos requeridos

- **Trello API Key**: Obtener en https://trello.com/1/appKey/generate
- **Trello Token**: Generado desde la API de Trello
- **Trello Member ID**: Añade `.json` a la URL de cualquier tablero Trello para obtener tu ID de miembro
- **GitLab Personal Access Token**: Generar en `https://YOUR_GITLAB_DOMAIN/profile/personal_access_tokens` con scope `api`

### Configuración

1. **Instalar dependencias de Venus**:
   ```bash
   cd <venus-project-folder>
   composer update
   ```

2. **Crear configuración de usuario**:
   - Copiar `user.ini.tpl` a `user.ini`
   - Rellenar credenciales de Trello y GitLab

3. **Crear alias** (recomendado):
   ```bash
   # Añadir a ~/.bash_profile o ~/.zshrc
   alias venus="php <path-to-venus>/venus.php"
   ```
   > **IMPORTANTE**: Sustituir `<path-to-venus>` por la ruta real de Venus

4. **Recargar configuración de shell**:
   ```bash
   source ~/.bash_profile  # o source ~/.zshrc
   ```

## Flujos principales

### Gestión de proyectos

#### Crear un proyecto nuevo

**Comando**:
```bash
venus newProject --name <project-name> --trelloBoard <board-id> --gitlabProject <project-id>
```

**Reglas**:
- Debe proporcionarse al menos una opción (`--name`, `--trelloBoard`, o `--gitlabProject`)
- Si no se proporciona `--trelloBoard`, Venus creará un tablero nuevo
- Si no se proporciona `--gitlabProject`, Venus creará un repositorio GitLab
- El proyecto se carga automáticamente tras crear

**Qué hace**:
- Crea y configura el tablero Trello (si aplica)
- Configura columnas del tablero para el flujo
- Configura etiquetas del tablero
- Genera board de historial para sprints
- Crea repositorio GitLab (si aplica)
- Genera fichero de configuración del proyecto
- Carga el proyecto en Venus

**Ejemplo**:
```bash
venus newProject --name prisa-publicidad --trelloBoard abc123def456
```

#### Cargar un proyecto

**Comando**:
```bash
venus loadProject <project-name>
```

**Reglas**:
- El nombre debe coincidir con un fichero en `projects/`
- El proyecto queda cargado hasta que se cargue otro
- Todos los comandos posteriores se aplican al proyecto cargado

**Ejemplo**:
```bash
venus loadProject prisa-publicidad
```

#### Comprobar estado del proyecto

**Comando**:
```bash
venus status
```

**Formato de salida**:
```
(project-name|V.X.X.X)
```

**Ejemplo**:
```
(prisa-publicidad|V.1.1.1)
```

### Gestión de releases

#### Crear un release nuevo

**Comando**:
```bash
venus newRelease <release-type>
```

**Tipos de release**:
- `major` - Cambios breaking (X.0.0)
- `minor` - Features nuevas, compatible (0.X.0)
- `patch` - Bug fixes (0.0.X)

**Reglas**:
- Usa Semantic Versioning (Semver)
- Calcula automáticamente la siguiente versión
- Ejecutar solo cuando se esté listo para release

**Qué hace**:
- Calcula nueva versión según tipo
- Elimina etiquetas `MR_DONE` de cards completadas
- Añade etiqueta de versión a cards Trello
- Crea etiqueta en GitLab con la versión
- Genera changelog con todas las features del release
- Crea MR de `development` a `main`
- Aprueba el MR
- Taggea el último commit de `main` con versión y changelog

**Ejemplo**:
```bash
venus newRelease minor
```

**Formato de changelog**:
```
**************************************** 
*********** V.9.6.91 CHANGELOG ********
****************************************
* Feature description - https://trello.com/c/CRmD0DL9 
* Another feature - https://trello.com/c/5hdFUxiI
```

### Gestión de sprints

#### Crear un sprint nuevo

**Comando**:
```bash
venus newSprint [sprint-due-date]
```

**Formato de fecha**: `yyyy-mm-dd` (p. ej., `2026-01-31`)

**Reglas**:
- La fecha de fin es opcional
- Ejecutar al inicio de cada sprint
- Limpia etiquetas del sprint anterior

**Qué hace**:
- Elimina etiquetas innecesarias del sprint anterior
- Renombra tablero Trello con el nuevo sprint
- Mueve cards completadas al board histórico
- Crea milestone en GitLab (con rango de fechas si se indica)

**Ejemplo**:
```bash
venus newSprint 2026-01-31
```

#### Comprobar estado de sprint

**Comando**:
```bash
venus sprintStatus
```

**Incluye**:
- Cards completadas vs. total
- Milestones completados
- Número de MRs
- Out of sprint
- Releases
- Feedme
- Hotfixes
- Desglose de errores (por categoría)

**Ejemplo de salida**:
```
****************************************
******** Status Sprint 6 ********
****************************************
Cards completed                  38 / 50
Milestones                       03 / 06
Merge Requests                        16
Out of the sprint                     22
Releases                              04
```

### Gestión de ramas y tags

#### Crear una rama nueva

**Comando**:
```bash
venus newBranch <branch-name> [--branch <parent-branch>]
```

**Convención de nombres**:
- Formato: `F|H|I/<trello-card-id>-short-description`
- `F` = Feature
- `H` = Hotfix
- `I` = Improvement
- Ejemplo: `F/jdshfksdf-add-custom-block`

**Reglas**:
- La rama debe seguir la convención
- Opción `--branch` crea rama desde parent (por defecto: `development`)
- Si se usa `--branch`, la rama se crea y se mergea dentro de esa rama

**Qué hace**:
- Crea rama en GitLab
- Genera MR con estado WIP
- Añade link del MR a la card Trello
- Abre el navegador con el MR
- Muestra comando de checkout

**Ejemplo**:
```bash
venus newBranch F/abc123def456-hero-block
```

#### Crear un tag en GitLab

**Comando**:
```bash
venus newGitlabTag <release-type>
```

**Tipos de release**: `major`, `minor`, `patch`

**Reglas**:
- Crea tag en el último commit de `main`
- Incluye changelog en el mensaje del tag
- Usar cuando necesites tag sin proceso completo de release

**Ejemplo**:
```bash
venus newGitlabTag patch
```

### Flujo diario

#### Revisar tu día

**Comando**:
```bash
venus myDay [trello-member-id]
```

**Reglas**:
- Si no se indica ID, usa tu ID por defecto
- Ejecutar al inicio de cada día
- Ayuda a priorizar

**Incluye**:
- Out of Sprint cards (⚠️)
- MRs con discusiones (😫)
- Cards en las que trabajas (👨‍💻)
- Cards pausadas (🆘)
- Cards asignadas a ti (🎁)
- Cards con merge request (😎)

**Buenas prácticas**:
- No trabajar en más de 1 card a la vez
- Mover cards extra a 'Paused'
- Revisar primero MRs con discusiones

**Ejemplo**:
```bash
venus myDay
```

### Gestión de cards

#### Mover cards Trello

**Comando**:
```bash
venus moveCardTo <column-name> --card-id <trello-card-id> [--label <label-name>] [--comment "comment text"]
```

**Columnas disponibles**:
- `TODO` - Trabajo por hacer (no se mueve manualmente)
- `OUT-OF-SPRINT` - Trabajo urgente no planificado (prioridad alta)
- `WORK-IN-PROGRESS` o `WIP` - Trabajo en curso (máx 8, 1 por persona)
- `PAUSED` - Trabajo pausado (requiere label y comentario)
- `MERGE_REQUEST` - Listo para revisión (requiere label R.W.X.Y.Z)
- `DONE` - Trabajo completado y liberado (no se mueve desde aquí)

**Reglas**:
- `--label` y `--comment` son **obligatorios** al mover a `PAUSED` (usar: HELP, VACATIONS, DISCUSSION, WFR)
- No se puede mover a `TODO` o `OUT-OF-SPRINT` manualmente
- No se puede mover desde `DONE`
- Cards desde `MERGE_REQUEST` a `DONE` obtienen `MR_DONE`
- Límite WIP: máx 8 cards en WORK-IN-PROGRESS, 1 por persona
- OUT-OF-SPRINT tiene prioridad sobre WIP

**Qué hace**:
- Mueve la card a la columna
- Añade `MR_DONE` al mover de `MERGE_REQUEST` a `DONE`
- Añade etiqueta de pausa al mover a `PAUSED` (HELP, VACATIONS, DISCUSSION, WFR)
- Elimina etiquetas de pausa al salir de `PAUSED`
- Añade comentario si se proporciona `--comment`
- Añade `WIP` al MR al mover a `WORK-IN-PROGRESS`
- Elimina `WIP` del MR al mover a `MERGE_REQUEST`

**Ejemplos**:
```bash
# Mover a WORK-IN-PROGRESS (comprobar WIP antes)
venus moveCardTo WORK-IN-PROGRESS --card-id abc123def456

# Mover a PAUSED (requiere etiqueta: HELP, VACATIONS, DISCUSSION, o WFR)
# Nota: comentarios deben estar en español
venus moveCardTo PAUSED --card-id abc123def456 --label HELP --comment "Bloqueado por problema de API, necesito soporte del backend"

# Mover a MERGE_REQUEST (tras quitar WIP del MR)
venus moveCardTo MERGE_REQUEST --card-id abc123def456

# Mover tarea OUT-OF-SPRINT a WIP
venus moveCardTo WORK-IN-PROGRESS --card-id abc123def456
```

### Comandos de utilidad

#### Listar proyectos

**Comando**:
```bash
venus projects
```

**Salida**:
- Lista todos los proyectos disponibles
- Marca el proyecto cargado con `*`
- Muestra la última versión del release

**Ejemplo**:
```
Venus available projects
============================================================================

  - * prisa-publicidad [V.1.1.1]
  -   other-project [V.0.5.2]
```

#### Obtener miembros del board

**Comando**:
```bash
venus getMembers
```

**Salida**:
- Lista miembros del tablero Trello
- Muestra nombre, username e ID

**Ejemplo**:
```
Trello board members
===============================================================

Pablo Poveda [pablopoveda4] - 5943c3dc7ff4ee0d5eeae208
```

#### Obtener ayuda

**Comando**:
```bash
venus help
```

Lista todas las herramientas y comandos disponibles de Venus.

## Buenas prácticas

### Flujo diario

1. **Inicio de día**:
   ```bash
   venus myDay
   ```
   - Revisar cards asignadas
   - Comprobar OUT-OF-SPRINT (prioridad alta)
   - Revisar MRs con discusiones
   - Priorizar trabajo

2. **Empezar trabajo nuevo**:
   ```bash
   venus newBranch F/<trello-card-id>-short-description
   ```
   - Comprobar WIP (máx 8 cards, 1 por persona)
   - Verificar que no hay otra card en WIP
   - Crear rama con convención
   - Mover card a `WORK-IN-PROGRESS`

3. **Pausar trabajo**:
   ```bash
   venus moveCardTo PAUSED --card-id <id> --label <HELP|VACATIONS|DISCUSSION|WFR> --comment "Por qué está pausado" # comentario en español
   ```
   - Usar siempre etiquetas de pausa: HELP, VACATIONS, DISCUSSION, o WFR
   - Añadir comentario explicando la razón
   - No pausar más de lo necesario

4. **Completar trabajo**:
   ```bash
   venus moveCardTo MERGE_REQUEST --card-id <id>
   ```
   - Quitar estado WIP del MR primero
   - Mover cuando el MR esté listo para revisión
   - Añadir discusión de pruebas en el MR

### Flujo de sprint

1. **Inicio de sprint**:
   ```bash
   venus newSprint 2026-01-31
   ```
   - Ejecutar al inicio del sprint
   - Incluir fecha fin para milestones

2. **Durante el sprint**:
   - Usar `venus sprintStatus` para seguimiento
   - Mover cards en el flujo
   - Mantener cards actualizadas

3. **Fin de sprint**:
   - Revisar salida de `venus sprintStatus`
   - Completar releases pendientes
   - Archivar trabajo completado

### Flujo de release

1. **Antes del release**:
   - Verificar etiquetas correctas
   - Comprobar que MRs están mergeados
   - Verificar que el changelog será correcto

2. **Crear release**:
   ```bash
   venus newRelease <major|minor|patch>
   ```
   - Elegir tipo correcto
   - Revisar changelog generado
   - Verificar que el MR se creó

3. **Después del release**:
   - Verificar tag en GitLab
   - Comprobar etiquetas Trello actualizadas
   - Confirmar fichero de changelog creado

## Problemas comunes y soluciones

### Problema: comando Venus no encontrado

**Solución**:
1. Comprobar alias: `alias venus`
2. Recargar shell: `source ~/.bash_profile` o `source ~/.zshrc`
3. Verificar ruta del alias
4. Probar con ruta completa: `php /path/to/venus/venus.php help`

### Problema: errores de certificado PHP (Windows)

**Solución**:
1. Descargar certificado desde https://curl.se/docs/caextract.html
2. Guardar `cacert.pem` en una carpeta
3. Editar `php.ini` y `php.ini` para Apache
4. Buscar `;curl.cainfo =` y reemplazar con:
   ```ini
   curl.cainfo = "C:\path\to\cacert.pem"
   ```
5. Reiniciar Apache/PHP

### Problema: deshacer un release incorrecto

**Solución**:
1. Volver a etiquetar cards con `MR_DONE` que tengan versión incorrecta
2. Quitar etiqueta de versión incorrecta en Trello (si no existía antes)
3. Quitar etiqueta de versión incorrecta en GitLab (si no existía antes)
4. Borrar tag en el repositorio (si no existía antes)
5. Borrar fichero de changelog: `venus/changelog/project_name-V.X.X.X.txt`
6. **No** crear un release nuevo inmediatamente (no hay cambios entre ramas)
7. Recargar proyecto: `venus loadProject <project-name>`

### Problema: proyecto no carga

**Solución**:
1. Verificar que existe el fichero en `projects/`
2. Comprobar que el formato coincide con `project.ini.tpl`
3. Verificar que el nombre coincide con el fichero (sin extension)
4. Comprobar permisos de archivo

### Problema: errores de API Trello/GitLab

**Solución**:
1. Verificar credenciales en `user.ini`
2. Comprobar que las API keys son validas y no han caducado
3. Verificar permisos en tablero Trello/proyecto GitLab
4. Comprobar conectividad de red
5. Revisar mensajes de error

## Integración con flujo Git

Venus integra con estándares de flujo Git:

- **Creación de ramas**: Usar `venus newBranch` en lugar de crear manualmente
- **Merge Requests**: Venus crea y gestiona MRs automáticamente
- **Releases**: Usar `venus newRelease` en lugar de tags manuales
- **Seguimiento de cards**: Vincular cards a ramas con naming correcto

**Ver también**: 
- `.codex/rules/12-git-workflow-standards.md` para detalles de Git
- `.codex/rules/21-trello-workflow-standards.md` para Trello y metodología COMPI

## Checklist

### Antes de empezar a trabajar
- [ ] Proyecto cargado: `venus status`
- [ ] Revisar tu día: `venus myDay`
- [ ] Crear rama con naming correcto: `venus newBranch F/<card-id>-description`

### Durante el trabajo
- [ ] Mover card a `WIP` al iniciar: `venus moveCardTo WIP --card-id <id>`
- [ ] Mover card a `PAUSED` si se bloquea (con motivo): `venus moveCardTo PAUSED --card-id <id> --label <reason> --comment "por qué está pausado"` (comentario en español)
- [ ] Mover card a `MERGE_REQUEST` al estar lista: `venus moveCardTo MERGE_REQUEST --card-id <id>`

### Gestión de sprint
- [ ] Crear sprint al inicio: `venus newSprint [date]`
- [ ] Comprobar estado del sprint: `venus sprintStatus`
- [ ] Completar releases antes de terminar sprint: `venus newRelease <type>`

### Gestión de release
- [ ] Verificar etiquetas de cards antes de release
- [ ] Elegir tipo de release correcto: `major`, `minor`, o `patch`
- [ ] Revisar changelog generado
- [ ] Verificar MR creado y aprobado
- [ ] Confirmar tag creado en GitLab

## Anti-patrones a evitar

❌ **Crear ramas manualmente en lugar de Venus**
- Usar siempre `venus newBranch` para asegurar integración

❌ **Mover cards sin Venus**
- Usar `venus moveCardTo` para mantener etiquetas consistentes

❌ **Crear releases manualmente**
- Usar `venus newRelease` para changelog y etiquetado correctos

❌ **Trabajar en varias cards a la vez**
- Foco en una card, pausar otras si hace falta

❌ **Pausar cards sin motivo**
- Siempre añadir `--label` y `--comment` (comentario en español)

❌ **Saltarse el check diario**
- Ejecutar `venus myDay` para organizarte

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
