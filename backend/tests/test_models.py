import pytest
from pydantic import ValidationError
from app.models import TestResultCreate, TestResult
from datetime import datetime


def test_test_result_create_valid():
    """Test creating a valid TestResultCreate"""
    data = {
        "download_speed": 100.5,
        "upload_speed": 50.2,
        "latency": 25.3,
        "jitter": 5.1
    }
    result = TestResultCreate(**data)
    assert result.download_speed == 100.5
    assert result.upload_speed == 50.2
    assert result.latency == 25.3
    assert result.jitter == 5.1


def test_test_result_create_with_optional_fields():
    """Test creating TestResultCreate with optional fields"""
    data = {
        "download_speed": 100.5,
        "upload_speed": 50.2,
        "latency": 25.3,
        "jitter": 5.1,
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0"
    }
    result = TestResultCreate(**data)
    assert result.ip_address == "192.168.1.1"
    assert result.user_agent == "Mozilla/5.0"


def test_test_result_create_negative_values():
    """Test that negative values are rejected"""
    with pytest.raises(ValidationError):
        TestResultCreate(
            download_speed=-100,
            upload_speed=50,
            latency=25,
            jitter=5
        )

    with pytest.raises(ValidationError):
        TestResultCreate(
            download_speed=100,
            upload_speed=-50,
            latency=25,
            jitter=5
        )


def test_test_result_create_missing_fields():
    """Test that missing required fields raise error"""
    with pytest.raises(ValidationError):
        TestResultCreate(
            download_speed=100,
            upload_speed=50
            # Missing latency and jitter
        )


def test_test_result_create_zero_values():
    """Test that zero values are accepted"""
    data = {
        "download_speed": 0,
        "upload_speed": 0,
        "latency": 0,
        "jitter": 0
    }
    result = TestResultCreate(**data)
    assert result.download_speed == 0
    assert result.upload_speed == 0


def test_test_result_model():
    """Test the full TestResult model"""
    data = {
        "id": "test-id-123",
        "timestamp": datetime.utcnow(),
        "download_speed": 100.5,
        "upload_speed": 50.2,
        "latency": 25.3,
        "jitter": 5.1,
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0"
    }
    result = TestResult(**data)
    assert result.id == "test-id-123"
    assert isinstance(result.timestamp, datetime)
    assert result.download_speed == 100.5
