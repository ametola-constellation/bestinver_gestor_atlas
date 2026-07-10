try:
    from src.jira_client.client import JiraClient
except ModuleNotFoundError:
    from jira_client.client import JiraClient


def list_projects(jira_client: JiraClient | None = None) -> list[dict]:
    client = jira_client or JiraClient()
    return client.get_projects()