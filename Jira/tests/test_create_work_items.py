import unittest
import os
import sys
from unittest.mock import MagicMock

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.services.create_work_items import create_work_item


class TestCreateWorkItems(unittest.TestCase):

    def test_create_epic(self):
        jira_client = MagicMock()
        jira_client.create_epic.return_value = {"id": "E-123"}

        epic_data = {
            'name': 'Test Epic',
            'description': 'This is a test epic'
        }
        response = create_work_item(project_key='TEST', epic=epic_data, jira_client=jira_client)
        self.assertEqual(response['status'], 'success')
        self.assertIn('epic_id', response)

    def test_create_task(self):
        jira_client = MagicMock()
        jira_client.create_task.return_value = {"id": "T-987"}

        task_data = {
            'name': 'Test Task',
            'description': 'This is a test task',
            'epic_id': '12345'
        }
        response = create_work_item(project_key='TEST', tasks=[task_data], jira_client=jira_client)
        self.assertEqual(response['status'], 'success')
        self.assertIn('task_ids', response)

    def test_create_work_item_invalid_project(self):
        response = create_work_item(project_key='INVALID', epic={'name': 'Invalid Epic'})
        self.assertEqual(response['status'], 'error')
        self.assertEqual(response['message'], 'Invalid project key')

if __name__ == '__main__':
    unittest.main()