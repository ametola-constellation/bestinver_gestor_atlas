def validate_epic(epic):
    if not isinstance(epic, dict):
        raise ValueError("Epic must be a dictionary.")
    if 'title' not in epic or not epic['title']:
        raise ValueError("Epic must have a title.")
    if 'description' not in epic or not epic['description']:
        raise ValueError("Epic must have a description.")

def validate_task(task):
    if not isinstance(task, dict):
        raise ValueError("Task must be a dictionary.")
    if 'title' not in task or not task['title']:
        raise ValueError("Task must have a title.")
    if 'epic_id' not in task or not task['epic_id']:
        raise ValueError("Task must be associated with an epic (epic_id).")

def validate_work_item(work_item, item_type):
    if item_type == 'epic':
        validate_epic(work_item)
    elif item_type == 'task':
        validate_task(work_item)
    else:
        raise ValueError("Invalid work item type. Must be 'epic' or 'task'.")