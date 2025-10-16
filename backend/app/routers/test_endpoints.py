from fastapi import APIRouter, Response, Request
from fastapi.responses import StreamingResponse
import time
import os
from typing import Dict

router = APIRouter(prefix="/api/test", tags=["bandwidth-tests"])


@router.get("/ping")
async def ping_test() -> Dict[str, float]:
    """
    Endpoint for latency testing.
    Returns server response time.
    """
    start_time = time.time()
    # Simulate minimal processing
    time.sleep(0.001)
    end_time = time.time()

    return {
        "server_time": (end_time - start_time) * 1000  # Convert to ms
    }


@router.post("/download")
async def download_test(size_mb: int = 1) -> StreamingResponse:
    """
    Endpoint for download speed testing.
    Generates random data of specified size.
    """
    # Limit size to prevent abuse
    size_mb = min(size_mb, 50)
    chunk_size = 1024 * 1024  # 1MB chunks

    def generate_data():
        bytes_sent = 0
        target_bytes = size_mb * 1024 * 1024

        while bytes_sent < target_bytes:
            chunk = os.urandom(min(chunk_size, target_bytes - bytes_sent))
            bytes_sent += len(chunk)
            yield chunk

    return StreamingResponse(
        generate_data(),
        media_type="application/octet-stream",
        headers={
            "Content-Length": str(size_mb * 1024 * 1024),
            "Cache-Control": "no-cache, no-store, must-revalidate"
        }
    )


@router.post("/upload")
async def upload_test(request: Request) -> Dict[str, int]:
    """
    Endpoint for upload speed testing.
    Receives data and returns the size received.
    """
    data = await request.body()
    return {
        "bytes_received": len(data)
    }
