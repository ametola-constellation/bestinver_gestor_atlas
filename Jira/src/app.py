import argparse
import json

from dotenv import load_dotenv

try:
    from src.jira_client.client import JiraClient
    from src.services.create_work_items import create_work_item
    from src.services.import_work_items import import_work_items_from_json
    from src.services.list_projects import list_projects
except ModuleNotFoundError:
    from jira_client.client import JiraClient
    from services.create_work_items import create_work_item
    from services.import_work_items import import_work_items_from_json
    from services.list_projects import list_projects


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Jira helper CLI")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("list", help="List available Jira projects")

    create_task_parser = subparsers.add_parser(
        "create-task", help="Create a test task in Jira"
    )
    create_task_parser.add_argument("--project", required=True, help="Project key")
    create_task_parser.add_argument("--summary", required=True, help="Task summary")
    create_task_parser.add_argument(
        "--description",
        default="Tarea de prueba creada desde automatización",
        help="Task description",
    )
    create_task_parser.add_argument(
        "--assignee-id",
        default=None,
        help="Jira accountId for assignee (optional)",
    )
    create_task_parser.add_argument(
        "--assignee-from-issue",
        default=None,
        help="Issue key used to copy assignee accountId (example: BG-1)",
    )

    import_parser = subparsers.add_parser(
        "import-json", help="Import Jira issues from JSON (dry-run by default)"
    )
    import_parser.add_argument("--file", required=True, help="Path to JSON file")
    import_parser.add_argument(
        "--execute",
        action="store_true",
        help="Create issues in Jira. If omitted, only preview is shown.",
    )
    import_parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit number of items to process",
    )

    return parser.parse_args()


def main():
    load_dotenv()
    args = parse_args()

    jira_client = JiraClient()

    if not jira_client.authenticate():
        print(
            "Falta configuración de Jira. Define al menos JIRA_BASE_URL y JIRA_API_TOKEN "
            "(y opcionalmente JIRA_EMAIL para Jira Cloud)."
        )
        return

    if args.command in (None, "list"):
        projects = list_projects(jira_client=jira_client)
        print("Jira Projects:")
        if not projects:
            print("- No se han encontrado proyectos o no tienes permisos para verlos.")
            return

        for project in projects:
            print(f"- {project.get('key', '')}: {project.get('name', '')}")
        return

    if args.command == "create-task":
        task_payload = {
            "summary": args.summary,
            "description": args.description,
        }
        assignee_id = args.assignee_id
        if not assignee_id and args.assignee_from_issue:
            assignee_id = jira_client.get_issue_assignee_account_id(args.assignee_from_issue)
            if not assignee_id:
                print(
                    "No se pudo resolver el asignado desde la issue indicada. "
                    "Prueba con --assignee-id directamente."
                )
                return

        if assignee_id:
            task_payload["assignee_id"] = assignee_id

        response = create_work_item(
            project_key=args.project,
            tasks=[task_payload],
            jira_client=jira_client,
        )
        if response.get("status") != "success":
            print(f"Error creando tarea: {response}")
            return

        task_ids = response.get("task_ids", [])
        print("Tarea creada correctamente.")
        for task_id in task_ids:
            print(f"- task_id: {task_id}")
        return

    if args.command == "import-json":
        result = import_work_items_from_json(
            file_path=args.file,
            jira_client=jira_client,
            execute=args.execute,
            limit=args.limit,
        )
        mode = "EJECUCIÓN REAL" if args.execute else "DRY-RUN"
        print(f"Modo: {mode}")
        print(f"Total items: {result['total_items']}")
        print("Preview (primeros 5):")
        for item in result["preview"][:5]:
            print(
                "- "
                f"{item.get('local_id') or '-'} | "
                f"{item['project_key']} | {item['issue_type']} | {item['summary']} | "
                f"parent={item.get('parent_key') or item.get('parent_ref') or '-'} | "
                f"assignee={item['assignee_account_id']}"
            )

        if args.execute:
            print(f"Issues creadas: {len(result['created_issue_ids'])}")
            if result["created_issue_ids"]:
                print(json.dumps(result["created_issue_ids"], ensure_ascii=False, indent=2))
            if result.get("created_refs"):
                print("Referencias locales resueltas:")
                print(json.dumps(result["created_refs"], ensure_ascii=False, indent=2))

        if result["errors"]:
            print("Errores:")
            print(json.dumps(result["errors"], ensure_ascii=False, indent=2))
        return

if __name__ == "__main__":
    main()
