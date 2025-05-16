import pytest
from fastapi.testclient import TestClient
from backend.main import app
import jwt
from backend.auth import SECRET_KEY, ALGORITHM

client = TestClient(app)

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
