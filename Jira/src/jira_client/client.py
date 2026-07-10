import os
import re
from typing import Any

import requests
from requests.auth import HTTPBasicAuth


class JiraClient:
    def __init__(
        self,
        base_url: str | None = None,
        api_token: str | None = None,
        timeout: int = 30,
    ):
        self.base_url = (base_url or os.getenv("JIRA_BASE_URL", "")).rstrip("/")
        self.api_token = api_token or os.getenv("JIRA_API_TOKEN")
        self.email = os.getenv("JIRA_EMAIL")
        self.timeout = timeout
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        if self.api_token and not self.email:
            self.headers["Authorization"] = f"Bearer {self.api_token}"

    def authenticate(self) -> bool:
        return bool(self.base_url and self.api_token)

    def _get_auth(self):
        if self.email and self.api_token:
            return HTTPBasicAuth(self.email, self.api_token)
        return None

    def get_projects(self) -> list[dict[str, Any]]:
        if not self.authenticate():
            raise ValueError(
                "Missing Jira credentials. Please set JIRA_BASE_URL and JIRA_API_TOKEN."
            )

        response = requests.get(
            f"{self.base_url}/rest/api/3/project/search",
            headers=self.headers,
            auth=self._get_auth(),
            params={"maxResults": 1000},
            timeout=self.timeout,
        )
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict) and isinstance(data.get("values"), list):
            return data["values"]
        if isinstance(data, list):
            return data
        return []

    @staticmethod
    def _to_adf_description(text: str) -> dict[str, Any]:
        if not text:
            return {
                "type": "doc",
                "version": 1,
                "content": [
                    {"type": "paragraph", "content": [{"type": "text", "text": ""}]}
                ],
            }

        url_pattern = re.compile(r'(https?://[^\s,)]+)')
        parts = url_pattern.split(text)
        content_nodes: list[dict[str, Any]] = []

        for part in parts:
            if not part:
                continue
            if url_pattern.match(part):
                content_nodes.append({
                    "type": "text",
                    "text": part,
                    "marks": [{"type": "link", "attrs": {"href": part}}],
                })
            else:
                content_nodes.append({"type": "text", "text": part})

        return {
            "type": "doc",
            "version": 1,
            "content": [{"type": "paragraph", "content": content_nodes}],
        }

    def create_epic(self, epic_payload: dict[str, Any], project_key: str) -> dict[str, Any]:
        fields = {
            "project": {"key": project_key},
            "summary": epic_payload.get("summary") or epic_payload.get("name"),
            "description": self._to_adf_description(epic_payload.get("description", "")),
            "issuetype": {"name": "Epic"},
        }
        if epic_payload.get("labels"):
            fields["labels"] = epic_payload["labels"]
        if epic_payload.get("fix_versions"):
            fields["fixVersions"] = [
                {"name": v} for v in epic_payload["fix_versions"]
            ]
        response = requests.post(
            f"{self.base_url}/rest/api/3/issue",
            headers=self.headers,
            auth=self._get_auth(),
            json={"fields": fields},
            timeout=self.timeout,
        )
        if response.status_code >= 400:
            raise requests.HTTPError(
                f"{response.status_code} error creating epic: {response.text}",
                response=response,
            )
        response.raise_for_status()
        return response.json()

    def get_issue_assignee_account_id(self, issue_key: str) -> str | None:
        response = requests.get(
            f"{self.base_url}/rest/api/3/issue/{issue_key}",
            headers=self.headers,
            auth=self._get_auth(),
            params={"fields": "assignee"},
            timeout=self.timeout,
        )
        response.raise_for_status()
        data = response.json()
        assignee = data.get("fields", {}).get("assignee")
        if not assignee:
            return None
        return assignee.get("accountId") or assignee.get("id")

    def get_issue_status_name(self, issue_key: str) -> str | None:
        response = requests.get(
            f"{self.base_url}/rest/api/3/issue/{issue_key}",
            headers=self.headers,
            auth=self._get_auth(),
            params={"fields": "status"},
            timeout=self.timeout,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("fields", {}).get("status", {}).get("name")

    def get_issue_transitions(self, issue_key: str) -> list[dict[str, Any]]:
        response = requests.get(
            f"{self.base_url}/rest/api/3/issue/{issue_key}/transitions",
            headers=self.headers,
            auth=self._get_auth(),
            timeout=self.timeout,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("transitions", [])

    def transition_issue(self, issue_key: str, transition_id: str) -> None:
        response = requests.post(
            f"{self.base_url}/rest/api/3/issue/{issue_key}/transitions",
            headers=self.headers,
            auth=self._get_auth(),
            json={"transition": {"id": str(transition_id)}},
            timeout=self.timeout,
        )
        if response.status_code >= 400:
            raise requests.HTTPError(
                f"{response.status_code} error transitioning issue {issue_key}: {response.text}",
                response=response,
            )
        response.raise_for_status()

    def transition_issue_to_status(self, issue_key: str, status_name: str) -> None:
        if not status_name:
            return

        current_status = self.get_issue_status_name(issue_key)
        if current_status and current_status.casefold() == status_name.casefold():
            return

        transitions = self.get_issue_transitions(issue_key)
        transition_id = None
        available_targets = []

        for transition in transitions:
            transition_target = transition.get("to", {}).get("name", "")
            transition_name = transition.get("name", "")
            available_targets.extend([transition_target, transition_name])

            if (
                transition_target.casefold() == status_name.casefold()
                or transition_name.casefold() == status_name.casefold()
            ):
                transition_id = transition.get("id")
                break

        if not transition_id:
            raise ValueError(
                f"No transition found to status '{status_name}' for issue {issue_key}. "
                f"Available transitions: {sorted(set([name for name in available_targets if name]))}"
            )

        self.transition_issue(issue_key, str(transition_id))

    def create_task(
        self,
        task_payload: dict[str, Any],
        project_key: str,
        epic_id: str | None = None,
    ) -> dict[str, Any]:
        fields = {
            "project": {"key": project_key},
            "summary": task_payload.get("summary") or task_payload.get("name"),
            "description": self._to_adf_description(task_payload.get("description", "")),
            "issuetype": {"name": task_payload.get("issue_type", "Task")},
        }
        if task_payload.get("parent_key"):
            fields["parent"] = {"key": task_payload["parent_key"]}
        elif epic_id:
            fields["parent"] = {"id": epic_id}
        if task_payload.get("assignee_id"):
            fields["assignee"] = {"accountId": task_payload["assignee_id"]}
        if task_payload.get("labels"):
            fields["labels"] = task_payload["labels"]
        if task_payload.get("fix_versions"):
            fields["fixVersions"] = [
                {"name": v} for v in task_payload["fix_versions"]
            ]

        response = requests.post(
            f"{self.base_url}/rest/api/3/issue",
            headers=self.headers,
            auth=self._get_auth(),
            json={"fields": fields},
            timeout=self.timeout,
        )
        if response.status_code >= 400:
            raise requests.HTTPError(
                f"{response.status_code} error creating task: {response.text}",
                response=response,
            )
        response.raise_for_status()
        return response.json()
