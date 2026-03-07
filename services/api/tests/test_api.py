from fastapi.testclient import TestClient
from app.main import app
from app.storage.runs import run_store

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_analyze_endpoint_creates_run():
    payload = {
        "idea": "An AI platform for organizing local generic charity events.",
        "demo_mode": True
    }
    response = client.post("/analyze", json=payload)
    assert response.status_code == 202
    data = response.json()
    assert "run_id" in data
    assert data["status"] == "queued"
    
    run_id = data["run_id"]
    
    # Check status endpoint
    status_resp = client.get(f"/runs/{run_id}/status")
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["run_id"] == run_id
    # status could be queued or running at this exact fraction of a second
    assert status_data["status"] in ["queued", "running", "pulse_ready", "complete"]

def test_run_status_not_found():
    response = client.get("/runs/invalid_run_id/status")
    assert response.status_code == 404

def test_run_result_not_found():
    response = client.get("/runs/invalid_run_id/result")
    assert response.status_code == 404
