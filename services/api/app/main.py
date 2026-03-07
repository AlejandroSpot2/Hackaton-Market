from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routes.health import router as health_router
from .routes.runs import router as runs_router

app = FastAPI(
    title="RealityCheck AI API",
    version="0.1.0",
    summary="Hackathon gateway for progressive market atlas runs.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(runs_router)