from sqlalchemy import Column, String, Integer, ForeignKey, Text, DateTime, Boolean
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True, index=True)
    street = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)

class Package(Base):
    __tablename__ = "packages"
    id = Column(String, primary_key=True, index=True)
    sender = Column(String, nullable=False)
    recipient = Column(String, nullable=False)
    origin_id = Column(Integer, ForeignKey("addresses.id"))
    destination_id = Column(Integer, ForeignKey("addresses.id"))
    status = Column(String, default="Created")
    estimated_delivery_days = Column(Integer)

    origin = relationship("Address", foreign_keys=[origin_id])
    destination = relationship("Address", foreign_keys=[destination_id])

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, index=True)
    sender = Column(String, nullable=False)
    recipient = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True, index=True)
    agent = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    completed = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=True)
    priority = Column(Integer, default=3)  # 1=High, 2=Medium, 3=Low
    tags = Column(String, default="")  # Comma-separated tags
    related_documents = Column(String, default="")  # Comma-separated document URLs or IDs
    created_at = Column(DateTime, default=datetime.utcnow)
