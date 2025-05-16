from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import os
import httpx
import uuid

router = APIRouter()

API_KEY_NAME = "X-API-KEY"
API_KEY = os.getenv("AI_API_KEY", "default-secure-api-key")  # Use environment variable for security
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key")  # OpenAI API key

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

async def call_openai_api(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    json_data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 500,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=json_data)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]

@router.post("/ai/send_task")
async def send_task(task: Task, api_key: str = Depends(verify_api_key)):
    """
    Receive a new task and process it using OpenAI API.
    """
    tasks_store[task.id] = task
    try:
        result = await call_openai_api(task.description)
        task.status = "completed"
        task.result = result
    except Exception as e:
        task.status = "failed"
        task.result = str(e)
    tasks_store[task.id] = task
    return {"id": task.id, "status": task.status, "result": task.result}

@router.get("/ai/get_responses/{agent_id}")
async def get_ai_responses(agent_id: str, api_key: str = Depends(verify_api_key)):
    """
    Return all completed tasks for the agent.
    """
    completed_tasks = [task for task in tasks_store.values() if task.status == "completed"]
    return completed_tasks

@router.post("/ai/send_research_analysis")
async def send_research_analysis(analysis_task: dict, api_key: str = Depends(verify_api_key)):
    """
    Send a research analysis task to OpenAI and return the result.
    """
    analysis_id = analysis_task.get("id", str(uuid.uuid4()))
    prompt = analysis_task.get("description", "Analyze the following research data.")
    try:
        summary = await call_openai_api(prompt)
        result = {"analysis_id": analysis_id, "summary": summary}
    except Exception as e:
        result = {"analysis_id": analysis_id, "summary": f"Error: {str(e)}"}
    return result

@router.get("/ai/get_research_results/{analysis_id}")
async def get_research_results(analysis_id: str, api_key: str = Depends(verify_api_key)):
    """
    Return a stored research analysis result (mocked for now).
    """
    # For demo, return a placeholder
    result = {"analysis_id": analysis_id, "summary": "This is a stored research analysis result."}
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

@router.get("/ai/revenue_opportunities")
async def get_revenue_opportunities(api_key: str = Depends(verify_api_key)):
    """
    Return mock revenue opportunities data.
    """
    opportunities = [
        {"id": "1", "description": "Increase delivery speed in urban areas", "potential_revenue": 50000},
        {"id": "2", "description": "Expand service to new rural regions", "potential_revenue": 30000},
        {"id": "3", "description": "Offer premium packaging options", "potential_revenue": 20000},
    ]
    return {"opportunities": opportunities}
