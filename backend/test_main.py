import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_create_and_get_task():
    # Create a new task
    task_data = {
        "agent": "test_agent",
        "description": "Test task",
        "completed": False,
        "priority": 2,
        "tags": ["test", "task"],
        "related_documents": ["doc1", "doc2"]
    }
    response = client.post("/tasks/", json=task_data)
    assert response.status_code == 200
    json_resp = response.json()
    assert "id" in json_resp
    task_id = json_resp["id"]

    # Get tasks for the agent
    response = client.get(f"/tasks/{task_data['agent']}")
    assert response.status_code == 200
    tasks = response.json()
    assert any(task["id"] == task_id for task in tasks)

def test_tasks_summary():
    response = client.get("/research/tasks_summary")
    assert response.status_code == 200
    summary = response.json()
    assert "total_tasks" in summary
    assert "completed_tasks" in summary
    assert "completion_rate" in summary
    assert "priority_distribution" in summary

def test_tasks_by_tag():
    tag = "test"
    response = client.get(f"/research/tasks_by_tag/{tag}")
    assert response.status_code == 200
    tasks = response.json()
    for task in tasks:
        assert tag in task["tags"]

def test_send_and_get_messages():
    # Send a message
    message_data = {
        "sender": "test_sender",
        "recipient": "test_recipient",
        "subject": "Test Subject",
        "body": "Test message body"
    }
    response = client.post("/messages/", json=message_data)
    assert response.status_code == 200
    json_resp = response.json()
    assert "id" in json_resp

    # Get messages for recipient
    response = client.get(f"/messages/{message_data['recipient']}")
    assert response.status_code == 200
    messages = response.json()
    assert any(msg["subject"] == message_data["subject"] for msg in messages)
