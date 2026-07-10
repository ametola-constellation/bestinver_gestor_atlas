import unittest
import os
import sys
from unittest.mock import MagicMock

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.services.list_projects import list_projects


class TestListProjects(unittest.TestCase):

    def test_list_projects(self):
        jira_client = MagicMock()
        jira_client.get_projects.return_value = [
            {"id": "10000", "key": "TEST", "name": "Proyecto Test"}
        ]

        projects = list_projects(jira_client=jira_client)
        self.assertIsInstance(projects, list)
        self.assertGreater(len(projects), 0)
        for project in projects:
            self.assertIn("id", project)
            self.assertIn("name", project)


if __name__ == '__main__':
    unittest.main()