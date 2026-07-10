# Guia de payloads Jira - Bestinver-GestorAtlas

Este directorio contiene la automatizacion del proyecto Jira `BG` para preparar el backlog de migracion de `BESTINVER.GestorAltas.Web.Public` de Knockout a React.

## Payloads disponibles

| Fichero | Uso | Items |
| --- | --- | ---: |
| `payloads/bg_gestor_atlas_migration_test.json` | Prueba controlada: 1 epic + 2 tareas. | 3 |
| `payloads/bg_gestor_atlas_migration_full.json` | Backlog inicial completo: epics y tareas operativas. | 75 |

## Reglas de generacion

- `project_key`: `BG`.
- No se define asignado por defecto para evitar fallos por `accountId` heredado.
- No se define `fix_versions` por defecto porque puede no existir todavia en el proyecto BG.
- Las relaciones epic/tarea se definen con:
  - `local_id` en el epic.
  - `parent_ref` en las tareas.
- Las etiquetas base son:
  - `bestinver-gestor-atlas`
  - `knockout-react`
  - `migration`

## Orden de ejecucion recomendado

1. Validar que las credenciales funcionan:

   ```bash
   cd Jira
   python3 -m src.app list
   ```

2. Ejecutar dry-run del payload de prueba:

   ```bash
   python3 -m src.app import-json --file payloads/bg_gestor_atlas_migration_test.json
   ```

3. Crear el lote de prueba:

   ```bash
   python3 -m src.app import-json --file payloads/bg_gestor_atlas_migration_test.json --execute
   ```

4. Comprobar en Jira que las dos tareas cuelgan del epic creado.

5. Si la prueba es correcta, ejecutar dry-run del lote completo:

   ```bash
   python3 -m src.app import-json --file payloads/bg_gestor_atlas_migration_full.json
   ```

6. Crear el backlog completo:

   ```bash
   python3 -m src.app import-json --file payloads/bg_gestor_atlas_migration_full.json --execute
   ```

## Alcance funcional del backlog

El backlog completo contiene:

- Descubrimiento funcional y tecnico.
- Plataforma React dentro de Web.Public.
- Sistema UI y accesibilidad.
- Capa de dominio frontend.
- Migracion de `Register`.
- Migracion de `Juridica`.
- Migracion de `Extranjero`.
- Migracion de `Remediacion`.
- Firma y documentos.
- Backend y contratos.
- QA, regresion y accesibilidad.
- Release, despliegue y retirada de Knockout.

El detalle por vista esta documentado en `../Plan_Jira_Migracion_WebPublic.md`.
