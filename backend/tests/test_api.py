import pytest
from fastapi.testclient import TestClient


def test_health_endpoint(client: TestClient):
    """Test health check endpoint"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data


def test_root_endpoint(client: TestClient):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_ping_endpoint(client: TestClient):
    """Test ping endpoint for latency"""
    response = client.get("/api/test/ping")
    assert response.status_code == 200
    data = response.json()
    assert "server_time" in data
    assert isinstance(data["server_time"], float)
    assert data["server_time"] >= 0


def test_download_endpoint(client: TestClient):
    """Test download endpoint"""
    response = client.post("/api/test/download?size_mb=1")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/octet-stream"
    # Check that we received data
    content = response.content
    assert len(content) > 0


def test_upload_endpoint(client: TestClient):
    """Test upload endpoint"""
    test_data = b"x" * 1024  # 1KB of data
    response = client.post("/api/test/upload", content=test_data)
    assert response.status_code == 200
    data = response.json()
    assert data["bytes_received"] == len(test_data)


def test_create_result(client: TestClient, sample_result_data):
    """Test creating a new test result"""
    response = client.post("/api/results/", json=sample_result_data)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["download_speed"] == sample_result_data["download_speed"]
    assert data["upload_speed"] == sample_result_data["upload_speed"]
    assert data["latency"] == sample_result_data["latency"]
    assert data["jitter"] == sample_result_data["jitter"]


def test_get_results_empty(client: TestClient):
    """Test getting results when database is empty"""
    response = client.get("/api/results/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_get_results_with_data(client: TestClient, sample_result_data):
    """Test getting results after creating some"""
    # Create a result
    client.post("/api/results/", json=sample_result_data)

    # Get all results
    response = client.get("/api/results/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["download_speed"] == sample_result_data["download_speed"]


def test_get_result_by_id(client: TestClient, sample_result_data):
    """Test getting a specific result by ID"""
    # Create a result
    create_response = client.post("/api/results/", json=sample_result_data)
    result_id = create_response.json()["id"]

    # Get the result by ID
    response = client.get(f"/api/results/{result_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == result_id
    assert data["download_speed"] == sample_result_data["download_speed"]


def test_get_result_not_found(client: TestClient):
    """Test getting a non-existent result"""
    response = client.get("/api/results/non-existent-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Result not found"


def test_delete_result(client: TestClient, sample_result_data):
    """Test deleting a result"""
    # Create a result
    create_response = client.post("/api/results/", json=sample_result_data)
    result_id = create_response.json()["id"]

    # Delete the result
    response = client.delete(f"/api/results/{result_id}")
    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get(f"/api/results/{result_id}")
    assert get_response.status_code == 404


def test_delete_result_not_found(client: TestClient):
    """Test deleting a non-existent result"""
    response = client.delete("/api/results/non-existent-id")
    assert response.status_code == 404


def test_create_result_validation(client: TestClient):
    """Test validation of result creation"""
    # Missing required fields
    invalid_data = {"download_speed": 100}
    response = client.post("/api/results/", json=invalid_data)
    assert response.status_code == 422

    # Negative speed values
    invalid_data = {
        "download_speed": -100,
        "upload_speed": 50,
        "latency": 25,
        "jitter": 5
    }
    response = client.post("/api/results/", json=invalid_data)
    assert response.status_code == 422


def test_pagination(client: TestClient, sample_result_data):
    """Test pagination of results"""
    # Create multiple results
    for i in range(5):
        data = sample_result_data.copy()
        data["download_speed"] = 100 + i
        client.post("/api/results/", json=data)

    # Get with limit
    response = client.get("/api/results/?limit=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3

    # Get with skip
    response = client.get("/api/results/?skip=2&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
