try:
    from src.jira_client.client import JiraClient
except ModuleNotFoundError:
    from jira_client.client import JiraClient


def create_work_item(
    project_key: str,
    epic: dict | None = None,
    tasks: list[dict] | None = None,
    jira_client: JiraClient | None = None,
) -> dict:
    if not project_key or project_key == "INVALID":
        return {"status": "error", "message": "Invalid project key"}

    if epic is None and not tasks:
        return {"status": "error", "message": "No work item data provided"}

    client = jira_client or JiraClient()
    epic_id = None
    created_task_ids: list[str] = []

    if epic is not None:
        epic_response = client.create_epic(epic, project_key)
        epic_id = epic_response.get("key") or epic_response.get("id")
        if not epic_id:
            return {"status": "error", "message": "Failed to create epic"}
        epic_status = epic.get("status")
        if epic_status:
            client.transition_issue_to_status(epic_id, epic_status)

    for task in tasks or []:
        task_response = client.create_task(task, project_key, epic_id=epic_id)
        task_id = task_response.get("key") or task_response.get("id")
        if not task_id:
            return {"status": "error", "message": "Failed to create task"}
        task_status = task.get("status")
        if task_status:
            client.transition_issue_to_status(task_id, task_status)
        created_task_ids.append(task_id)

    if epic_id and created_task_ids:
        return {
            "status": "success",
            "epic_id": epic_id,
            "task_ids": created_task_ids,
        }

    if epic_id:
        return {"status": "success", "epic_id": epic_id}

    return {"status": "success", "task_ids": created_task_ids}