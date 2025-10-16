from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()


# SQLAlchemy Model
class TestResultDB(Base):
    __tablename__ = "test_results"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    download_speed = Column(Float, nullable=False)
    upload_speed = Column(Float, nullable=False)
    latency = Column(Float, nullable=False)
    jitter = Column(Float, nullable=False)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)


# Pydantic Models for API
class TestResultCreate(BaseModel):
    download_speed: float = Field(..., ge=0, description="Download speed in Mbps")
    upload_speed: float = Field(..., ge=0, description="Upload speed in Mbps")
    latency: float = Field(..., ge=0, description="Latency in ms")
    jitter: float = Field(..., ge=0, description="Jitter in ms")
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class TestResult(BaseModel):
    id: str
    timestamp: datetime
    download_speed: float
    upload_speed: float
    latency: float
    jitter: float
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        from_attributes = True


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
