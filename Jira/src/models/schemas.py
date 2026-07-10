from pydantic import BaseModel
from typing import List, Optional

class Epic(BaseModel):
    summary: str
    description: Optional[str] = None
    project_key: str
    issue_type: str = "Epic"

class Task(BaseModel):
    summary: str
    description: Optional[str] = None
    project_key: str
    epic_link: Optional[str] = None
    issue_type: str = "Task"