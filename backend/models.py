from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

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
