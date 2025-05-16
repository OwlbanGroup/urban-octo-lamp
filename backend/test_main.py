import pytest
from fastapi.testclient import TestClient
from backend.main import app, database, engine
from backend.models import Base

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after tests
    Base.metadata.drop_all(bind=engine)

def test_protected_route_unauthorized():
    response = client.get("/protected")
    assert response.status_code == 401  # Unauthorized without token

def test_create_task():
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

def test_get_tasks():
    agent = "test_agent"
    response = client.get(f"/tasks/{agent}")
    assert response.status_code == 200
    tasks = response.json()
    assert isinstance(tasks, list)

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
    assert isinstance(tasks, list)

def test_send_message():
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

def test_get_messages():
    recipient = "recipient1"
    response = client.get(f"/messages/{recipient}")
    assert response.status_code == 200
    messages = response.json()
    assert isinstance(messages, list)
