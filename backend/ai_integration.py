from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import os

router = APIRouter()

API_KEY_NAME = "X-API-KEY"
API_KEY = os.getenv("AI_API_KEY", "default-secure-api-key")  # Use environment variable for security

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

async def verify_api_key(api_key: str = Depends(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

class Task(BaseModel):
    id: str
    description: str
    status: str = "pending"
    result: str = None

# In-memory store for tasks (for demo purposes)
tasks_store = {}

@router.post("/ai/send_task")
async def send_task(task: Task, api_key: str = Depends(verify_api_key)):
    """
    Receive a new task and process it locally (mock AI processing).
    """
    tasks_store[task.id] = task
    # Mock processing: just mark as completed with a dummy result
    task.status = "completed"
    task.result = f"Processed task: {task.description}"
    tasks_store[task.id] = task
    return {"id": task.id, "status": task.status, "result": task.result}

@router.get("/ai/get_responses/{agent_id}")
async def get_ai_responses(agent_id: str, api_key: str = Depends(verify_api_key)):
    """
    Return all completed tasks for the agent (mock implementation).
    """
    # For demo, return all tasks
    completed_tasks = [task for task in tasks_store.values() if task.status == "completed"]
    return completed_tasks

@router.post("/ai/send_research_analysis")
async def send_research_analysis(analysis_task: dict, api_key: str = Depends(verify_api_key)):
    """
    Mock sending a research analysis task and return a dummy result.
    """
    analysis_id = analysis_task.get("id", "unknown")
    result = {"analysis_id": analysis_id, "summary": "This is a mock research analysis result."}
    return result

@router.get("/ai/get_research_results/{analysis_id}")
async def get_research_results(analysis_id: str, api_key: str = Depends(verify_api_key)):
    """
    Return a mock research analysis result.
    """
    result = {"analysis_id": analysis_id, "summary": "This is a mock research analysis result."}
    return result

@router.post("/ai/webhook")
async def ai_webhook(request: Request):
    """
    Endpoint to receive webhook callbacks from the AI network.
    """
    payload = await request.json()
    # Process the payload as needed, e.g., update task status, store messages, etc.
    # For now, just acknowledge receipt
    return {"status": "received", "data": payload}
