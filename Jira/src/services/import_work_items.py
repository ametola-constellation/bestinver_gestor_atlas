import json
from pathlib import Path
from typing import Any

try:
    from src.services.create_work_items import create_work_item
except ModuleNotFoundError:
    from services.create_work_items import create_work_item


def import_work_items_from_json(
    file_path: str,
    jira_client,
    execute: bool = False,
    limit: int | None = None,
) -> dict[str, Any]:
    path = Path(file_path)
    payload = json.loads(path.read_text(encoding="utf-8"))
    items = payload.get("items", [])
    if limit is not None:
        items = items[:limit]

    preview: list[dict[str, Any]] = []
    created: list[str] = []
    errors: list[dict[str, Any]] = []
    created_refs: dict[str, str] = {}

    for item in items:
        issue_type = item.get("issue_type", "Task")
        project_key = item.get("project_key")
        summary = item.get("summary_es") or item.get("summary")
        description = item.get("description_es") or item.get("description")
        assignee_id = item.get("assignee_account_id")
        labels = item.get("labels", [])
        parent_key = item.get("parent_key")
        parent_ref = item.get("parent_ref")
        fix_versions = item.get("fix_versions", [])
        status = item.get("status")
        local_id = item.get("local_id")

        entry = {
            "local_id": local_id,
            "project_key": project_key,
            "issue_type": issue_type,
            "summary": summary,
            "assignee_account_id": assignee_id,
            "labels": labels,
            "parent_key": parent_key,
            "parent_ref": parent_ref,
            "fix_versions": fix_versions,
            "status": status,
            "source_commit_url": item.get("source_commit_url"),
        }
        preview.append(entry)

        if not execute:
            continue

        try:
            if issue_type.lower() == "epic":
                response = create_work_item(
                    project_key=project_key,
                    epic={
                        "summary": summary,
                        "description": description,
                        "status": status,
                        "labels": labels,
                        "fix_versions": fix_versions,
                    },
                    jira_client=jira_client,
                )
                epic_id = response.get("epic_id")
                created.extend([epic_id])
                if local_id and epic_id:
                    created_refs[local_id] = epic_id
            else:
                resolved_parent_key = parent_key
                if parent_ref:
                    resolved_parent_key = created_refs.get(parent_ref)
                    if not resolved_parent_key:
                        raise ValueError(
                            f"No se pudo resolver parent_ref '{parent_ref}' para '{summary}'. "
                            "Asegurate de que el epic aparece antes en el JSON."
                        )

                response = create_work_item(
                    project_key=project_key,
                    tasks=[
                        {
                            "summary": summary,
                            "description": description,
                            "issue_type": issue_type,
                            "assignee_id": assignee_id,
                            "labels": labels,
                            "parent_key": resolved_parent_key,
                            "fix_versions": fix_versions,
                            "status": status,
                        }
                    ],
                    jira_client=jira_client,
                )
                task_ids = response.get("task_ids", [])
                created.extend(task_ids)
                if local_id and task_ids:
                    created_refs[local_id] = task_ids[0]
        except Exception as error:
            errors.append({"summary": summary, "error": str(error)})

    return {
        "total_items": len(items),
        "execute": execute,
        "preview": preview,
        "created_issue_ids": [item for item in created if item],
        "created_refs": created_refs,
        "errors": errors,
        "metadata": payload.get("metadata", {}),
    }
