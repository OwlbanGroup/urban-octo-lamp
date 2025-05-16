from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_subscribed = Column(Boolean, default=False)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=True)
    subscription = relationship("Subscription", back_populates="users")

class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    price_cents = Column(Integer, nullable=False)  # price in cents
    description = Column(String, nullable=True)
    users = relationship("User", back_populates="subscription")

# Existing models for Address, Package, Message, Task remain unchanged
class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True, index=True)
    street = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    postal_code = Column(String)

class Package(Base):
    __tablename__ = "packages"
    id = Column(String, primary_key=True, index=True)
    sender = Column(String)
    recipient = Column(String)
    origin_id = Column(Integer, ForeignKey("addresses.id"))
    destination_id = Column(Integer, ForeignKey("addresses.id"))
    status = Column(String)
    estimated_delivery_days = Column(Integer)

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, index=True)
    sender = Column(String)
    recipient = Column(String)
    subject = Column(String)
    body = Column(String)
    read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True, index=True)
    agent = Column(String)
    description = Column(String)
    completed = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=True)
    priority = Column(Integer, default=3)
    tags = Column(String, nullable=True)
    related_documents = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
