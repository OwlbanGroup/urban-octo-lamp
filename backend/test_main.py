import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_create_task_and_get_tasks():
    # Create a new task
    task_payload = {
        "agent": "test_agent",
        "description": "Test task creation",
        "completed": False,
        "priority": 1,
        "tags": ["urgent", "test"],
        "related_documents": ["doc1", "doc2"]
    }
    response = client.post("/tasks/", json=task_payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    task_id = data["id"]

    # Retrieve tasks for the agent
    response = client.get(f"/tasks/{task_payload['agent']}")
    assert response.status_code == 200
    tasks = response.json()
    assert any(task["id"] == task_id for task in tasks)

def test_get_tasks_summary():
    response = client.get("/research/tasks_summary")
    assert response.status_code == 200
    summary = response.json()
    assert "total_tasks" in summary
    assert "completed_tasks" in summary
    assert "completion_rate" in summary
    assert "priority_distribution" in summary

def test_get_tasks_by_tag():
    tag = "test"
    response = client.get(f"/research/tasks_by_tag/{tag}")
    assert response.status_code == 200
    tasks = response.json()
    for task in tasks:
        assert tag in task["tags"]

def test_send_and_get_messages():
    # Send a message
    message_payload = {
        "sender": "sender1",
        "recipient": "recipient1",
        "subject": "Test Subject",
        "body": "This is a test message."
    }
    response = client.post("/messages/", json=message_payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data

    # Get messages for recipient
    response = client.get(f"/messages/{message_payload['recipient']}")
    assert response.status_code == 200
    messages = response.json()
    assert any(msg["subject"] == message_payload["subject"] for msg in messages)
