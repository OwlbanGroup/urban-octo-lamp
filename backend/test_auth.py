import pytest
from fastapi.testclient import TestClient
from backend.main import app, database, engine
from backend.models import Base, User
from backend.auth import pwd_context
import jwt

client = TestClient(app)

import asyncio
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Base, User
from backend.auth import pwd_context
from backend.main import app
from fastapi.testclient import TestClient

import os

# Override DATABASE_URL environment variable for tests
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

DATABASE_URL = os.getenv("DATABASE_URL")

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Base, User
from backend.auth import pwd_context
from backend.main import app
from fastapi.testclient import TestClient

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    test_user = User(
        email="user@example.com",
        full_name="Test User",
        hashed_password=pwd_context.hash("password"),
        is_active=True,
        is_subscribed=True,
        subscription_id=None
    )
    session.add(test_user)
    session.commit()
    session.close()
    yield
    Base.metadata.drop_all(bind=engine)
    
def test_token_generation_and_access():
    # Test login to get token
    response = client.post("/token", data={"username": "user@example.com", "password": "password"})
    assert response.status_code == 200
    token = response.json().get("access_token")
    assert token is not None

    # Test access to protected route with token
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/protected", headers=headers)
    assert response.status_code == 200
    assert "message" in response.json()

def test_access_protected_route_without_token():
    response = client.get("/protected")
    assert response.status_code == 401

def test_access_protected_route_with_invalid_token():
    headers = {"Authorization": "Bearer invalidtoken"}
    response = client.get("/protected", headers=headers)
    assert response.status_code == 401

def test_invalid_login():
    response = client.post("/token", data={"username": "user@example.com", "password": "wrongpassword"})
    assert response.status_code == 401
