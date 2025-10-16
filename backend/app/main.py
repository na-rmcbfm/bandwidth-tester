from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from .database import init_db
from .models import HealthResponse
from .routers import test_endpoints, results

# Initialize FastAPI app
app = FastAPI(
    title="Bandwidth Test API",
    description="API for testing internet bandwidth and storing results",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(test_endpoints.router)
app.include_router(results.router)


@app.on_event("startup")
def on_startup():
    """Initialize database on startup"""
    init_db()


@app.get("/api/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow()
    )


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Bandwidth Test API",
        "version": "1.0.0",
        "docs": "/docs"
    }
