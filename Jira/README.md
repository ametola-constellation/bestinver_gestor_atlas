# Jira Automation - Bestinver-GestorAtlas

Utilidad local para crear epics y tareas en Jira Cloud a partir de payloads JSON.

Proyecto Jira objetivo:

- URL: `https://constellationconsulting.atlassian.net/jira/software/projects/BG/boards/261/backlog`
- Project key: `BG`
- Nombre funcional: `Bestinver-GestorAtlas`

## Estructura

```text
Jira/
├── payloads/
│   ├── bg_gestor_atlas_migration_test.json
│   └── bg_gestor_atlas_migration_full.json
├── src/
│   ├── app.py
│   ├── jira_client/client.py
│   └── services/
└── requirements.txt
```

## Configuracion

Crear o actualizar `Jira/.env` con credenciales de Jira Cloud:

```bash
JIRA_BASE_URL=https://constellationconsulting.atlassian.net
JIRA_EMAIL=<email-atlassian>
JIRA_API_TOKEN=<api-token>
```

No subas `Jira/.env` al repositorio.

## Instalacion

```bash
cd Jira
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Comandos

Listar proyectos visibles:

```bash
python3 -m src.app list
```

Dry-run del payload de prueba:

```bash
python3 -m src.app import-json --file payloads/bg_gestor_atlas_migration_test.json
```

Crear el epic y las dos tareas de prueba:

```bash
python3 -m src.app import-json --file payloads/bg_gestor_atlas_migration_test.json --execute
```

Dry-run del payload completo:

```bash
python3 -m src.app import-json --file payloads/bg_gestor_atlas_migration_full.json
```

Crear todo el backlog inicial:

```bash
python3 -m src.app import-json --file payloads/bg_gestor_atlas_migration_full.json --execute
```

## Formato JSON

El importador soporta `local_id` y `parent_ref` para crear un epic y despues colgar tareas de ese epic en la misma ejecucion:

```json
{
  "local_id": "EP00",
  "project_key": "BG",
  "issue_type": "Epic",
  "summary_es": "EP00 - Descubrimiento funcional y tecnico"
}
```

```json
{
  "local_id": "EP00-T01",
  "parent_ref": "EP00",
  "project_key": "BG",
  "issue_type": "Task",
  "summary_es": "Levantar mapa funcional"
}
```

Durante `--execute`, el importador guarda la clave real creada para `EP00` y la usa como `parent` de las tareas con `parent_ref: "EP00"`.

