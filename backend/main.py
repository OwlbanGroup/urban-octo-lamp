from fastapi import FastAPI, HTTPException, Depends
from .ai_integration import router as ai_router, tasks_store
from fastapi.security import OAuth2PasswordBearer
from .auth import get_current_user as auth_get_current_user, router as auth_router
from backend.payment import router as payment_router
from fastapi import Security

from pydantic import BaseModel
from typing import Optional
from uuid import uuid4
import random
from databases import Database
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base, Address as AddressModel, Package as PackageModel, Message as MessageModel, Task as TaskModel

DATABASE_URL = "sqlite:///./test.db"

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI(title="Global AI Postal System API")

app.include_router(auth_router)
app.include_router(ai_router)
app.include_router(payment_router)

from backend.autonomous_delivery import router as autonomous_router
app.include_router(autonomous_router)

# Example of protecting an endpoint with authentication
@app.get("/protected")
async def protected_route(current_user: dict = Depends(auth_get_current_user)):
    return {"message": f"Hello, {current_user.get('sub', current_user.get('username'))}! This is a protected route."}

# Protect AI endpoints to require subscription
async def verify_subscription(current_user: dict = Depends(auth_get_current_user)):
    if not current_user.get("is_subscribed", False):
        raise HTTPException(status_code=403, detail="Subscription required")
    return current_user

# Override AI router dependencies to require subscription
for route in ai_router.routes:
    if route.path.startswith("/ai/"):
        route.dependencies = [Depends(verify_subscription)]

        
# Pydantic models for request/response
class Address(BaseModel):
    street: str
    city: str
    state: str
    country: str
    postal_code: str

class Package(BaseModel):
    id: str
    sender: str
    recipient: str
    origin: Address
    destination: Address
    status: str = "Created"
    estimated_delivery_days: Optional[int] = None

class PackageCreateRequest(BaseModel):
    sender: str
    recipient: str
    origin: Address
    destination: Address
    
@app.on_event("startup")
async def startup():
    await database.connect()
    Base.metadata.create_all(bind=engine)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/messages/", response_model=dict)
async def send_message(message: dict):
    session = SessionLocal()
    msg_id = str(uuid4())
    new_message = MessageModel(
        id=msg_id,
        sender=message.get("sender"),
        recipient=message.get("recipient"),
        subject=message.get("subject"),
        body=message.get("body"),
        read=False
    )
    session.add(new_message)
    session.commit()
    session.close()
    return {"message": "Message sent", "id": msg_id}

@app.get("/messages/{recipient}", response_model=list)
async def get_messages(recipient: str):
    session = SessionLocal()
    messages = session.query(MessageModel).filter(MessageModel.recipient == recipient).all()
    session.close()
    return [
        {
            "id": msg.id,
            "sender": msg.sender,
            "recipient": msg.recipient,
            "subject": msg.subject,
            "body": msg.body,
            "timestamp": msg.timestamp.isoformat(),
            "read": msg.read
        }
        for msg in messages
    ]

@app.post("/tasks/", response_model=dict)
async def create_task(task: dict):
    session = SessionLocal()
    task_id = str(uuid4())
    new_task = TaskModel(
        id=task_id,
        agent=task.get("agent"),
        description=task.get("description"),
        completed=task.get("completed", False),
        due_date=task.get("due_date"),
        priority=task.get("priority", 3),
        tags=",".join(task.get("tags", [])) if task.get("tags") else "",
        related_documents=",".join(task.get("related_documents", [])) if task.get("related_documents") else ""
    )
    session.add(new_task)
    session.commit()
    session.close()
    return {"message": "Task created", "id": task_id}

@app.get("/tasks/{agent}", response_model=list)
async def get_tasks(agent: str):
    session = SessionLocal()
    tasks = session.query(TaskModel).filter(TaskModel.agent == agent).all()
    session.close()
    return [
        {
            "id": task.id,
            "agent": task.agent,
            "description": task.description,
            "completed": task.completed,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "priority": task.priority,
            "tags": task.tags.split(",") if task.tags else [],
            "related_documents": task.related_documents.split(",") if task.related_documents else [],
            "created_at": task.created_at.isoformat()
        }
        for task in tasks
    ]

