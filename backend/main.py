from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4
import random
from databases import Database
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Address as AddressModel, Package as PackageModel

DATABASE_URL = "sqlite:///./test.db"

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI(title="Global AI Postal System API")

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

@app.post("/packages/", response_model=Package)
async def create_package(pkg_req: PackageCreateRequest):
    pkg_id = str(uuid4())
    estimated_days = estimate_delivery_time(pkg_req.origin, pkg_req.destination)
    query_origin = AddressModel(
        street=pkg_req.origin.street,
        city=pkg_req.origin.city,
        state=pkg_req.origin.state,
        country=pkg_req.origin.country,
        postal_code=pkg_req.origin.postal_code
    )
    query_destination = AddressModel(
        street=pkg_req.destination.street,
        city=pkg_req.destination.city,
        state=pkg_req.destination.state,
        country=pkg_req.destination.country,
        postal_code=pkg_req.destination.postal_code
    )
    session = SessionLocal()
    session.add(query_origin)
    session.add(query_destination)
    session.commit()
    session.refresh(query_origin)
    session.refresh(query_destination)

    package = PackageModel(
        id=pkg_id,
        sender=pkg_req.sender,
        recipient=pkg_req.recipient,
        origin_id=query_origin.id,
        destination_id=query_destination.id,
        status="Created",
        estimated_delivery_days=estimated_days
    )
    session.add(package)
    session.commit()
    session.refresh(package)
    session.close()

    return Package(
        id=package.id,
        sender=package.sender,
        recipient=package.recipient,
        origin=Address(
            street=query_origin.street,
            city=query_origin.city,
            state=query_origin.state,
            country=query_origin.country,
            postal_code=query_origin.postal_code
        ),
        destination=Address(
            street=query_destination.street,
            city=query_destination.city,
            state=query_destination.state,
            country=query_destination.country,
            postal_code=query_destination.postal_code
        ),
        status=package.status,
        estimated_delivery_days=package.estimated_delivery_days
    )

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