@app.get("/research/tasks_summary")
async def tasks_summary():
    session = SessionLocal()
    total_tasks = session.query(TaskModel).count()
    completed_tasks = session.query(TaskModel).filter(TaskModel.completed == True).count()
    high_priority = session.query(TaskModel).filter(TaskModel.priority == 1).count()
    medium_priority = session.query(TaskModel).filter(TaskModel.priority == 2).count()
    low_priority = session.query(TaskModel).filter(TaskModel.priority == 3).count()
    session.close()
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "completion_rate": (completed_tasks / total_tasks) if total_tasks > 0 else 0,
        "priority_distribution": {
            "high": high_priority,
            "medium": medium_priority,
            "low": low_priority
        }
    }

@app.get("/research/tasks_by_tag/{tag}")
async def tasks_by_tag(tag: str):
    session = SessionLocal()
    tasks = session.query(TaskModel).filter(TaskModel.tags.like(f"%{tag}%")).all()
    session.close()
    return [
        {
            "id": task.id,
            "agent": task.agent,
            "description": task.description,
            "completed": task.completed,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "priority": task.priority,
            "tags": task.tags.split(",") if task.tags else [],
            "related_documents": task.related_documents.split(",") if task.related_documents else [],
            "created_at": task.created_at.isoformat()
        }
        for task in tasks
    ]

@app.get("/packages/{package_id}", response_model=Package)
async def get_package(package_id: str):
    session = SessionLocal()
    package = session.query(PackageModel).filter(PackageModel.id == package_id).first()
    if not package:
        session.close()
        raise HTTPException(status_code=404, detail="Package not found")
    origin = session.query(AddressModel).filter(AddressModel.id == package.origin_id).first()
    destination = session.query(AddressModel).filter(AddressModel.id == package.destination_id).first()
    session.close()
    return Package(
        id=package.id,
        sender=package.sender,
        recipient=package.recipient,
        origin=Address(
            street=origin.street,
            city=origin.city,
            state=origin.state,
            country=origin.country,
            postal_code=origin.postal_code
        ),
        destination=Address(
            street=destination.street,
            city=destination.city,
            state=destination.state,
            country=destination.country,
            postal_code=destination.postal_code
        ),
        status=package.status,
        estimated_delivery_days=package.estimated_delivery_days
    )

@app.get("/validate_address/")
async def validate_address(address: Address):
    if len(address.postal_code) < 4:
        return {"valid": False, "reason": "Postal code too short"}
    return {"valid": True}

@app.get("/optimize_route/")
async def optimize_route(origin: Address, destination: Address):
    route_score = random.uniform(0, 1)
    return {"route_score": route_score, "message": "Route optimized"}

def estimate_delivery_time(origin: Address, destination: Address) -> int:
    days = 3
    if origin.country != destination.country:
        days += 2
    return days

@app.get("/sustainability/carbon_footprint/")
async def carbon_footprint(origin: Address, destination: Address):
    """
    Estimate the carbon footprint of a delivery route based on origin and destination.
    """
    # Simple estimation: local delivery = 1 unit, international = 5 units
    footprint = 1
    if origin.country != destination.country:
        footprint = 5
    return {"carbon_footprint_units": footprint, "message": "Estimated carbon footprint for delivery route"}

@app.get("/notifications/new_items/{agent}")
async def get_new_notifications(agent: str):
    """
    Get count of new messages and tasks for the agent.
    """
    session = SessionLocal()
    new_messages_count = session.query(MessageModel).filter(MessageModel.recipient == agent, MessageModel.read == False).count()
    new_tasks_count = session.query(TaskModel).filter(TaskModel.agent == agent, TaskModel.completed == False).count()
    session.close()
    return {"new_messages": new_messages_count, "new_tasks": new_tasks_count}
